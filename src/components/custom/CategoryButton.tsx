import Link from "next/link";

interface CategoryButtonProps {
  catClass: string;
  children: React.ReactNode | string;
  href: string;
  growOnHover: boolean;
  tabIndex?: number;
}
export default function CategoryButton(props: CategoryButtonProps) {
  const { catClass, children, growOnHover, href } = props;
  return (
    <Link
      href={`/blog/categories?category=${href}`}
      className={`font-bold py-1 px-2 text-base xs:text-xl rounded-lg cat-${catClass} ${growOnHover && "hover:scale-105 hover:drop-shadow-light"}`}
      tabIndex={props.tabIndex}
    >
      {children}
    </Link>
  );
}
