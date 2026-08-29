import type { Meta, StoryObj } from '@storybook/react';
import { AppHeaderUI } from '@ui';

const meta: Meta<typeof AppHeaderUI> = {
  title: 'Components/AppHeader',
  component: AppHeaderUI,
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;
type Story = StoryObj<typeof AppHeaderUI>;

export const Default: Story = {
  args: {
    userName: '' // ← исправлено!
  }
};

export const WithUserName: Story = {
  args: {
    userName: 'Анастасия'
  }
};
