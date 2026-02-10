"use client";
import { useState } from "react";
import Button from "./Button";

interface NewsItem {
  title: string;
  date: Date;
  content: string;
}

interface HomeNewsProps {
  news: NewsItem[];
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default function HomeNews({ news }: HomeNewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSlidingRight, setIsSlidingRight] = useState(false);
  const [isSlidingLeft, setIsSlidingLeft] = useState(false);

  const handleNext = () => {
    setIsSlidingRight(true);
    setTimeout(() => {
      setIsSlidingRight(false);
    }, 500);
    setCurrentIndex((prevIndex) =>
      prevIndex === news.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setIsSlidingLeft(true);
    setTimeout(() => {
      setIsSlidingLeft(false);
    }, 500);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? news.length - 1 : prevIndex - 1
    );
  };

  const currentNews = news[currentIndex];

  return (
    <div className="home-news">
      <article
        className={`home-news__container ${isSlidingRight && "home-news__container--fade-right"} ${isSlidingLeft && "home-news__container--fade-left"}`}
      >
        <h3 className="home-news__title">
          {currentNews.title} -{" "}
          <time
            dateTime={new Date(currentNews.date).toISOString()}
            className="home-news__date"
          >
            {dateFormatter.format(new Date(currentNews.date))}
          </time>
        </h3>
        <p className="home-news__desc">{currentNews.content}</p>
        {news.length > 1 && (
          <p className="home-news__pagination">
            {currentIndex + 1}/{news.length}
          </p>
        )}
      </article>

      {news.length > 1 && (
        <div className="home-news__btns">
          <Button onClick={handlePrev} ariaLabel="Previous news">
            &larr; Previous
          </Button>
          <Button onClick={handleNext} ariaLabel="Next news">
            Next &rarr;
          </Button>
        </div>
      )}
    </div>
  );
}
