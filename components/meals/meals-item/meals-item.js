import Image from "next/image";
import Link from "next/link";

import classes from "./meals-item.module.css";

import PropTypes from "prop-types";

export default function MealsItem({ title, slug, image, summary, creator }) {
  const imageUrl = process.env.AWS_BUCKET_SERVER_IMAGE_URL;

  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <Image src={`${imageUrl}/${image}`} alt={title} fill />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          <Link href={`/meals/${slug}`}>View Details</Link>
        </div>
      </div>
    </article>
  );
}

MealsItem.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
};
