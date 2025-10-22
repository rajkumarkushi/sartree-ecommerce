import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Profile from "./pages/ProfileDetails";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import HelpSupport from "./pages/HelpSupport";
import OrderHistory from "./pages/OrderHistory";
import SettingsPanel from "./pages/SettingsPanel";
import Checkout from "./pages/Checkout";
import OrderPlaced from "./pages/OrderPlaced";
import CreateOrder from "./pages/CreateOrder";
import Addresses from "./pages/Addresses";
import ChangePassword from "./pages/ChangePassword";

import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart'; // ✅ NEW

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen overflow-hidden">
            <Toaster />
            <Sonner />
            <HashRouter>
              <Header />
              <main className="flex-grow relative">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} /> {/* ✅ NEW */}
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blogs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/help-support" element={<HelpSupport />} />
                  <Route path="/order-history" element={<OrderHistory />} />
                  <Route path="/orders/" element={<OrderHistory />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/settings-panel" element={<SettingsPanel />} />
                  <Route
                    path="/change-password"
                    element={
                      <ProtectedRoute>
                        <ChangePassword />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/addresses" element={<Addresses />} />
                  <Route path="/order-placed/:orderId" element={<OrderPlaced />} />
                  <Route path="/create-order" element={<CreateOrder />} />
                  {/* Removed catch-all 404 route */}
                </Routes>
              </main>
              <Footer />
            </HashRouter>
          </div>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
