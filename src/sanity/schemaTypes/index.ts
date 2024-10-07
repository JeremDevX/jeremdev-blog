import { type SchemaTypeDefinition } from "sanity";
import { postType } from "./post";
import { categoryType } from "./category";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, categoryType],
};
