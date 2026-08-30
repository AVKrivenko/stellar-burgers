import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi } from '@api';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ingredients = useSelector((state) => state.ingredients.items);
  const ingredientsLoading = useSelector(
    (state) => state.ingredients.isLoading
  );

  useEffect(() => {
    if (!ingredients.length && !ingredientsLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, ingredientsLoading]);

  useEffect(() => {
    if (!number) return;

    setIsLoading(true);
    setError(null);

    getOrderByNumberApi(Number(number))
      .then((res) => {
        if (res.success && res.orders.length) {
          setOrderData(res.orders[0]);
        } else {
          setError('Заказ не найден');
        }
      })
      .catch((err) => {
        console.error('❌ Ошибка:', err);
        setError('Ошибка загрузки заказа');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData) return null;
    if (!ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: { [key: string]: TIngredient & { count: number } }, id: string) => {
        const ingredient = ingredients.find((ing) => ing._id === id);
        if (ingredient) {
          if (!acc[id]) {
            acc[id] = { ...ingredient, count: 0 };
          }
          acc[id].count += 1;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (isLoading || ingredientsLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p className='text text_type_main-medium text_color_error'>{error}</p>
      </div>
    );
  }

  if (!orderInfo) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p className='text text_type_main-medium'>Заказ не найден</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 className='text text_type_main-large mb-5'>
        #{String(orderInfo.number).padStart(6, '0')}
      </h1>
      <OrderInfoUI orderInfo={orderInfo} />
    </div>
  );
};
