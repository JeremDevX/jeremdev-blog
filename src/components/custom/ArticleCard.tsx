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
    <article className="article-card">
      <div className="article-card__container">
        <div className="article-card__header">
          <div className="article-card__mask"></div>
          <Image src={imgSrc} fill alt="" className="article-card__img" />
          <Link
            href={`/blog/posts/${slug}`}
            className="article-card__link"
            tabIndex={-1}
          >
            <h3 className="article-card__post-title">{title}</h3>
          </Link>
          <div className="article-card__infos">
            <time className="article-card__date">
              {new Date(date).toLocaleDateString()}
            </time>
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
        <div className="article-card__content">
          <p className="article-card__paragraph">{resume}</p>
          <div className="article-card__btn">
            <Button link={`/blog/posts/${slug}`}>Read full article...</Button>
          </div>
        </div>
      </div>
    </article>
  );
}
