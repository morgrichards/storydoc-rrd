import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { normalizeLanguageCode } from "./storyDoctorShared";
import type { Id } from "./_generated/dataModel";

const nullableString = v.union(v.string(), v.null());

export const listVideoVariants = query({
  args: {
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const variants = await ctx.db.query("videoVariants").withIndex("by_videoId").collect();

    const filteredVariants = args.includeInactive
      ? variants
      : variants.filter((variant) => variant.active);

    return Promise.all(
      filteredVariants.map(async (variant) => {
        const video = await ctx.db.get(variant.videoId);
        return {
          ...variant,
          videoSlug: video?.slug ?? "unknown",
          videoTitle: video?.title ?? "Unknown",
        };
      }),
    );
  },
});

export const createVideoVariant = mutation({
  args: {
    videoId: v.id("videos"),
    languageCode: v.string(),
    videoUrl: nullableString,
    audioUrl: nullableString,
    subtitleUrl: nullableString,
    version: v.string(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const languageCode = normalizeLanguageCode(args.languageCode);
    const [video, language, existing] = await Promise.all([
      ctx.db.get(args.videoId),
      ctx.db
        .query("languages")
        .withIndex("by_code", (q) => q.eq("code", languageCode))
        .unique(),
      ctx.db
        .query("videoVariants")
        .withIndex("by_video_language", (q) =>
          q.eq("videoId", args.videoId).eq("languageCode", languageCode),
        )
        .unique(),
    ]);

    if (!video) {
      throw new Error("Video not found");
    }
    if (!language) {
      throw new Error(`Language not found: ${languageCode}`);
    }
    if (existing) {
      throw new Error("A variant for this video and language already exists");
    }

    return ctx.db.insert("videoVariants", {
      videoId: args.videoId,
      languageCode,
      videoUrl: args.videoUrl,
      audioUrl: args.audioUrl,
      subtitleUrl: args.subtitleUrl,
      version: args.version.trim(),
      active: args.active,
    });
  },
});

export const updateVideoVariant = mutation({
  args: {
    variantId: v.id("videoVariants"),
    videoId: v.optional(v.id("videos")),
    languageCode: v.optional(v.string()),
    videoUrl: v.optional(nullableString),
    audioUrl: v.optional(nullableString),
    subtitleUrl: v.optional(nullableString),
    version: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const current = await ctx.db.get(args.variantId);
    if (!current) {
      throw new Error("Video variant not found");
    }

    const nextVideoId = args.videoId ?? current.videoId;
    const nextLanguageCode = normalizeLanguageCode(
      args.languageCode ?? current.languageCode,
    );

    const [video, language, existing] = await Promise.all([
      ctx.db.get(nextVideoId),
      ctx.db
        .query("languages")
        .withIndex("by_code", (q) => q.eq("code", nextLanguageCode))
        .unique(),
      ctx.db
        .query("videoVariants")
        .withIndex("by_video_language", (q) =>
          q.eq("videoId", nextVideoId).eq("languageCode", nextLanguageCode),
        )
        .unique(),
    ]);

    if (!video) {
      throw new Error("Video not found");
    }
    if (!language) {
      throw new Error(`Language not found: ${nextLanguageCode}`);
    }
    if (existing && existing._id !== args.variantId) {
      throw new Error("A variant for this video and language already exists");
    }

    const patch: {
      videoId?: Id<"videos">;
      languageCode?: string;
      videoUrl?: string | null;
      audioUrl?: string | null;
      subtitleUrl?: string | null;
      version?: string;
      active?: boolean;
    } = {};

    if (args.videoId !== undefined) {
      patch.videoId = args.videoId;
    }
    if (args.languageCode !== undefined) {
      patch.languageCode = nextLanguageCode;
    }
    if (args.videoUrl !== undefined) {
      patch.videoUrl = args.videoUrl;
    }
    if (args.audioUrl !== undefined) {
      patch.audioUrl = args.audioUrl;
    }
    if (args.subtitleUrl !== undefined) {
      patch.subtitleUrl = args.subtitleUrl;
    }
    if (args.version !== undefined) {
      patch.version = args.version.trim();
    }
    if (args.active !== undefined) {
      patch.active = args.active;
    }

    await ctx.db.patch(args.variantId, patch);
    return args.variantId;
  },
});

export const deleteVideoVariant = mutation({
  args: {
    variantId: v.id("videoVariants"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.variantId);
  },
});
