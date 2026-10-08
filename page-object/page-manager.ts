import { Page } from '@playwright/test';
import { NavigationPage } from '../page-object/navigetion-page';
import { FormsLayoutsPage } from '../page-object/forms-layouts-page';
import { DatePickerPage } from '../page-object/datepicker-page';

export class PageManager {
    readonly navigateTo: NavigationPage
    readonly formsLayoutsPage: FormsLayoutsPage
    readonly datePickerPage: DatePickerPage

    constructor(page: Page) {
        this.navigateTo = new NavigationPage(page)
        this.formsLayoutsPage = new FormsLayoutsPage(page)
        this.datePickerPage = new DatePickerPage(page)
    }
}