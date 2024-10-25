import Link from "next/link";

interface ButtonProps {
  text: string;
  link?: string;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}

export default function Button(props: ButtonProps) {
  return (
    <>
      {props.link ? (
        <Link
          href={`${props.link}`}
          className={`px-6 py-1 w-fit rounded-lg bg-secondary text-lg font-semibold hover:bg-primary hover:text-primary-foreground ring-1 hover:drop-shadow-lighter hover:scale-105 ${props.className}`}
          aria-label={props.ariaLabel}
        >
          {props.text}
        </Link>
      ) : (
        <button
          className={`px-6 py-1 w-fit rounded-lg bg-secondary text-lg font-semibold hover:bg-primary hover:text-primary-foreground ring-1 hover:drop-shadow-lighter hover:scale-105 ${props.className}`}
          onClick={props.onClick}
          aria-label={props.ariaLabel}
        >
          {props.text}
        </button>
      )}
    </>
  );
}
