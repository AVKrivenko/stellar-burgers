import { test, expect } from '@playwright/test';

test.describe('Burger constructor', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });

    await page.goto('/');
    await page.waitForSelector('text=Краторная булка N-200i');
  });

  test('Добавление булки и начинки в конструктор', async ({ page }) => {
    const bun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bun.locator('button:has-text("Добавить")').click();

    const filling = page.locator('li').filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' });
    await filling.locator('button:has-text("Добавить")').click();

    const bunInConstructor = page.locator('.constructor-element_pos_top').filter({ hasText: 'Краторная булка N-200i' });
    await expect(bunInConstructor).toBeVisible();

    const fillingInConstructor = page.locator('.constructor-element').filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' });
    await expect(fillingInConstructor).toBeVisible();
  });

  test('Открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.locator('text=Краторная булка N-200i').click();

    const modalTitle = page.locator('text=Детали ингредиента');
    await expect(modalTitle).toBeVisible({ timeout: 5000 });

    await page.locator('body').click({ position: { x: 10, y: 10 } });
    await expect(modalTitle).not.toBeVisible();
  });
  test('Создание заказа', async ({ page }) => {

    await page.context().addCookies([
      { name: 'accessToken', value: 'fake-token', domain: 'localhost', path: '/' }
    ]);
    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@test.com', name: 'Test User' }
        })
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          order: { number: 109644 }
        })
      });
    });

    await page.reload();
    await page.waitForSelector('text=Краторная булка N-200i', { timeout: 10000 });

    // Добавляем булку
    const bun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bun.locator('button:has-text("Добавить")').click();

    // Добавляем начинку
    const filling = page.locator('li').filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' });
    await filling.locator('button:has-text("Добавить")').click();

    // Нажимаем "Оформить заказ"
    await page.locator('button:has-text("Оформить заказ")').click();

    const orderNumber = page.locator('text=109644');
    await expect(orderNumber).toBeVisible({ timeout: 10000 });

    const bunInConstructor = page.locator('.constructor-element_pos_top').filter({ hasText: 'Краторная булка N-200i' });
    await expect(bunInConstructor).not.toBeVisible();

    const fillingInConstructor = page.locator('.constructor-element').filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' });
    await expect(fillingInConstructor).not.toBeVisible();
  });
});
