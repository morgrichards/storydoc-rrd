import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { normalizeLanguageCode } from "./storyDoctorShared";

export const listLanguages = query({
  args: {
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.includeInactive) {
      return ctx.db.query("languages").withIndex("by_sortOrder").collect();
    }

    return ctx.db
      .query("languages")
      .withIndex("by_active_sortOrder", (q) => q.eq("active", true))
      .collect();
  },
});

export const createLanguage = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    active: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const code = normalizeLanguageCode(args.code);
    const existing = await ctx.db
      .query("languages")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique();

    if (existing) {
      throw new Error(`Language code already exists: ${code}`);
    }

    return ctx.db.insert("languages", {
      code,
      name: args.name.trim(),
      active: args.active,
      sortOrder: args.sortOrder,
    });
  },
});

export const updateLanguage = mutation({
  args: {
    languageId: v.id("languages"),
    code: v.optional(v.string()),
    name: v.optional(v.string()),
    active: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const current = await ctx.db.get(args.languageId);
    if (!current) {
      throw new Error("Language not found");
    }

    const patch: {
      code?: string;
      name?: string;
      active?: boolean;
      sortOrder?: number;
    } = {};

    if (args.code !== undefined) {
      const code = normalizeLanguageCode(args.code);
      const existing = await ctx.db
        .query("languages")
        .withIndex("by_code", (q) => q.eq("code", code))
        .unique();

      if (existing && existing._id !== args.languageId) {
        throw new Error(`Language code already exists: ${code}`);
      }

      patch.code = code;
    }

    if (args.name !== undefined) {
      patch.name = args.name.trim();
    }
    if (args.active !== undefined) {
      patch.active = args.active;
    }
    if (args.sortOrder !== undefined) {
      patch.sortOrder = args.sortOrder;
    }

    await ctx.db.patch(args.languageId, patch);
    return args.languageId;
  },
});

export const deleteLanguage = mutation({
  args: {
    languageId: v.id("languages"),
  },
  handler: async (ctx, args) => {
    const language = await ctx.db.get(args.languageId);
    if (!language) {
      return;
    }

    const variantsUsingLanguage = await ctx.db
      .query("videoVariants")
      .withIndex("by_languageCode", (q) => q.eq("languageCode", language.code))
      .first();

    if (variantsUsingLanguage) {
      throw new Error(
        `Cannot delete language ${language.code} because it is used by video variants`,
      );
    }

    await ctx.db.delete(args.languageId);
  },
});
