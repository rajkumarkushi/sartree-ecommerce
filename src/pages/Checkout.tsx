import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';
import { orderAPI } from '@/api/modules/orders';
import { tokenManager } from '@/api/tokens';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'upi'>('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleShippingChange = (field: string, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCardChange = (field: string, value: string) => {
    setCardInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    return required.every(field => shippingInfo[field as keyof typeof shippingInfo]?.trim());
  };

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      return cardInfo.cardNumber && cardInfo.expiryDate && cardInfo.cvv && cardInfo.cardholderName;
    }
    return true;
  };

  const validateOrderData = (orderData: any) => {
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return "Cart is empty.";
    }
    for (const item of orderData.items) {
      if (!item.product_id || !item.quantity || !item.price) {
        return "Invalid cart item.";
      }
    }
    const addr = orderData.shipping_address;
    if (!addr || !addr.first_name || !addr.last_name || !addr.address_line_1 || !addr.city || !addr.state || !addr.zip_code || !addr.country) {
      return "Shipping address is incomplete.";
    }
    if (!orderData.payment_method) {
      return "Payment method is required.";
    }
    if (orderData.payment_method === 'card') {
      const pd = orderData.payment_details;
      if (!pd || !pd.card_number || !pd.cardholder_name || !pd.expiry_date || !pd.cvv) {
        return "Card details are incomplete.";
      }
    }
    if (!orderData.email || !orderData.phone) {
      return "Email and phone are required.";
    }
    return null;
  };

  const handleNext = () => {
    if (step === 1 && validateShipping()) {
      setStep(2);
    } else if (step === 2 && validatePayment()) {
      // If COD selected and not authenticated, force login before placing order
      if (paymentMethod === 'cod' && !isAuthenticated) {
        navigate('/signin', { state: { from: '/checkout' } });
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    // Require signup/login right before placing order if user is not authenticated
    const token = tokenManager.getAccessToken && tokenManager.getAccessToken();
    if (!token || (tokenManager.isTokenExpired && tokenManager.isTokenExpired(token))) {
      toast({ title: 'Please sign in', description: 'Create an account or sign in to place order.' });
      navigate('/signup', { state: { from: '/checkout' } });
      return;
    }
    setLoading(true); // Optional: show loading spinner
    try {
      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address: {
          first_name: shippingInfo.firstName,
          last_name: shippingInfo.lastName,
          address_line_1: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip_code: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
        payment_method: paymentMethod,
        payment_details: paymentMethod === 'card' ? {
          card_number: cardInfo.cardNumber,
          cardholder_name: cardInfo.cardholderName,
          expiry_date: cardInfo.expiryDate,
          cvv: cardInfo.cvv,
        } : undefined,
        notes: '',
        email: shippingInfo.email,
        phone: shippingInfo.phone,
      };

      // Validate orderData before sending
      const validationError = validateOrderData(orderData);
      if (validationError) {
        toast({
          title: "Order Error",
          description: validationError,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Pass the token as the second argument
      const response = await orderAPI.createOrder(orderData);

      // Optionally clear the cart and redirect
      clearCart();
      if (response && response.order_id) {
        navigate(`/order-placed/${response.order_id || response.id}`);
      } else {
        navigate('/order-placed');
      }

      toast({
        title: "Order Success",
        description: "Order placed successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: "Order failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false); // Optional: hide loading spinner
    }
  };

  const subtotal = getCartTotal();
  const shipping = 5.99;
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart before proceeding to checkout.</p>
          <Button onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-farm-primary text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 mx-2 ${step >= 2 ? 'bg-farm-primary' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-farm-primary text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 mx-2 ${step >= 3 ? 'bg-farm-primary' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-farm-primary text-white' : 'bg-gray-200'
            }`}>
              3
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <Truck className="w-6 h-6 mr-3 text-farm-primary" />
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleShippingChange('firstName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleShippingChange('lastName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={shippingInfo.country} onValueChange={(value) => handleShippingChange('country', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            )}

            {step === 2 && (
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-6 h-6 mr-3 text-farm-primary" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'cod' | 'upi')} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Credit/Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Cash on Delivery</Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardInfo.cardNumber}
                        onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={cardInfo.expiryDate}
                          onChange={(e) => handleCardChange('expiryDate', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardInfo.cvv}
                          onChange={(e) => handleCardChange('cvv', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name *</Label>
                      <Input
                        id="cardholderName"
                        value={cardInfo.cardholderName}
                        onChange={(e) => handleCardChange('cardholderName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </Card>
            )}

            {step === 3 && (
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <Truck className="w-6 h-6 mr-3 text-farm-primary" />
                  <h2 className="text-xl font-semibold">Order Review</h2>
                </div>
                
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Shipping Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.email}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                        <p>{shippingInfo.phone}</p>
                      </div>
                    </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>{paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}</p>
                      {paymentMethod === 'card' && (
                        <p>•••• •••• •••• {cardInfo.cardNumber.slice(-4)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              <div className="ml-auto">
{step < 3 ? (
  <Button onClick={handleNext} disabled={step === 1 ? !validateShipping() : !validatePayment()}>
    Continue
  </Button>
) : (
  <Button 
    onClick={handlePlaceOrder} 
    disabled={loading}
    className="bg-farm-primary hover:bg-farm-dark"
  >
    {loading ? 'Processing...' : 'Place Order'}
  </Button>
)}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{((item.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
