import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

function MdxImage(props: ComponentPropsWithoutRef<"img">) {
  const { src, alt, width, height } = props;
  if (!src || typeof src !== "string") return null;

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={width ? Number(width) : 1200}
      height={height ? Number(height) : 630}
    />
  );
}

function MdxLink(props: ComponentPropsWithoutRef<"a">) {
  const { href, children, ...rest } = props;
  if (!href) return <a {...rest}>{children}</a>;

  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  img: MdxImage,
  a: MdxLink,
};
