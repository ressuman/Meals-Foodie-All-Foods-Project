import MealsItem from "../meals-item/meals-item";
import styles from "./meals-grid.module.css";

import PropTypes from "prop-types";

export default function MealsGrid({ meals }) {
  return (
    <ul className={styles.meals}>
      {meals?.map((meal) => (
        <li key={meal.id}>
          <MealsItem {...meal} />
        </li>
      ))}
    </ul>
  );
}

MealsGrid.propTypes = {
  meals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      creator: PropTypes.string.isRequired,
    })
  ).isRequired,
};
