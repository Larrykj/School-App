import { test, expect } from '@playwright/test';

test.describe('Student Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@school.com');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/);
  });

  test('should navigate to students page', async ({ page }) => {
    await page.getByRole('link', { name: /students/i }).click();
    
    await expect(page).toHaveURL(/\/dashboard\/students/);
    await expect(page.getByRole('heading', { name: /students/i })).toBeVisible();
  });

  test('should display student list', async ({ page }) => {
    await page.goto('/dashboard/students');
    
    // Should show table or grid with students
    await expect(page.locator('table, [data-testid="student-grid"]')).toBeVisible();
  });

  test('should open add student form', async ({ page }) => {
    await page.goto('/dashboard/students');
    
    await page.getByRole('button', { name: /add.*student/i }).click();
    
    // Should show form
    await expect(page.getByLabel(/first.*name/i)).toBeVisible();
    await expect(page.getByLabel(/last.*name/i)).toBeVisible();
    await expect(page.getByLabel(/admission/i)).toBeVisible();
  });

  test('should search for students', async ({ page }) => {
    await page.goto('/dashboard/students');
    
    const searchBox = page.getByPlaceholder(/search/i);
    await searchBox.fill('John');
    
    // Should filter results
    await page.waitForTimeout(500); // Wait for debounce
    // Results should update
  });
});

