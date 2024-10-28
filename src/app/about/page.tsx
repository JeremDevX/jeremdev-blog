import { Mail } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TechHowlerX - About",
  description:
    "Discover the purpose of this website and learn more about the creator behind TechHowlerX.",
};

export default function About() {
  return (
    <main className="flex flex-col max-w-1000 mt-10 px-4 mb-8">
      <h1 className="text-center text-3xl font-bold mb-8">About</h1>
      <h2 className="text-2xl font-bold underline underline-offset-4 mb-2 mt-6 text-center">
        Why This Website ?
      </h2>
      <p className="text-xl">
        I created this website to share my passion for technology and
        programming. As a developer, I strongly believe in the power of
        knowledge sharing. This platform is designed to offer valuable
        resources, tutorials, insights, and tools that can benefit fellow
        developers as well as anyone with an interest in technology.
      </p>
      <h2 className="text-2xl font-bold underline underline-offset-4 mb-2 mt-6 text-center">
        Who Am I ?
      </h2>
      <p className="text-xl">
        I’m Jérémie L. (also known as JeremDevX), a passionate junior front-end
        developer based in Switzerland. I built this website not only to assist
        other developers but also to improve my own skills along the way. While
        design isn’t my strongest suit, I strive to keep the user interface
        simple and user-friendly.
      </p>
      <h2 className="text-2xl font-bold underline underline-offset-4 mb-2 mt-6 text-center">
        Encountered an Issue?
      </h2>
      <p className="text-xl">
        If you come across any problems—whether it’s a bug, outdated
        information, or even a typo—I’d love to hear from you. Your feedback is
        invaluable in helping me improve the content and tools available here.
        You can contact me via email or reach out on X (Twitter). I’m always
        open to suggestions, corrections, or any thoughts that can make this
        platform even better for everyone.
      </p>
      <div className="flex justify-center gap-12 mt-20">
        <Link
          href="mailto:jeremdev.contactpro@gmail.com"
          className="flex flex-col items-center justify-center hover:scale-110 hover:bg-secondary px-4 pt-2 pb-1 rounded"
        >
          <Mail height={25} width={25} />
          <span>Mail</span>
        </Link>
        <Link
          href="https://x.com"
          className="flex flex-col items-center justify-center hover:scale-110 hover:bg-secondary px-2 pt-2 pb-1 rounded"
          target="_blank"
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            height={25}
            width={25}
            className="fill-foreground"
          >
            <title>X</title>
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
          </svg>
          <span>X(twitter)</span>
        </Link>
      </div>
    </main>
  );
}
