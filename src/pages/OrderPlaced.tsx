import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
 

const OrderPlaced: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const orderFromState: any = (location.state as any)?.order;
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto text-center mb-6">
        <h2 className="text-3xl font-bold text-green-600">Order Placed!</h2>
        <p className="text-muted-foreground mt-2">Thank you for your purchase.</p>
      </div>
      <Card className="max-w-3xl mx-auto p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {!!orderId && (
            <div>
              <div className="text-sm text-muted-foreground">Order ID</div>
              <div className="font-medium">#{orderId}</div>
            </div>
          )}
          {orderFromState?.total && (
            <div>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="font-medium">₹{orderFromState.total}</div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={() => navigate('/orders')}>View My Orders</Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderPlaced;
