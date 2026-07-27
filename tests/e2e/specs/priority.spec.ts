import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'

const USER = { email: 'priority_test@capstone.dev', password: 'Test1234!' }

async function ensureUser(page: import('@playwright/test').Page) {
  // Register (no-op if already exists)
  await page.request.post('http://localhost:4000/api/auth/register', {
    data: { email: USER.email, password: USER.password },
  })
}

/** Extract item id from the item-title-{id} data-testid attribute */
async function getItemId(
  page: import('@playwright/test').Page,
  title: string,
): Promise<string> {
  const titleEl = page
    .locator('[data-testid^="item-title-"]')
    .filter({ hasText: title })
    .first()
  await titleEl.waitFor({ state: 'visible' })
  const testId = await titleEl.getAttribute('data-testid')
  const id = testId?.replace('item-title-', '')
  if (!id) throw new Error('Could not find item id for title: ' + title)
  return id
}

// ---------------------------------------------------------------------------
// Happy path
// ---------------------------------------------------------------------------
test.describe('Item Priority - Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await ensureUser(page)
    const login = new LoginPage(page)
    await login.goto()
    await login.login(USER.email, USER.password)
    await page.waitForURL('**/dashboard')
  })

  test('create item with high priority shows high badge', async ({ page }) => {
    const title = 'High Priority Item ' + Date.now()

    await page.getByTestId('item-title-input').fill(title)
    await page.getByTestId('item-priority-select').selectOption('high')
    await page.getByTestId('add-item-button').click()

    await expect(page.getByText(title)).toBeVisible()

    const id = await getItemId(page, title)
    const badge = page.locator(`[data-testid="item-priority-${id}"]`)
    await expect(badge).toBeVisible()
    await expect(badge).toHaveText('high')
  })

  test('change item priority inline from medium to low updates the badge', async ({ page }) => {
    const title = 'Inline Priority Change ' + Date.now()

    // Create with default priority (medium)
    await page.getByTestId('item-title-input').fill(title)
    await page.getByTestId('add-item-button').click()
    await expect(page.getByText(title)).toBeVisible()

    const id = await getItemId(page, title)
    const badge = page.locator(`[data-testid="item-priority-${id}"]`)
    await expect(badge).toHaveText('medium')

    // Change via inline select on the card
    const inlineSelect = page.locator(`[data-testid="item-priority-select-${id}"]`)
    await inlineSelect.selectOption('low')

    // Badge should update reactively
    await expect(badge).toHaveText('low')
  })

  test('filter by priority=high updates URL with priority=high', async ({ page }) => {
    const filter = page.getByTestId('priority-filter')
    await expect(filter).toBeVisible()
    await filter.selectOption('high')
    await expect(page).toHaveURL(/priority=high/)
  })

  test('sort by priority updates URL with sort=priority', async ({ page }) => {
    const sortSelect = page.getByTestId('sort-select')
    await expect(sortSelect).toBeVisible()
    await sortSelect.selectOption('priority')
    await expect(page).toHaveURL(/sort=priority/)
  })

  test('sort by priority shows high-priority items before low-priority items', async ({ page }) => {
    const ts = Date.now()
    const highTitle = 'Sort High ' + ts
    const lowTitle  = 'Sort Low '  + ts

    // Create high-priority item
    await page.getByTestId('item-title-input').fill(highTitle)
    await page.getByTestId('item-priority-select').selectOption('high')
    await page.getByTestId('add-item-button').click()
    await expect(page.getByText(highTitle)).toBeVisible()

    // Create low-priority item
    await page.getByTestId('item-title-input').fill(lowTitle)
    await page.getByTestId('item-priority-select').selectOption('low')
    await page.getByTestId('add-item-button').click()
    await expect(page.getByText(lowTitle)).toBeVisible()

    // Sort by priority (high -> low)
    await page.getByTestId('sort-select').selectOption('priority')
    await expect(page).toHaveURL(/sort=priority/)
    await page.waitForLoadState('networkidle')

    const highEl = page
      .locator('[data-testid^="item-title-"]')
      .filter({ hasText: highTitle })
      .first()
    const lowEl = page
      .locator('[data-testid^="item-title-"]')
      .filter({ hasText: lowTitle })
      .first()

    await expect(highEl).toBeVisible()
    await expect(lowEl).toBeVisible()

    // High-priority item must appear above low-priority item in the DOM
    const highBox = await highEl.boundingBox()
    const lowBox  = await lowEl.boundingBox()
    expect(highBox).not.toBeNull()
    expect(lowBox).not.toBeNull()
    expect(highBox!.y).toBeLessThan(lowBox!.y)
  })

  test('priority badge is visible on each created item card', async ({ page }) => {
    const ts = Date.now()
    const items = [
      { title: 'Badge High '   + ts, priority: 'high'   },
      { title: 'Badge Medium ' + ts, priority: 'medium' },
      { title: 'Badge Low '    + ts, priority: 'low'    },
    ]

    for (const item of items) {
      await page.getByTestId('item-title-input').fill(item.title)
      await page.getByTestId('item-priority-select').selectOption(item.priority)
      await page.getByTestId('add-item-button').click()
      await expect(page.getByText(item.title)).toBeVisible()
    }

    for (const item of items) {
      const id = await getItemId(page, item.title)
      const badge = page.locator(`[data-testid="item-priority-${id}"]`)
      await expect(badge).toBeVisible()
      await expect(badge).toHaveText(item.priority)
    }
  })
})

// ---------------------------------------------------------------------------
// Error / edge scenarios
// ---------------------------------------------------------------------------
test.describe('Item Priority - Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await ensureUser(page)
    const login = new LoginPage(page)
    await login.goto()
    await login.login(USER.email, USER.password)
    await page.waitForURL('**/dashboard')
  })

  test('submitting form with empty title does not create an item', async ({ page }) => {
    const addBtn = page.getByTestId('add-item-button')

    // Ensure title input is empty
    await page.getByTestId('item-title-input').clear()

    // Button is disabled when title is empty (ItemForm: disabled={loading || !title.trim()})
    await expect(addBtn).toBeDisabled()

    // Snapshot card count before attempted submit
    const cardsBefore = await page.locator('[data-testid^="item-card-"]').count()

    // Pressing Enter on an empty title is a no-op (form guard: if (!title.trim()) return)
    await page.getByTestId('item-title-input').press('Enter')

    // No new card should appear
    const cardsAfter = await page.locator('[data-testid^="item-card-"]').count()
    expect(cardsAfter).toBe(cardsBefore)
  })

  test('default priority for a new item is medium when no priority is explicitly selected', async ({ page }) => {
    const title = 'Default Priority ' + Date.now()

    await page.getByTestId('item-title-input').fill(title)
    // Do NOT touch the priority select - it defaults to 'medium' (ItemForm useState)
    await page.getByTestId('add-item-button').click()

    await expect(page.getByText(title)).toBeVisible()

    const id = await getItemId(page, title)
    const badge = page.locator(`[data-testid="item-priority-${id}"]`)
    await expect(badge).toHaveText('medium')
  })
})
