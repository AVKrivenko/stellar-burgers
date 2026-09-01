import ingredientsSlice, {
  fetchIngredients
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const initialState = {
  items: [],
  isLoading: false,
  error: null
};

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    price: 1255,
    image: 'image.png',
    image_mobile: 'image-mobile.png',
    image_large: 'image-large.png',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420
  }
];

describe('ingredientsSlice', () => {
  it('должен вернуть начальное состояние', () => {
    const state = ingredientsSlice(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('должен обрабатывать fetchIngredients.pending', () => {
    const state = ingredientsSlice(initialState, {
      type: fetchIngredients.pending.type
    });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('должен обрабатывать fetchIngredients.fulfilled', () => {
    const state = ingredientsSlice(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBe(null);
  });

  it('должен обрабатывать fetchIngredients.rejected', () => {
    const state = ingredientsSlice(initialState, {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
