import { defineQuery, type SanityDocument } from "next-sanity";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Refractor, registerLanguage } from "react-refractor";
import tsx from "refractor/lang/tsx";

registerLanguage(tsx);

const customComponents = {
  types: {
    code: ({ value }: { value: SanityDocument }) => (
      <Refractor language={value.language} value={value.code} />
    ),
    image: ({ value }: { value: SanityImageSource }) => (
      <Image
        src={urlFor(value)?.url() || "https://via.placeholder.com/550x310"}
        alt=""
        width={100}
        height={100}
      />
    ),
  },
};

const options = { next: { revalidate: 60 } };

const POST_QUERY = defineQuery(`*[
    _type == "post" &&
    slug.current == $slug
  ][0]{title, slug, date, coverImage, content}`);

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await client.fetch(POST_QUERY, params, options);
  if (!post) {
    notFound();
  }
  const { title, date, content, coverImage } = post;
  const ImageUrl = coverImage
    ? urlFor(coverImage)?.width(550).height(310).url()
    : null;

  return (
    <section className="w-full px-8">
      <div className="mb-4"></div>
      <div className="">
        <Image
          src={ImageUrl || "https://via.placeholder.com/550x310"}
          alt=""
          className="mx-auto overflow-hidden rounded-xl object-cover object-center"
          height="810"
          width="810"
        />
        <div className="flex flex-col justify-between py-8">
          <h1 className="text-2xl font-semibold underline-offset-2 underline">
            {title}
          </h1>
          <span>Date : {date}</span>
        </div>
        <PortableText value={content} components={customComponents} />
      </div>
    </section>
  );
}
