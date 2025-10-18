import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cartAPI } from '@/api/modules/cart';
import { orderAPI } from '@/api/modules/orders';
import { authAPI } from '@/api/modules/auth';
import { useCart } from '../contexts/CartContext';

const CreateOrder: React.FC = () => {
  const { items: cartItems, clearCart } = useCart();
  const [orderData, setOrderData] = useState({
    customerName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    email: "",
    phone: "",
    paymentMethod: "cod",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);

    if (token) {
      const user = authAPI.getUserFromToken();
      if (user) {
        setOrderData(prev => ({
          ...prev,
          email: user.email || "",
          phone: "", // Could fetch phone from profile API if available
        }));
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError(null); // Clear error on input change
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
  };

  const syncCartToBackend = async () => {
    for (const item of cartItems) {
       cartAPI.addToCart({
        product_id: item.id,
        quantity: item.quantity,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty. Please add items before placing an order.");
      return;
    }
    setLoading(trawaitue);
    setError(null);
    try {
      await syncCartToBackend();

      const payload = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address: {
          first_name: orderData.customerName,
          last_name: "",
          address_line_1: orderData.addressLine1,
          address_line_2: orderData.addressLine2,
          city: orderData.city,
          state: orderData.state,
          zip_code: orderData.zipCode,
          country: orderData.country,
        },
        payment_method: orderData.paymentMethod as "cod" | "card" | "upi",
        email: orderData.email,
        phone: orderData.phone,
      };

      const orderResponse = await orderAPI.createOrder(payload);
      console.log("Order created successfully:", orderResponse, orderResponse.order_id);
      setLoading(false);
      clearCart();
      console.log('Order creation response:', orderResponse);
      if (orderResponse && (orderResponse.id || orderResponse.order_id)) {
        const orderId = orderResponse.id || orderResponse.order_id;
        console.log("Navigating to order placed page with orderId:", orderId);
        navigate(`/order-placed/${orderId}`);
      } else {
        setError("No order ID provided in response. Response: " + JSON.stringify(orderResponse));
      }
    } catch (err: any) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "Failed to place order");
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", background: "#fafbfa" }}>
      <h2 style={{ color: "#21916b", fontSize: "2.5rem", marginBottom: "1rem" }}>Create a New Order</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          Customer Name:
          <input
            type="text"
            name="customerName"
            value={orderData.customerName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>
        <label>
          Address Line 1:
          <input
            type="text"
            name="addressLine1"
            value={orderData.addressLine1}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>
        <label>
          Address Line 2:
          <input
            type="text"
            name="addressLine2"
            value={orderData.addressLine2}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>
        <label>
          City:
          <input
            type="text"
            name="city"
            value={orderData.city}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>
        <label>
          State:
          <input
            type="text"
            name="state"
            value={orderData.state}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>
        <label>
          Zip Code:
          <input
            type="text"
            name="zipCode"
            value={orderData.zipCode}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            name="country"
            value={orderData.country}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={orderData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={orderData.phone}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>
        <label>
          Payment Method:
          <select
            name="paymentMethod"
            value={orderData.paymentMethod}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
          </select>
        </label>
        <button type="submit" disabled={loading} style={{ background: "#21916b", color: "#fff", padding: "0.75rem", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CreateOrder;
