const fs = require('fs');
const path = require('path');

// Install xlsx if not present
try {
  require.resolve('xlsx');
} catch (e) {
  console.log('Installing xlsx package...');
  const { execSync } = require('child_process');
  execSync('npm install xlsx', { stdio: 'inherit' });
}

const XLSX = require('xlsx');

// Test case data
const testCases = [
  {
    TestCaseId: 'TC-001',
    'Page Name': 'Home Page',
    TestCaseName: 'Verify Home Page Loads Successfully',
    Descriptive: 'Validate that the DemoBlaze home page loads without errors and displays all key elements',
    Category: 'UI/Navigation',
    Preconditions: 'User has internet connectivity and access to demoblaze.com',
    Priority: 'High',
    TestData: 'URL: https://demoblaze.com/index.html',
    'Steps for execution': '1. Navigate to https://demoblaze.com/index.html\n2. Wait for page to fully load',
    ExpectedResult: 'Home page loads successfully with all elements visible including: Products, Categories (Phones, Laptops, Monitors), navigation menu, and footer',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-002',
    'Page Name': 'Category/Product Page',
    TestCaseName: 'Verify Product Categories Display',
    Descriptive: 'Validate that all product categories are displayed on the home page',
    Category: 'Product Browsing',
    Preconditions: 'User is on the home page',
    Priority: 'High',
    TestData: 'Categories: Phones, Laptops, Monitors',
    'Steps for execution': '1. Observe the left sidebar or category section\n2. Verify all three categories are displayed: Phones, Laptops, Monitors',
    ExpectedResult: 'All categories are visible and clickable',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-003',
    'Page Name': 'Category/Product Page',
    TestCaseName: 'Filter Products by Category - Phones',
    Descriptive: 'Validate filtering functionality for Phones category',
    Category: 'Product Browsing',
    Preconditions: 'User is on the home page',
    Priority: 'High',
    TestData: 'Category: Phones',
    'Steps for execution': '1. Click on "Phones" category\n2. Verify products are filtered\n3. Wait for product list to update',
    ExpectedResult: 'Only phone products are displayed on the page',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-004',
    'Page Name': 'Category/Product Page',
    TestCaseName: 'Filter Products by Category - Laptops',
    Descriptive: 'Validate filtering functionality for Laptops category',
    Category: 'Product Browsing',
    Preconditions: 'User is on the home page',
    Priority: 'High',
    TestData: 'Category: Laptops',
    'Steps for execution': '1. Click on "Laptops" category\n2. Verify products are filtered\n3. Wait for product list to update',
    ExpectedResult: 'Only laptop products are displayed on the page',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-005',
    'Page Name': 'Category/Product Page',
    TestCaseName: 'Filter Products by Category - Monitors',
    Descriptive: 'Validate filtering functionality for Monitors category',
    Category: 'Product Browsing',
    Preconditions: 'User is on the home page',
    Priority: 'High',
    TestData: 'Category: Monitors',
    'Steps for execution': '1. Click on "Monitors" category\n2. Verify products are filtered\n3. Wait for product list to update',
    ExpectedResult: 'Only monitor products are displayed on the page',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-006',
    'Page Name': 'Category/Product Page',
    TestCaseName: 'View Product Details',
    Descriptive: 'Validate that clicking on a product displays its details',
    Category: 'Product Browsing',
    Preconditions: 'User is on the home page with products visible',
    Priority: 'High',
    TestData: 'Any available product',
    'Steps for execution': '1. Click on any product\n2. Verify product details page opens\n3. Wait for details to load',
    ExpectedResult: 'Product details page displays with product name, price, description, image, and "Add to cart" button',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-007',
    'Page Name': 'Cart Page',
    TestCaseName: 'Add Product to Cart',
    Descriptive: 'Validate that products can be added to shopping cart',
    Category: 'Shopping Cart',
    Preconditions: 'User has opened a product details page',
    Priority: 'High',
    TestData: 'Any available product',
    'Steps for execution': '1. Click on "Add to cart" button\n2. Wait for confirmation message',
    ExpectedResult: 'Product is added to cart and a success notification is displayed',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-008',
    'Page Name': 'Cart Page',
    TestCaseName: 'View Shopping Cart',
    Descriptive: 'Validate that shopping cart displays added products correctly',
    Category: 'Shopping Cart',
    Preconditions: 'User has added at least one product to cart',
    Priority: 'High',
    TestData: 'Products previously added to cart',
    'Steps for execution': '1. Click on "Cart" link in navigation\n2. Navigate to cart page\n3. Verify all items are displayed',
    ExpectedResult: 'Cart page displays with added products, quantities, prices, total amount, and checkout option',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-009',
    'Page Name': 'Cart Page',
    TestCaseName: 'Remove Product from Cart',
    Descriptive: 'Validate that products can be removed from shopping cart',
    Category: 'Shopping Cart',
    Preconditions: 'User is on the cart page with products',
    Priority: 'Medium',
    TestData: 'Products in cart',
    'Steps for execution': '1. Click on the "Delete" or remove button next to a product\n2. Verify product is removed\n3. Verify cart total is updated',
    ExpectedResult: 'Product is removed from cart and cart total is updated',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-010',
    'Page Name': 'Checkout Page',
    TestCaseName: 'Proceed to Checkout',
    Descriptive: 'Validate checkout process initiation',
    Category: 'Checkout',
    Preconditions: 'User has products in cart',
    Priority: 'High',
    TestData: 'Products in cart',
    'Steps for execution': '1. Click on "Place Order" or "Checkout" button on cart page\n2. Wait for checkout page to load',
    ExpectedResult: 'User is directed to checkout/order form page',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-011',
    'Page Name': 'Login Page',
    TestCaseName: 'Sign Up - Valid Data',
    Descriptive: 'Validate user account creation with valid credentials',
    Category: 'Authentication',
    Preconditions: 'User is on the home page',
    Priority: 'High',
    TestData: 'Username: testuser123, Password: Password@123',
    'Steps for execution': '1. Click on "Sign up" link\n2. Enter username: testuser123\n3. Enter password: Password@123\n4. Click "Sign up" button',
    ExpectedResult: 'Account is created successfully and confirmation message is displayed',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-012',
    'Page Name': 'Login Page',
    TestCaseName: 'Sign Up - Duplicate Username',
    Descriptive: 'Validate system behavior when signing up with existing username',
    Category: 'Authentication',
    Preconditions: 'User account already exists with username "testuser123"',
    Priority: 'Medium',
    TestData: 'Username: testuser123, Password: Password@123',
    'Steps for execution': '1. Click on "Sign up" link\n2. Enter existing username: testuser123\n3. Enter password: Password@123\n4. Click "Sign up" button',
    ExpectedResult: 'Error message "This user already exist" is displayed',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-013',
    'Page Name': 'Login Page',
    TestCaseName: 'Login - Valid Credentials',
    Descriptive: 'Validate user login with valid credentials',
    Category: 'Authentication',
    Preconditions: 'User account exists with username "testuser123" and password "Password@123"',
    Priority: 'High',
    TestData: 'Username: testuser123, Password: Password@123',
    'Steps for execution': '1. Click on "Log in" link\n2. Enter username: testuser123\n3. Enter password: Password@123\n4. Click "Login" button',
    ExpectedResult: 'User is logged in successfully and username is displayed in navigation',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-014',
    'Page Name': 'Login Page',
    TestCaseName: 'Login - Invalid Credentials',
    Descriptive: 'Validate system behavior with invalid login credentials',
    Category: 'Authentication',
    Preconditions: 'User is on the login page',
    Priority: 'High',
    TestData: 'Username: invaliduser, Password: WrongPass',
    'Steps for execution': '1. Enter username: invaliduser\n2. Enter password: WrongPass\n3. Click "Login" button',
    ExpectedResult: 'Error message "User does not exist" or "Invalid credentials" is displayed',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-015',
    'Page Name': 'Category/Product Page',
    TestCaseName: 'Product Carousel Navigation - Next',
    Descriptive: 'Validate next button functionality in product carousel',
    Category: 'UI/Navigation',
    Preconditions: 'User is on the home page',
    Priority: 'Medium',
    TestData: 'Product carousel visible',
    'Steps for execution': '1. Observe the product carousel/slider\n2. Click on "Next" button\n3. Wait for carousel to animate',
    ExpectedResult: 'Next set of products is displayed in the carousel',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-016',
    'Page Name': 'Category/Product Page',
    TestCaseName: 'Product Carousel Navigation - Previous',
    Descriptive: 'Validate previous button functionality in product carousel',
    Category: 'UI/Navigation',
    Preconditions: 'User has clicked "Next" on the product carousel',
    Priority: 'Medium',
    TestData: 'Product carousel with multiple slides',
    'Steps for execution': '1. Click on "Previous" button\n2. Wait for carousel to animate',
    ExpectedResult: 'Previous set of products is displayed in the carousel',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-017',
    'Page Name': 'Checkout Page',
    TestCaseName: 'Place Order - Complete Checkout',
    Descriptive: 'Validate complete order placement process',
    Category: 'Checkout',
    Preconditions: 'User is on the checkout/order form page with cart items',
    Priority: 'High',
    TestData: 'Name: John Doe, Country: United States, City: New York, CC: 4111111111111111, Month: 12, Year: 2025',
    'Steps for execution': '1. Enter Name: John Doe\n2. Enter Country: United States\n3. Enter City: New York\n4. Enter Credit Card: 4111111111111111\n5. Enter Month: 12\n6. Enter Year: 2025\n7. Click "Purchase" button',
    ExpectedResult: 'Order is placed successfully and confirmation message with order ID is displayed',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-018',
    'Page Name': 'Home Page',
    TestCaseName: 'Verify About Us Page',
    Descriptive: 'Validate About Us page content and accessibility',
    Category: 'UI/Navigation',
    Preconditions: 'User is on the home page',
    Priority: 'Low',
    TestData: 'Navigation to About Us section',
    'Steps for execution': '1. Click on "About us" link in navigation or footer',
    ExpectedResult: 'About Us section/page displays with company information',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-019',
    'Page Name': 'Home Page',
    TestCaseName: 'Verify Contact Information',
    Descriptive: 'Validate contact information is displayed in footer',
    Category: 'UI/Navigation',
    Preconditions: 'User is on the home page',
    Priority: 'Low',
    TestData: 'Address, Phone, Email details',
    'Steps for execution': '1. Scroll to the footer section\n2. Verify contact details are displayed',
    ExpectedResult: 'Contact information is visible including Address, Phone, and Email',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-020',
    'Page Name': 'Login Page',
    TestCaseName: 'Logout Functionality',
    Descriptive: 'Validate user logout functionality',
    Category: 'Authentication',
    Preconditions: 'User is logged in successfully',
    Priority: 'High',
    TestData: 'Logged in user session',
    'Steps for execution': '1. Click on the user profile or logout option\n2. Click "Logout" button',
    ExpectedResult: 'User is logged out and redirected to home page',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-021',
    'Page Name': 'Cart Page',
    TestCaseName: 'Add Multiple Products to Cart',
    Descriptive: 'Validate adding multiple products to cart',
    Category: 'Shopping Cart',
    Preconditions: 'User is on the home page',
    Priority: 'Medium',
    TestData: 'Multiple products from different categories',
    'Steps for execution': '1. Click on first product and add to cart\n2. Return to home page\n3. Click on second product and add to cart\n4. Navigate to cart page',
    ExpectedResult: 'Cart displays multiple products with correct quantities',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-022',
    'Page Name': 'Category/Product Page',
    TestCaseName: 'Search Functionality',
    Descriptive: 'Validate product search functionality',
    Category: 'Product Browsing',
    Preconditions: 'User is on the home page',
    Priority: 'Medium',
    TestData: 'Search term: iPhone',
    'Steps for execution': '1. Enter product name in search box: iPhone\n2. Press Enter or click search button',
    ExpectedResult: 'Search results display matching products',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-023',
    'Page Name': 'Category/Product Page',
    TestCaseName: 'Verify Product Price Display',
    Descriptive: 'Validate product price display format',
    Category: 'Product Browsing',
    Preconditions: 'User is viewing products on home page or category page',
    Priority: 'Medium',
    TestData: 'Product prices',
    'Steps for execution': '1. Observe product cards\n2. Verify each product displays a price\n3. Verify price format is correct',
    ExpectedResult: 'All products display prices in correct format (currency symbol and amount)',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-024',
    'Page Name': 'Category/Product Page',
    TestCaseName: 'Verify Product Images Load',
    Descriptive: 'Validate product images load correctly',
    Category: 'UI/Navigation',
    Preconditions: 'User is on the home page',
    Priority: 'Medium',
    TestData: 'Product images',
    'Steps for execution': '1. Wait for page to fully load\n2. Verify product images are displayed on product cards',
    ExpectedResult: 'All product images load and display correctly',
    Status: 'Not Executed'
  },
  {
    TestCaseId: 'TC-025',
    'Page Name': 'Home Page',
    TestCaseName: 'Responsive Design - Mobile View',
    Descriptive: 'Validate responsive design on mobile devices',
    Category: 'UI/Navigation',
    Preconditions: 'Browser is resized to mobile dimensions (375x667)',
    Priority: 'Medium',
    TestData: 'Mobile viewport: 375x667',
    'Steps for execution': '1. Resize browser window to mobile size (375x667)\n2. Navigate to demoblaze.com\n3. Verify navigation is accessible (e.g., hamburger menu)\n4. Verify content is readable and properly formatted',
    ExpectedResult: 'Website is responsive and displays correctly on mobile devices',
    Status: 'Not Executed'
  }
];

// Create workbook and worksheet
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(testCases, {
  header: ['TestCaseId', 'Page Name', 'TestCaseName', 'Descriptive', 'Category', 'Preconditions', 'Priority', 'TestData', 'Steps for execution', 'ExpectedResult', 'Status']
});

// Set column widths
ws['!cols'] = [
  { wch: 12 },  // TestCaseId
  { wch: 20 },  // Page Name
  { wch: 35 },  // TestCaseName
  { wch: 40 },  // Descriptive
  { wch: 20 },  // Category
  { wch: 35 },  // Preconditions
  { wch: 12 },  // Priority
  { wch: 30 },  // TestData
  { wch: 40 },  // Steps for execution
  { wch: 40 },  // ExpectedResult
  { wch: 15 }   // Status
];

// Append sheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Test Cases');

// Write to file
const outputPath = path.join(__dirname, 'DemoBlaze_TestCases.xlsx');
XLSX.writeFile(wb, outputPath);

console.log(`Excel file created successfully: ${outputPath}`);
