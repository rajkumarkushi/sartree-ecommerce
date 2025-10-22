const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:8082', 'http://127.0.0.1:8082', 'http://localhost:8083', 'http://127.0.0.1:8083'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: 'Toor Dal / kandipappu',
    price: 110.00,
    original_price: 140.00,
    image: '/images/1.jpeg',
    weight: '1kg',
    is_new: false,
    is_on_sale: true,
    is_sold_out: false,
    description: 'High quality toor dal',
    category: { title: 'Pulses' },
    brand_name: 'SAR TREE',
    specifications: [
      { label: 'Weight', value: '1kg' },
      { label: 'Type', value: 'Toor Dal' }
    ]
  },
  {
    id: 2,
    name: 'Urad Gola White / Gundu Minapappu',
    price: 110.00,
    original_price: 110.00,
    image: '/images/2.jpeg',
    weight: '1kg',
    is_new: false,
    is_on_sale: false,
    is_sold_out: false,
    description: 'Premium quality urad dal',
    category: { title: 'Pulses' },
    brand_name: 'SAR TREE',
    specifications: [
      { label: 'Weight', value: '1kg' },
      { label: 'Type', value: 'Urad Dal' }
    ]
  },
  {
    id: 3,
    name: 'Moong Dal (pesarapappu)',
    price: 90.00,
    original_price: 90.00,
    image: '/images/3.jpeg',
    weight: '500g',
    is_new: false,
    is_on_sale: false,
    is_sold_out: false,
    description: 'Fresh moong dal',
    category: { title: 'Pulses' },
    brand_name: 'SAR TREE',
    specifications: [
      { label: 'Weight', value: '500g' },
      { label: 'Type', value: 'Moong Dal' }
    ]
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock API server is running' });
});

// Products endpoints
app.get('/api/v1/product', (req, res) => {
  console.log('GET /api/v1/product - Returning mock products');
  res.json({ data: mockProducts });
});

app.get('/api/v1/product/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = mockProducts.find(p => p.id === id);
  if (product) {
    console.log(`GET /api/v1/product/${id} - Returning product`);
    res.json({ data: product });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Cart endpoints
app.post('/api/v1/cart-items', (req, res) => {
  console.log('POST /api/v1/cart-items - Returning empty cart');
  res.json({ data: [], total: 0 });
});

app.post('/api/v1/cart/add', (req, res) => {
  console.log('POST /api/v1/cart/add - Mock add to cart');
  res.json({ success: true, message: 'Item added to cart (mock)' });
});

app.post('/api/v1/cart-delete', (req, res) => {
  console.log('POST /api/v1/cart-delete - Mock remove from cart');
  res.json({ success: true, message: 'Item removed from cart (mock)' });
});

// User endpoints - Updated to match the actual API endpoints used
app.post('/api/v1/user/login', (req, res) => {
  console.log('POST /api/v1/user/login - Mock login');
  console.log('Request body:', req.body);
  res.json({ 
    access_token: 'mock-jwt-token-12345',
    token_type: 'Bearer',
    expires_in: 3600,
    user: { 
      id: 1, 
      email: req.body.email || req.body.username, 
      name: 'Test User',
      phone: '+1234567890'
    }
  });
});

app.post('/api/v1/user/register', (req, res) => {
  console.log('POST /api/v1/user/register - Mock register');
  console.log('Request body:', req.body);
  res.json({ 
    success: true, 
    message: 'User registered successfully (mock)',
    user: {
      id: 2,
      email: req.body.email,
      name: req.body.name || 'New User'
    }
  });
});

// Catch all for other API routes
app.all('/api/*', (req, res) => {
  console.log(`${req.method} ${req.path} - Mock response`);
  res.json({ data: [], message: 'Mock API response' });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Products: http://localhost:${PORT}/api/v1/product`);
});

