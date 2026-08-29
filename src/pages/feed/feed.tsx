import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/ordersSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';

export const Feed = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  const { items: ingredients, isLoading: ingredientsLoading } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    dispatch(fetchFeeds());
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading || ingredientsLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p className='text text_type_main-medium text_color_error'>
          Ошибка: {error}
        </p>
        <button onClick={handleGetFeeds}>Обновить</button>
      </div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
