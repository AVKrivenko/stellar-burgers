// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { orderBurgerApi } from '../../utils/burger-api';
// import { TOrder } from '../../utils/types';

// interface OrderState {
//   orderRequest: boolean;
//   orderModalData: TOrder | null;
//   error: string | null;
// }

// const initialState: OrderState = {
//   orderRequest: false,
//   orderModalData: null,
//   error: null
// };

// export const createOrder = createAsyncThunk(
//   'order/createOrder',
//   async (data: string[]) => {
//     const response = await orderBurgerApi(data);
//     return {
//       ...response.order,
//       ingredients: []
//     } as TOrder;
//   }
// );

// const orderSlice = createSlice({
//   name: 'order',
//   initialState,
//   reducers: {
//     clearOrderData: (state) => {
//       state.orderModalData = null;
//       state.orderRequest = false;
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createOrder.pending, (state) => {
//         state.orderRequest = true;
//         state.error = null;
//       })
//       .addCase(createOrder.fulfilled, (state, action) => {
//         state.orderRequest = false;
//         state.orderModalData = action.payload;
//       })
//       .addCase(createOrder.rejected, (state, action) => {
//         state.orderRequest = false;
//         state.error = action.error.message || 'Ошибка создания заказа';
//       });
//   }
// });

// export const { clearOrderData } = orderSlice.actions;
// export default orderSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { clearConstructor } from './constructorSlice';

interface OrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[], { dispatch }) => {
    const response = await orderBurgerApi(data);
    dispatch(clearConstructor());
    return {
      ...response.order,
      ingredients: []
    } as TOrder;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      });
  }
});

export const { clearOrderData } = orderSlice.actions;
export default orderSlice.reducer;
