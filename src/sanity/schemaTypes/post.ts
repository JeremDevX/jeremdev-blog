import { defineField, defineType } from "sanity";
import { categoryType } from "./category";

export const postType = defineType({
  type: "document",
  name: "post",
  title: "Post",
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Title",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      validation: (e) => e.required(),
      options: {
        source: "title",
        maxLength: 200,
        slugify: (input) =>
          input
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[\s']/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 200),
      },
    }),
    defineField({
      name: "view",
      title: "Views",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      type: "text",
      name: "resume",
      title: "Resume",
    }),
    defineField({
      type: "reference",
      name: "Category",
      title: "Category",
      to: categoryType,
    }),
    defineField({ type: "image", name: "coverImage", title: "Cover Image" }),
    defineField({
      type: "date",
      name: "date",
      title: "Date",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "array",
      name: "content",
      title: "Content",
      validation: (e) => e.required(),
      of: [
        {
          type: "block",
        },
        {
          type: "image",
        },
        { type: "code" },
      ],
    }),
  ],
});
