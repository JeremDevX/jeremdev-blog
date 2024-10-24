"use client";
import { useState } from "react";

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

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === news.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? news.length - 1 : prevIndex - 1
    );
  };

  const currentNews = news[currentIndex];

  return (
    <div className="flex flex-col items-center px-4">
      <article className="max-w-1000 flex flex-col p-4 justify-center items-center gap-4 md:flex-row bg-muted rounded-lg relative">
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
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
          <button
            onClick={handlePrev}
            className="p-2 bg-secondary rounded hover:bg-secondary-hover"
            aria-label="Previous news"
          >
            &larr; Previous
          </button>
          <button
            onClick={handleNext}
            className="p-2 bg-secondary rounded hover:bg-secondary-hover"
            aria-label="Next news"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
