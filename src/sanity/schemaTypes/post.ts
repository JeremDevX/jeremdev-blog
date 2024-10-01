import { defineArrayMember, defineField, defineType } from "sanity";

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
          input.toLowerCase().replace(/\s+/g, "-").slice(0, 200),
      },
    }),
    defineField({
      type: "text",
      name: "resume",
      title: "Resume",
    }),
    defineField({
      type: "string",
      name: "category",
      title: "Category",
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
