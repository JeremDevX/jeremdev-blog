import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export const viewCountClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.TOKEN_COUNT_VIEW,
});
