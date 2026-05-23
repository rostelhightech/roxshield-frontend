import { Page, expect } from "@playwright/test";

/** Login as a demo user and wait for redirect */
export async function loginAs(
  page: Page,
  role: "Super Admin" | "Admin Client" | "Employé",
  expectedUrl: string
) {
  await page.goto("/login");
  await page.getByText(role).click();
  await page.locator("button[type='submit']").click();
  // Wait for URL to change away from /login
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), {
    timeout: 30000,
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveURL(new RegExp(expectedUrl));
  // Wait for page to stabilize (React hydration + API calls)
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
}

export async function loginAsAdmin(page: Page) {
  await loginAs(page, "Admin Client", "/dashboard");
}

export async function loginAsEmployee(page: Page) {
  await loginAs(page, "Employé", "/employee");
}

export async function loginAsSuperAdmin(page: Page) {
  await loginAs(page, "Super Admin", "/admin");
}
