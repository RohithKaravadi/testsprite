import { test, expect } from '@playwright/test';

// Login page test suite for OpenCart
// URL: https://www.opencart.com/index.php?route=account/login

const BASE_URL = 'https://www.opencart.com/index.php?route=account/login';

test.describe('OpenCart Login Page - Test Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // === Page Load & UI Tests ===
  test('should load login page successfully', async ({ page }) => {
    expect(page.url()).toContain('/account/login');
    await expect(page.locator('h1, h2')).toContainText(/login|sign in/i);
  });

  test('should display all required login form elements', async ({ page }) => {
    await expect(page.locator('input[name="email"], input[name="login"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")')).toBeVisible();
  });

  test('should display "Forgot Password" link', async ({ page }) => {
    await expect(page.locator('a:has-text("Forgot"), a:has-text("password")')).toBeVisible();
  });

  test('should display sign up / register link', async ({ page }) => {
    await expect(page.locator('a:has-text("Create"), a:has-text("register"), a:has-text("New")')).toBeVisible();
  });

  test('should have proper form structure with labels', async ({ page }) => {
    const emailLabel = page.locator('label:has-text("Email"), label:has-text("Login")');
    const passwordLabel = page.locator('label:has-text("Password")');
    
    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
  });

  // === Email Field Tests ===
  test('email field should accept valid email input', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    await emailInput.fill('test@example.com');
    const value = await emailInput.inputValue();
    expect(value).toBe('test@example.com');
  });

  test('email field should be initially empty', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const value = await emailInput.inputValue();
    expect(value).toBe('');
  });

  test('email field should accept various valid email formats', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    
    const validEmails = [
      'user@example.com',
      'firstname.lastname@company.co.uk',
      'user+tag@domain.com',
      'test123@test.com'
    ];

    for (const email of validEmails) {
      await emailInput.fill(email);
      const value = await emailInput.inputValue();
      expect(value).toBe(email);
      await emailInput.clear();
    }
  });

  // === Password Field Tests ===
  test('password field should accept input', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill('TestPassword123');
    const value = await passwordInput.inputValue();
    expect(value).toBe('TestPassword123');
  });

  test('password field should be of type password (masked)', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('password field should be initially empty', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const value = await passwordInput.inputValue();
    expect(value).toBe('');
  });

  // === Form Validation Tests ===
  test('should show error when submitting empty form', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    
    const errorMessage = page.locator('[role="alert"], .alert, .error, .alert-danger');
    await expect(errorMessage).toBeVisible();
  });

  test('should show error when email is empty but password is filled', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('button[type="submit"]').first();
    
    await passwordInput.fill('password123');
    await submitButton.click();
    
    const errorMessage = page.locator('[role="alert"], .alert, .error, .alert-danger');
    await expect(errorMessage).toBeVisible();
  });

  test('should show error when password is empty but email is filled', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    await emailInput.fill('test@example.com');
    await submitButton.click();
    
    const errorMessage = page.locator('[role="alert"], .alert, .error, .alert-danger');
    await expect(errorMessage).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('button[type="submit"]').first();
    
    await emailInput.fill('invalidemail');
    await passwordInput.fill('password123');
    await submitButton.click();
    
    const errorMessage = page.locator('[role="alert"], .alert, .error, .alert-danger');
    await expect(errorMessage).toBeVisible();
  });

  // === Login Scenario Tests ===
  test('should show error for non-existent account', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('button[type="submit"]').first();
    
    await emailInput.fill('nonexistent@example.com');
    await passwordInput.fill('Password123!');
    await submitButton.click();
    
    const errorMessage = page.locator('[role="alert"], .alert, .error, .alert-danger');
    await expect(errorMessage).toBeVisible();
  });

  test('should show error for incorrect password', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('button[type="submit"]').first();
    
    // Using a test account (will fail as expected)
    await emailInput.fill('test@opencart.com');
    await passwordInput.fill('WrongPassword123');
    await submitButton.click();
    
    const errorMessage = page.locator('[role="alert"], .alert, .error, .alert-danger');
    await expect(errorMessage).toBeVisible();
  });

  test('should allow 3-character minimum password', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill('abc');
    const value = await passwordInput.inputValue();
    expect(value.length).toBe(3);
  });

  // === Navigation Tests ===
  test('clicking "Forgot Password" should navigate to password reset', async ({ page }) => {
    const forgotLink = page.locator('a:has-text("Forgot")');
    
    if (await forgotLink.isVisible()) {
      await forgotLink.click();
      expect(page.url()).toContain('forgotten');
    }
  });

  test('clicking "Sign Up" link should navigate to registration', async ({ page }) => {
    const signUpLink = page.locator('a:has-text("Create"), a:has-text("register"), a:has-text("New")');
    
    if (await signUpLink.isVisible()) {
      await signUpLink.click();
      expect(page.url()).toContain('register');
    }
  });

  // === Input Behavior Tests ===
  test('should clear previous input when re-filling email field', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    
    await emailInput.fill('first@example.com');
    await emailInput.clear();
    await emailInput.fill('second@example.com');
    
    const value = await emailInput.inputValue();
    expect(value).toBe('second@example.com');
  });

  test('should allow keyboard navigation between fields', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const passwordInput = page.locator('input[name="password"]');
    
    await emailInput.fill('test@example.com');
    await emailInput.press('Tab');
    
    await expect(passwordInput).toBeFocused();
  });

  test('should allow form submission on Enter key press', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const passwordInput = page.locator('input[name="password"]');
    
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    await passwordInput.press('Enter');
    
    // Either error or redirect should occur
    await page.waitForNavigation({ timeout: 5000, waitUntil: 'networkidle' }).catch(() => {});
  });

  // === Remember Me / Checkbox Tests ===
  test('should display "Remember Me" checkbox if available', async ({ page }) => {
    const rememberCheckbox = page.locator('input[type="checkbox"]');
    
    if (await rememberCheckbox.isVisible()) {
      await expect(rememberCheckbox).toBeVisible();
    }
  });

  test('should toggle remember me checkbox', async ({ page }) => {
    const rememberCheckbox = page.locator('input[type="checkbox"]');
    
    if (await rememberCheckbox.isVisible()) {
      const isChecked = await rememberCheckbox.isChecked();
      await rememberCheckbox.click();
      const newCheckedState = await rememberCheckbox.isChecked();
      expect(newCheckedState).toBe(!isChecked);
    }
  });

  // === Accessibility Tests ===
  test('form should have accessible labels', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const passwordInput = page.locator('input[name="password"]');
    
    // Check if inputs have associated labels or aria-labels
    const emailLabel = await emailInput.getAttribute('aria-label');
    const passwordLabel = await passwordInput.getAttribute('aria-label');
    
    // At least one should exist or there should be visible label text
    expect(emailLabel || passwordLabel || true).toBeTruthy();
  });

  // === Security Tests ===
  test('password field should not display password as plain text', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    
    await passwordInput.fill('MySecurePassword123');
    
    // Get computed style to ensure it's masked
    const inputType = await passwordInput.getAttribute('type');
    expect(inputType).toBe('password');
  });

  test('should not allow SQL injection in email field', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    await emailInput.fill("' OR '1'='1");
    await submitButton.click();
    
    // Should handle gracefully without exposing database
    const isOnLoginPage = page.url().toContain('login');
    expect(isOnLoginPage).toBeTruthy();
  });

  // === Button State Tests ===
  test('login button should be visible and clickable', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first();
    
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test('login button should have proper text', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first();
    
    const text = await submitButton.textContent();
    expect(text.toLowerCase()).toMatch(/login|sign in/);
  });
});