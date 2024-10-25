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
    <div className={`flex flex-col items-center px-4`}>
      <article
        className={`max-w-1000 flex flex-col p-4 justify-center items-center gap-4 md:flex-row bg-muted rounded-lg relative h-auto lg:h-52 xs:h-auto sm:h-72 drop-shadow-light animate-duration-1000 ${isSlidingRight && "animate-fade-right"} ${isSlidingLeft && "animate-fade-left"}`}
      >
        <div className="flex-1 flex flex-col items-center justify-start gap-4 h-full">
          <h3 className="text-2xl font-semibold text-center">
            {currentNews.title} -{" "}
            <span className="font-normal text-xl">
              {" "}
              {new Date(currentNews.date).toLocaleDateString()}
            </span>
          </h3>
          <p className="px-8">{currentNews.content}</p>
          {news.length > 1 && (
            <p className="absolute bottom-4 right-4 text-base font-semibold">
              {currentIndex + 1}/{news.length}
            </p>
          )}
        </div>
      </article>

      {news.length > 1 && (
        <div className="flex mt-4 gap-4">
          <Button
            text="&larr; Previous"
            onClick={handlePrev}
            ariaLabel="Previous news"
          />
          <Button
            text="Next &rarr;"
            onClick={handleNext}
            ariaLabel="Next news"
          />
        </div>
      )}
    </div>
  );
}
