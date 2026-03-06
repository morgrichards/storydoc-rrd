import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

type SeedCategory = {
  slug: string;
  title: string;
  description: string;
  iconKey: string;
  sortOrder: number;
};

type SeedVideo = {
  slug: string;
  title: string;
  description: string;
  categorySlug: string;
  durationSeconds: number;
  sortOrder: number;
};

const languageSeed = [
  { code: "en", name: "English", active: true, sortOrder: 1 },
  { code: "es", name: "Spanish", active: true, sortOrder: 2 },
  { code: "fr", name: "French", active: true, sortOrder: 3 },
  { code: "ar", name: "Arabic", active: true, sortOrder: 4 },
  { code: "sw", name: "Swahili", active: true, sortOrder: 5 },
  { code: "vi", name: "Vietnamese", active: true, sortOrder: 6 },
] as const;

const categorySeed: SeedCategory[] = [
  {
    slug: "health",
    title: "Health",
    description: "Short videos about common health topics and prevention.",
    iconKey: "heart-pulse",
    sortOrder: 1,
  },
  {
    slug: "family",
    title: "Family",
    description: "Support for families and caregivers.",
    iconKey: "users",
    sortOrder: 2,
  },
  {
    slug: "disability",
    title: "Disability",
    description: "Access and rights information for people with disabilities.",
    iconKey: "accessibility",
    sortOrder: 3,
  },
  {
    slug: "information",
    title: "Information",
    description: "How systems, forms, and appointments work.",
    iconKey: "info",
    sortOrder: 4,
  },
  {
    slug: "mental-health",
    title: "Mental Health",
    description: "Mental health basics and coping strategies.",
    iconKey: "brain",
    sortOrder: 5,
  },
  {
    slug: "help",
    title: "Help",
    description: "Where and how to ask for support quickly.",
    iconKey: "lifebuoy",
    sortOrder: 6,
  },
];

const videoSeed: SeedVideo[] = [
  {
    slug: "staying-hydrated",
    title: "Staying Hydrated",
    description: "How much water to drink and signs of dehydration.",
    categorySlug: "health",
    durationSeconds: 95,
    sortOrder: 1,
  },
  {
    slug: "understanding-fever",
    title: "Understanding Fever",
    description: "What fever means and when to seek care.",
    categorySlug: "health",
    durationSeconds: 110,
    sortOrder: 2,
  },
  {
    slug: "preventing-infections",
    title: "Preventing Infections",
    description: "Simple hygiene habits that lower infection risk.",
    categorySlug: "health",
    durationSeconds: 130,
    sortOrder: 3,
  },
  {
    slug: "supporting-a-child-in-care",
    title: "Supporting a Child in Care",
    description: "How caregivers can reduce stress during clinic visits.",
    categorySlug: "family",
    durationSeconds: 125,
    sortOrder: 4,
  },
  {
    slug: "talking-with-teens",
    title: "Talking with Teens",
    description: "Communication tips for difficult conversations.",
    categorySlug: "family",
    durationSeconds: 140,
    sortOrder: 5,
  },
  {
    slug: "caregiver-burnout",
    title: "Caregiver Burnout",
    description: "Early signs of burnout and where to get support.",
    categorySlug: "family",
    durationSeconds: 155,
    sortOrder: 6,
  },
  {
    slug: "requesting-accommodations",
    title: "Requesting Accommodations",
    description: "How to ask for disability accommodations in services.",
    categorySlug: "disability",
    durationSeconds: 135,
    sortOrder: 7,
  },
  {
    slug: "accessible-communication",
    title: "Accessible Communication",
    description: "Using plain language, visuals, and interpretation.",
    categorySlug: "disability",
    durationSeconds: 100,
    sortOrder: 8,
  },
  {
    slug: "rights-and-consent",
    title: "Rights and Consent",
    description: "What informed consent means in practical terms.",
    categorySlug: "disability",
    durationSeconds: 145,
    sortOrder: 9,
  },
  {
    slug: "booking-an-appointment",
    title: "Booking an Appointment",
    description: "Step-by-step booking flow and preparation checklist.",
    categorySlug: "information",
    durationSeconds: 90,
    sortOrder: 10,
  },
  {
    slug: "reading-a-referral",
    title: "Reading a Referral",
    description: "How to read referral letters and what to bring.",
    categorySlug: "information",
    durationSeconds: 120,
    sortOrder: 11,
  },
  {
    slug: "understanding-costs",
    title: "Understanding Costs",
    description: "Basic out-of-pocket cost concepts explained.",
    categorySlug: "information",
    durationSeconds: 115,
    sortOrder: 12,
  },
  {
    slug: "stress-basics",
    title: "Stress Basics",
    description: "What stress does to the body and simple resets.",
    categorySlug: "mental-health",
    durationSeconds: 105,
    sortOrder: 13,
  },
  {
    slug: "sleep-for-recovery",
    title: "Sleep for Recovery",
    description: "Why sleep matters and routines that improve rest.",
    categorySlug: "mental-health",
    durationSeconds: 150,
    sortOrder: 14,
  },
  {
    slug: "panic-episode-first-steps",
    title: "Panic Episode: First Steps",
    description: "A short guide for grounding during panic episodes.",
    categorySlug: "mental-health",
    durationSeconds: 85,
    sortOrder: 15,
  },
  {
    slug: "calling-for-urgent-help",
    title: "Calling for Urgent Help",
    description: "When and how to call emergency and urgent services.",
    categorySlug: "help",
    durationSeconds: 80,
    sortOrder: 16,
  },
  {
    slug: "finding-local-services",
    title: "Finding Local Services",
    description: "How to locate nearby support organizations.",
    categorySlug: "help",
    durationSeconds: 145,
    sortOrder: 17,
  },
  {
    slug: "what-to-say-when-asking-help",
    title: "What to Say When Asking for Help",
    description: "Simple scripts for requesting support.",
    categorySlug: "help",
    durationSeconds: 100,
    sortOrder: 18,
  },
  {
    slug: "managing-medication-reminders",
    title: "Managing Medication Reminders",
    description: "Tools and habits for taking medication safely.",
    categorySlug: "health",
    durationSeconds: 125,
    sortOrder: 19,
  },
  {
    slug: "building-a-support-plan",
    title: "Building a Support Plan",
    description: "Create a simple personal support plan you can share.",
    categorySlug: "help",
    durationSeconds: 160,
    sortOrder: 20,
  },
];

const optionalLanguageCodes = ["es", "fr", "ar", "sw", "vi"] as const;

async function clearTable(
  ctx: MutationCtx,
  tableName: "videoVariants" | "videos" | "categories" | "languages",
) {
  const rows = await ctx.db.query(tableName).collect();
  for (const row of rows) {
    await ctx.db.delete(row._id);
  }
}

export const seedStoryDoctorData = mutation({
  args: {
    resetExisting: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const resetExisting = args.resetExisting ?? true;

    if (resetExisting) {
      await clearTable(ctx, "videoVariants");
      await clearTable(ctx, "videos");
      await clearTable(ctx, "categories");
      await clearTable(ctx, "languages");
    }

    const languageMap = new Map<string, Id<"languages">>();
    const categoryMap = new Map<string, Id<"categories">>();

    for (const language of languageSeed) {
      const existing = await ctx.db
        .query("languages")
        .withIndex("by_code", (q) => q.eq("code", language.code))
        .unique();

      const languageId =
        existing?._id ??
        (await ctx.db.insert("languages", {
          code: language.code,
          name: language.name,
          active: language.active,
          sortOrder: language.sortOrder,
        }));

      languageMap.set(language.code, languageId);
    }

    for (const category of categorySeed) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", category.slug))
        .unique();

      const categoryId =
        existing?._id ??
        (await ctx.db.insert("categories", {
          slug: category.slug,
          title: category.title,
          description: category.description,
          iconKey: category.iconKey,
          active: true,
          sortOrder: category.sortOrder,
        }));

      categoryMap.set(category.slug, categoryId);
    }

    let videoCount = 0;
    let variantCount = 0;

    for (const video of videoSeed) {
      const categoryId = categoryMap.get(video.categorySlug);
      if (!categoryId) {
        throw new Error(`Missing category for slug: ${video.categorySlug}`);
      }

      const existingVideo = await ctx.db
        .query("videos")
        .withIndex("by_slug", (q) => q.eq("slug", video.slug))
        .unique();

      const videoId =
        existingVideo?._id ??
        (await ctx.db.insert("videos", {
          slug: video.slug,
          title: video.title,
          description: video.description,
          categoryId,
          durationSeconds: video.durationSeconds,
          thumbnailUrl: `https://placehold.co/640x360?text=${encodeURIComponent(video.title)}`,
          active: true,
          sortOrder: video.sortOrder,
        }));

      videoCount += existingVideo ? 0 : 1;

      const sharedAnimationMode = video.sortOrder % 4 === 0;

      const enabledLanguageCodes = [
        "en",
        ...optionalLanguageCodes.filter((code, index) => {
          const divisor = index + 2;
          return video.sortOrder % divisor !== 0;
        }),
      ];

      for (const languageCode of enabledLanguageCodes) {
        const existingVariant = await ctx.db
          .query("videoVariants")
          .withIndex("by_video_language", (q) =>
            q.eq("videoId", videoId).eq("languageCode", languageCode),
          )
          .unique();

        if (existingVariant) {
          continue;
        }

        const hasDedicatedVideo = languageCode === "en" || !sharedAnimationMode;
        const safeSlug = `${video.slug}-${languageCode}`;

        await ctx.db.insert("videoVariants", {
          videoId,
          languageCode,
          videoUrl: hasDedicatedVideo
            ? `https://cdn.storydoctor.example/video/${safeSlug}.mp4`
            : null,
          audioUrl:
            languageCode === "en"
              ? null
              : `https://cdn.storydoctor.example/audio/${safeSlug}.m4a`,
          subtitleUrl:
            languageCode === "ar"
              ? null
              : `https://cdn.storydoctor.example/subtitles/${safeSlug}.vtt`,
          version: "v1",
          active: true,
        });
        variantCount += 1;
      }
    }

    return {
      languages: languageMap.size,
      categories: categoryMap.size,
      videosCreated: videoCount,
      videoVariantsCreated: variantCount,
      note:
        "Seed completed. English is on all videos and other languages are intentionally partial.",
    };
  },
});
