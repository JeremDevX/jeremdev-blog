import { type SchemaTypeDefinition } from "sanity";
import { postType } from "./post";
import { categoryType } from "./category";
import { newsType } from "./news";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, categoryType, newsType],
};
