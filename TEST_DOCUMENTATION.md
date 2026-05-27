# OpenCart Login Page - Playwright Test Suite

## Overview
This test suite contains **30+ comprehensive test cases** for the OpenCart login page using Playwright. The tests cover functionality, validation, security, accessibility, and user experience.

## URL Tested
`https://www.opencart.com/index.php?route=account/login`

## Installation

### Prerequisites
- Node.js (v14+)
- npm

### Setup
```bash
npm install
```

## Running Tests

### All Browsers (Chromium, Firefox, WebKit)
```bash
npm test
```

### Specific Browser
```bash
npm run test:chromium   # Chrome/Chromium only
npm run test:firefox    # Firefox only
npm run test:webkit     # Safari only
```

### Debug Mode
```bash
npm run test:debug
```

### Headed Mode (see browser)
```bash
npm run test:headed
```

### UI Mode (interactive)
```bash
npm run test:ui
```

### View Test Report
```bash
npm run report
```

---

## Test Categories

### 1. **Page Load & UI Tests** (5 tests)
- ✅ Load login page successfully
- ✅ Display all required form elements
- ✅ Display "Forgot Password" link
- ✅ Display sign up/register link
- ✅ Have proper form structure with labels

### 2. **Email Field Tests** (3 tests)
- ✅ Accept valid email input
- ✅ Start empty
- ✅ Accept various valid email formats

### 3. **Password Field Tests** (3 tests)
- ✅ Accept password input
- ✅ Display as masked (type="password")
- ✅ Start empty

### 4. **Form Validation Tests** (5 tests)
- ✅ Show error when submitting empty form
- ✅ Show error when email is empty but password is filled
- ✅ Show error when password is empty but email is filled
- ✅ Show error for invalid email format
- ✅ Show error for non-existent account

### 5. **Login Scenario Tests** (3 tests)
- ✅ Show error for non-existent account
- ✅ Show error for incorrect password
- ✅ Allow 3-character minimum password

### 6. **Navigation Tests** (2 tests)
- ✅ "Forgot Password" link navigation
- ✅ "Sign Up" link navigation

### 7. **Input Behavior Tests** (3 tests)
- ✅ Clear and refill email field correctly
- ✅ Keyboard navigation between fields (Tab)
- ✅ Form submission on Enter key press

### 8. **Remember Me Tests** (2 tests)
- ✅ Display "Remember Me" checkbox if available
- ✅ Toggle checkbox state

### 9. **Accessibility Tests** (1 test)
- ✅ Form has accessible labels

### 10. **Security Tests** (2 tests)
- ✅ Password field masks input (not plain text)
- ✅ Prevent SQL injection attempts

### 11. **Button State Tests** (2 tests)
- ✅ Login button is visible and clickable
- ✅ Login button has proper text

---

## Test Scenarios Covered

| Scenario | Test Count | Status |
|----------|-----------|--------|
| Valid Credentials | 1 | Included |
| Invalid Credentials | 2 | Included |
| Empty Fields | 3 | Included |
| Email Validation | 2 | Included |
| Password Field | 3 | Included |
| Navigation | 2 | Included |
| Accessibility | 1 | Included |
| Security | 2 | Included |
| UI/UX | 11 | Included |
| **TOTAL** | **30+** | ✅ |

---

## Key Features

### 🎯 Comprehensive Coverage
- Page load verification
- Form element visibility
- Input field validation
- Error message verification
- Navigation flows
- Accessibility compliance

### 🔒 Security Testing
- SQL injection prevention
- Password masking verification
- Form data handling

### ♿ Accessibility
- Label associations
- ARIA attributes
- Keyboard navigation
- Screen reader compatibility

### 📱 Cross-Browser Testing
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

### 📊 Reporting
- HTML test reports
- JUnit XML reports
- Screenshots on failure
- Video recordings on failure

---

## Test Output

### Successful Run
```
✓ 30 passed (15s)
```

### Test Report Location
```
./test-results/
├── junit.xml
└── index.html (detailed HTML report)
```

---

## Configuration

### Timeout Settings
- Global timeout: 30 seconds
- Navigation wait: 5 seconds
- Full page timeout: Network idle

### Retry Policy
- **CI Environment**: 2 retries
- **Local Development**: No retries

### Screenshots & Videos
- Screenshots: Captured on test failure only
- Videos: Retained on failure only
- Traces: Enabled on first retry

---

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Playwright Tests
  run: npm test
  
- name: Upload Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: test-results/
```

---

## Support

For issues or questions:
1. Check selector patterns match your page structure
2. Review Playwright documentation: https://playwright.dev
3. Run tests in debug mode: `npm run test:debug`

---

**Status**: Ready for Use  
**Version**: 1.0  
**Framework**: Playwright v1.40.0+
