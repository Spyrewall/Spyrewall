import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, CreditCard, CheckCircle2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/courses';

export default function Checkout() {
  const { items, totalPrice, totalOriginalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && !paymentSuccess) {
      navigate('/cart');
    }
  }, [items, paymentSuccess, navigate]);

  const discount = totalOriginalPrice - totalPrice;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error for field
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setIsProcessing(false);
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TKaii6Z6qi3jxW';

    const options = {
      key: razorpayKey,
      amount: totalPrice * 100, // Razorpay expects paise
      currency: 'INR',
      name: 'Spyrewall',
      description: `${items.length} Course(s)`,
      image: '/spyrewall-logo.png', // Or wherever your logo is
      // order_id: orderIdFromBackend, // TODO: Get from Cloud Function
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone.startsWith('+') ? formData.phone : `+91${formData.phone.replace(/\D/g, '')}`,
      },
      theme: {
        color: '#3b82f6', // hsl(217 91% 60%) approx
      },
      handler: function (response) {
        // Payment successful
        setIsProcessing(false);
        setPaymentSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id || 'ORDER_PLACEHOLDER',
          amount: totalPrice,
          itemsPurchased: [...items]
        });
        clearCart();
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (paymentSuccess) {
    return (
      <section className="py-24 min-h-[80vh] flex items-center justify-center relative bg-[hsl(0_0%_4%)] cyber-grid">
        <div className="max-w-2xl w-full px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_15%)] p-8 md:p-12 text-center cyber-clip relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(217_91%_60%)] to-transparent opacity-50" />
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-[hsl(217_91%_60%)]/20 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle2 size={40} style={{ color: 'hsl(217 91% 60%)' }} />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-[hsl(0_0%_98%)] mb-2">
              PAYMENT SUCCESSFUL
            </h1>
            <p className="font-mono text-sm tracking-widest text-[hsl(0_0%_65%)] mb-8">
              TRANSMISSION SECURE // ACCESS GRANTED
            </p>

            <div className="bg-[hsl(0_0%_4%)] border border-[hsl(0_0%_15%)] p-6 text-left mb-8">
              <h3 className="font-mono text-xs tracking-widest text-[hsl(0_0%_65%)] mb-4 border-b border-[hsl(0_0%_15%)] pb-2">
                ORDER DETAILS
              </h3>
              
              <div className="space-y-4 mb-4">
                {paymentSuccess.itemsPurchased.map(item => (
                  <div key={item.id} className="flex justify-between items-start">
                    <span className="text-[hsl(0_0%_98%)] font-medium">{item.name}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[hsl(0_0%_15%)] flex justify-between items-center text-sm">
                <span className="text-[hsl(0_0%_65%)] font-mono">TOTAL PAID</span>
                <span className="text-[hsl(0_0%_98%)] font-bold">{formatPrice(paymentSuccess.amount)}</span>
              </div>
              <div className="mt-2 flex justify-between items-center text-sm">
                <span className="text-[hsl(0_0%_65%)] font-mono">TXN ID</span>
                <span className="text-[hsl(0_0%_98%)] font-mono text-xs truncate max-w-[200px]">{paymentSuccess.paymentId}</span>
              </div>
            </div>

            <Link to="/dashboard">
              <button className="cyber-clip-button w-full sm:w-auto bg-[hsl(217_91%_60%)] hover:bg-[hsl(217_91%_50%)] text-[hsl(0_0%_98%)] px-8 py-4 font-mono font-bold tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto">
                GO TO DASHBOARD
                <ArrowRight size={18} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 min-h-screen relative bg-[hsl(0_0%_4%)] cyber-grid">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Header */}
        <div className="mb-12 border-b border-[hsl(0_0%_15%)] pb-6 flex items-center gap-3">
          <Lock style={{ color: 'hsl(217 91% 60%)' }} size={28} />
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[hsl(0_0%_98%)]">
              SECURE CHECKOUT
            </h1>
            <p className="font-mono text-xs tracking-widest text-[hsl(0_0%_65%)] mt-2">
              ENCRYPTED CONNECTION // 256-BIT SSL
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Order Summary (Left) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_15%)] p-6 md:p-8 cyber-clip sticky top-24">
              <h2 className="font-mono text-sm tracking-widest text-[hsl(0_0%_65%)] mb-6 flex items-center gap-2">
                <ShieldCheck size={16} style={{ color: 'hsl(217 91% 60%)' }} />
                ORDER SUMMARY
              </h2>

              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b border-[hsl(0_0%_15%)] last:border-0 last:pb-0">
                    <div className="pr-4">
                      <h3 className="text-[hsl(0_0%_98%)] font-medium text-sm line-clamp-2">{item.name}</h3>
                      <p className="text-[hsl(0_0%_65%)] text-xs mt-1">{item.level}</p>
                    </div>
                    <span className="text-[hsl(0_0%_98%)] font-bold shrink-0">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[hsl(0_0%_15%)] pt-6 space-y-4 font-mono text-sm">
                <div className="flex justify-between text-[hsl(0_0%_65%)]">
                  <span>SUBTOTAL</span>
                  <span>{formatPrice(totalOriginalPrice)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>DISCOUNT</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[hsl(0_0%_98%)] text-lg font-bold pt-4 border-t border-[hsl(0_0%_15%)]">
                  <span>TOTAL</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[hsl(0_0%_15%)] flex items-center justify-center gap-2 text-[hsl(0_0%_65%)] opacity-70">
                <CreditCard size={16} />
                <span className="text-xs font-mono tracking-widest">POWERED BY RAZORPAY</span>
              </div>
            </div>
          </div>

          {/* Contact Form (Right) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_15%)] p-6 md:p-8 cyber-clip">
              <h2 className="font-mono text-sm tracking-widest text-[hsl(0_0%_65%)] mb-8">
                CONTACT INFORMATION
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-mono text-xs tracking-widest text-[hsl(0_0%_65%)] mb-2">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-[hsl(0_0%_4%)] border ${errors.name ? 'border-red-500' : 'border-[hsl(0_0%_15%)]'} text-[hsl(0_0%_98%)] px-4 py-3 focus:outline-none focus:border-[hsl(217_91%_60%)] transition-colors`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block font-mono text-xs tracking-widest text-[hsl(0_0%_65%)] mb-2">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-[hsl(0_0%_4%)] border ${errors.email ? 'border-red-500' : 'border-[hsl(0_0%_15%)]'} text-[hsl(0_0%_98%)] px-4 py-3 focus:outline-none focus:border-[hsl(217_91%_60%)] transition-colors`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block font-mono text-xs tracking-widest text-[hsl(0_0%_65%)] mb-2">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full bg-[hsl(0_0%_4%)] border ${errors.phone ? 'border-red-500' : 'border-[hsl(0_0%_15%)]'} text-[hsl(0_0%_98%)] px-4 py-3 focus:outline-none focus:border-[hsl(217_91%_60%)] transition-colors`}
                    placeholder="9876543210"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[hsl(0_0%_15%)]">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="cyber-clip-button w-full bg-[hsl(217_91%_60%)] hover:bg-[hsl(217_91%_50%)] disabled:opacity-50 disabled:cursor-not-allowed text-[hsl(0_0%_98%)] px-8 py-5 font-mono font-bold tracking-widest text-lg transition-colors flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      PAY {formatPrice(totalPrice)}
                    </>
                  )}
                </button>
                <p className="text-center text-[hsl(0_0%_65%)] text-xs mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck size={14} /> Payments are secure and encrypted
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
