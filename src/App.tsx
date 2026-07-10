import { useState, useEffect, useMemo, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Search, 
  ShoppingBag, 
  Star, 
  Clock, 
  Flame, 
  Plus, 
  Minus, 
  Trash2, 
  Compass, 
  AlertCircle, 
  Timer, 
  ChevronRight, 
  User, 
  X,
  Sparkles,
  ArrowRight,
  MapPinOff,
  ThumbsUp
} from 'lucide-react';
import { FOOD_ITEMS, CATEGORIES, SUGGESTED_ADDRESSES } from './data';
import { FoodItem, CartItem, OrderStatus, OrderPhase } from './types';

export default function App() {
  // Menu filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Shopping cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Order checkout & delivery simulation state
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [checkoutError, setCheckoutError] = useState('');
  
  // Live simulation state
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [simulatedTimeLeft, setSimulatedTimeLeft] = useState(0); // in seconds
  const [orderLogs, setOrderLogs] = useState<string[]>([]);

  // Sound effects or visual micro-notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2500);
  };

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    return FOOD_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  // Cart operations
  const addToCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.foodItem.id === item.id);
      if (existing) {
        showToast(`Increased quantity of ${item.name}`);
        return prev.map((i) => 
          i.foodItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      showToast(`Added ${item.name} to cart`);
      return [...prev, { foodItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.foodItem.id === itemId);
      if (!item) return prev;
      if (item.quantity === 1) {
        showToast(`Removed ${item.foodItem.name} from cart`);
        return prev.filter((i) => i.foodItem.id !== itemId);
      }
      return prev.map((i) => 
        i.foodItem.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const clearItemFromCart = (itemId: string) => {
    const item = cart.find((i) => i.foodItem.id === itemId);
    if (item) {
      showToast(`Removed ${item.foodItem.name} completely`);
    }
    setCart((prev) => prev.filter((i) => i.foodItem.id !== itemId));
  };

  // Cart totals
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.foodItem.price * item.quantity), 0);
  }, [cart]);

  const deliveryFee = subtotal > 30 ? 0 : 3.99;
  const platformFee = 0.99;
  const total = subtotal > 0 ? subtotal + deliveryFee + platformFee : 0;

  // Handles address auto-complete typing
  const handleAddressChange = (val: string) => {
    setAddress(val);
    if (val.trim() === '') {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    } else {
      const filtered = SUGGESTED_ADDRESSES.filter((addr) => 
        addr.toLowerCase().includes(val.toLowerCase())
      );
      setAddressSuggestions(filtered);
      setShowSuggestions(true);
    }
  };

  const selectAddress = (addr: string) => {
    setAddress(addr);
    setShowSuggestions(false);
  };

  // Submit and start simulator
  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setCheckoutError('Please enter your name.');
      return;
    }
    if (!address.trim()) {
      setCheckoutError('Please enter a delivery address.');
      return;
    }
    setCheckoutError('');

    const status: OrderStatus = {
      phase: 'preparing',
      timeLeft: 30, // 30 seconds for immediate high-fidelity live simulation
      address: address,
      customerName: customerName
    };

    setOrderStatus(status);
    setSimulatedTimeLeft(30);
    setOrderLogs(['Order received! Tiger Chef is warming up the grill. 🍳']);
    showToast('🚀 Order launched! Tiger power initiated.');
  };

  // Live countdown and status updates simulation
  useEffect(() => {
    if (!orderStatus || simulatedTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setSimulatedTimeLeft((prev) => {
        const nextTime = prev - 1;
        
        // Phase transition logic
        let currentPhase: OrderPhase = 'preparing';
        if (nextTime <= 20 && nextTime > 8) {
          currentPhase = 'dispatched';
        } else if (nextTime <= 8 && nextTime > 0) {
          currentPhase = 'dispatched'; // still dispatched, approaching
        } else if (nextTime <= 0) {
          currentPhase = 'delivered';
        }

        // Update main state
        setOrderStatus((current) => {
          if (!current) return null;
          return {
            ...current,
            phase: currentPhase,
            timeLeft: nextTime
          };
        });

        // Push contextual logs at key intervals
        if (nextTime === 25) {
          setOrderLogs((logs) => [
            'Our culinary team is hand-crafting your meal with blazing speed. Fresh and blazing hot! 🔥',
            ...logs
          ]);
        }
        if (nextTime === 20) {
          setOrderLogs((logs) => [
            'Order secured! Speed Courier Saber has grabbed the heat-locked box. 🛵💨',
            ...logs
          ]);
        }
        if (nextTime === 14) {
          setOrderLogs((logs) => [
            'Saber is carving through city traffic using shortcut Tiger routes! Peak temperature maintained. 📍',
            ...logs
          ]);
        }
        if (nextTime === 8) {
          setOrderLogs((logs) => [
            'Rider is turning the corner! Get ready to taste the freshness. 🐯🏡',
            ...logs
          ]);
        }
        if (nextTime === 0) {
          setOrderLogs((logs) => [
            'Arrived! Food Tiger delivery successful. Enjoy your premium feast! 🎉🍖',
            ...logs
          ]);
          showToast('🔔 Tiger Courier has arrived!');
        }

        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderStatus, simulatedTimeLeft]);

  // Reset simulator
  const handleResetOrder = () => {
    setOrderStatus(null);
    setCart([]);
    setCustomerName('');
    setAddress('');
    setOrderLogs([]);
    setSimulatedTimeLeft(0);
  };

  return (
    <div id="food_tiger_root" className="min-h-screen bg-white font-sans text-[#1a1a1a] antialiased selection:bg-[#ff6b00] selection:text-white relative overflow-hidden flex flex-col">
      
      {/* Subtle Background Decor */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff6b00] rounded-full blur-[140px] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ff6b00] rounded-full blur-[140px] opacity-[0.03] pointer-events-none"></div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            id="toast_notification"
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#1a1a1a] px-6 py-3 shadow-xl border border-orange-500/20"
          >
            <span className="h-2 w-2 animate-ping rounded-full bg-[#ff6b00]" />
            <p className="text-sm font-medium text-white">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex flex-col sm:flex-row justify-between items-center px-6 md:px-12 py-8 border-b border-[#f0f0f0] bg-white/90 backdrop-blur-md sticky top-0 z-40 gap-4 sm:gap-0">
        <div className="flex items-center space-x-12">
          <span className="text-xl font-black tracking-tighter text-[#ff6b00] flex items-center gap-2">
            <span>🐯</span> FOOD TIGER
          </span>
          <div className="hidden md:flex space-x-8 text-sm font-medium tracking-tight opacity-60">
            <a href="#food_grid" className="hover:opacity-100 transition-opacity">Restaurants</a>
            <a href="#promo_banner" className="hover:opacity-100 transition-opacity">Offers</a>
            <a href="#checkout_panel" className="hover:opacity-100 transition-opacity font-bold text-[#ff6b00]">Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs bg-[#f5f5f5] text-[#1a1a1a] px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            12 Tiger couriers online
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-6 py-10 w-full flex-1">
        
        {/* Content Section: 2 Column Grid */}
        <div id="main_grid" className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* Left Column (8 cols): Catalog and Categories */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Promo Banner Card */}
            <section id="promo_banner" className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] text-white p-8 md:p-12 shadow-xs border border-[#2a2a2a]">
              <div className="relative z-10 max-w-md">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
                  <Flame className="h-3.5 w-3.5 text-[#ff6b00]" />
                  <span>WEEKEND BLITZ</span>
                </div>
                <h2 className="mt-5 font-display text-4xl md:text-5xl font-black leading-[1.05] tracking-tight text-white">
                  Delicious food,<br/>delivered fast.
                </h2>
                <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                  Order premium culinary masterpieces from top-tier private kitchens. Delivered within 30 minutes, or it is completely free.
                </p>
                
                <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#ff6b00]" />
                    <span>Heat-Shield Containers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#ff6b00]" />
                    <span>Artisan Quality</span>
                  </div>
                </div>
              </div>

              {/* Decorative graphic background */}
              <div className="absolute right-0 bottom-0 top-0 hidden w-1/3 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#ff6b00]/25 via-transparent to-transparent md:block" />
              <div className="absolute -right-8 -bottom-8 opacity-10 text-9xl">🐯</div>
            </section>

            {/* Filter and Search Section */}
            <section id="filter_section" className="rounded-3xl border border-[#f0f0f0] bg-white p-6 shadow-sm space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                
                {/* Custom Stylized Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter your delivery address or craving..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#f5f5f5] border-none rounded-2xl px-6 py-4 pl-12 text-sm focus:ring-2 focus:ring-[#ff6b00] outline-none text-[#1a1a1a] font-medium"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-0.5 hover:bg-slate-200"
                    >
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Counter indicator */}
                <div className="text-xs text-slate-500 font-medium sm:text-right">
                  Showing <span className="text-[#1a1a1a] font-bold">{filteredItems.length}</span> signature delicacies
                </div>
              </div>

              {/* Category Pills Slider */}
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`cursor-pointer whitespace-nowrap rounded-full px-6 py-3 text-xs font-semibold tracking-wide transition-all ${
                        isActive
                          ? 'bg-[#1a1a1a] text-white shadow-md'
                          : 'bg-[#f5f5f5] text-[#1a1a1a] opacity-80 hover:opacity-100 hover:bg-slate-200/80'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Food Grid */}
            <section id="food_grid" className="scroll-mt-24">
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-[#f0f0f0] transition-all hover:border-[#ff6b00]/30 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* Image container */}
                      <div className="relative h-48 overflow-hidden bg-[#f5f5f5] rounded-3xl m-3 mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                        />
                        
                        {/* Overlay tags */}
                        {item.popular && (
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-[#1a1a1a]">
                            Featured
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 rounded-full bg-[#1a1a1a]/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs flex items-center gap-1">
                          <Flame className="h-3 w-3 text-[#ff6b00]" />
                          <span>{item.calories} kcal</span>
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="flex flex-1 flex-col p-6 pt-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-lg font-bold text-[#1a1a1a] group-hover:text-[#ff6b00] transition-colors leading-snug">
                            {item.name}
                          </h3>
                          <span className="font-display text-lg font-extrabold text-[#1a1a1a]">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-2 text-xs text-slate-500 leading-relaxed flex-1 font-medium">
                          {item.description}
                        </p>

                        {/* Specs row */}
                        <div className="mt-5 flex items-center justify-between border-t border-[#f0f0f0] pt-4">
                          <div className="flex items-center space-x-3 text-xs opacity-60 font-medium">
                            <span className="flex items-center space-x-1">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-[#1a1a1a]">{item.rating}</span>
                            </span>
                            <span>•</span>
                            <span>{item.prepTime}</span>
                          </div>

                          <button
                            onClick={() => addToCart(item)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a1a] text-white transition-all hover:bg-[#ff6b00] cursor-pointer active:scale-95"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-[#f0f0f0] bg-white p-12 text-center">
                  <MapPinOff className="h-12 w-12 text-slate-300" />
                  <h3 className="mt-4 font-display text-lg font-bold text-slate-800">No Tiger bites found</h3>
                  <p className="mt-1 text-sm text-slate-500 max-w-sm">
                    We couldn't match any delicacies in this category with your keyword. Try expanding your search!
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 rounded-full bg-[#1a1a1a] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#ff6b00]"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </section>
          </main>

          {/* Right Column (4 cols): Interactive Checkout / Live tracker */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              
              {/* If order is submitted, show the gorgeous live tracking experience */}
              {orderStatus ? (
                <div id="live_tracker_panel" className="overflow-hidden rounded-3xl border border-[#f0f0f0] bg-white shadow-md">
                  
                  {/* Status header */}
                  <div className="bg-[#1a1a1a] px-6 py-6 text-white border-b border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#ff6b00] animate-pulse" />
                        <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff6b00]">Live Delivery Status</span>
                      </div>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-white backdrop-blur-md">
                        #2847
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-2xl font-black tracking-tight">
                      {orderStatus.phase === 'preparing' && 'Chef Crafting...'}
                      {orderStatus.phase === 'dispatched' && 'Tiger Speed Dispatch!'}
                      {orderStatus.phase === 'delivered' && 'Feast Arrived!'}
                    </h3>

                    {orderStatus.phase !== 'delivered' ? (
                      <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-300">
                        <Timer className="h-4 w-4 text-[#ff6b00]" />
                        <span>Arriving in <span className="font-mono text-sm font-black text-white">{simulatedTimeLeft} seconds</span></span>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="h-4 w-4 fill-emerald-500/20 text-emerald-400" />
                        <span>Delivered fresh in 30s flat!</span>
                      </div>
                    )}
                  </div>

                  {/* High fidelity simulation map container */}
                  <div className="relative h-44 border-b border-[#f0f0f0] bg-slate-950 p-4 overflow-hidden">
                    {/* Retro Grid Map Effect */}
                    <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

                    {/* Dotted delivery route line */}
                    <svg className="absolute inset-0 h-full w-full">
                      <path
                        d="M 50 120 Q 150 40, 280 80"
                        fill="none"
                        stroke="#2a2a2a"
                        strokeWidth="3"
                        strokeDasharray="6,6"
                      />
                      {orderStatus.phase !== 'delivered' && (
                        <motion.path
                          d="M 50 120 Q 150 40, 280 80"
                          fill="none"
                          stroke="#ff6b00"
                          strokeWidth="3"
                          strokeDasharray="6,6"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: (30 - simulatedTimeLeft) / 30 }}
                          transition={{ duration: 1, ease: "linear" }}
                        />
                      )}
                    </svg>

                    {/* Map Nodes */}
                    {/* Kitchen Node */}
                    <div className="absolute left-[38px] bottom-[38px] z-10 flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border-2 border-[#ff6b00] text-white shadow-md">
                        <ChefHat className="h-4 w-4 text-[#ff6b00]" />
                      </div>
                      <span className="mt-1 text-[8px] font-bold text-slate-500 uppercase tracking-widest">KITCHEN</span>
                    </div>

                    {/* Customer Node */}
                    <div className="absolute right-[30px] top-[40px] z-10 flex flex-col items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                        orderStatus.phase === 'delivered' 
                          ? 'bg-[#ff6b00] border-[#ff6b00] text-white shadow-lg' 
                          : 'bg-slate-900 border-slate-750 text-slate-500'
                      }`}>
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="mt-1 text-[8px] font-bold text-slate-500 uppercase tracking-widest">HOME</span>
                    </div>

                    {/* Animated Scooter/Courier icon */}
                    {orderStatus.phase !== 'delivered' && (
                      <motion.div
                        className="absolute z-20 flex h-7 w-7 items-center justify-center rounded-full bg-[#ff6b00] border border-white text-white shadow-md"
                        style={{
                          left: '50px',
                          top: '120px',
                        }}
                        animate={{
                          x: [0, 50, 115, 175, 230],
                          y: [0, -35, -55, -45, -40],
                        }}
                        transition={{
                          duration: 30,
                          ease: 'linear',
                        }}
                      >
                        <span className="text-xs">🏍️</span>
                      </motion.div>
                    )}

                    {/* Delivered Floating Celebration */}
                    {orderStatus.phase === 'delivered' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 text-center p-4 backdrop-blur-xs"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                          <ThumbsUp className="h-5 w-5 animate-bounce" />
                        </div>
                        <h4 className="text-sm font-bold text-white">Order Arrived!</h4>
                        <p className="text-[10px] text-slate-400 max-w-xs mt-0.5">Your courier Saber left the meal at your door. Enjoy!</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Live Simulation Timeline logs */}
                  <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-2xs font-extrabold uppercase tracking-widest text-slate-400">Activity Log</h4>
                      <span className="rounded bg-[#f5f5f5] px-2 py-0.5 text-[9px] font-mono font-bold text-[#1a1a1a]">Tiger Speed</span>
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-3 rounded-2xl bg-[#f5f5f5] p-4 border border-[#eee]">
                      <AnimatePresence initial={false}>
                        {orderLogs.map((log, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-2.5 text-xs"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#ff6b00] shrink-0" />
                            <p className="text-[#1a1a1a] leading-relaxed font-semibold">{log}</p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Driver details card */}
                    <div className="rounded-2xl border border-[#f0f0f0] bg-white p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#f5f5f5] border border-orange-100 flex items-center justify-center font-display text-lg font-bold">
                          🐯
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1a1a1a]">Saber the Courier</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Top Ranked Speedster</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#ff6b00] bg-orange-50 px-2.5 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-[#ff6b00] text-[#ff6b00]" />
                        <span>5.0</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <button
                      onClick={handleResetOrder}
                      className="cursor-pointer w-full rounded-2xl bg-[#1a1a1a] py-3.5 text-center text-xs font-bold text-white transition-all hover:bg-[#ff6b00] shadow-sm"
                    >
                      {orderStatus.phase === 'delivered' ? 'Order Something Else' : 'Reset Simulator'}
                    </button>
                  </div>
                </div>
              ) : (
                
                /* Main Checkout Checkout/Cart Panel */
                <div id="checkout_panel" className="rounded-3xl border border-[#f0f0f0] bg-white p-6 shadow-md scroll-mt-24">
                  <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-[#ff6b00]" />
                      <h3 className="font-display text-lg font-bold text-[#1a1a1a]">Tiger Cart</h3>
                    </div>
                    <span className="rounded-full bg-[#f5f5f5] px-3 py-1 text-xs font-bold text-[#1a1a1a]">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  </div>

                  {cart.length > 0 ? (
                    <div className="mt-4 space-y-5">
                      {/* Cart Items List */}
                      <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                        {cart.map((item) => (
                          <div key={item.foodItem.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#f5f5f5] bg-[#f5f5f5]/55 p-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={item.foodItem.image}
                                alt={item.foodItem.name}
                                referrerPolicy="no-referrer"
                                className="h-10 w-10 rounded-xl object-cover shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="truncate text-xs font-bold text-[#1a1a1a]">{item.foodItem.name}</h4>
                                <p className="text-[10px] text-slate-400 font-semibold">${item.foodItem.price.toFixed(2)} each</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <div className="flex items-center rounded-full border border-[#e0e0e0] bg-white px-1">
                                <button
                                  onClick={() => removeFromCart(item.foodItem.id)}
                                  className="p-1 hover:text-[#ff6b00] cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-1 text-xs font-bold text-[#1a1a1a]">{item.quantity}</span>
                                <button
                                  onClick={() => addToCart(item.foodItem)}
                                  className="p-1 hover:text-[#ff6b00] cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => clearItemFromCart(item.foodItem.id)}
                                className="rounded p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Form */}
                      <form onSubmit={handlePlaceOrder} className="border-t border-[#f0f0f0] pt-5 space-y-4">
                        <h4 className="text-2xs font-extrabold uppercase tracking-widest text-slate-400">Delivery Information</h4>
                        
                        {/* Name Input */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Your Name</label>
                          <div className="relative">
                            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Master Tiger"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              className="w-full rounded-2xl border-none bg-[#f5f5f5] py-3 pl-9 pr-3 text-xs font-semibold outline-none transition-all focus:ring-2 focus:ring-[#ff6b00] text-[#1a1a1a]"
                            />
                          </div>
                        </div>

                        {/* Address Input & Suggestion Box */}
                        <div className="space-y-1 relative">
                          <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Delivery Address</label>
                          <div className="relative">
                            <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              required
                              placeholder="Where should Saber fly?"
                              value={address}
                              onChange={(e) => handleAddressChange(e.target.value)}
                              onFocus={() => {
                                if (address.trim() !== '') setShowSuggestions(true);
                              }}
                              className="w-full rounded-2xl border-none bg-[#f5f5f5] py-3 pl-9 pr-3 text-xs font-semibold outline-none transition-all focus:ring-2 focus:ring-[#ff6b00] text-[#1a1a1a]"
                            />
                          </div>

                          {/* Address Suggestions Dropdown */}
                          <AnimatePresence>
                            {showSuggestions && addressSuggestions.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute left-0 right-0 z-30 mt-1 max-h-40 overflow-y-auto rounded-2xl border border-[#f0f0f0] bg-white p-1.5 shadow-lg"
                              >
                                {addressSuggestions.map((suggestion) => (
                                  <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => selectAddress(suggestion)}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs text-[#1a1a1a] hover:bg-[#f5f5f5]"
                                  >
                                    <MapPin className="h-3.5 w-3.5 text-[#ff6b00] shrink-0" />
                                    <span className="truncate font-bold">{suggestion}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Payment Mode</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('card')}
                              className={`cursor-pointer rounded-2xl border py-2.5 text-center text-xs font-bold transition-all ${
                                paymentMethod === 'card'
                                  ? 'border-[#ff6b00] bg-orange-50/50 text-[#ff6b00]'
                                  : 'border-slate-200 bg-slate-50/30 text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              Tiger Card Pay
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('cash')}
                              className={`cursor-pointer rounded-2xl border py-2.5 text-center text-xs font-bold transition-all ${
                                paymentMethod === 'cash'
                                  ? 'border-[#ff6b00] bg-orange-50/50 text-[#ff6b00]'
                                  : 'border-slate-200 bg-slate-50/30 text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              Cash on Arrival
                            </button>
                          </div>
                        </div>

                        {/* Error panel */}
                        {checkoutError && (
                          <div className="flex items-center gap-1.5 rounded-2xl bg-red-50 p-3 text-xs font-semibold text-red-600">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{checkoutError}</span>
                          </div>
                        )}

                        {/* Subtotal summary breakdown */}
                        <div className="space-y-2 bg-[#f5f5f5] p-4 rounded-2xl border border-[#eee] text-xs font-medium">
                          <div className="flex justify-between text-slate-500">
                            <span>Subtotal</span>
                            <span className="text-[#1a1a1a] font-semibold">${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>Delivery Fee</span>
                            <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${deliveryFee.toFixed(2)}`}</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>Security Packaging</span>
                            <span className="text-[#1a1a1a] font-semibold">${platformFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-200 pt-2.5 text-sm font-black text-[#1a1a1a]">
                            <span>Total due</span>
                            <span className="text-[#ff6b00] text-base">${total.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="cursor-pointer w-full rounded-2xl bg-[#ff6b00] py-4 text-center text-xs font-bold text-white transition-all hover:bg-[#e05e00] shadow-md shadow-[#ff6b00]/10 flex items-center justify-center gap-2"
                        >
                          <span>Secure Lightspeed Delivery</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* Empty Cart Screen */
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[#ff6b00] mb-3">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <h4 className="font-display text-sm font-bold text-slate-800">Your Cart is Empty</h4>
                      <p className="mt-1.5 text-xs text-slate-400 max-w-[200px] leading-relaxed font-semibold">
                        Choose some gourmet delicacies on the left to start your order.
                      </p>
                    </div>
                  )}

                </div>
              )}

              {/* Secure guarantee card */}
              <div className="rounded-3xl bg-[#1a1a1a] p-5 text-white shadow-sm flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <Compass className="h-5 w-5 animate-spin" style={{ animationDuration: '12s' }} />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Tiger Guarantee</h4>
                  <p className="text-[10px] text-slate-400 leading-normal font-semibold">Our couriers utilize active heat-insulated thermal cases to guarantee restaurant temperatures.</p>
                </div>
              </div>

            </div>
          </aside>

        </div>

      </div>

      {/* Humble Elegant Footer (Zero margin clutter or AI credit lines as strictly demanded in design guidelines) */}
      <footer className="mt-20 bg-white border-t border-[#f0f0f0] py-10 text-center text-xs text-slate-400">
        <p>© 2026 Food Tiger Delivery. All rights reserved.</p>
      </footer>
    </div>
  );
}
