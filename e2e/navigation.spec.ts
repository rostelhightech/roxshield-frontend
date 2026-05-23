import { test, expect } from "@playwright/test";
import { loginAsAdmin, loginAsSuperAdmin } from "./helpers";

test.describe("Public Pages", () => {
  test("should show 404 for unknown routes", async ({ page }) => {
    await page.goto("/unknown-page");
    await expect(page.getByText("404")).toBeVisible();
  });

  test("about page should display company info", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText("Herdy Rostel Youlou")).toBeVisible();
    await expect(page.getByText("Dakar, Sénégal").first()).toBeVisible();
  });

  test("about page should display timeline", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText("2021")).toBeVisible();
    await expect(page.getByText("2025")).toBeVisible();
  });

  test("legal page should be accessible", async ({ page }) => {
    await page.goto("/legal");
    await expect(page).toHaveURL("/legal");
  });
});

test.describe("Authenticated Navigation", () => {
  test("admin panel should be accessible after login", async ({ page }) => {
    await loginAsSuperAdmin(page);
    await expect(page).toHaveURL("/admin");
    await expect(page.locator("header")).toBeVisible();
  });

  test("settings page should have tabs", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/dashboard/settings");
    await expect(page.getByRole("tab", { name: /organisation/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /notifications/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /sécurité/i })).toBeVisible();
  });
});
