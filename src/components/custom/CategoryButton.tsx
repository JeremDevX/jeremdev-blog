import Link from "next/link";

interface CategoryButtonProps {
  catClass: string;
  children: React.ReactNode | string;
  href: string;
  growOnHover: boolean;
  tabIndex?: number;
  link?: boolean;
}
export default function CategoryButton(props: CategoryButtonProps) {
  const { catClass, children, growOnHover, href } = props;
  if (props.link) {
    return (
      <Link
        href={`/blog/categories?category=${href}`}
        className={`cat-button cat-${catClass} ${growOnHover && "cat-button--grow"}`}
        tabIndex={props.tabIndex}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={`cat-button cat-${catClass} ${growOnHover && "cat-button--grow"}`}
    >
      {children}
    </button>
  );
}
