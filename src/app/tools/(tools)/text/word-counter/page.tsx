import WordCounter from "./WordCounter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechHowlerX - Word Counter Tool",
  description:
    "Interactive tool to track word and character counts, helping you meet recommended content lengths for blogs, social media, and emails.",
};

export default function WordCounterPage() {
  return <WordCounter />;
}
