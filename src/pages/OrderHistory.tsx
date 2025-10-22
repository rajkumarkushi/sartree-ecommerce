import { Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import React, { useEffect, useState } from 'react';
import { orderAPI } from '@/api/modules/orders';
import { orderAPI as orderModule } from '@/api/modules/orders';

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'processing':
        return 'outline';
      default:
        return 'outline';
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getOrders();
        const list = (data?.data || data?.orders || data);
        const safe = Array.isArray(list) ? list : [];
        console.log('Fetched orders (normalized):', safe);
        setOrders(safe);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleViewDetails = async (order: any) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
    setDetailsLoading(true);
    setOrderDetails(null);
    
    try {
      const details = await orderModule.getOrder(order.id);
      setOrderDetails(details);
    } catch (err: any) {
      console.error('Failed to fetch order details:', err);
      // If API fails, use the order data we already have
      setOrderDetails(order);
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-foreground">Order History</h3>
        <div className="text-sm text-muted-foreground">Total Orders: {orders.length}</div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-card border border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-xl font-semibold text-foreground">
                {orders.filter((o) => (o?.status || '').toLowerCase() === 'delivered').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card border border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Truck className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shipped</p>
              <p className="text-xl font-semibold text-foreground">
                {orders.filter((o) => (o?.status || '').toLowerCase() === 'shipped').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card border border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Processing</p>
              <p className="text-xl font-semibold text-foreground">
                {orders.filter((o) => (o?.status || '').toLowerCase() === 'processing').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card border border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-xl font-semibold text-foreground">
                ₹
                {orders
                  .reduce((acc, order) => acc + Number(order?.total ?? order?.totalAmount ?? 0), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="p-6 bg-gradient-card border border-border hover:shadow-glow transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-foreground">Order #{order.id}</h4>
                  <Badge variant={getStatusVariant((order.status || '').toLowerCase())} className="capitalize">
                    {order.status || 'processing'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Order Date: {new Date(order.created_at || order.date || Date.now()).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-foreground">₹{order.total ?? order.totalAmount ?? 0}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => handleViewDetails(order)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Items</label>
                <div className="mt-1 space-y-1">
                  {(order.items || order.order_items || []).map((item: any, index: number) => (
                    <p key={index} className="text-foreground text-sm">
                      {item.product?.title || item.product?.name || 'Unnamed Product'} × {item.quantity} – ₹{item.price}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment</label>
                <p className="text-foreground mt-1">{order.payment_status}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(order.status)}
                  <span className="text-foreground capitalize">{order.status}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Order Details #{selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          
          {detailsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading order details...</p>
              </div>
            </div>
          ) : orderDetails ? (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Order Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Order ID:</span>
                    <p className="font-medium">#{orderDetails.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(orderDetails.status)}
                      <Badge variant={getStatusVariant(orderDetails.status)} className="capitalize">
                        {orderDetails.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Order Date:</span>
                    <p className="font-medium">
                      {new Date(orderDetails.created_at || orderDetails.date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Amount:</span>
                    <p className="font-medium text-lg">₹{orderDetails.total || orderDetails.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-3">Order Items</h4>
                <div className="space-y-3">
                  {orderDetails.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.product?.title || item.product?.name || 'Unnamed Product'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(item.quantity * (item.price || 0)).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Payment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Payment Status:</span>
                      <p className="font-medium capitalize">{orderDetails.payment_status || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Payment Method:</span>
                      <p className="font-medium">{orderDetails.payment_method || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Shipping Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tracking Number:</span>
                      <p className="font-medium font-mono">{orderDetails.tracking_number || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Shipping Address:</span>
                      <p className="font-medium">
                        {orderDetails.shipping_address?.address_line_1 || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Failed to load order details</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderHistory;

