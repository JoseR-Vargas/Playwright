import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/')
})

test.describe('Form Layouts page', () => {

    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('Input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" })
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 500 })

        //Extract the value 
        const inputValue = await usingTheGridEmailInput.inputValue()

        //assertions
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
        await expect(usingTheGridEmailInput).toHaveValue(/test.com/)

    })

    test('radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: "Using the Grid" })

        await usingTheGridForm.getByLabel('Option 1').check({ force: true })
        await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true })

        const radioStatus = await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).isChecked()
        expect(radioStatus).toBeTruthy()

        await expect(usingTheGridForm.getByRole('radio', { name: 'Option 2' })).toBeChecked()
        await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1' })).not.toBeChecked()
    })

    test('checkboxes', async ({ page }) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()

        // await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).click({force: true})
        // await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true})

        await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true })

        const allBoxes = page.getByRole('checkbox')
        for (const box of await allBoxes.all()) {
            await box.check({ force: true })
            await expect(box).toBeChecked()
        }
    })

    test('List and dropdowns', async ({ page }) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()

        //standar dropdowns

        // await page.getByRole('combobox').selectOption('warning')
        await page.locator('.form-group', { hasText: 'Toast type:' }).getByRole('combobox').selectOption('warning')
        await expect(page.getByRole('combobox')).toHaveValue('warning')

        //custom dropdowns
        await page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select').click()
        //option 1 select the list
        // await page.getByRole('list').getByText('bottom-end').click()
        //option 2
        await page.locator('nb-option', { hasText: 'bottom-end' }).click()
        await expect(page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select')).toHaveText('bottom-end')

        //looping trought the list
        const positionDropDownField = page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select')
        await positionDropDownField.click()
        const allListValues = await page.locator('nb-option').allTextContents()
        for (const ListValue of allListValues) {
            await page.locator('nb-option', { hasText: ListValue }).click()
            await expect(positionDropDownField).toHaveText(ListValue)
            await positionDropDownField.click()
        }
    })

    test('tooltips', async ({ page }) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Tooltip').click()

        await page.getByRole('button', { name: 'Top' }).hover()
        await expect(page.getByRole('tooltip')).toHaveText('This is a tooltip')
    })

    test('dialaog box', async ({ page }) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Are you sure you want to delete?')
            dialog.accept()
        })

        await page.locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click()
        await expect(page.locator('tr', { hasText: 'mdo@gmail.com' })).not.toBeVisible()
    })

    // Hacer review de la 38
    test('web tables', async ({ page }) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        // 1 How to select a row by any visible text
        const tableRowByEmail = page.getByRole('row', { name: 'twitter@outlook.com' })
        await tableRowByEmail.locator('.nb-edit').click()
        await tableRowByEmail.getByPlaceholder('Age').fill('34')
        await tableRowByEmail.locator('.nb-checkmark').click()
        await expect(tableRowByEmail.locator('td').last()).toHaveText('34')
    })
    
    test('datepicker', async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Datepicker').click()

        const calendarInputField = page.getByPlaceholder('Form Picker')
        await calendarInputField.click()

        const date = new Date()
        date.setDate(date.getDate() + 50)
        const expectedDay = date.getDate().toString()
        const expectedMonth = date.toLocaleString('En-US', { month: 'short' })
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
        const expectedYear = date.getFullYear()
        const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`

        let currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
        while (!currentMonthAndYear?.includes(expectedMonthAndYear)) {
            await page.locator('.next-month').click()
            currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        }

        await page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, { exact: true }).click()
        await expect(calendarInputField).toHaveValue(expectedDate)
    })
})

test('sliders', async ({ page }) => {
    // 1 setting
    /*     const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
        await tempGauge.evaluate(circle => {
            circle.setAttribute('cx', '232.630')
            circle.setAttribute('cy', '232.630')
        })
        await tempGauge.click() */

    // 2 mouse moving
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    if (!box) throw new Error('Temperature slider bounding box was not found')

    const x = box.x + box.width / 2
    const y = box.y + box.height / 2

    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')

})

test('Drag  drop', async ({ page }) => {
    await page.getByText('Extra Components').click()
    await page.getByText('Drag & Drop').click()

    //option1
    await page.getByText('Clean my room').dragTo(page.locator('#drop-list'))

    //option 2
    await page.getByText('Get groceries').hover()
    await page.mouse.down()
    await page.locator('#drop-list').hover()
    await page.mouse.up()
})