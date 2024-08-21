import { Suspense } from "react";

import Link from "next/link";

import styles from "./page.module.css";
import MealsGrid from "@/components/meals/meals-grid/meals-grid";
import { getMeals } from "@/lib/meals/meals";

export const metadata = {
  title: "All Meals",
  description: "Browse the delicious meals shared by our vibrant community.",
};

async function Meals() {
  console.log("Fetching meals");
  const meals = await getMeals();

  return <MealsGrid meals={meals} />;
}

export default function MealsPage() {
  return (
    <>
      <header className={styles.header}>
        <h1>
          Delicious meals, created &nbsp;{" "}
          <span className={styles.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it yourself. It&apos;s easy, fun,
          and a chance to explore new flavors!
        </p>
        <p>
          Whether you&apos;re a seasoned chef or just starting, our community is
          here to inspire and guide you through every step.
        </p>
        <p>
          Experience the joy of cooking, share your culinary creations, and
          connect with fellow food lovers. Let&apos;s make every meal an
          adventure!
        </p>
        <p className={styles.cta}>
          <Link href="/meals/share">Share Your Favorite Recipe</Link>
        </p>
      </header>
      <main className={styles.header}>
        <section>
          <h2>Explore Our Community&apos;s Favorite Meals</h2>
          <p>
            Dive into a world of delicious possibilities! Our community has
            shared their most beloved recipes, from quick weeknight dinners to
            elaborate weekend feasts. Whether you&apos;re looking for something
            new or a classic dish, you&apos;ll find it here.
          </p>
        </section>
        <Suspense
          fallback={<p className={styles.loading}>Fetching meals...</p>}
        >
          <Meals />
        </Suspense>

        <section>
          <h2>Join the Culinary Journey</h2>
          <p>
            Every recipe tells a story. Share yours with our vibrant community
            of food enthusiasts. Your recipe could be the next big hit!
          </p>
          <p>
            Don&apos;t just follow recipes – create them, improve them, and
            inspire others. Together, we can turn every meal into a masterpiece.
          </p>
          <p className={styles.cta}>
            <Link href="/community">Become a Member Today</Link>
          </p>
        </section>
      </main>
    </>
  );
}
