import { Mail } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Link as LucideLink, Linkedin } from "lucide-react";

export const metadata: Metadata = {
  title: "TechHowlerX - About",
  description:
    "Discover the purpose of this website and learn more about the creator behind TechHowlerX.",
};

export default function About() {
  return (
    <main className="flex flex-col w-full max-w-1000 mt-10 px-4 mb-8">
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
      <h2 className="text-2xl font-bold underline underline-offset-4 mb-2 mt-6 text-center">
        Get in Touch
      </h2>
      <div className="flex justify-center flex-wrap gap-12 mt-2">
        <Link
          href="https://jeremdevx.com"
          className="flex flex-col items-center justify-center hover:scale-110 hover:bg-secondary px-4 pt-2 pb-1 rounded"
          rel="noopener noreferrer"
          target="_blank"
        >
          <LucideLink height={25} width={25} />
          <span>Portfolio</span>
        </Link>
        <Link
          href="https://github.com/JeremDevX"
          className="flex flex-col items-center justify-center hover:scale-110 hover:bg-secondary px-4 pt-2 pb-1 rounded"
          rel="noopener noreferrer"
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
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </Link>
        <Link
          href="mailto:jeremdev.contactpro@gmail.com"
          className="flex flex-col items-center justify-center hover:scale-110 hover:bg-secondary px-4 pt-2 pb-1 rounded"
        >
          <Mail height={25} width={25} />
          <span>Mail</span>
        </Link>
        <Link
          href="https://x.com/JeremDevX"
          className="flex flex-col items-center justify-center hover:scale-110 hover:bg-secondary px-2 pt-2 pb-1 rounded"
          rel="noopener noreferrer"
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
        <Link
          href="https://www.linkedin.com/in/jeremie-lavergnat/"
          className="flex flex-col items-center justify-center hover:scale-110 hover:bg-secondary px-4 pt-2 pb-1 rounded"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Linkedin height={25} width={25} />
          <span>Linkedin</span>
        </Link>
      </div>
    </main>
  );
}
