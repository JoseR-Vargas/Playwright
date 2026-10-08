import { Page } from "@playwright/test";

export class FormsLayoutsPage {
    private readonly page: Page
    constructor(page: Page) {
        this.page = page
    }

    async submitUsingTheGridForm(email: string, password: string, optionTest: string){
        const usingTheGridForm = this.page.locator('nb-card', { hasText: "Using the Grid" })
        await usingTheGridForm.getByRole('textbox', { name: "Email" }).fill(email)
        await usingTheGridForm.getByRole('textbox', { name: "Password" }).fill(password)
        await usingTheGridForm.getByLabel(optionTest).check({ force: true })
        await usingTheGridForm.getByRole('button', { name: "Sign in" }).click()
    }

    async submitInlineForm(fullName: string, email: string, remeberMeCheckbox: boolean){
        const inlineForm = this.page.locator('nb-card', { hasText: "Inline form" })
        await inlineForm.getByRole('textbox', { name: "Jane Doe" }).fill(fullName)
        await inlineForm.getByRole('textbox', { name: "Email" }).fill(email)
        if(remeberMeCheckbox){
            await inlineForm.getByRole('checkbox').check({force:true})
        }
        await inlineForm.getByRole('button', { name: "Submit" }).click()
}
}