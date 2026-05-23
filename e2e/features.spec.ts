import { test, expect } from "@playwright/test";
import { loginAsEmployee } from "./helpers";

test.describe("Badges Page", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsEmployee(page);
    await page.goto("/employee/badges");
    await page.waitForLoadState("networkidle");
  });

  test("should display badges page", async ({ page }) => {
    await expect(page).toHaveURL("/employee/badges");
    await expect(page.locator("header")).toBeVisible();
  });
});

test.describe("Back to Top", () => {
  test("should show back-to-top button after scrolling on landing", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(async () => {
      window.scrollTo(0, 1500);
      window.dispatchEvent(new Event("scroll"));
    });
    await page.waitForTimeout(1000);
    await expect(page.locator("[aria-label='Retour en haut']")).toBeVisible();
  });
});
