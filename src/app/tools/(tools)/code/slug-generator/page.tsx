import { Metadata } from "next";
import SlugGenerator from "./SlugGenerator";

export const metadata: Metadata = {
  title: "Slug Generator",
  description: "Generate a normalized slug for your URLs from a given text.",
  alternates: {
    canonical: "/tools/code/slug-generator",
  },
  openGraph: {
    title: "Slug Generator",
    description: "Generate a normalized slug for your URLs from a given text.",
    type: "website",
  },
};

export default function SlugGeneratorPage() {
  return <SlugGenerator />;
}
