import Image from "next/image";
import Link from "next/link";
import CategoryButton from "./CategoryButton";

interface ArticleCardProps {
  imgSrc: string;
  title: string;
  date: Date;
  category: string;
  resume: string;
  slug: string;
  className?: string;
}

export default function ArticleCard(props: ArticleCardProps) {
  const { imgSrc, title, date, category, resume, slug, className } = props;
  return (
    <article
      className={`flex col-span-2 bg-muted h-80 rounded-xl border hover:drop-shadow-lighter hover:scale-101 overflow-hidden ${className}`}
    >
      <div className="md:w-1/3 relative md:block hidden">
        <Image src={imgSrc} fill alt="" className="object-cover" />
      </div>
      <div className="md:w-2/3 w-full flex flex-col">
        <div className="h-2/5 bg-secondary md:p-4 p-3 flex flex-col justify-between relative">
          <div className="absolute inset-0 bg-gray-900 opacity-85 z-10 block md:hidden"></div>
          <Image
            src={imgSrc}
            fill
            alt=""
            className="object-cover block md:hidden"
          />
          <Link
            href={`/blog/posts/${slug}`}
            className="hover:underline-offset-4 hover:underline font-semibold z-10 focus:underline h-14 line-clamp-2"
            tabIndex={-1}
          >
            <h3 className="w-full h-fit md:text-xl text-lg font-bold pl-1 ">
              {title}
            </h3>
          </Link>
          <div className="flex justify-between z-10">
            <span className="flex items-end -mb-1 font-semibold">
              {new Date(date).toLocaleDateString()}
            </span>
            <CategoryButton
              catClass={category.toLowerCase()}
              href={category.toLowerCase()}
              growOnHover={false}
              tabIndex={-1}
            >
              {category}
            </CategoryButton>
          </div>
        </div>
        <div className="flex flex-col h-3/5 justify-between md:py-5 md:px-4 p-3">
          <div className="md:line-clamp-4 line-clamp-5">{resume}</div>
          <div className="flex justify-end">
            <Link
              href={`/blog/posts/${slug}`}
              className="hover:underline-offset-4 hover:underline font-semibold focus:text-primary"
            >
              Read full article...
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
