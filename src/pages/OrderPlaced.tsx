import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderAPI } from '@/api/modules/orders';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
 

const OrderPlaced: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
console.log("Order ID from params:", orderId);
  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }
    const fetchOrderDetails = async () => {
      try {
        const data = await orderAPI.getOrder(orderId);
        console.log("Fetched order details:", data.id || data.order_id);
        setOrderDetails(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order details");
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading order details...</p>;
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#fafbfa" }}>
        <h2 style={{ color: "red" }}>Error</h2>
        <p>{error}</p>
        <button
          style={{
            background: "#21916b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            fontSize: "1.1rem",
            cursor: "pointer",
            marginTop: "1rem"
          }}
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    );
  }

  const items = orderDetails.items || orderDetails.order_items || [];
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto text-center mb-6">
        <h2 className="text-3xl font-bold text-green-600">Order Placed!</h2>
        <p className="text-muted-foreground mt-2">Thank you for your purchase. Here are your order details.</p>
      </div>
      <Card className="max-w-3xl mx-auto p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div>
            <div className="text-sm text-muted-foreground">Order ID</div>
            <div className="font-medium">#{orderDetails.id || orderDetails.order_id}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="font-medium">₹{orderDetails.totalAmount || orderDetails.total || orderDetails.total_price}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Date</div>
            <div className="font-medium">{new Date(orderDetails.created_at || Date.now()).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Payment</div>
            <div className="font-medium capitalize">{orderDetails.payment_method || orderDetails.payment_details || 'N/A'}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="font-semibold mb-2">Items</div>
          <div className="space-y-2">
            {items.map((it: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="truncate mr-2">{it.product?.title || it.product?.name || it.title || `Item ${i+1}`}</div>
                <div className="text-muted-foreground">x {it.quantity}</div>
                <div>₹{(it.price || 0) * (it.quantity || 1)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={() => navigate('/orders')}>View Orders</Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderPlaced;
