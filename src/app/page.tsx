import { SanityDocument } from "next-sanity";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
import Button from "@/components/custom/Button";

export interface Post extends SanityDocument {
  title: string;
  coverImage: {
    asset: {
      _ref: SanityImageSource;
    };
  };
  slug: {
    current: string;
  };
  date: Date;
  resume: string;
  category: {
    title: string;
  };
  view: number;
}

// const options = { next: { revalidate: 60 } };

// const POSTS_QUERY = defineQuery(`*[
//   _type == "post"
//   && defined(slug.current)
// ]{_id, title, slug, date, resume, coverImage, "category" : Category->{title}}|order(date desc)[0...5]`);

// const { projectId, dataset } = client.config();
// // const urlFor = (source: SanityImageSource) =>
// //   projectId && dataset
// //     ? imageUrlBuilder({ projectId, dataset }).image(source)
// //     : null;

export default async function IndexPage() {
  return (
    <main className="flex gap-12 w-full mb-12">
      <section className="flex justify-center w-screen bg-accent-darker text-accent-foreground pb-8 px-2">
        <div className="max-w-1440 w-full flex flex-col p-4 justify-center items-center">
          <h1 className="text-4xl font-bold mt-8 mb-12 text-center w-fit">
            Dev blog and utility tools
          </h1>
          <div className="flex xl:flex-row-reverse gap-8 xl:gap-0 items-center h-full relative">
            <div className="flex-1 relative justify-center items-center hidden md:flex">
              <Image
                src="/home-hero-image.png"
                height={750}
                width={1000}
                alt=""
                className="rounded-lg border border-secondary hidden md:block"
              />
            </div>
            <div className="flex flex-col flex-1 justify-center h-full gap-8 relative w-full md:absolute inset-0 p-8 bg-gray-950 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 ring-1 xl:relative xl:p-0 xl:pr-8 xl:bg-transparent xl:ring-0">
              <div className="flex flex-col gap-4 border-b border-secondary pb-8">
                <p className="text-2xl font-semibold">
                  Weekly posts about tech, programming and more.
                  <br />
                  <span className="text-lg font-normal">
                    Every week, discover new content covering a variety of
                    topics, from software to hardware and everything on between.
                  </span>
                </p>
                <Button text="Explore blog" link="/blog" />
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-2xl font-bold">
                  Free and interactive dev tools.
                  <br />
                  <span className="text-lg font-normal">
                    Browse a wide range of tools like code formatters, CSS
                    utilities, and more
                  </span>
                </p>
                <Button text="Explore tools" link="/tools" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
