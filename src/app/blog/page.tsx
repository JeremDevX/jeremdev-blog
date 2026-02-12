import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechHowlerX - Blog",
  description:
    " Discover the latest or most viewed articles on TechHowlerX's blog.",
  keywords: "tech, programming, blog",
};

export default async function BlogPage() {
  return (
    <main className="blog">
      <h1 className="blog__main-title">Blog</h1>
    </main>
  );
}
