import {test} from '@playwright/test';
import { LoginPage } from '../Pages/loginPage';
import { credentials } from '../utilities/testData';
import { beforeEach } from 'node:test';

test.beforeEach(async({page})=>
{
    await page.goto("https://demoblaze.com/index.html");
})

test("login page test case", async({page})=>{

    const loginPageObj = new LoginPage(page);
    await loginPageObj.login(credentials.userName,credentials.password);

    // await page.goto("https://demoblaze.com/index.html");

    // //click on login button
    // await page.locator('//a[@id="login2"]').click();

    // //Enter usernme
    // await page.locator('//input[@id="loginusername"]').fill("sagar1234");

    // //Enter password
    // await page.locator('//input[@id="loginpassword"]').fill("Password_1234");

    // //Click on Login
    // await page.locator('//button[text()="Log in"]').click();

})