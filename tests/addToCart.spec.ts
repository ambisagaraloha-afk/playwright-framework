import test from "@playwright/test";
import { Homepage } from "../Pages/homePage";
import { credentials } from "../utilities/testData";
import { LoginPage } from "../Pages/loginPage";

test.beforeEach(async ({page})=>
{
    await page.goto("https://demoblaze.com/index.html");
})

test("Add to cart", async ({page})=>
{
    //alert box

    page.on('dialog', async dialog =>{
       await page.waitForTimeout(1000); //optional
       console.log(dialog.message());
       dialog.accept();
    }
    )
   const loginpage=new LoginPage(page);
   await loginpage.login(credentials.userName, credentials.password);

   const homepage=new Homepage(page);
   await homepage.navigateToCartPage();

})