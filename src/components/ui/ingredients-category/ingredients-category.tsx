import { forwardRef } from 'react';
import styles from './ingredients-category.module.css';
import { TIngredientsCategoryUIProps } from './type';
import { BurgerIngredient } from '@components';

export const IngredientsCategoryUI = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryUIProps
>(({ title, titleRef, ingredients, ingredientsCounters }, ref) => (
  <section className={styles.category}>
    <h2 ref={titleRef} className='text text_type_main-medium mt-10 mb-6'>
      {title}
    </h2>
    <ul ref={ref} className={styles.items}>
      {ingredients.map((ingredient) => (
        <BurgerIngredient
          key={ingredient._id}
          ingredient={ingredient}
          count={ingredientsCounters[ingredient._id] || 0}
        />
      ))}
    </ul>
  </section>
));
