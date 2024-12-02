import Button from "@/components/custom/Button";

export default function NotFound() {
  return (
    <main className="not-found">
      <h2>404 Page Not Found</h2>
      <p>The page you were looking for doesn&apos;t exist.</p>
      <Button link="/" className="not-found__button">
        Return Home
      </Button>
    </main>
  );
}
