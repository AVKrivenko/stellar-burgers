import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const { bun, ingredients } = useSelector(
      (state) => state.burgerConstructor
    );

    let calculatedCount = 0;
    if (ingredient.type === 'bun') {
      if (bun && bun._id === ingredient._id) {
        calculatedCount = 2;
      }
    } else if (ingredients) {
      calculatedCount = ingredients.filter(
        (item) => item._id === ingredient._id
      ).length;
    }

    const finalCount = count ?? calculatedCount;

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={finalCount}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
