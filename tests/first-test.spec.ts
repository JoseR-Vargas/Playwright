import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator Syntax Rules', async ({ page }) => {
    // Find By tag
    page.locator('input')
    //Find By ID
    page.locator('#inputEmail')
    //Find By Class Value
    page.locator('.shape-rectangle')
    //Find By Any Attribute
    page.locator('[placeholder="Email"]')
    //Find By full Class Value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')
    //Find By several selectors
    page.locator('input[placeholder="Email"][nbinput]')
    //Find By XPath (XPath is not recommended by playwright)
    page.locator('//*[@id="inputEmail"]')
    //Find By partial text match
    page.locator(':text("Using")')
    //Find By exact text match
    page.locator(':text-is("Using the Grid")')
})

test('Locating child elements', async ({ page }) => {
    await page.locator('nb-card').locator('nb-radio-group').locator(':text-is("Option 1")').click()
    await page.locator('nb-card nb-radio-group :text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locating Parents elements', async ({ page }) => {
    await page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('button').click()
    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('button').click()

    await page.locator('nb-card').filter({ hasText: 'Using the Grid' }).getByRole('button').click()

    await page.locator('nb-card')
        .filter({ has: page.locator('nb-checkbox') })
        .filter({ hasText: 'Sign in' })
        .getByLabel('Email')
        .fill('test@test.com')

    await page.getByText('Using the Grid').locator('..').getByRole('button').click() // doble check
})

test('Reusing Locators', async ({ page }) => {
    const basicFormSection = page.locator('nb-card', { hasText: 'Basic form' })
    const emailInputField = basicFormSection.getByLabel('Email')

    await emailInputField.fill('test@test.com')
    await basicFormSection.getByLabel('Password').fill('playwright')
    await basicFormSection.locator('nb-checkbox').click()
    await basicFormSection.getByRole('button').click()

    await expect(emailInputField).toHaveValue('test@test.com')
})

test('Extracting values', async ({ page }) => {
    //extracting text
    const basicFormSection = page.locator('nb-card', { hasText: 'Basic form' })
    const submitButtonText = await basicFormSection.getByRole('button').textContent()
    expect(submitButtonText).toEqual('Submit')

    //extract multiple text values
    const allRadioButtonValues = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonValues).toContain('Option 1')

    //extract input field values
    const emailField = basicFormSection.getByRole('textbox', { name: 'Email' })
    await emailField.fill('test@test.com')
    const emailFieldValue = await emailField.inputValue()
    console.log(emailFieldValue)

    //extract attribute value
    const emailPlaceholder = await emailField.getAttribute('placeholder')
    console.log(emailPlaceholder)
})

test('Assertions', async ({ page }) => {
    const basicFormSetionButton = page.locator('nb-card', { hasText: 'Basic form' }).getByRole('button')
    //Generic Assertions
    const value = 7
    expect(value).toEqual(7)

    const submitButtonText = await basicFormSetionButton.textContent()
    expect(submitButtonText).toEqual('Submit')

    //Locator assertion
    await expect(basicFormSetionButton).toHaveText('Submit')

    //Soft assertion
    await expect.soft(basicFormSetionButton).toHaveText('Submit')
})

