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
    <div className="home-articles">
      <h2 className="home-articles__types">
        <span
          onClick={toggleLatest}
          className={`home-articles__type ${showLatest ? "home-articles__type--active" : ""}`}
          tabIndex={0}
          onKeyDown={(e) => handleEnterKeyDown(e, toggleLatest)}
        >
          Latest Article
        </span>
        <span className="home-articles__type-slash">/</span>
        <span
          onClick={toggleMostViewed}
          className={`home-articles__type ${!showLatest ? "home-articles__type--active" : ""}`}
          tabIndex={0}
          onKeyDown={(e) => handleEnterKeyDown(e, toggleMostViewed)}
        >
          Most Viewed Article
        </span>
      </h2>
      <article
        className={`home-articles__content ${
          isFading ? "home-articles__content--fading" : ""
        }`}
      >
        <div className="home-articles__content-mask"></div>
        <div className="home-articles__content-img-container">
          <Image
            src={homeContentImgUrl}
            fill
            alt=""
            className="home-articles__content-img"
          />
        </div>
        <div className="home-articles__content-container">
          <Link
            href={`/blog/posts/${homeContent[0].slug.current}`}
            className="home-articles__content-link"
          >
            <h3 className="home-articles__content-title">
              {homeContent[0].title}
            </h3>
          </Link>
          <p className="home-articles__content-summary">
            {homeContent[0].resume}
          </p>
          <div className="home-articles__content-btn">
            <Button link={`/blog/posts/${homeContent[0].slug.current}`}>
              Read full article...
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
