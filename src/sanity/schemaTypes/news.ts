import { defineField, defineType } from "sanity";

export const newsType = defineType({
  type: "document",
  name: "news",
  title: "News",
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Title",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "date",
      name: "date",
      title: "Date",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "text",
      name: "content",
      title: "Content",
    }),
  ],
});
