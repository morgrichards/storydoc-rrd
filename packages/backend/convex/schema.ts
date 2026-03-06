import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  languages: defineTable({
    code: v.string(),
    name: v.string(),
    active: v.boolean(),
    sortOrder: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_sortOrder", ["sortOrder"])
    .index("by_active_sortOrder", ["active", "sortOrder"]),

  categories: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    iconKey: v.string(),
    active: v.boolean(),
    sortOrder: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_sortOrder", ["sortOrder"])
    .index("by_active_sortOrder", ["active", "sortOrder"]),

  videos: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    categoryId: v.id("categories"),
    durationSeconds: v.number(),
    thumbnailUrl: v.string(),
    active: v.boolean(),
    sortOrder: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_categoryId", ["categoryId"])
    .index("by_active_sortOrder", ["active", "sortOrder"])
    .index("by_category_active_sortOrder", ["categoryId", "active", "sortOrder"]),

  videoVariants: defineTable({
    videoId: v.id("videos"),
    languageCode: v.string(),
    videoUrl: v.union(v.string(), v.null()),
    audioUrl: v.union(v.string(), v.null()),
    subtitleUrl: v.union(v.string(), v.null()),
    version: v.string(),
    active: v.boolean(),
  })
    .index("by_videoId", ["videoId"])
    .index("by_video_active", ["videoId", "active"])
    .index("by_video_language", ["videoId", "languageCode"])
    .index("by_languageCode", ["languageCode"]),
});
