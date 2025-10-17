export { default as apiClient } from './client';
export { tokenManager } from './tokens';

// Module exports for feature APIs (thin wrappers)
export * from './modules/auth';
export * from './modules/cart';
export * from './modules/orders';
export * from './modules/user';
export * from './modules/products';

