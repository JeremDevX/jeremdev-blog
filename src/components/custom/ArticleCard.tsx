import Image from "next/image";
import Link from "next/link";

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
      className={`flex col-span-2 bg-accent h-80 rounded-xl overflow-hidden ring-2 ${className}`}
    >
      <div className="md:w-1/3 relative md:block hidden">
        <Image src={imgSrc} fill alt="" className="object-cover" />
      </div>
      <div className="md:w-2/3 w-full flex flex-col">
        <div className="h-2/5 bg-secondary md:p-4 p-3 flex flex-col justify-between">
          <div className="h-14 line-clamp-2">
            <Link
              href={`/blog/posts/${slug}`}
              className="hover:underline-offset-4 hover:underline font-semibold"
            >
              <h3 className="md:text-xl text-lg font-bold">{title}</h3>
            </Link>
          </div>
          <div className="flex justify-between">
            <span className="flex items-end -mb-1 font-semibold">
              {new Date(date).toLocaleDateString()}
            </span>
            <span
              className={`font-bold py-1 px-2 text-xl rounded-lg cat-${category.toLowerCase()}`}
            >
              {category}
            </span>
          </div>
        </div>
        <div className="flex flex-col h-3/5 justify-between md:py-5 md:px-4 p-3">
          <div className="md:line-clamp-4 line-clamp-5">{resume}</div>
          <div className="flex justify-end">
            <Link
              href={`/blog/posts/${slug}`}
              className="hover:underline-offset-4 hover:underline font-semibold"
            >
              Read full article...
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
