import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../services/slices/ordersSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';

export const ProfileOrders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  const { items: ingredients, isLoading: ingredientsLoading } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    // Загружаем и заказы, и ингредиенты
    dispatch(fetchOrders());
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch]);

  // Показываем загрузку, пока что-то загружается
  if (isLoading || ingredientsLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p className='text text_type_main-medium text_color_error'>
          Ошибка: {error}
        </p>
        <button onClick={() => dispatch(fetchOrders())}>Обновить</button>
      </div>
    );
  }

  // Если ингредиенты всё ещё пустые, но не загружаются
  if (!ingredients.length) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p className='text text_type_main-medium'>Загрузка ингредиентов...</p>
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
