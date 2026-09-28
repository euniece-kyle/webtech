import { test, expect } from '@playwright/test';

test.describe('Front-End Automation Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
  });


  test.describe('10 Functional Logic Checks', () => {

    test('F01: Core Workflow - Add a new item', async ({ page }) => {
      const input = page.locator('.new-todo');
      await input.fill('Buy groceries');
      await input.press('Enter');
      await expect(page.locator('.todo-list label')).toHaveText(['Buy groceries']);
    });

    test('F02: Data Processing - Multiple sequential entries', async ({ page }) => {
      const input = page.locator('.new-todo');
      for (const item of ['Task A', 'Task B', 'Task C']) {
        await input.fill(item);
        await input.press('Enter');
      }
      await expect(page.locator('.todo-list li')).toHaveCount(3);
    });

    test('F03: User Interaction - Complete an item', async ({ page }) => {
      await page.locator('.new-todo').fill('Complete homework');
      await page.locator('.new-todo').press('Enter');
      await page.locator('.todo-list li .toggle').first().check();
      await expect(page.locator('.todo-list li').first()).toHaveClass(/completed/);
    });

    test('F04: User Interaction - Clear completed items', async ({ page }) => {
      await page.locator('.new-todo').fill('Task to clear');
      await page.locator('.new-todo').press('Enter');
      await page.locator('.todo-list li .toggle').first().check();
      await page.locator('.clear-completed').click();
      await expect(page.locator('.todo-list li')).toHaveCount(0);
    });

    test('F05: State Persistence - Retain state across page reload', async ({ page }) => {
      await page.locator('.new-todo').fill('Persistent Task');
      await page.locator('.new-todo').press('Enter');
      await page.reload();
      await expect(page.locator('.todo-list label')).toHaveText(['Persistent Task']);
    });

    test('F06: Navigation / Filter - Active items filter', async ({ page }) => {
      await page.locator('.new-todo').fill('Active Task');
      await page.locator('.new-todo').press('Enter');
      await page.locator('.new-todo').fill('Completed Task');
      await page.locator('.new-todo').press('Enter');
      await page.locator('.todo-list li').filter({ hasText: 'Completed Task' }).locator('.toggle').check();
      await page.click('a[href="#/active"]');
      await expect(page.locator('.todo-list li')).toHaveCount(1);
      await expect(page.locator('.todo-list label')).toHaveText(['Active Task']);
    });

    test('F07: Navigation / Filter - Completed items filter', async ({ page }) => {
      await page.locator('.new-todo').fill('Task 1');
      await page.locator('.new-todo').press('Enter');
      await page.locator('.todo-list li .toggle').check();
      await page.click('a[href="#/completed"]');
      await expect(page.locator('.todo-list label')).toHaveText(['Task 1']);
    });

    test('F08: Item Deletion - Delete item via destroy trigger', async ({ page }) => {
      await page.locator('.new-todo').fill('Delete Me');
      await page.locator('.new-todo').press('Enter');
      const item = page.locator('.todo-list li').first();
      await item.hover();
      await item.locator('.destroy').click();
      await expect(page.locator('.todo-list li')).toHaveCount(0);
    });

    test('F09: Bulk State Toggle - Toggle all items simultaneously', async ({ page }) => {
      await page.locator('.new-todo').fill('Item 1');
      await page.locator('.new-todo').press('Enter');
      await page.locator('.new-todo').fill('Item 2');
      await page.locator('.new-todo').press('Enter');
      await page.locator('label[for="toggle-all"]').click();
      await expect(page.locator('.todo-list li.completed')).toHaveCount(2);
    });

    test('F10: Inline Editing - Update item title on double click', async ({ page }) => {
      await page.locator('.new-todo').fill('Original Title');
      await page.locator('.new-todo').press('Enter');
      await page.locator('.todo-list label').first().dblclick();
      const editInput = page.locator('.todo-list li.editing .edit');
      await editInput.fill('Updated Title');
      await editInput.press('Enter');
      await expect(page.locator('.todo-list label')).toHaveText(['Updated Title']);
    });

  });

  test.describe('10 UI & Visual Validation Checks', () => {

    test('V01: Header Visibility - Heading renders properly', async ({ page }) => {
      const header = page.locator('h1');
      await expect(header).toBeVisible();
      await expect(header).toHaveText('todos');
    });

    test('V02: Input Field Placeholder - Display correct guidance text', async ({ page }) => {
      const input = page.locator('.new-todo');
      await expect(input).toHaveAttribute('placeholder', 'What needs to be done?');
    });

    test('V03: Element Styling - Verify header CSS attributes', async ({ page }) => {
      const header = page.locator('h1');
      await expect(header).toHaveCSS('font-size', '100px');
    });

    test('V04: Conditional UI State - Footer hidden when list is empty', async ({ page }) => {
      await expect(page.locator('.footer')).toBeHidden();
    });

    test('V05: Conditional UI State - Footer visible when items exist', async ({ page }) => {
      await page.locator('.new-todo').fill('Test item');
      await page.locator('.new-todo').press('Enter');
      await expect(page.locator('.footer')).toBeVisible();
    });

    test('V06: Component UI - Counter displays accurate item count', async ({ page }) => {
      await page.locator('.new-todo').fill('Single Item');
      await page.locator('.new-todo').press('Enter');
      await expect(page.locator('.todo-count')).toContainText('1 item left');
    });

    test('V07: Component Styling - Active filter highlight styling', async ({ page }) => {
      await page.locator('.new-todo').fill('Check styling');
      await page.locator('.new-todo').press('Enter');
      await expect(page.locator('a[href="#/"]')).toHaveClass('selected');
    });

    test('V08: Responsive Layout - Validate rendering on Mobile Viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('.new-todo')).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();
    });

    test('V09: Visual Snapshot - Full page baseline match', async ({ page }) => {
      await page.locator('.new-todo').fill('Snapshot item');
      await page.locator('.new-todo').press('Enter');
      await expect(page).toHaveScreenshot('landing-page.png', { maxDiffPixelRatio: 0.05 });
    });

    test('V10: Component Visual Snapshot - Component baseline match', async ({ page }) => {
      await page.locator('.new-todo').fill('Component snapshot');
      await page.locator('.new-todo').press('Enter');
      await expect(page.locator('.todo-list li').first()).toHaveScreenshot('todo-item.png');
    });

  });

});