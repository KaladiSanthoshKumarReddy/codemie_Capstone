import { test, expect } from '@playwright/test'
import { RegisterPage } from '../pages/RegisterPage'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const uniqueEmail = () => `register_e2e_${Date.now()}@capstone.dev`

// ---------------------------------------------------------------------------
// UI — static checks
// ---------------------------------------------------------------------------
test.describe('Register Page — UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('renders Create Account heading', async ({ page }) => {
    const rp = new RegisterPage(page)
    await expect(rp.heading).toBeVisible()
  })

  test('shows email input, password input, and register button', async ({ page }) => {
    const rp = new RegisterPage(page)
    await expect(rp.emailInput).toBeVisible()
    await expect(rp.passwordInput).toBeVisible()
    await expect(rp.registerButton).toBeVisible()
  })

  test('email input has type=email', async ({ page }) => {
    await expect(page.getByTestId('register-email-input')).toHaveAttribute('type', 'email')
  })

  test('password input has type=password', async ({ page }) => {
    await expect(page.getByTestId('register-password-input')).toHaveAttribute('type', 'password')
  })

  test('register button label is "Register" initially', async ({ page }) => {
    await expect(page.getByTestId('register-button')).toHaveText('Register')
  })

  test('no error message visible on initial load', async ({ page }) => {
    await expect(page.getByTestId('register-error')).not.toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// Validation — client-side constraints
// ---------------------------------------------------------------------------
test.describe('Register — Validation', () => {
  test('shows error when password is less than 6 characters', async ({ page }) => {
    const rp = new RegisterPage(page)
    await rp.goto()
    // Fill a valid email but short password
    await rp.register('shortpw@capstone.dev', 'abc')
    await expect(rp.errorMessage).toBeVisible()
    await expect(rp.errorMessage).toHaveText('Password must be at least 6 characters')
  })

  test('password validation fires without a network request', async ({ page }) => {
    const rp = new RegisterPage(page)
    await rp.goto()
    let requestMade = false
    page.on('request', req => {
      if (req.url().includes('/api/auth/register')) requestMade = true
    })
    await rp.register('shortpw2@capstone.dev', 'ab')
    expect(requestMade).toBe(false)
    await expect(rp.errorMessage).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// Registration flow — success and duplicate-email
// ---------------------------------------------------------------------------
test.describe('Register — Flow', () => {
  test('successful registration redirects to /login', async ({ page }) => {
    const rp = new RegisterPage(page)
    await rp.goto()
    const email = uniqueEmail()
    await rp.register(email, 'Test1234!')
    await expect(page).toHaveURL('/login')
  })

  test('register button shows "Creating account…" while submitting', async ({ page }) => {
    const rp = new RegisterPage(page)
    await rp.goto()
    const email = uniqueEmail()

    // Hold the API response so we can observe the loading state
    await page.route('**/api/auth/register', route =>
      new Promise<void>(resolve => setTimeout(() => resolve(route.continue() as unknown as void), 600)),
    )
    await rp.emailInput.fill(email)
    await rp.passwordInput.fill('Test1234!')
    void rp.registerButton.click()
    await expect(rp.registerButton).toBeDisabled()
    await expect(rp.registerButton).toHaveText('Creating account…')
    await page.unrouteAll()
  })

  test('duplicate email shows "Email already registered" error', async ({ page }) => {
    const rp = new RegisterPage(page)
    const email = uniqueEmail()

    // First registration — should succeed and redirect to /login
    await rp.goto()
    await rp.register(email, 'Test1234!')
    await page.waitForURL('/login')

    // Second registration with the same email — should show 409 error
    await rp.goto()
    await rp.register(email, 'Test1234!')
    await expect(rp.errorMessage).toBeVisible()
    await expect(rp.errorMessage).toHaveText('Email already registered')
  })
})
