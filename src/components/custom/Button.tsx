import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
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
          className={`button ${props.className ? props.className : ""}`}
          aria-label={props.ariaLabel}
        >
          {props.children}
        </Link>
      ) : (
        <button
          className={`button ${props.disabled ? "btn-disabled" : ""} ${props.className}`}
          onClick={props.onClick}
          aria-label={props.ariaLabel}
          disabled={props.disabled}
        >
          {props.children}
        </button>
      )}
    </>
  );
}
