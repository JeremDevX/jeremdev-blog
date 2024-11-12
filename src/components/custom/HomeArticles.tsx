"use client";
import { Post } from "@/app/page";
import { handleEnterKeyDown } from "@/utils/handleKeyDown";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Button from "./Button";

interface HomeArticlesProps {
  latestPost: Post[];
  mostViewedPost: Post[];
  imgUrlLatest: string;
  imgUrlMostViewed: string;
}

export default function HomeArticles(props: HomeArticlesProps) {
  const { latestPost, mostViewedPost, imgUrlMostViewed, imgUrlLatest } = props;

  const [showLatest, setShowLatest] = useState(true);
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
          onClick={toggleLatest}
          className={`${showLatest && "bg-secondary"} hover:bg-primary hover:text-primary-foreground p-2 rounded-lg hover:drop-shadow-lighter cursor-pointer`}
          tabIndex={0}
          onKeyDown={(e) => handleEnterKeyDown(e, toggleLatest)}
        >
          Latest Article
        </span>
        <span className="hidden md:inline">/</span>
        <span
          onClick={toggleMostViewed}
          className={`${!showLatest && "bg-secondary"} hover:bg-primary hover:text-primary-foreground p-2 rounded-lg hover:drop-shadow-lighter cursor-pointer`}
          tabIndex={0}
          onKeyDown={(e) => handleEnterKeyDown(e, toggleMostViewed)}
        >
          Most Viewed Article
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
        <div className="w-full md:w-7/12 relative z-10 flex flex-col items-center justify-between py-2 min-h-96 md:min-h-max">
          <Link
            href={`/blog/posts/${homeContent[0].slug.current}`}
            className="focus:text-accent hover:text-accent"
          >
            <h3 className="font-semibold underline underline-offset-4 line-clamp-2 text-2xl px-4 mt-4 md:mt-0 text-center">
              {homeContent[0].title}
            </h3>
          </Link>
          <p className="mt-4 md:-mt-6 px-2 md:px-6 md:pb-0 md:text-center line-clamp-6 text-lg md:text-xl">
            {homeContent[0].resume}
          </p>
          <div className="flex w-full justify-center">
            <Button
              link={`/blog/posts/${homeContent[0].slug.current}`}
              text="Read full article..."
              className="md:w-96 text-center"
            />
          </div>
        </div>
      </article>
    </div>
  );
}
