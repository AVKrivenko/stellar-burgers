import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const { items: ingredients, isLoading } = useSelector(
    (state) => state.ingredients
  );

  console.log('🔍 IngredientDetails:', {
    id,
    ingredientsCount: ingredients.length,
    isLoading
  });

  useEffect(() => {
    if (ingredients.length === 0 && !isLoading) {
      console.log('📦 Загружаем ингредиенты...');
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, isLoading]);

  const ingredientData = useMemo(() => {
    if (ingredients.length === 0 || !id) return null;
    const found = ingredients.find((item) => item._id === id);
    console.log(
      '🔍 Ищем ингредиент:',
      id,
      found ? '✅ Найден' : '❌ Не найден'
    );
    return found || null;
  }, [ingredients, id]);

  if (isLoading || ingredients.length === 0) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p className='text text_type_main-medium text_color_error'>
          Ингредиент не найден
        </p>
        <p className='text text_type_main-default mt-4'>ID: {id}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 100px)',
        padding: '20px'
      }}
    >
      <div style={{ maxWidth: '640px', width: '100%' }}>
        <h1 className='text text_type_main-large mb-5 text-center'>
          Детали ингредиента
        </h1>
        <IngredientDetailsUI ingredientData={ingredientData} />
      </div>
    </div>
  );
};
