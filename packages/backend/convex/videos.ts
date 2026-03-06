import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

export const listVideosByCategory = query({
  args: {
    categorySlug: v.string(),
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", normalizeSlug(args.categorySlug)))
      .unique();

    if (!category || (!args.includeInactive && !category.active)) {
      return {
        category: null,
        videos: [],
      };
    }

    const videos = args.includeInactive
      ? await ctx.db
          .query("videos")
          .withIndex("by_categoryId", (q) => q.eq("categoryId", category._id))
          .collect()
      : await ctx.db
          .query("videos")
          .withIndex("by_category_active_sortOrder", (q) =>
            q.eq("categoryId", category._id).eq("active", true),
          )
          .collect();

    const videosWithLanguageCodes = await Promise.all(
      videos.map(async (video) => {
        const variants = await ctx.db
          .query("videoVariants")
          .withIndex("by_video_active", (q) =>
            q.eq("videoId", video._id).eq("active", true),
          )
          .collect();

        const availableLanguageCodes = Array.from(
          new Set(variants.map((variant) => variant.languageCode)),
        ).sort();

        return {
          ...video,
          availableLanguageCodes,
        };
      }),
    );

    return {
      category,
      videos: videosWithLanguageCodes,
    };
  },
});

export const getVideoWithVariants = query({
  args: {
    videoSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const video = await ctx.db
      .query("videos")
      .withIndex("by_slug", (q) => q.eq("slug", normalizeSlug(args.videoSlug)))
      .unique();

    if (!video) {
      return null;
    }

    const [category, variants] = await Promise.all([
      ctx.db.get(video.categoryId),
      ctx.db
        .query("videoVariants")
        .withIndex("by_videoId", (q) => q.eq("videoId", video._id))
        .collect(),
    ]);

    return {
      ...video,
      category,
      variants,
    };
  },
});

export const listAllVideos = query({
  args: {},
  handler: async (ctx) => {
    const videos = await ctx.db
      .query("videos")
      .withIndex("by_active_sortOrder")
      .collect();

    return Promise.all(
      videos.map(async (video) => {
        const category = await ctx.db.get(video.categoryId);
        return {
          ...video,
          categorySlug: category?.slug ?? "unknown",
          categoryTitle: category?.title ?? "Unknown",
        };
      }),
    );
  },
});

export const createVideo = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    categoryId: v.id("categories"),
    durationSeconds: v.number(),
    thumbnailUrl: v.string(),
    active: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const slug = normalizeSlug(args.slug);
    const existing = await ctx.db
      .query("videos")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (existing) {
      throw new Error(`Video slug already exists: ${slug}`);
    }

    const category = await ctx.db.get(args.categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    return ctx.db.insert("videos", {
      slug,
      title: args.title.trim(),
      description: args.description.trim(),
      categoryId: args.categoryId,
      durationSeconds: args.durationSeconds,
      thumbnailUrl: args.thumbnailUrl.trim(),
      active: args.active,
      sortOrder: args.sortOrder,
    });
  },
});

export const updateVideo = mutation({
  args: {
    videoId: v.id("videos"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    durationSeconds: v.optional(v.number()),
    thumbnailUrl: v.optional(v.string()),
    active: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const current = await ctx.db.get(args.videoId);
    if (!current) {
      throw new Error("Video not found");
    }

    const patch: {
      slug?: string;
      title?: string;
      description?: string;
      categoryId?: Id<"categories">;
      durationSeconds?: number;
      thumbnailUrl?: string;
      active?: boolean;
      sortOrder?: number;
    } = {};

    if (args.slug !== undefined) {
      const slug = normalizeSlug(args.slug);
      const existing = await ctx.db
        .query("videos")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (existing && existing._id !== args.videoId) {
        throw new Error(`Video slug already exists: ${slug}`);
      }
      patch.slug = slug;
    }

    if (args.categoryId !== undefined) {
      const category = await ctx.db.get(args.categoryId);
      if (!category) {
        throw new Error("Category not found");
      }
      patch.categoryId = args.categoryId;
    }

    if (args.title !== undefined) {
      patch.title = args.title.trim();
    }
    if (args.description !== undefined) {
      patch.description = args.description.trim();
    }
    if (args.durationSeconds !== undefined) {
      patch.durationSeconds = args.durationSeconds;
    }
    if (args.thumbnailUrl !== undefined) {
      patch.thumbnailUrl = args.thumbnailUrl.trim();
    }
    if (args.active !== undefined) {
      patch.active = args.active;
    }
    if (args.sortOrder !== undefined) {
      patch.sortOrder = args.sortOrder;
    }

    await ctx.db.patch(args.videoId, patch);
    return args.videoId;
  },
});

export const deleteVideo = mutation({
  args: {
    videoId: v.id("videos"),
  },
  handler: async (ctx, args) => {
    const variants = await ctx.db
      .query("videoVariants")
      .withIndex("by_videoId", (q) => q.eq("videoId", args.videoId))
      .collect();

    for (const variant of variants) {
      await ctx.db.delete(variant._id);
    }

    await ctx.db.delete(args.videoId);
  },
});
