//methods: login, sign up

import { Locator, Page } from "@playwright/test";

export class LoginPage{

  readonly page:Page;
  readonly loginLink:Locator;
  readonly userName:Locator;
  readonly password:Locator;
  readonly loginButton:Locator;

  constructor(page:Page)
  {
    this.page=page;
    this.loginLink=page.locator('//a[@id="login2"]');
    this.userName=page.locator('//input[@id="loginusername"]');
    this.password=page.locator('//input[@id="loginpassword"]');
    this.loginButton=page.locator('//button[text()="Log in"]');
  }  

    async login(userName:string, password:string)
    {



    //click on login button
    await this.loginLink.click();

    //Enter usernme
    await this.userName.fill(userName);

    //Enter password
    await this.password.fill(password);

    //Click on Login
    await this.loginButton.click();

    }

}