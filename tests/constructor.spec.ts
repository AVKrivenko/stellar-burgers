import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

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

    // Проверяем верхнюю половину булки
    const bunTop = page.locator('.constructor-element_pos_top').filter({ hasText: 'Краторная булка N-200i' });
    await expect(bunTop).toBeVisible();

    // Проверяем нижнюю половину булки
    const bunBottom = page.locator('.constructor-element_pos_bottom').filter({ hasText: 'Краторная булка N-200i' });
    await expect(bunBottom).toBeVisible();

    // Проверяем начинку
    const fillingInConstructor = page.locator('.constructor-element').filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' });
    await expect(fillingInConstructor).toBeVisible();
  });

  test('Открытие и закрытие модального окна ингредиента', async ({ page }) => {
    // 1. Открываем модальное окно кликом на ингредиент
    await page.locator('text=Краторная булка N-200i').first().click();

    // 2. Находим заголовок и модальное окно
    const modalTitle = page.getByRole('heading', { name: 'Детали ингредиента' });
    await expect(modalTitle).toBeVisible();

    const modal = modalTitle.locator('xpath=../..');

    // 3. Проверяем заголовок внутри модалки
    await expect(modal.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();

    // 4. Проверяем данные открытого ингредиента (название и КБЖУ)
    await expect(modal.getByRole('heading', { name: 'Краторная булка N-200i' })).toBeVisible();
    await expect(modal.getByText('Калории, ккал')).toBeVisible();
    await expect(modal.getByText('420')).toBeVisible();
    await expect(modal.getByText('Белки, г')).toBeVisible();
    await expect(modal.getByText('80')).toBeVisible();
    await expect(modal.getByText('Жиры, г')).toBeVisible();
    await expect(modal.getByText('24')).toBeVisible();
    await expect(modal.getByText('Углеводы, г')).toBeVisible();
    await expect(modal.getByText('53')).toBeVisible();

    // 5. Закрываем модалку по кнопке с крестиком
    const closeButton = modalTitle.locator('..').locator('button');
    await closeButton.click();

    // 6. Проверяем закрытие
    await expect(modalTitle).not.toBeVisible();
  });
test('Создание заказа', async ({ page }) => {
  // 1. Считываем ожидаемый номер заказа из orders.har
  const harFilePath = path.resolve(__dirname, 'hars/orders.har');
  const ordersHarRaw = fs.readFileSync(harFilePath, 'utf-8');
  const ordersHarData = JSON.parse(ordersHarRaw);
  const ordersResponseBody = JSON.parse(
    ordersHarData.log.entries[0].response.content.text
  );
  const expectedOrderNumber = String(ordersResponseBody.order.number);

  // 2. Подключаем HAR-файлы
  await page.routeFromHAR('tests/hars/user.har', {
    url: '**/api/auth/user',
    update: false,
  });

  await page.routeFromHAR('tests/hars/orders.har', {
    url: '**/api/orders',
    update: false,
  });

  // 3. Устанавливаем куки и токен авторизации
  await page.context().addCookies([
    { name: 'accessToken', value: 'fake-token', domain: 'localhost', path: '/' },
  ]);
  await page.evaluate(() => {
    localStorage.setItem('refreshToken', 'fake-refresh-token');
  });

  // 4. Перезагружаем страницу для применения авторизации
  await page.reload();
  await page.waitForSelector('text=Краторная булка N-200i', { timeout: 10000 });

  // 5. Добавляем булку и начинку в конструктор
  const bun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
  await bun.locator('button:has-text("Добавить")').click();

  const filling = page
    .locator('li')
    .filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' });
  await filling.locator('button:has-text("Добавить")').click();

  // 6. Оформляем заказ
  await page.locator('button:has-text("Оформить заказ")').click();

  // 7. Работаем внутри портала модалок (#modals сам по себе hidden — это нормально)
  const modals = page.locator('#modals');

  // Ждём номер заказа из HAR внутри модалок
  const orderNumberInModals = modals.getByText(expectedOrderNumber);
  await expect(orderNumberInModals).toBeVisible({ timeout: 15000 });

  // Ограничиваемся контейнером модалки заказа (и проверяем текст внутри неё)
  const orderModal = orderNumberInModals.locator(
    'xpath=ancestor::div[.//button][1]'
  );

  await expect(orderModal.getByText('идентификатор заказа')).toBeVisible();
  await expect(orderModal.getByText(expectedOrderNumber)).toBeVisible();

  // 8. Закрываем модалку
  await orderModal.locator('button[type="button"]').first().click();

  // Убеждаемся, что модалка закрылась
  await expect(orderNumberInModals).not.toBeVisible();

  // 9. Проверяем, что конструктор очистился полностью (верх/низ булки + начинка)
  const bunTopInConstructor = page
    .locator('.constructor-element_pos_top')
    .filter({ hasText: 'Краторная булка N-200i' });
  await expect(bunTopInConstructor).not.toBeVisible();

  const bunBottomInConstructor = page
    .locator('.constructor-element_pos_bottom')
    .filter({ hasText: 'Краторная булка N-200i' });
  await expect(bunBottomInConstructor).not.toBeVisible();

  const fillingInConstructor = page
    .locator('.constructor-element')
    .filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' });
  await expect(fillingInConstructor).not.toBeVisible();
});
});
