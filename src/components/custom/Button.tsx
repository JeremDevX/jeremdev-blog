import Link from "next/link";

interface ButtonProps {
  text: string;
  link?: string;
}

export default function Button(props: ButtonProps) {
  return (
    <>
      {props.link ? (
        <Link
          href={`${props.link}`}
          className="px-6 py-1 w-fit rounded-lg bg-secondary text-lg font-semibold hover:bg-primary hover:text-primary-foreground ring-1 hover:drop-shadow-light hover:scale-105"
        >
          {props.text}
        </Link>
      ) : (
        <button className="px-6 py-1 w-fit rounded-lg bg-secondary text-lg font-semibold hover:bg-primary hover:text-primary-foreground ring-1 hover:drop-shadow-light hover:scale-105">
          {props.text}
        </button>
      )}
    </>
  );
}
