"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import type { Id } from "@packages/backend/convex/_generated/dataModel";

export type LanguageId = Id<"languages">;
export type CategoryId = Id<"categories">;
export type VideoId = Id<"videos">;
export type VideoVariantId = Id<"videoVariants">;

export function useActiveCategories() {
  return useQuery(api.categories.listActiveCategories, {}) ?? [];
}

export function useAllCategories() {
  return useQuery(api.categories.listAllCategories, {}) ?? [];
}

export function useLanguages(includeInactive = false) {
  return (
    useQuery(api.languages.listLanguages, {
      includeInactive,
    }) ?? []
  );
}

export function useVideosByCategory(categorySlug: string) {
  return useQuery(api.videos.listVideosByCategory, {
    categorySlug,
    includeInactive: false,
  });
}

export function useVideoWithVariants(videoSlug: string) {
  return useQuery(api.videos.getVideoWithVariants, {
    videoSlug,
  });
}

export function useAllVideos() {
  return useQuery(api.videos.listAllVideos, {}) ?? [];
}

export function useAllVideoVariants(includeInactive = true) {
  return (
    useQuery(api.videoVariants.listVideoVariants, {
      includeInactive,
    }) ?? []
  );
}

export function useStoryDoctorMutations() {
  return {
    seedStoryDoctorData: useMutation(api.seed.seedStoryDoctorData),

    createLanguage: useMutation(api.languages.createLanguage),
    updateLanguage: useMutation(api.languages.updateLanguage),
    deleteLanguage: useMutation(api.languages.deleteLanguage),

    createCategory: useMutation(api.categories.createCategory),
    updateCategory: useMutation(api.categories.updateCategory),
    deleteCategory: useMutation(api.categories.deleteCategory),

    createVideo: useMutation(api.videos.createVideo),
    updateVideo: useMutation(api.videos.updateVideo),
    deleteVideo: useMutation(api.videos.deleteVideo),

    createVideoVariant: useMutation(api.videoVariants.createVideoVariant),
    updateVideoVariant: useMutation(api.videoVariants.updateVideoVariant),
    deleteVideoVariant: useMutation(api.videoVariants.deleteVideoVariant),
  };
}
