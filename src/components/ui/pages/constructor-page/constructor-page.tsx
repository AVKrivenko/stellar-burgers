import { FC } from 'react';
import styles from './constructor-page.module.css';
import { Preloader } from '@ui';
import { BurgerIngredients, BurgerConstructor } from '@components';
import { TIngredient } from '@utils-types';

interface ConstructorPageUIProps {
  isIngredientsLoading: boolean;
  ingredients: TIngredient[];
}

export const ConstructorPageUI: FC<ConstructorPageUIProps> = ({
  isIngredientsLoading,
  ingredients
}) => (
  <>
    {isIngredientsLoading ? (
      <Preloader />
    ) : (
      <main className={styles.containerMain}>
        <h1
          className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
        >
          Соберите бургер
        </h1>
        <div className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients ingredients={ingredients} />
          <BurgerConstructor />
        </div>
      </main>
    )}
  </>
);
