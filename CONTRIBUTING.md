# Contributing to TestSprite

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/testsprite.git`
3. Install dependencies: `npm install`
4. Create a branch for your changes: `git checkout -b feature/your-feature`

## Running Tests Locally

```bash
# Run all tests
npm test

# Run in debug mode
npm run test:debug

# Run in UI mode
npm run test:ui

# Run specific browser
npm run test:chromium
```

## Adding New Tests

### Test Structure
```javascript
test('test description', async ({ page }) => {
  // Setup
  await page.goto(BASE_URL);
  
  // Action
  const emailInput = page.locator('input[name="email"]');
  await emailInput.fill('test@example.com');
  
  // Assert
  await expect(emailInput).toHaveValue('test@example.com');
});
```

### Test Guidelines
- Use descriptive test names
- Test one thing per test
- Use proper waits for dynamic content
- Clean up after tests
- Follow existing patterns

## Code Style

- Use async/await syntax
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Use const over let when possible

## Commit Messages

Use clear, descriptive commit messages:
```
Add: New test for payment form validation
Fix: Selector issue in email field test
Update: Improve wait strategy for dynamic content
```

## Pull Request Process

1. Update documentation if needed
2. Run all tests and ensure they pass
3. Describe your changes clearly
4. Reference any related issues
5. Be ready to address feedback

## Test Coverage

When adding tests, ensure you cover:
- Happy path (expected behavior)
- Edge cases
- Error scenarios
- Accessibility
- Security concerns

## Questions?

Open an issue or start a discussion in the repository.

Thank you for contributing!
