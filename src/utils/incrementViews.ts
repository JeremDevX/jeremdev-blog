import { viewCountClient } from "@/sanity/lib/client";

export async function incrementViews(articleId: string) {
  try {
    const result = await viewCountClient
      .patch(articleId)
      .setIfMissing({ view: 0 })
      .inc({ view: 1 })
      .commit();

    return result;
  } catch (error) {
    console.error("Failed to increment views:", error);
  }
}
