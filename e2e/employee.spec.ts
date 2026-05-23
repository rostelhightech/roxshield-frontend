import { test, expect } from "@playwright/test";
import { loginAsEmployee } from "./helpers";

test.describe("Employee Space", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsEmployee(page);
  });

  test("should display employee dashboard", async ({ page }) => {
    await expect(page).toHaveURL("/employee");
  });

  test("should have employee navigation items", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("link", { name: /formations/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test("should load badges page", async ({ page }) => {
    await page.goto("/employee/badges");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL("/employee/badges");
  });

  test("should load leaderboard page", async ({ page }) => {
    await page.goto("/employee/leaderboard");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL("/employee/leaderboard");
  });

  test("should load training page", async ({ page }) => {
    await page.goto("/employee/training");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL("/employee/training");
  });

  test("should load results page", async ({ page }) => {
    await page.goto("/employee/results");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL("/employee/results");
  });
});
