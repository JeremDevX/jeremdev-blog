import Link from "next/link";

interface ButtonProps {
  text: string;
  link?: string;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
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
          className={`px-6 py-1 w-fit rounded-lg bg-secondary text-lg font-semibold ${!props.disabled && "hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:drop-shadow-lighter"} ${props.disabled && "opacity-60"} ring-1  ${props.className}`}
          onClick={props.onClick}
          aria-label={props.ariaLabel}
          disabled={props.disabled}
        >
          {props.text}
        </button>
      )}
    </>
  );
}
