"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isPostPage = pathname.startsWith("/blog/posts");

  return (
    <footer
      className={`h-20 bg-accent w-full mt-8 flex justify-center items-center ${isPostPage && "hidden"}`}
    >
      <div className="max-w-1440">Footer</div>
    </footer>
  );
}
