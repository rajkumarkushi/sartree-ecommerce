// Test script to verify API endpoints
// Run this in the browser console to test the API endpoints

const API_BASE = 'https://api.sartree.com/api/v1';

// Test function to check if endpoints are accessible
async function testEndpoint(endpoint, method = 'GET', data = null) {
  try {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    console.log(`Testing ${method} ${endpoint}...`);
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    console.log(`${method} ${endpoint}:`, {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (response.ok) {
      try {
        const data = await response.json();
        console.log('✅ Success - Response data:', data);
        return data;
      } catch (e) {
        const text = await response.text();
        console.log('✅ Success - Response text:', text);
        return text;
      }
    } else {
      try {
        const errorData = await response.json();
        console.log('❌ Error - Error data:', errorData);
        return errorData;
      } catch (e) {
        const errorText = await response.text();
        console.log('❌ Error - Error text:', errorText);
        return errorText;
      }
    }
  } catch (error) {
    console.error(`❌ Network Error testing ${method} ${endpoint}:`, error);
    return null;
  }
}

// Test all endpoints
async function testAllEndpoints() {
  console.log('🚀 Testing API endpoints...');
  console.log('=====================================');
  
  // Test cart endpoints
  console.log('\n📦 Testing Cart Endpoints:');
  console.log('-------------------------------------');
  await testEndpoint('/cart');
  await testEndpoint('/cart/add', 'POST', { product_id: '20', quantity: 1 });
  
  // Test address endpoint
  console.log('\n📍 Testing Address Endpoints:');
  console.log('-------------------------------------');
  await testEndpoint('/address', 'POST', {
    first_name: 'Test',
    last_name: 'User',
    address_line_1: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    zip_code: '12345',
    country: 'India'
  });
  
  // Test orders endpoint
  console.log('\n📋 Testing Orders Endpoints:');
  console.log('-------------------------------------');
  await testEndpoint('/orders');
  
  // Test order creation
  console.log('\n🛒 Testing Order Creation:');
  console.log('-------------------------------------');
  await testEndpoint('/orders', 'POST', {
    items: [{
      product_id: '20',
      quantity: 1,
      price: 100.00
    }],
    shipping_address: {
      first_name: 'Test',
      last_name: 'User',
      address_line_1: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zip_code: '12345',
      country: 'India'
    },
    payment_method: 'cod',
    email: 'test@example.com',
    phone: '1234567890'
  });
  
  console.log('\n✅ API endpoint testing completed.');
  console.log('=====================================');
}

// Test specific endpoint
async function testSpecificEndpoint(endpoint, method = 'GET', data = null) {
  console.log(`🎯 Testing specific endpoint: ${method} ${endpoint}`);
  return await testEndpoint(endpoint, method, data);
}

// Test cart functionality
async function testCartFlow() {
  console.log('🛒 Testing Cart Flow:');
  console.log('=====================================');
  
  // 1. Get current cart
  console.log('\n1. Getting current cart...');
  const cart = await testEndpoint('/cart');
  
  // 2. Add item to cart
  console.log('\n2. Adding item to cart...');
  const addResult = await testEndpoint('/cart/add', 'POST', { 
    product_id: '20', 
    quantity: 1 
  });
  
  // 3. Get updated cart
  console.log('\n3. Getting updated cart...');
  const updatedCart = await testEndpoint('/cart');
  
  console.log('\n✅ Cart flow testing completed.');
  return { cart, addResult, updatedCart };
}

// Make functions available globally
window.testAllEndpoints = testAllEndpoints;
window.testSpecificEndpoint = testSpecificEndpoint;
window.testCartFlow = testCartFlow;

console.log('🔧 API Test Functions loaded:');
console.log('- testAllEndpoints() - Test all endpoints');
console.log('- testSpecificEndpoint(endpoint, method, data) - Test specific endpoint');
console.log('- testCartFlow() - Test cart functionality');
console.log('\nRun any of these functions to test the API!'); 