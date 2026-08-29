import { forwardRef } from 'react';
import { TIngredientsCategoryUIProps } from './type';
import { BurgerIngredient } from '../../burger-ingredient';
import styles from './ingredients-category.module.css';

export const IngredientsCategoryUI = forwardRef<
  HTMLLIElement,
  TIngredientsCategoryUIProps
>(({ title, titleRef, ingredients, ingredientsCounters }, ref) => (
  <li className={styles.category} ref={ref}>
    <h3 className='text text_type_main-medium' ref={titleRef}>
      {title}
    </h3>
    <ul className={styles.items}>
      {ingredients.map((ingredient) => (
        <BurgerIngredient
          key={ingredient._id}
          ingredient={ingredient}
          count={ingredientsCounters[ingredient._id]}
        />
      ))}
    </ul>
  </li>
));
