import Image from "next/image";
import { notFound } from "next/navigation";

import PropTypes from "prop-types";

import classes from "./page.module.css";
import { getMeal } from "@/lib/meals/meals";

const AWS_BUCKET_URL = process.env.AWS_BUCKET_SERVER_IMAGE_URL;

export async function generateMetadata({ params }) {
  const meal = await getMeal(params.mealsSlug);

  if (!meal) {
    notFound();
  }

  return {
    title: meal.title,
    description: meal.summary,
  };
}

export default async function MealsDetailsPage({ params }) {
  const meal = await getMeal(params.mealsSlug);
  console.log(meal);
  if (!meal) {
    notFound();
  }
  meal.instructions = meal.instructions.replace(/\n/g, "<br />");

  console.log(`${AWS_BUCKET_URL}/${meal.image}`);

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image
            src={`${AWS_BUCKET_URL}/${meal.image}`}
            alt={meal.title}
            fill
          />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{
            __html: meal.instructions,
          }}
        ></p>
      </main>
    </>
  );
}

MealsDetailsPage.propTypes = {
  params: PropTypes.shape({
    mealsSlug: PropTypes.string.isRequired,
  }).isRequired,
};
