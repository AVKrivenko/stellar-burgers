import type { Meta, StoryObj } from '@storybook/react';
import { BurgerIngredientUI } from '@ui';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
};

const meta: Meta<typeof BurgerIngredientUI> = {
  title: 'Components/BurgerIngredient',
  component: BurgerIngredientUI,
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof BurgerIngredientUI>;

export const Default: Story = {
  args: {
    ingredient: mockIngredient,
    count: 0,
    locationState: { background: {} as any },
    handleAdd: () => {}
  }
};

export const WithCount: Story = {
  args: {
    ingredient: mockIngredient,
    count: 5,
    locationState: { background: {} as any },
    handleAdd: () => {}
  }
};
