"use client";

import { Post } from "@/app/page";
import { client } from "@/sanity/lib/client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AsideContentProps {
  category: string;
}

const options = { next: { revalidate: 3600 } };

export default function AsideContent(props: AsideContentProps) {
  const [articles, setArticles] = useState([]);
  const [displayed, setDisplayed] = useState("hidden");
  const { category } = props;

  const chevronStyle = {
    transform: displayed === "visible" ? "rotate(-180deg)" : "rotate(0deg)",
    transition: "transform 0.2s ease",
  };

  const CATEGORY_QUERY = `*[
_type == "post" && Category -> title == "${category}"
]
{_id, title, slug}|order(lower(title) asc)`;

  const fetchCategoryArticles = async () => {
    if (displayed === "hidden") {
      setDisplayed("visible");
    } else {
      setDisplayed("hidden");
    }

    if (articles.length === 0) {
      const fetchedArticles = await client.fetch(CATEGORY_QUERY, {}, options);
      setArticles(fetchedArticles);
    }
  };

  return (
    <div className="flex flex-col">
      <div className=" flex justify-between font-semibold my-4">
        <span>{category}</span>
        <span>
          <ChevronDown
            className="cursor-pointer"
            onClick={fetchCategoryArticles}
            style={chevronStyle}
          />
        </span>
      </div>
      <div className={`flex flex-col gap-4 text-sm ${displayed}`}>
        {articles.map((article: Post) => (
          <Link
            href={`/posts/${article.slug.current}`}
            key={article._id}
            className="hover:underline underline-offset-4 hover:text-primary"
          >
            {article.title}
          </Link>
        ))}
      </div>
      <span
        className={`w-full border-b-2 ${displayed === "hidden" ? "-mt-2" : "mt-2"}`}
      ></span>
    </div>
  );
}
