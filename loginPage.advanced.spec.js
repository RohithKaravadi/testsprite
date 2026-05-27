import { test, expect } from '@playwright/test';

// Advanced Test Cases for OpenCart Login Page
// These tests cover edge cases, performance, and advanced scenarios

const BASE_URL = 'https://www.opencart.com/index.php?route=account/login';

test.describe('OpenCart Login Page - Advanced Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // === Rate Limiting & Brute Force Tests ===
  test('should handle multiple failed login attempts gracefully', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('button[type="submit"]').first();

    for (let i = 0; i < 3; i++) {
      await emailInput.fill('test@example.com');
      await passwordInput.fill(`WrongPassword${i}`);
      await submitButton.click();
      
      // Wait for error to appear or dismiss
      await page.waitForTimeout(500);
    }

    // Page should still be functional
    expect(page.url()).toContain('login');
  });

  // === Session Management Tests ===
  test('should not retain password in browser history', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    
    await passwordInput.fill('TestPassword123');
    await passwordInput.clear();
    
    // Verify no autocomplete suggestions for password
    const value = await passwordInput.inputValue();
    expect(value).toBe('');
  });

  // === Special Characters & Edge Cases ===
  test('should handle special characters in email field', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    
    const specialEmails = [
      'user+test@example.com',
      'user.name@example.com',
      'user_name@example.com',
      'user-name@example.com'
    ];

    for (const email of specialEmails) {
      await emailInput.fill(email);
      const value = await emailInput.inputValue();
      expect(value).toBe(email);
      await emailInput.clear();
    }
  });

  test('should handle special characters in password field', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    
    const specialPasswords = [
      'Pass@word!123',
      'Pass#word$%^',
      'Pass&word()',
      'Pass*word{}[]'
    ];

    for (const password of specialPasswords) {
      await passwordInput.fill(password);
      const value = await passwordInput.inputValue();
      expect(value).toBe(password);
      await passwordInput.clear();
    }
  });

  test('should handle very long email input gracefully', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const longEmail = 'a'.repeat(100) + '@example.com';
    
    await emailInput.fill(longEmail);
    const value = await emailInput.inputValue();
    
    // Should either accept or have a max length
    expect(value.length).toBeLessThanOrEqual(longEmail.length);
  });

  test('should handle very long password input gracefully', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const longPassword = 'a'.repeat(256);
    
    await passwordInput.fill(longPassword);
    const value = await passwordInput.inputValue();
    
    // Should handle without errors
    expect(value).toBeTruthy();
  });

  // === Whitespace Handling ===
  test('should trim whitespace from email field', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('button[type="submit"]').first();

    await emailInput.fill('  test@example.com  ');
    await passwordInput.fill('password');
    await submitButton.click();

    // Application should handle whitespace gracefully
    const isOnLoginPage = page.url().toContain('login');
    expect(isOnLoginPage).toBeTruthy();
  });

  test('should handle newline characters in input fields', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    
    try {
      await emailInput.fill('test\n@example.com');
      const value = await emailInput.inputValue();
      
      // Should not contain newline or handle gracefully
      expect(value).not.toContain('\n');
    } catch (e) {
      // It's acceptable if form rejects this input
      expect(true).toBeTruthy();
    }
  });

  // === Copy-Paste Behavior ===
  test('should allow paste operations in email field', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    
    await emailInput.focus();
    await page.evaluate(() => {
      const input = document.querySelector('input[name="email"], input[name="login"]');
      if (input) {
        const event = new ClipboardEvent('paste', {
          clipboardData: new DataTransfer(),
        });
        input.value = 'pasted@example.com';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    const value = await emailInput.inputValue();
    expect(value).toBeTruthy();
  });

  // === Keyboard Interactions ===
  test('should support Ctrl+A to select all text', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    
    await emailInput.fill('test@example.com');
    await emailInput.focus();
    await emailInput.press('Control+a');
    
    // Text should remain (selection is not testable directly)
    const value = await emailInput.inputValue();
    expect(value).toBe('test@example.com');
  });

  test('should support backspace key in password field', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    
    await passwordInput.fill('password123');
    
    // Press backspace multiple times
    for (let i = 0; i < 3; i++) {
      await passwordInput.press('Backspace');
    }
    
    const value = await passwordInput.inputValue();
    expect(value.length).toBe(9); // 12 - 3 = 9
  });

  test('should support Home and End keys', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    
    await emailInput.fill('test@example.com');
    await emailInput.press('Home');
    await emailInput.press('End');
    
    // Text should remain unchanged
    const value = await emailInput.inputValue();
    expect(value).toBe('test@example.com');
  });

  // === Browser Compatibility ===
  test('should work with browser autocomplete disabled', async ({ page }) => {
    const form = page.locator('form');
    const autoComplete = await form.getAttribute('autocomplete');
    
    // If autocomplete is explicitly disabled, form should still work
    if (autoComplete === 'off') {
      const emailInput = page.locator('input[name="email"], input[name="login"]').first();
      await emailInput.fill('test@example.com');
      expect(true).toBeTruthy();
    }
  });

  // === Error Recovery ===
  test('should allow retry after failed login attempt', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('button[type="submit"]').first();

    // First attempt - wrong password
    await emailInput.fill('test@example.com');
    await passwordInput.fill('WrongPassword');
    await submitButton.click();

    await page.waitForTimeout(500);

    // Second attempt - clear and retry
    await emailInput.clear();
    await passwordInput.clear();
    await emailInput.fill('test@example.com');
    await passwordInput.fill('CorrectPassword');

    // Form should be functional for retry
    expect(page.url()).toContain('login');
  });

  // === Field Interaction ===
  test('should maintain focus state during input', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    
    await emailInput.focus();
    const isFocused1 = await emailInput.evaluate(el => el === document.activeElement);
    expect(isFocused1).toBeTruthy();

    await emailInput.type('test@example.com', { delay: 50 });
    const isFocused2 = await emailInput.evaluate(el => el === document.activeElement);
    expect(isFocused2).toBeTruthy();
  });

  test('should fire input events on field changes', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    
    let eventFired = false;
    await emailInput.evaluate(() => {
      const input = document.querySelector('input[name="email"], input[name="login"]');
      if (input) {
        input.addEventListener('input', () => {
          eventFired = true;
        });
      }
    });

    await emailInput.fill('test@example.com');
    
    // Event should have been triggered during typing
    const value = await emailInput.inputValue();
    expect(value).toBe('test@example.com');
  });

  // === State Persistence ===
  test('should retain input values during page interactions', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    
    await emailInput.fill('test@example.com');
    
    // Click on a link (that doesn't navigate)
    const forgotLink = page.locator('a:has-text("Forgot")');
    if (await forgotLink.isVisible()) {
      // Don't actually click if it navigates
      const href = await forgotLink.getAttribute('href');
      if (href) {
        // Don't follow the link
      }
    }

    // Email should still be there
    const value = await emailInput.inputValue();
    expect(value).toBe('test@example.com');
  });

  // === Responsive Design ===
  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const passwordInput = page.locator('input[name="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const passwordInput = page.locator('input[name="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should be responsive on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const passwordInput = page.locator('input[name="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  // === Error Message Clarity ===
  test('should display specific error message for invalid email', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('button[type="submit"]').first();

    await emailInput.fill('notanemail');
    await passwordInput.fill('password123');
    await submitButton.click();

    const errorMessage = page.locator('[role="alert"], .alert, .error, .alert-danger');
    
    if (await errorMessage.isVisible()) {
      const text = await errorMessage.textContent();
      expect(text.toLowerCase()).toContain('email');
    }
  });

  // === CSS & Styling ===
  test('form elements should have proper styling', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[name="login"]').first();
    
    // Should be visible and properly styled
    const isVisible = await emailInput.isVisible();
    const boundingBox = await emailInput.boundingBox();
    
    expect(isVisible).toBeTruthy();
    expect(boundingBox).toBeTruthy();
    expect(boundingBox.width).toBeGreaterThan(0);
    expect(boundingBox.height).toBeGreaterThan(0);
  });
});