import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("should display login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("input#email")).toBeVisible();
    await expect(page.locator("input#password")).toBeVisible();
  });

  test("should have demo role selection cards", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Super Admin")).toBeVisible();
    await expect(page.getByText("Admin Client")).toBeVisible();
    await expect(page.getByText("Employé")).toBeVisible();
  });

  test("should pre-fill credentials when clicking a demo role", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("Admin Client").click();
    await expect(page.locator("input#email")).toHaveValue("f.sow@safisenegal.com");
  });

  test("should login as Admin Client and redirect to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("Admin Client").click();
    await page.locator("button[type='submit']").click();
    await page.waitForURL("/dashboard", { timeout: 15000 });
    await expect(page).toHaveURL("/dashboard");
  });

  test("should login as Employee and redirect to employee space", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("Employé").click();
    await page.locator("button[type='submit']").click();
    await page.waitForURL("/employee", { timeout: 15000 });
    await expect(page).toHaveURL("/employee");
  });

  test("should login as Super Admin and redirect to admin panel", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("Super Admin").click();
    await page.locator("button[type='submit']").click();
    await page.waitForURL("/admin", { timeout: 15000 });
    await expect(page).toHaveURL("/admin");
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.locator("input#email").fill("invalid@test.com");
    await page.locator("input#password").fill("wrongpassword");
    await page.locator("button[type='submit']").click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/login/);
  });

  test("should redirect unauthenticated users to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
