import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { AppHeader } from '@components';
import { ProtectedRoute } from '../protected-route';
import { ModalUI, IngredientDetailsUI, OrderInfoUI } from '@ui';
import { OrderInfo } from '../order-info';
import { IngredientDetails } from '../ingredient-details';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { useEffect } from 'react';
import { getUser } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';
import styles from './app.module.css';
import { TOrder, TIngredient } from '@utils-types';
import '../../index.css';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const dispatch = useDispatch();

  const { items: ingredients } = useSelector((state) => state.ingredients);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!user && !isAuthenticated) {
      dispatch(getUser());
    }
  }, [dispatch, user, isAuthenticated]);

  const getIngredientById = (id: string) =>
    ingredients.find((item) => item._id === id);

  const handleModalClose = () => {
    navigate(-1);
  };

  const getIngredientId = () => {
    const pathParts = location.pathname.split('/');
    return pathParts[pathParts.length - 1] || '';
  };

  const ingredientId = getIngredientId();
  const ingredientData = getIngredientById(ingredientId);

  const getOrderNumber = () => {
    const pathParts = location.pathname.split('/');
    return parseInt(pathParts[pathParts.length - 1]) || 0;
  };

  const orderNumber = getOrderNumber();
  const orderData = orders.find((o) => o.number === orderNumber);

  const prepareOrderInfo = (order: TOrder | null) => {
    if (!order) return null;

    const ingredientsInfo: {
      [key: string]: TIngredient & { count: number };
    } = {};
    let total = 0;

    order.ingredients?.forEach((id: string) => {
      const ingredient = ingredients.find((item) => item._id === id);
      if (ingredient) {
        if (!ingredientsInfo[id]) {
          ingredientsInfo[id] = {
            ...ingredient,
            count: 0
          };
        }
        ingredientsInfo[id].count += 1;
        total += ingredient.price;
      }
    });

    return {
      ...order,
      ingredientsInfo,
      total,
      date: new Date(order.createdAt),
      ingredientsToShow: Object.values(ingredientsInfo).slice(0, 6)
    };
  };

  const preparedOrderData = prepareOrderInfo(orderData || null);

  const pageStyles = {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '40px 20px'
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <ModalUI onClose={handleModalClose} title='Детали ингредиента'>
                {ingredientData ? (
                  <IngredientDetailsUI ingredientData={ingredientData} />
                ) : (
                  <p>Ингредиент не найден</p>
                )}
              </ModalUI>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <ModalUI
                onClose={handleModalClose}
                title={`#${String(orderNumber).padStart(6, '0')}`}
              >
                {preparedOrderData ? (
                  <OrderInfoUI orderInfo={preparedOrderData} />
                ) : (
                  <p>Заказ не найден</p>
                )}
              </ModalUI>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <ModalUI
                  onClose={handleModalClose}
                  title={`#${String(orderNumber).padStart(6, '0')}`}
                >
                  {preparedOrderData ? (
                    <OrderInfoUI orderInfo={preparedOrderData} />
                  ) : (
                    <p>Заказ не найден</p>
                  )}
                </ModalUI>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
