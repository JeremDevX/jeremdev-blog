"use client";
import { Post } from "@/app/page";
import { handleEnterKeyDown } from "@/utils/handleKeyDown";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface HomeArticlesProps {
  latestPost: Post[];
  mostViewedPost: Post[];
  imgUrlLatest: string;
  imgUrlMostViewed: string;
}

export default function HomeArticles(props: HomeArticlesProps) {
  const { latestPost, mostViewedPost, imgUrlMostViewed, imgUrlLatest } = props;

  const [showLatest, setShowLatest] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const toggleLatest = () => {
    setIsFading(true);
    setTimeout(() => {
      setShowLatest(true);
      setIsFading(false);
    }, 300);
  };

  const toggleMostViewed = () => {
    setIsFading(true);
    setTimeout(() => {
      setShowLatest(false);
      setIsFading(false);
    }, 300);
  };

  const homeContent = showLatest ? latestPost : mostViewedPost;
  const homeContentImgUrl = showLatest ? imgUrlLatest : imgUrlMostViewed;

  return (
    <div className="max-w-1440 flex flex-col p-4 justify-center items-center">
      <h2 className="text-3xl font-bold mt-8 mb-8 underline-offset-4 flex flex-col md:flex-row gap-2 items-center">
        <span
          onClick={toggleMostViewed}
          className={`${!showLatest && "underline  bg-secondary hover:bg-primary hover:text-primary-foreground p-2 rounded-lg"} hover:drop-shadow-lighter cursor-pointer hover:underline p-2`}
          tabIndex={0}
          onKeyDown={(e) => handleEnterKeyDown(e, toggleMostViewed)}
        >
          Most Viewed Article
        </span>
        <span className="hidden md:inline">/</span>
        <span
          onClick={toggleLatest}
          className={`${showLatest && "underline  bg-secondary hover:bg-primary hover:text-primary-foreground p-2 rounded-lg"} hover:drop-shadow-lighter cursor-pointer hover:underline p-2`}
          tabIndex={0}
          onKeyDown={(e) => handleEnterKeyDown(e, toggleLatest)}
        >
          Latest Article
        </span>
      </h2>
      <article
        className={`max-w-1000 min-h-96 h-fit md:h-96 p-3 rounded-lg md:bg-muted text-secondary-foreground relative md:flex hover:scale-101 drop-shadow-light hover:drop-shadow-lighter transition-all duration-300 transform ${
          isFading ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="bg-gray-950 rounded-lg z-0 absolute inset-0 opacity-85 md:hidden"></div>
        <div className="w-5/12 md:relative">
          <Image
            src={homeContentImgUrl}
            fill
            alt=""
            className="object-cover rounded-lg -z-10 md:z-0"
          />
        </div>
        <div className="w-full md:w-7/12 relative z-10 flex flex-col items-center justify-between min-h-96 md:min-h-max">
          <Link
            href={`/blog/posts/${homeContent[0].slug.current}`}
            className="focus:text-accent hover:text-accent"
          >
            <h3 className="font-semibold underline underline-offset-4 line-clamp-2 text-2xl px-4 mt-4 md:mt-0">
              {homeContent[0].title}
            </h3>
          </Link>
          <p className="mt-4 md:-mt-6 pt-4 px-4 pb-2 md:pb-0">
            {homeContent[0].resume}
          </p>
          <div className="w-full text-right">
            <Link
              href={`/blog/posts/${homeContent[0].slug.current}`}
              className="mt-2 font-semibold hover:underline underline-offset-4 focus:text-accent hover:text-accent"
            >
              Read full article...
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}