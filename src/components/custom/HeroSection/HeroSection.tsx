import Link from "next/link";
import styles from "./HeroSection.module.scss";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Tech for the Curious Mind</h1>
        <p className={styles.subtitle}>
          Explore tech articles and interactive developer tools
        </p>
        <div className={styles.cta}>
          <Link href="/blog" className={styles.ctaPrimary}>
            Explore Blog
          </Link>
          <Link href="/tools" className={styles.ctaSecondary}>
            Explore Tools
          </Link>
        </div>
      </div>
    </section>
  );
}
