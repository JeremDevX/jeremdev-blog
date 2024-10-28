import { Metadata } from "next";
import Categories from "./Categories";

export const metadata: Metadata = {
  title: "TechHowlerX - Blog Categories",
  description: "Browse blog categories to find posts on specific topics.",
};

export default function CategoriesPage() {
  return (
    <main className="flex flex-col gap-12 w-full max-w-screen-xl p-4 mt-20">
      <Categories />
    </main>
  );
}
