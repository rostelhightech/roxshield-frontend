import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

test.describe("Dashboard (Admin Client)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("should display dashboard page after login", async ({ page }) => {
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator("header")).toBeVisible();
  });

  test("should display KPI cards", async ({ page }) => {
    await page.waitForTimeout(2000);
    await expect(page.locator("[class*='card']").first()).toBeVisible();
  });

  test("should have sidebar navigation", async ({ page }) => {
    await expect(page.getByRole("link", { name: /employés/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /formations/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /simulations/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /rapports/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /paramètres/i }).first()).toBeVisible();
  });

  test("should navigate to employees page", async ({ page }) => {
    await page.getByRole("link", { name: /employés/i }).first().click();
    await expect(page).toHaveURL("/dashboard/employees", { timeout: 10000 });
  });

  test("should navigate to reports page", async ({ page }) => {
    await page.getByRole("link", { name: /rapports/i }).first().click();
    await expect(page).toHaveURL("/dashboard/reports", { timeout: 10000 });
  });

  test("should navigate to settings page", async ({ page }) => {
    await page.getByRole("link", { name: /paramètres/i }).first().click();
    await expect(page).toHaveURL("/dashboard/settings", { timeout: 10000 });
  });

  test("should navigate to training page", async ({ page }) => {
    await page.getByRole("link", { name: /formations/i }).first().click();
    await expect(page).toHaveURL("/dashboard/training", { timeout: 10000 });
  });
});
