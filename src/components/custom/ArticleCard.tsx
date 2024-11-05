import Image from "next/image";
import Link from "next/link";
import CategoryButton from "./CategoryButton";
import Button from "./Button";

interface ArticleCardProps {
  imgSrc: string;
  title: string;
  date: Date;
  category: string;
  categorySlug: string;
  resume: string;
  slug: string;
  className?: string;
}

export default function ArticleCard(props: ArticleCardProps) {
  const { imgSrc, title, date, category, resume, slug, categorySlug } = props;
  return (
    <article
      className={`flex col-span-2 bg-muted h-80 rounded-xl border hover:drop-shadow-lighter hover:scale-101 overflow-hidden`}
    >
      <div className="w-full flex flex-col">
        <div className="h-2/5 bg-secondary p-3 flex flex-col justify-between relative">
          <div className="absolute inset-0 bg-gray-950 opacity-90 z-10"></div>
          <Image src={imgSrc} fill alt="" className="object-cover" />
          <Link
            href={`/blog/posts/${slug}`}
            className="flex md:items-center hover:underline-offset-4 hover:underline font-semibold z-10 focus:underline h-14 line-clamp-2"
            tabIndex={-1}
          >
            <h3 className="w-full h-fit md:text-center md:text-xl text-lg font-bold pl-1">
              {title}
            </h3>
          </Link>
          <div className="flex justify-between z-10">
            <span className="flex items-end -mb-1 font-semibold">
              {new Date(date).toLocaleDateString()}
            </span>
            <CategoryButton
              catClass={categorySlug}
              href={categorySlug}
              growOnHover={false}
              tabIndex={-1}
            >
              {category}
            </CategoryButton>
          </div>
        </div>
        <div className="flex flex-col h-3/5 justify-between p-3">
          <div className="line-clamp-4 text-lg md:text-xl">{resume}</div>
          <div className="flex justify-center md:w-5/12 m-auto">
            <Button
              link={`/blog/posts/${slug}`}
              className="w-full text-center"
              text="Read full article..."
            />
          </div>
        </div>
      </div>
    </article>
  );
}
