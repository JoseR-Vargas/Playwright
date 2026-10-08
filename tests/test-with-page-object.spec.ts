import { test } from '@playwright/test';
import { PageManager } from '../page-object/page-manager';

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/')
})

test('Navigate go to form layouts page', async ({ page }) => {
    const pom = new PageManager(page)
    await pom.navigateTo.FormLayoutsPage()
    await pom.navigateTo.datePickerPage()
    await pom.navigateTo.toasterPage()
    await pom.navigateTo.smartTablePage()
})

test('Parametrized page object methods', async ({ page }) => {

    const pom = new PageManager(page)
    await pom.navigateTo.FormLayoutsPage()
    await pom.formsLayoutsPage.submitUsingTheGridForm('any88pereira@gmail.com', 'Password2026', 'Option 2')
    await pom.formsLayoutsPage.submitInlineForm('Anisleidys Pereira', 'any88pereira@gmail.com', true)
    await pom.navigateTo.datePickerPage()
    await pom.datePickerPage.selectCommonDatepickerDateFromToday(6)
    await pom.datePickerPage.selectDatePickerWithRangeFromToday(5, 8)
})