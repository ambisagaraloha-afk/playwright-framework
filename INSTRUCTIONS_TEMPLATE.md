# Playwright MCP Instructions for Reliable TypeScript E2E Automation

## 1) Objective
Use these instructions when generating or updating **Playwright + TypeScript** automated tests in **VS Code** through **Playwright MCP**.

### Primary Goal
Produce **complete, runnable, maintainable, and low-flake** automation code that:
- follows **Playwright best practices**
- uses **TypeScript** only
- uses **Page Object Model (POM)** when the scenario spans more than one page or reusable page actions
- generates **Allure results** and supports **Allure report output**
- requires **minimal manual fixes** after generation

### Non-Negotiable Success Standard
Aim for the **highest possible execution reliability** by generating code that is:
- deterministic
- strongly typed
- assertion-driven
- locator-stable
- build-safe
- free of placeholder logic, TODOs, or incomplete methods

> Do **not** claim guaranteed 100% pass rate. Instead, optimize the generated code and configuration for **near-zero avoidable failures**.

---

## 2) Output Contract
When asked to automate a test case, generate all required code artifacts in **TypeScript** and ensure they are internally consistent.

### Required Output
Generate or update the following where applicable:
- `playwright.config.ts`
- page objects in `pages/`
- specs in `tests/` or `e2e/`
- shared helpers/utilities only when truly needed
- test data/constants only when reusable
- Allure reporter configuration
- execution commands for Playwright + Allure

### Mandatory Quality Bar
The generated output must:
- compile without TypeScript syntax issues
- use valid Playwright APIs only
- include complete imports/exports
- avoid duplicate or unused code
- avoid dead methods and unused abstractions
- keep naming consistent across files

---

## 3) Preferred Project Structure
Use this structure unless the existing repository already has a clear convention:

```text
project-root/
├── pages/
│   ├── BasePage.ts
│   └── <FeatureName>Page.ts
├── tests/
│   └── <feature>.spec.ts
├── fixtures/
│   └── test-fixtures.ts              # only if custom fixtures are needed
├── data/
│   └── testData.ts                   # only if reusable test data is needed
├── utils/
│   └── <helper>.ts                   # only for real reuse
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

### Keep It Lean
Do **not** create extra files for the sake of architecture.
Only create:
- `BasePage.ts` if at least one reusable page utility exists
- helper files if logic is reused in multiple places
- test data files if values are shared across tests

---

## 4) Coding Rules for Maximum Reliability

### 4.1 Language and Framework
- Use **TypeScript** only
- Use `@playwright/test`
- Use modern Playwright patterns and web-first assertions
- Prefer simple, explicit code over over-engineered abstractions

### 4.2 Locator Strategy (Strict Priority)
Always prefer the most stable user-facing locator available:
1. `getByTestId()`
2. `getByRole()` with accessible name
3. `getByLabel()`
4. `getByPlaceholder()`
5. `getByText()` only for stable visible text
6. CSS/XPath only as a last resort

### 4.3 Locator Rules
- Prefer unique, deterministic locators
- Avoid brittle chained CSS selectors
- Avoid index-based selectors unless unavoidable and clearly justified
- Do not use dynamic classes/IDs if they appear unstable
- If fallback selectors are necessary, document the reason in a short comment

### 4.4 Waiting Rules
- **Never** use hard waits like `waitForTimeout()` unless the application has no deterministic signal and the reason is clearly documented
- Prefer Playwright auto-waiting
- Wait on:
  - URL changes
  - element state (`visible`, `enabled`, `attached`, `hidden`)
  - API/UI completion signals
  - assertion completion via `expect(...)`
- Prefer `expect(locator).toBeVisible()` and related web-first assertions over manual polling

### 4.5 Assertion Rules
- Assertions belong in **spec files**, not page objects, except for very small page-state helpers that return a value/locator
- Each test must validate the expected business outcome
- Avoid weak assertions such as “page loaded” unless required by the scenario
- Prefer assertions on visible UI states, URLs, values, network results, or persisted outcomes

### 4.6 Interaction Rules
- Use `await` consistently
- Check visibility/readiness before interacting when the control is known to be delayed
- Avoid `{ force: true }` unless necessary and justified in a comment
- Use `scrollIntoViewIfNeeded()` when hidden by viewport position
- Handle dialogs/popups/downloads explicitly when relevant to the test case
- Handle iframes with `frameLocator()` when required

### 4.7 Data and Test Design
- Tests must be independent and repeatable
- Avoid data coupling between tests
- Reuse authenticated state only if the project already supports it or the scenario clearly benefits from it
- Prefer generating unique values for mutable test data where needed
- Clean up created data only when the scenario or environment requires it

### 4.8 Error Prevention Rules
Generated code must not contain:
- TODO / FIXME / placeholder comments
- pseudo-code
- missing method bodies
- unused imports
- duplicate locators or duplicate helper methods
- generic comments that do not help maintainability

---

## 5) Page Object Model Standards
Use POM for reusable page behavior. Keep page objects focused on **page actions and page state access**.

### Page Object Responsibilities
Each page object may contain:
- locators
- navigation methods for that page
- business actions for that page
- helper methods that return values/state needed by tests

Each page object must **not** contain:
- test assertions for business outcomes
- unrelated cross-page workflows
- unnecessary wrappers around one-line Playwright calls unless they improve readability or reuse

### Page Object Naming Standard
- Class names: `LoginPage`, `CheckoutPage`, `OrdersPage`
- Files: `LoginPage.ts`, `CheckoutPage.ts`
- Locators: suffix with `Locator` only if it improves clarity; otherwise concise readable names are acceptable

### Example Page Object Pattern
```typescript
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
  }

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/login`);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
```

---

## 6) Spec File Standards
Every generated spec must be clean, readable, and complete.

### Mandatory Spec Rules
- Use descriptive `test()` names based on business intent
- Follow **Arrange -> Act -> Assert**
- Keep one business flow per test unless data-driven coverage is explicitly needed
- Use `test.step()` for major steps when it improves debug value
- Include at least one strong assertion for each expected outcome

### Example Spec Pattern
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('user can sign in with valid credentials', async ({ page, baseURL }) => {
  const loginPage = new LoginPage(page);

  await test.step('Navigate to login page', async () => {
    await loginPage.goto(baseURL!);
  });

  await test.step('Sign in with valid credentials', async () => {
    await loginPage.login('standard.user@example.com', 'Password@123');
  });

  await test.step('Verify successful sign-in', async () => {
    await expect(page).toHaveURL(/dashboard|home/i);
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
```

---

## 7) BasePage Guidance
Create `BasePage.ts` only if it provides **real reuse**.

### Good Candidates for BasePage
- common navigation helper
- consistent click/fill wrappers with deterministic waiting
- reusable toast/message retrieval
- reusable loading-state handling
- common menu/header/footer actions

### Avoid in BasePage
- business-specific methods
- giant utility classes with unrelated helpers
- wrappers for every Playwright function with no value added

---

## 8) Playwright Configuration Requirements
The generated `playwright.config.ts` must be practical and reliability-focused.

### Required Configuration Principles
- sensible `timeout` and `expect.timeout`
- retries for transient environment issues (especially CI)
- screenshots on failure
- trace retention on failure
- video retention on failure when useful
- reporter setup for both local debugging and Allure output

### Recommended Config Pattern
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: false }],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Config Notes
- Do not enable unnecessary browsers unless explicitly requested
- Prefer `chromium` first for generated samples unless the project already uses more browsers
- Avoid overly aggressive parallelism if tests share data or the environment is unstable

---

## 9) Allure Report Output — Mandatory Conditions
If the automation output must support **Allure reporting**, the generated solution must include the following.

### 9.1 Required Dependencies
Ensure `package.json` includes:
```json
{
  "devDependencies": {
    "@playwright/test": "latest",
    "allure-playwright": "latest",
    "allure-commandline": "latest",
    "typescript": "latest"
  }
}
```

### 9.2 Required Reporter Setup
`playwright.config.ts` must include:
- `allure-playwright` reporter
- output folder set to `allure-results`
- HTML reporter enabled for quick local triage

### 9.3 Required Test Artifacts for Allure Value
Enable these Playwright artifacts:
- `screenshot: 'only-on-failure'`
- `trace: 'retain-on-failure'`
- `video: 'retain-on-failure'` when useful for debugging

### 9.4 Optional but Recommended Allure Enrichment
When appropriate, enrich tests with:
- `test.step()` for readable execution steps
- attachments such as screenshots, JSON payloads, or text logs
- labels/tags only if the project already uses them consistently

### 9.5 Required Execution Commands
Include these commands in guidance or scripts:

```bash
npx playwright test
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

### 9.6 Recommended package.json Scripts
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "report:playwright": "playwright show-report",
    "report:allure:generate": "allure generate allure-results --clean -o allure-report",
    "report:allure:open": "allure open allure-report"
  }
}
```

### 9.7 Allure Output Success Conditions
To ensure Allure report generation works reliably, verify that:
- test execution completed and produced the `allure-results/` directory
- the Allure reporter is configured in `playwright.config.ts`
- `allure-commandline` is installed or available via `npx`
- the generated tests do not crash before reporter output is flushed
- result folders are not deleted prior to report generation

---

## 10) Playwright MCP-Specific Generation Instructions
When using Playwright MCP to automate test cases:

### Always Do the Following
1. Understand the full business flow before generating code
2. Generate working TypeScript code — not framework theory
3. Use realistic selectors based on the inspected UI
4. Reflect the exact expected outcome from the test case
5. Add only the minimum architecture required for maintainability
6. Ensure the code can be pasted into VS Code with minimal edits
7. Keep imports, paths, class names, and file names aligned
8. If a page object is introduced, actually use it from the spec
9. If a utility is introduced, ensure at least one real reuse exists
10. Complete every step in the scenario; do not omit validation steps

### Never Do the Following
- never return partial implementations
- never leave important selectors as placeholders
- never use unsupported or pseudo APIs
- never overuse custom wrappers when native Playwright is sufficient
- never hide flaky behavior with arbitrary waits
- never split logic into too many files without clear benefit

---

## 11) Failure-Reduction Checklist
Before finalizing output, validate that the generated content satisfies all items below.

### Code Integrity
- imports are complete
- exports are correct
- TypeScript syntax is valid
- file paths are consistent
- named classes/functions match actual usage

### Test Reliability
- selectors are stable
- no hard waits exist without documented reason
- assertions verify meaningful outcomes
- navigation, dialogs, iframes, and popups are handled if present
- test data is deterministic or uniquely generated where needed

### Reporting
- HTML reporter configured
- Allure reporter configured
- failure artifacts retained
- commands to generate/open Allure report are included

### Maintainability
- no dead code
- no duplicate methods
- no vague comments
- only necessary abstractions are used

---

## 12) Preferred Response Style When Generating Automation
When responding to a test automation request, produce output in this order when applicable:
1. short implementation note
2. file-by-file code
3. configuration updates
4. package.json script/dependency updates
5. commands to run tests and generate Allure report
6. brief assumptions and any required manual selector verification

Keep the explanation concise and keep the code production-ready.

---

## 13) Final Instruction to the Automation Generator
Generate **robust, executable Playwright + TypeScript automation** that is optimized for **maximum practical success rate**, **minimal flakiness**, and **ready Allure report generation**.

If trade-offs are required, prefer:
1. reliability over cleverness
2. stable selectors over short selectors
3. readable code over excessive abstraction
4. deterministic waits over hard-coded delays
5. complete runnable output over partial templates
