import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  removeIngredient,
  moveIngredient
} from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Перемещение элемента вниз
    const handleMoveDown = () => {
      dispatch(moveIngredient({ from: index, to: index + 1 }));
    };

    // Перемещение элемента вверх
    const handleMoveUp = () => {
      dispatch(moveIngredient({ from: index, to: index - 1 }));
    };

    // Удаление ингредиента по его уникальному id
    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
