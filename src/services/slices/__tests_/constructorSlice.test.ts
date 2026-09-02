import constructorSlice, {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

const initialState = {
  bun: null,
  ingredients: []
};

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Тестовый ингредиент',
  type: 'main',
  price: 100,
  image: 'image.png',
  image_mobile: 'image-mobile.png',
  image_large: 'image-large.png',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100
};

const mockBun: TIngredient = {
  _id: '2',
  name: 'Тестовая булка',
  type: 'bun',
  price: 200,
  image: 'image.png',
  image_mobile: 'image-mobile.png',
  image_large: 'image-large.png',
  proteins: 20,
  fat: 20,
  carbohydrates: 20,
  calories: 200
};

describe('constructorSlice', () => {
  it('должен вернуть начальное состояние', () => {
    const state = constructorSlice(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('должен добавлять ингредиент (не булку)', () => {
    const action = addIngredient(mockIngredient);
    const state = constructorSlice(initialState, action);
    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0].name).toBe('Тестовый ингредиент');
    expect(state.bun).toBe(null);
  });

  it('должен добавлять булку', () => {
    const action = addIngredient(mockBun);
    const state = constructorSlice(initialState, action);
    expect(state.bun).not.toBe(null);
    expect(state.bun?.name).toBe('Тестовая булка');
    expect(state.ingredients.length).toBe(0);
  });

  it('должен заменять булку при добавлении новой', () => {
    const bun1 = { ...mockBun, _id: '2', name: 'Булка 1' };
    const bun2 = { ...mockBun, _id: '3', name: 'Булка 2' };

    let state = constructorSlice(initialState, addIngredient(bun1));
    expect(state.bun?.name).toBe('Булка 1');

    state = constructorSlice(state, addIngredient(bun2));
    expect(state.bun?.name).toBe('Булка 2');
    expect(state.ingredients.length).toBe(0);
  });

  it('должен удалять ингредиент', () => {
    const addAction = addIngredient(mockIngredient);
    let state = constructorSlice(initialState, addAction);
    expect(state.ingredients.length).toBe(1);

    const removeAction = removeIngredient(state.ingredients[0].id);
    state = constructorSlice(state, removeAction);
    expect(state.ingredients.length).toBe(0);
  });

  it('должен очищать конструктор', () => {
    let state = constructorSlice(initialState, addIngredient(mockIngredient));
    state = constructorSlice(state, addIngredient(mockBun));
    expect(state.ingredients.length).toBe(1);
    expect(state.bun).not.toBe(null);

    state = constructorSlice(state, clearConstructor());
    expect(state.ingredients.length).toBe(0);
    expect(state.bun).toBe(null);
  });

  it('должен перемещать ингредиент', () => {
    const ing1 = { ...mockIngredient, _id: '1', name: 'Ингредиент 1' };
    const ing2 = { ...mockIngredient, _id: '2', name: 'Ингредиент 2' };

    let state = constructorSlice(initialState, addIngredient(ing1));
    state = constructorSlice(state, addIngredient(ing2));
    expect(state.ingredients[0].name).toBe('Ингредиент 1');
    expect(state.ingredients[1].name).toBe('Ингредиент 2');

    state = constructorSlice(state, moveIngredient({ from: 0, to: 1 }));
    expect(state.ingredients[0].name).toBe('Ингредиент 2');
    expect(state.ingredients[1].name).toBe('Ингредиент 1');
  });
});
