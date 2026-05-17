import { test, expect } from "@playwright/test";

test.describe("Command Palette", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.evaluate(() => {
      sessionStorage.setItem("cybersense_onboarding_admin-client", "done");
    });
    await page.reload();
  });

  test("should open command palette with keyboard shortcut", async ({ page }) => {
    // Use Ctrl+k which works in Playwright (Meta+k is intercepted by browser)
    await page.keyboard.press("Control+k");
    await expect(page.getByPlaceholder(/Rechercher|Search/i)).toBeVisible();
  });

  test("should show navigation items in command palette", async ({ page }) => {
    await page.keyboard.press("Meta+k");
    await expect(page.getByText("Dashboard").first()).toBeVisible();
  });

  test("should close command palette with Escape", async ({ page }) => {
    await page.keyboard.press("Control+k");
    await expect(page.getByPlaceholder(/Rechercher|Search/i)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByPlaceholder(/Rechercher|Search/i)).not.toBeVisible();
  });
});

test.describe("Activity Feed", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.evaluate(() => {
      sessionStorage.setItem("cybersense_onboarding_admin-client", "done");
    });
    await page.reload();
  });

  test("should display activity feed on dashboard", async ({ page }) => {
    await expect(page.getByText(/Activité récente/i)).toBeVisible();
  });

  test("should show recent activity items", async ({ page }) => {
    await expect(page.getByText("Fatou Sow").first()).toBeVisible();
    await expect(page.getByText(/signalé un email suspect/i)).toBeVisible();
  });
});

test.describe("Badges Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/employee/badges");
    await page.evaluate(() => {
      sessionStorage.setItem("cybersense_onboarding_employee", "done");
    });
    await page.reload();
  });

  test("should display earned badges", async ({ page }) => {
    await expect(page.getByText("Premiers pas")).toBeVisible();
    await expect(page.getByText("Œil de lynx")).toBeVisible();
  });

  test("should display badge progress section", async ({ page }) => {
    await expect(page.getByText(/En cours de progression/i)).toBeVisible();
    await expect(page.getByText("Expert MDP")).toBeVisible();
  });

  test("should show badge completion stats", async ({ page }) => {
    await expect(page.getByText(/4 \/ 8 badges obtenus/i)).toBeVisible();
  });
});

test.describe("Back to Top", () => {
  test("should show back-to-top button after scrolling on landing", async ({ page }) => {
    await page.goto("/");
    // Dispatch multiple scroll events to trigger the component
    await page.evaluate(async () => {
      window.scrollTo(0, 1500);
      // Manually dispatch scroll event in case scrollTo doesn't trigger it in test
      window.dispatchEvent(new Event("scroll"));
    });
    // Wait for animation
    await page.waitForTimeout(1000);
    await expect(page.locator("[aria-label='Retour en haut']")).toBeVisible();
  });
});
