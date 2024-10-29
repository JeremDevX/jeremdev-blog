import { Metadata } from "next";
import SlugGenerator from "./SlugGenerator";

export const metadata: Metadata = {
  title: "TechHowlerX - Slug Generator Tool",
  description: "Generate a normalized slug for your URLs from a given text.",
  keywords: "slug, generator, slug generator, text, normalize",
};

export default function SlugGeneratorPage() {
  return <SlugGenerator />;
}
