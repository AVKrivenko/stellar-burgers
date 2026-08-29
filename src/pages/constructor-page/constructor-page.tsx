import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { ConstructorPageUI } from '../../components/ui/pages/constructor-page';

export const ConstructorPage = () => {
  const dispatch = useDispatch();
  const {
    items: ingredients,
    isLoading,
    error
  } = useSelector((state) => state.ingredients);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p className='text text_type_main-medium text_color_error'>
          Ошибка загрузки: {error}
        </p>
        <button
          onClick={() => dispatch(fetchIngredients())}
          style={{ marginTop: '20px', cursor: 'pointer' }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <ConstructorPageUI
      isIngredientsLoading={isLoading}
      ingredients={ingredients}
    />
  );
};
