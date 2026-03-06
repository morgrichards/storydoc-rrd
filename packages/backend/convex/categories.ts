import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

export const listActiveCategories = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("categories")
      .withIndex("by_active_sortOrder", (q) => q.eq("active", true))
      .collect();
  },
});

export const listAllCategories = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("categories").withIndex("by_sortOrder").collect();
  },
});

export const getCategoryBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", normalizeSlug(args.slug)))
      .unique();
  },
});

export const createCategory = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    iconKey: v.string(),
    active: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const slug = normalizeSlug(args.slug);
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (existing) {
      throw new Error(`Category slug already exists: ${slug}`);
    }

    return ctx.db.insert("categories", {
      slug,
      title: args.title.trim(),
      description: args.description.trim(),
      iconKey: args.iconKey.trim(),
      active: args.active,
      sortOrder: args.sortOrder,
    });
  },
});

export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    iconKey: v.optional(v.string()),
    active: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const current = await ctx.db.get(args.categoryId);
    if (!current) {
      throw new Error("Category not found");
    }

    const patch: {
      slug?: string;
      title?: string;
      description?: string;
      iconKey?: string;
      active?: boolean;
      sortOrder?: number;
    } = {};

    if (args.slug !== undefined) {
      const slug = normalizeSlug(args.slug);
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (existing && existing._id !== args.categoryId) {
        throw new Error(`Category slug already exists: ${slug}`);
      }
      patch.slug = slug;
    }
    if (args.title !== undefined) {
      patch.title = args.title.trim();
    }
    if (args.description !== undefined) {
      patch.description = args.description.trim();
    }
    if (args.iconKey !== undefined) {
      patch.iconKey = args.iconKey.trim();
    }
    if (args.active !== undefined) {
      patch.active = args.active;
    }
    if (args.sortOrder !== undefined) {
      patch.sortOrder = args.sortOrder;
    }

    await ctx.db.patch(args.categoryId, patch);
    return args.categoryId;
  },
});

export const deleteCategory = mutation({
  args: {
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videos")
      .withIndex("by_categoryId", (q) => q.eq("categoryId", args.categoryId))
      .collect();

    for (const video of videos) {
      const variants = await ctx.db
        .query("videoVariants")
        .withIndex("by_videoId", (q) => q.eq("videoId", video._id))
        .collect();

      for (const variant of variants) {
        await ctx.db.delete(variant._id);
      }

      await ctx.db.delete(video._id);
    }

    await ctx.db.delete(args.categoryId);
  },
});
