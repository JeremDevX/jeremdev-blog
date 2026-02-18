import WordCounter from "./WordCounter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Counter",
  description:
    "Interactive tool to track word and character counts, helping you meet recommended content lengths for blogs, social media, and emails.",
  alternates: {
    canonical: "/tools/text/word-counter",
  },
  openGraph: {
    title: "Word Counter",
    description:
      "Interactive tool to track word and character counts, helping you meet recommended content lengths for blogs, social media, and emails.",
    type: "website",
  },
};

export default function WordCounterPage() {
  return <WordCounter />;
}
