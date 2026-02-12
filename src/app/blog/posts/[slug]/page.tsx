import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Article - TechHowlerX",
  description: "Article coming soon on TechHowlerX.",
};

export default async function ArticlePage() {
  return (
    <section className="post__container">
      <Link href="/blog" className="post__back-link">
        &larr; Back to blog
      </Link>
    </section>
  );
}
