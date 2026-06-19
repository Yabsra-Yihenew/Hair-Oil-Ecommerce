import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, User, LogOut, Package, 
  LayoutDashboard, ShoppingCart, Plus, TrendingUp, 
  CheckCircle, XCircle, Star, Droplet, Leaf, ShieldCheck,
  Mail, MapPin, Instagram, Phone, Send, Menu, X, Users
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import productImage1 from '../Image/product1.png';
import productImage2 from '../Image/product2.png';
import productImage3 from '../Image/product3.png';


// --- MOCK DATA ---
const PRODUCT_IMAGES = [productImage1, productImage2, productImage3];

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Rosemary Stimulating Hair Oil', price: 25.00, stock: 145, category: 'Growth', rating: 4.8, image: PRODUCT_IMAGES[0], desc: 'Promotes scalp health and faster growth.' },
  { id: 2, name: 'Argan Moisture Seal Blend', price: 30.00, stock: 12, category: 'Moisture', rating: 4.9, image: PRODUCT_IMAGES[1], desc: 'Locks in moisture for dry, brittle ends.' },
  { id: 3, name: 'Chebe Infused Strengthener', price: 35.00, stock: 0, category: 'Strength', rating: 4.7, image: PRODUCT_IMAGES[2], desc: 'Traditional African secret for length retention.' },
  { id: 4, name: 'Daily Shine Serum', price: 18.00, stock: 85, category: 'Styling', rating: 4.5, image: PRODUCT_IMAGES[0], desc: 'Lightweight serum for everyday luster.' },
];

const PRODUCT_CATEGORIES = ['Growth', 'Moisture', 'Strength', 'Styling'];

const MATERIAL_CATEGORIES = [
  'Packaging - Liquid Plastic',
  'Packaging - Powder',
  'Sticker',
  'Hair Oil Ingredient'
];

const INITIAL_MATERIALS = [
  { id: 1, name: 'Plastic liquid bottles', category: 'Packaging - Liquid Plastic', stock: 500, unit: 'pcs', supplier: 'Local Packaging Supplier' },
  { id: 2, name: 'Powder jars', category: 'Packaging - Powder', stock: 240, unit: 'pcs', supplier: 'Local Packaging Supplier' },
  { id: 3, name: 'Product label stickers', category: 'Sticker', stock: 1000, unit: 'pcs', supplier: 'Print Shop' },
  { id: 4, name: 'Rosemary oil', category: 'Hair Oil Ingredient', stock: 35, unit: 'liters', supplier: 'Ingredient Vendor' },
  { id: 5, name: 'Chebe powder', category: 'Hair Oil Ingredient', stock: 28, unit: 'kg', supplier: 'Ingredient Vendor' },
];

const INITIAL_ORDERS = [
  { id: 'ORD-1042', customer: 'Abeba T.', date: '2026-06-16', total: 55.00, status: 'Pending', items: 2 },
  { id: 'ORD-1041', customer: 'Sara M.', date: '2026-06-15', total: 25.00, status: 'Shipped', items: 1 },
  { id: 'ORD-1040', customer: 'Helen K.', date: '2026-06-15', total: 88.00, status: 'Delivered', items: 3 },
  { id: 'ORD-1039', customer: 'Eden Y.', date: '2026-06-14', total: 30.00, status: 'Delivered', items: 1 },
];

const SALES_DATA = [
  { name: 'Mon', sales: 420 },
  { name: 'Tue', sales: 580 },
  { name: 'Wed', sales: 390 },
  { name: 'Thu', sales: 650 },
  { name: 'Fri', sales: 810 },
  { name: 'Sat', sales: 950 },
  { name: 'Sun', sales: 1100 },
];

const USERS = {
  'admin': { id: 'u1', name: 'Miheret Z.', role: 'admin', email: 'admin' },
  'customer': { id: 'u2', name: 'Loyal Customer', role: 'customer', email: 'user' }
};

const INITIAL_STAFF = [
  { id: 1, name: 'Miheret Z.', role: 'Store Manager', email: 'miheret@miheretnaturals.com', phone: '+251 911 000 101', status: 'Active' },
  { id: 2, name: 'Sara M.', role: 'Inventory Lead', email: 'sara@miheretnaturals.com', phone: '+251 911 000 102', status: 'Active' },
  { id: 3, name: 'Helen K.', role: 'Order Fulfillment', email: 'helen@miheretnaturals.com', phone: '+251 911 000 103', status: 'On Leave' },
];


// --- REUSABLE COMPONENTS ---
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg",
    secondary: "bg-stone-200 hover:bg-stone-300 text-stone-800",
    outline: "border-2 border-primary-600 text-primary-700 hover:bg-primary-50",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ text, type }) => {
  const types = {
    success: "bg-green-100 text-green-800",
    warning: "bg-primary-100 text-primary-800",
    danger: "bg-red-100 text-red-800",
    neutral: "bg-stone-100 text-stone-800"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${types[type] || types.neutral}`}>
      {text}
    </span>
  );
};


// --- STOREFRONT COMPONENTS ---
const TESTIMONIALS = [
  {
    name: 'Hanna T.',
    location: 'Addis Ababa',
    quote: 'The rosemary oil made my scalp feel healthier, and my hair feels softer after every wash day.'
  },
  {
    name: 'Mekdes A.',
    location: 'Adama',
    quote: 'I use the Chebe strengthener before protective styling. It helps my hair stay moisturized and reduces breakage.'
  },
  {
    name: 'Selam B.',
    location: 'Bole Bulbula',
    quote: 'The oils are light, smell natural, and do not leave my hair greasy. I recommend them for daily care.'
  }
];

const TIKTOK_VIDEOS = [
  {
    id: '7598921637840309522',
    title: 'Miheret Naturals TikTok product video',
    url: 'https://www.tiktok.com/@mihertzenebe116/video/7598921637840309522?is_from_webapp=1&sender_device=pc&web_id=7560979067026998795'
  },
  {
    id: '7535742233245404472',
    title: 'Miheret Naturals TikTok hair-care video',
    url: 'https://www.tiktok.com/@mihertzenebe116/video/7535742233245404472?is_from_webapp=1&sender_device=pc&web_id=7560979067026998795'
  },
  {
    id: '7641993324164926728',
    title: 'Miheret Naturals TikTok routine video',
    url: 'https://www.tiktok.com/@mihertzenebe116/video/7641993324164926728?is_from_webapp=1&sender_device=pc&web_id=7560979067026998795'
  }
];

const Storefront = ({ products, setView, user, addToCart }) => {
  const [activeTikTokVideoId, setActiveTikTokVideoId] = useState(null);
  const recommendedProducts = useMemo(() => {
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [products]);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="px-4 mt-6">
        <div className="relative bg-stone-900 text-white overflow-hidden rounded-3xl max-w-7xl mx-auto">
          <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1600" alt="Natural hair care" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 px-8 py-24 md:py-32">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight text-primary-50">
                Nourish Your Crown with Nature's Best.
              </h1>
              <p className="text-lg md:text-xl text-stone-300 mb-8 max-w-2xl">
                Discover our handcrafted hair oils designed to stimulate growth, lock in moisture, and restore your natural shine.
              </p>
              <Button onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })} className="text-lg px-8 py-3">
                Shop Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations (Only for logged-in customers) */}
      {user && user.role === 'customer' && (
        <section className="px-4 py-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Star className="text-primary-500 fill-primary-500" />
            <h2 className="text-2xl font-serif font-bold text-stone-800">Recommended for {user.name}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedProducts.map(product => (
              <ProductCard key={`rec-${product.id}`} product={product} addToCart={addToCart} />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section id="products" className="px-4 py-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Our Collection</h2>
            <p className="text-stone-500">Pure, organic oils for every hair type.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-primary-50 py-16 px-4 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
              <Droplet size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">100% Pure Oils</h3>
            <p className="text-stone-600">No synthetic fillers or artificial fragrances. Just pure, potent plant power.</p>
          </div>
          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
              <Leaf size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Ethically Sourced</h3>
            <p className="text-stone-600">We partner directly with farmers to ensure sustainable and fair-trade practices.</p>
          </div>
          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Proven Results</h3>
            <p className="text-stone-600">Formulated based on traditional remedies backed by modern hair science.</p>
          </div>
        </div>
      </section>

      {/* TikTok Videos */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-700 mb-2">TikTok Videos</p>
          <h2 className="text-3xl font-serif font-bold text-stone-800 mb-3">See the Products in Action</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">Watch short videos from our TikTok page showing Miheret Naturals hair-care products and routines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TIKTOK_VIDEOS.map((video) => (
            <div key={video.id} className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="bg-stone-100 aspect-[9/16] max-h-[720px]">
                {activeTikTokVideoId === video.id ? (
                  <iframe
                    title={video.title}
                    src={`https://www.tiktok.com/embed/v2/${video.id}`}
                    className="w-full h-full"
                    allow="encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTikTokVideoId(video.id)}
                    className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-stone-900 to-stone-700 text-white text-center p-6 hover:from-stone-800 hover:to-stone-600 transition-colors"
                    aria-label={`Play ${video.title}`}
                  >
                    <span className="w-16 h-16 rounded-full bg-white text-stone-900 flex items-center justify-center text-2xl font-bold shadow-lg">▶</span>
                    <span className="font-semibold">Click to play TikTok video</span>
                  </button>
                )}
              </div>
              <div className="p-5">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-4 py-2 font-medium text-white hover:bg-stone-800 transition-colors"
                >
                  Open on TikTok
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-700 mb-2">Testimonials</p>
          <h2 className="text-3xl font-serif font-bold text-stone-800 mb-3">What Customers Say</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">Real feedback from customers using Miheret Naturals in their hair-care routines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.name} className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
              <div className="flex items-center gap-1 text-primary-500 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} className="fill-primary-500" />
                ))}
              </div>
              <p className="text-stone-600 mb-6">"{testimonial.quote}"</p>
              <div>
                <p className="font-bold text-stone-800">{testimonial.name}</p>
                <p className="text-sm text-stone-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- STORE PAGE WRAPPER ---
const StorePage = ({ products, setView, user, addToCart }) => {
  const [category, setCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map(p => p.category)))];
  }, [products]);

  const filtered = useMemo(() => {
    return category === 'All' ? products : products.filter(p => p.category === category);
  }, [products, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-stone-800">Shop Our Store</h2>
        <p className="text-stone-500">Browse all products, filter by category, and find your perfect oil.</p>
      </div>

      {/* Category buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${category === cat ? 'bg-primary-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid (list-style cards with description) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 p-4 flex flex-col">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-stone-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-stone-900 text-white px-4 py-2 rounded-full font-bold tracking-wide">OUT OF STOCK</span>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-stone-800 text-lg mb-1">{product.name}</h3>
              <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
                <span className="font-semibold text-primary-700">${product.price.toFixed(2)}</span>
                <span>·</span>
                <span>{product.category}</span>
                <span>·</span>
                <span>{product.rating} ★</span>
              </div>
              <p className="text-stone-600 mb-4">{product.desc}</p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button onClick={() => addToCart(product)} variant="primary" className="flex-1">Add to Cart</Button>
              <Button onClick={() => setSelectedProduct(product)} variant="outline">View</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Product detail modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-stone-800">{selectedProduct.name}</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-stone-400 hover:text-stone-600"><XCircle size={24} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-56 object-cover rounded-lg" />
              <div>
                <p className="text-stone-700 mb-3">{selectedProduct.desc}</p>
                <p className="font-semibold text-primary-700 text-lg mb-3">${selectedProduct.price.toFixed(2)}</p>
                <div className="flex items-center gap-3">
                  <Button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="flex-1">Add to Cart</Button>
                  <Button variant="secondary" onClick={() => setSelectedProduct(null)}>Close</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product, addToCart }) => (
  <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100">
    <div className="relative aspect-square overflow-hidden bg-stone-100">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {product.stock === 0 && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <span className="bg-stone-900 text-white px-4 py-2 rounded-full font-bold tracking-wide">OUT OF STOCK</span>
        </div>
      )}
      {product.stock > 0 && product.stock < 20 && (
        <div className="absolute top-3 left-3">
          <Badge text="Low Stock" type="warning" />
        </div>
      )}
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-stone-800 text-lg leading-tight">{product.name}</h3>
      </div>
      <p className="text-stone-500 text-sm mb-4 flex-grow">{product.desc}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xl font-bold text-primary-800">${product.price.toFixed(2)}</span>
        <Button 
          onClick={() => addToCart(product)} 
          disabled={product.stock === 0}
          className="rounded-full px-4"
        >
          {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  </div>
);

const PRODUCT_USAGE_GUIDES = {
  Growth: {
    steps: [
      'Part clean, dry or slightly damp hair into small sections.',
      'Apply a few drops directly to the scalp, especially thin or dry areas.',
      'Massage with fingertips for 3-5 minutes, then leave in for at least 2 hours or overnight.'
    ],
    frequency: 'Use 2-3 times per week for scalp care and growth support.'
  },
  Moisture: {
    steps: [
      'Warm a small amount between your palms.',
      'Apply from mid-length to ends after washing or before styling.',
      'Focus on dry ends and avoid over-applying near the scalp.'
    ],
    frequency: 'Use after wash day or whenever hair feels dry.'
  },
  Strength: {
    steps: [
      'Apply lightly to scalp and hair strands before protective styling.',
      'Massage gently and distribute through the ends.',
      'Cover hair for 30-60 minutes before washing, or use a small amount as a leave-in.'
    ],
    frequency: 'Use weekly for length retention and breakage reduction.'
  },
  Styling: {
    steps: [
      'Use 1-3 drops on finished styles.',
      'Smooth over flyaways, edges, or dry ends.',
      'Add more only if needed to avoid weighing hair down.'
    ],
    frequency: 'Use daily or as needed for shine.'
  }
};

const getUsageGuide = (category) => PRODUCT_USAGE_GUIDES[category] || {
  steps: [
    'Start with a small amount of product.',
    'Apply evenly to scalp or hair strands based on your hair need.',
    'Massage or smooth through hair and style as desired.'
  ],
  frequency: 'Use as needed based on your hair type and routine.'
};

const buildYouTubeSearchUrl = (productName) => (
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${productName} hair oil how to use`)}`
);

const HowToUsePage = ({ products }) => (
  <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in">
    <div className="mb-10 max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary-700 mb-2">Product Guide</p>
      <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">How to Use Our Hair Oils</h2>
      <p className="text-stone-600 text-lg">
        Use these guides to apply each product correctly. Start with a small amount, observe how your hair responds, and adjust based on your scalp and hair needs.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {products.map((product) => {
        const guide = getUsageGuide(product.category);

        return (
          <article key={`usage-${product.id}`} className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="bg-stone-100 min-h-72">
                <img src={product.image} alt={`${product.name} product`} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col">
                <div className="mb-4">
                  <span className="inline-flex px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-3">
                    {product.category}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-stone-800">{product.name}</h3>
                  <p className="text-stone-500 mt-2">{product.desc}</p>
                </div>

                <div className="mb-5">
                  <h4 className="font-semibold text-stone-800 mb-2">Application Steps</h4>
                  <ol className="space-y-2 text-stone-600 list-decimal list-inside">
                    {guide.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>

                <p className="text-sm text-stone-500 mb-5">
                  <span className="font-semibold text-stone-700">Recommended use:</span> {guide.frequency}
                </p>

                <a
                  href={buildYouTubeSearchUrl(product.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  </div>
);


// --- ADMIN COMPONENTS ---
const AdminDashboard = ({ salesData, orders, products }) => {
  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const lowStockProducts = products.filter(p => p.stock < 15).length;

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold text-stone-800">Business Overview</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-500 font-medium mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-stone-800">${totalSales.toFixed(2)}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-xl text-green-700">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 flex items-center gap-1"><TrendingUp size={14}/> +12% from last week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-500 font-medium mb-1">Recent Orders</p>
              <h3 className="text-3xl font-bold text-stone-800">{totalOrders}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl text-blue-700">
              <ShoppingBag size={24} />
            </div>
          </div>
          <p className="text-sm text-stone-500 mt-4 flex items-center gap-1">Needs fulfillment: {orders.filter(o => o.status === 'Pending').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-500 font-medium mb-1">Low Stock Alerts</p>
              <h3 className="text-3xl font-bold text-stone-800">{lowStockProducts}</h3>
            </div>
            <div className="bg-primary-100 p-3 rounded-xl text-primary-700">
              <Package size={24} />
            </div>
          </div>
          <p className="text-sm text-primary-600 mt-4 flex items-center gap-1">Action required</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <h3 className="text-lg font-bold text-stone-800 mb-6">Daily Sales (This Week)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <RechartsTooltip cursor={{stroke: '#f59e0b', strokeWidth: 2}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                <Line type="monotone" dataKey="sales" stroke="#b45309" strokeWidth={3} dot={{r: 4, fill: '#b45309'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <h3 className="text-lg font-bold text-stone-800 mb-6">Top Selling Categories</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Growth Oils', value: 400 },
                { name: 'Moisturizers', value: 300 },
                { name: 'Serums', value: 200 },
                { name: 'Tools', value: 100 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: '#fef3c7'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                <Bar dataKey="value" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminInventory = ({ products, setProducts, materials, setMaterials }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '', desc: '' });
  const [newMaterial, setNewMaterial] = useState({ name: '', category: '', stock: '', unit: '', supplier: '' });

  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
      category: newProduct.category || 'General',
      desc: newProduct.desc,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400'
    };
    setProducts([...products, productToAdd]);
    setShowAddModal(false);
    setNewProduct({ name: '', price: '', stock: '', category: '', desc: '' });
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    setMaterials([
      ...materials,
      {
        id: Date.now(),
        name: newMaterial.name,
        category: newMaterial.category || MATERIAL_CATEGORIES[0],
        stock: parseInt(newMaterial.stock) || 0,
        unit: newMaterial.unit || 'units',
        supplier: newMaterial.supplier || 'Not assigned',
      },
    ]);
    setShowAddMaterialModal(false);
    setNewMaterial({ name: '', category: '', stock: '', unit: '', supplier: '' });
  };

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Inventory Management</h2>
          <p className="text-stone-500">Separate finished products from packaging, stickers, and ingredients.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setShowAddMaterialModal(true)} variant="outline"><Plus size={20} /> Add Material</Button>
          <Button onClick={() => setShowAddModal(true)}><Plus size={20} /> Add Product</Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-stone-800">Product Inventory</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 border-b border-stone-200">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock Level</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-medium text-stone-800">{product.name}</span>
                  </td>
                  <td className="p-4 text-stone-600">{product.category}</td>
                  <td className="p-4 text-stone-800 font-medium">${product.price.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-800">{product.stock} units</span>
                      {product.stock < 20 && product.stock > 0 && <Badge text="Low" type="warning" />}
                    </div>
                  </td>
                  <td className="p-4">
                    {product.stock > 0 ? <Badge text="In Stock" type="success" /> : <Badge text="Out of Stock" type="danger" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-stone-800">Materials Inventory</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 border-b border-stone-200">
                <th className="p-4 font-semibold">Material</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Stock Level</th>
                <th className="p-4 font-semibold">Supplier</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {materials.map(material => (
                <tr key={material.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="p-4 font-medium text-stone-800">{material.name}</td>
                  <td className="p-4 text-stone-600">{material.category}</td>
                  <td className="p-4 text-stone-800 font-medium">{material.stock} {material.unit}</td>
                  <td className="p-4 text-stone-600">{material.supplier}</td>
                  <td className="p-4">
                    {material.stock === 0 ? <Badge text="Out of Stock" type="danger" /> : material.stock < 30 ? <Badge text="Low" type="warning" /> : <Badge text="In Stock" type="success" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-stone-800">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Product Name</label>
                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Price ($)</label>
                  <input required type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Initial Stock</label>
                  <input required type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="">Select category...</option>
                  {PRODUCT_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea rows="3" value={newProduct.desc} onChange={e => setNewProduct({...newProduct, desc: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"></textarea>
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save Product</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddMaterialModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-stone-800">Add New Material</h3>
              <button onClick={() => setShowAddMaterialModal(false)} className="text-stone-400 hover:text-stone-600">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Material Name</label>
                <input required type="text" value={newMaterial.name} onChange={e => setNewMaterial({...newMaterial, name: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                <select value={newMaterial.category} onChange={e => setNewMaterial({...newMaterial, category: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="">Select category...</option>
                  {MATERIAL_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Stock</label>
                  <input required type="number" value={newMaterial.stock} onChange={e => setNewMaterial({...newMaterial, stock: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Unit</label>
                  <input required type="text" placeholder="pcs, kg, liters" value={newMaterial.unit} onChange={e => setNewMaterial({...newMaterial, unit: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Supplier</label>
                <input type="text" value={newMaterial.supplier} onChange={e => setNewMaterial({...newMaterial, supplier: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddMaterialModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save Material</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminStaff = ({ staff, setStaff }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', email: '', phone: '', status: 'Active' });

  const handleAddStaff = (e) => {
    e.preventDefault();
    setStaff([
      ...staff,
      {
        id: Date.now(),
        name: newStaff.name,
        role: newStaff.role,
        email: newStaff.email,
        phone: newStaff.phone,
        status: newStaff.status,
      },
    ]);
    setShowAddModal(false);
    setNewStaff({ name: '', role: '', email: '', phone: '', status: 'Active' });
  };

  const updateStaffStatus = (id, status) => {
    setStaff(staff.map(member => member.id === id ? { ...member, status } : member));
  };

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Staff Management</h2>
          <p className="text-stone-500">Manage store team roles, contact details, and availability.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}><Plus size={20} /> Add Staff</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <p className="text-stone-500 font-medium mb-1">Total Staff</p>
          <h3 className="text-3xl font-bold text-stone-800">{staff.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <p className="text-stone-500 font-medium mb-1">Active Staff</p>
          <h3 className="text-3xl font-bold text-stone-800">{staff.filter(member => member.status === 'Active').length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <p className="text-stone-500 font-medium mb-1">On Leave</p>
          <h3 className="text-3xl font-bold text-stone-800">{staff.filter(member => member.status === 'On Leave').length}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 text-stone-500 border-b border-stone-200">
              <th className="p-4 font-semibold">Staff Member</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Phone</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(member => (
              <tr key={member.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td className="p-4 font-medium text-stone-800">{member.name}</td>
                <td className="p-4 text-stone-600">{member.role}</td>
                <td className="p-4 text-stone-600">{member.email}</td>
                <td className="p-4 text-stone-600">{member.phone}</td>
                <td className="p-4">
                  <select
                    className="text-sm border border-stone-300 rounded-lg p-1.5 outline-none focus:ring-2 focus:ring-primary-500"
                    value={member.status}
                    onChange={(e) => updateStaffStatus(member.id, e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-stone-800">Add Staff Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                <input required value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Role</label>
                <input required value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input required type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                <input required value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save Staff</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminStock = ({ products, setProducts }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '', desc: '' });
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockCount = products.filter(product => product.stock > 0 && product.stock < 20).length;
  const outOfStockCount = products.filter(product => product.stock === 0).length;

  const adjustStock = (id, amount) => {
    setProducts(products.map(product => (
      product.id === id ? { ...product, stock: Math.max(0, product.stock + amount) } : product
    )));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
      category: newProduct.category || 'General',
      desc: newProduct.desc,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400'
    };
    setProducts([...products, productToAdd]);
    setShowAddModal(false);
    setNewProduct({ name: '', price: '', stock: '', category: '', desc: '' });
  };

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Stock Management</h2>
          <p className="text-stone-500">Track inventory levels and make quick stock adjustments.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}><Plus size={20} /> Add Product</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <p className="text-stone-500 font-medium mb-1">Total Units</p>
          <h3 className="text-3xl font-bold text-stone-800">{totalUnits}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <p className="text-stone-500 font-medium mb-1">Low Stock Items</p>
          <h3 className="text-3xl font-bold text-stone-800">{lowStockCount}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <p className="text-stone-500 font-medium mb-1">Out of Stock</p>
          <h3 className="text-3xl font-bold text-stone-800">{outOfStockCount}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 text-stone-500 border-b border-stone-200">
              <th className="p-4 font-semibold">Product</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Current Stock</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Quick Adjust</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                  <span className="font-medium text-stone-800">{product.name}</span>
                </td>
                <td className="p-4 text-stone-600">{product.category}</td>
                <td className="p-4 font-medium text-stone-800">{product.stock} units</td>
                <td className="p-4">
                  {product.stock === 0 ? <Badge text="Out of Stock" type="danger" /> : product.stock < 20 ? <Badge text="Low" type="warning" /> : <Badge text="Healthy" type="success" />}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" className="px-3" onClick={() => adjustStock(product.id, -1)}>-1</Button>
                    <Button variant="secondary" className="px-3" onClick={() => adjustStock(product.id, 1)}>+1</Button>
                    <Button className="px-3" onClick={() => adjustStock(product.id, 10)}>+10</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-stone-800">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Product Name</label>
                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Price ($)</label>
                  <input required type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Initial Stock</label>
                  <input required type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="">Select category...</option>
                  {PRODUCT_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea rows="3" value={newProduct.desc} onChange={e => setNewProduct({...newProduct, desc: e.target.value})} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"></textarea>
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save Product</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminOrders = ({ orders, setOrders }) => {
  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="animate-in fade-in space-y-6">
      <h2 className="text-2xl font-bold text-stone-800">Order Management</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 text-stone-500 border-b border-stone-200">
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td className="p-4 font-medium text-stone-800">{order.id}</td>
                <td className="p-4 text-stone-600">{order.customer}</td>
                <td className="p-4 text-stone-500">{order.date}</td>
                <td className="p-4 font-medium">${order.total.toFixed(2)}</td>
                <td className="p-4">
                  <Badge 
                    text={order.status} 
                    type={order.status === 'Delivered' ? 'success' : order.status === 'Shipped' ? 'warning' : 'neutral'} 
                  />
                </td>
                <td className="p-4">
                  <select 
                    className="text-sm border border-stone-300 rounded-lg p-1.5 outline-none focus:ring-2 focus:ring-primary-500"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// --- CONTACT + FOOTER ---
const ContactSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setName(''); setEmail(''); setMessage('');
    // lightweight feedback
    alert('Thanks! Your message has been sent.');
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-serif font-bold text-stone-800 mb-4">Get In Touch</h3>
            <p className="text-stone-600 mb-6">Have a question about our products or orders? Send us a message and we'll get back to you shortly.</p>
            <div className="space-y-3 text-stone-600">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0" />
                <span>አ.አ-22 ፀዲ ፕላዛ 1ኛ /ቦሌ ቡልቡላ</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0" />
                <span>አዳማ-ፓን አፍሪክ አካባቢ</span>
              </div>
              <div className="flex items-center gap-3">
                <Send />
                <a href="https://t.me/Abigailhairfoods" target="_blank" rel="noreferrer" className="hover:text-primary-700 transition-colors">Telegram @Abigailhairfoods</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone />
                <a href="tel:0993934070" className="hover:text-primary-700 transition-colors">0993934070</a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-stone-50 p-6 rounded-2xl">
            <div className="grid grid-cols-1 gap-4">
              <input required placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-lg border border-stone-200 outline-none" />
              <input required type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-lg border border-stone-200 outline-none" />
              <textarea required rows={5} placeholder="How can we help?" value={message} onChange={e => setMessage(e.target.value)} className="w-full p-3 rounded-lg border border-stone-200 outline-none"></textarea>
              <div className="text-right">
                <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg">Send Message</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const TikTokIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M14 3v10.5a4.5 4.5 0 1 1-4.5-4.5" />
    <path d="M14 3c.7 3.1 2.8 5.1 6 5.5" />
  </svg>
);

const Footer = () => (
  <footer className="bg-stone-900 text-stone-200 py-8 mt-12">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-serif font-bold">M</div>
            <span className="font-serif font-bold text-xl text-white">Miheret Naturals</span>
          </div>
          <p className="text-stone-400 max-w-sm">Handcrafted hair oils made with ethically sourced ingredients. Nourish your hair the natural way.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="font-semibold text-white mb-2">Shop</h4>
            <ul className="space-y-1 text-stone-400">
              <li>All Products</li>
              <li>Best Sellers</li>
              <li>New Arrivals</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Connect</h4>
            <div className="flex items-center gap-3 text-stone-400">
              <a href="#" aria-label="TikTok" className="hover:text-white transition-colors"><TikTokIcon className="w-6 h-6" /></a>
              <a href="#" aria-label="Instagram" className="hover:text-white transition-colors"><Instagram /></a>
              <a href="mailto:info@miheretnaturals.com" aria-label="Email" className="hover:text-white transition-colors"><Mail /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Contact</h4>
            <ul className="space-y-2 text-stone-400">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <span>አ.አ-22 ፀዲ ፕላዛ 1ኛ /ቦሌ ቡልቡላ</span>
              </li>
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <span>አዳማ-ፓን አፍሪክ አካባቢ</span>
              </li>
              <li className="flex gap-2">
                <Send className="w-4 h-4 mt-1 shrink-0" />
                <a href="https://t.me/Abigailhairfoods" className="hover:text-white transition-colors">Telegram @Abigailhairfoods</a>
              </li>
              <li className="flex gap-2">
                <Phone className="w-4 h-4 mt-1 shrink-0" />
                <a href="tel:0993934070" className="hover:text-white transition-colors">0993934070</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800 mt-6 pt-6 text-stone-500 text-sm text-center">
        © {new Date().getFullYear()} Miheret Naturals — All rights reserved.
      </div>
    </div>
  </footer>
);


// --- MAIN APPLICATION ---
export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [cart, setCart] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync initial view from URL and enable back/forward navigation
  useEffect(() => {
    const mapPathToView = (p) => {
      if (p.startsWith('/admin')) return 'admin-dashboard';
      if (p === '/cart') return 'cart';
      if (p === '/login') return 'login';
      if (p === '/store') return 'store';
      if (p === '/how-to-use') return 'how-to-use';
      if (p === '/') return 'home';
      return 'home';
    };

    const handlePop = () => {
      setView(mapPathToView(window.location.pathname));
    };

    // set initial view based on current path
    setView(mapPathToView(window.location.pathname));
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // Push URL when view changes
  useEffect(() => {
    setIsMobileMenuOpen(false);

    const mapViewToPath = (v) => {
      if (v === 'cart') return '/cart';
      if (v === 'login') return '/login';
      if (v.startsWith('admin')) return '/admin';
      if (v === 'store') return '/store';
      if (v === 'how-to-use') return '/how-to-use';
      return '/';
    };
    const newPath = mapViewToPath(view);
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  }, [view]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin') {
      setUser(USERS['admin']);
      setView('admin-dashboard');
      showToast('Welcome back, Admin!');
    } else {
      setUser(USERS['customer']);
      setView('store');
      showToast('Successfully logged in!');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('store');
    setCart([]);
    showToast('Logged out successfully.');
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    showToast(`${product.name} added to cart!`);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const checkout = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      customer: user ? user.name : 'Guest User',
      date: new Date().toISOString().split('T')[0],
      total: total,
      status: 'Pending',
      items: cart.length
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setView('store');
    showToast('Order placed successfully!');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-primary-200">
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-stone-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle size={20} className="text-green-400" />
          <p className="font-medium">{toastMessage}</p>
        </div>
      )}

      <nav className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="min-w-0 flex items-center gap-2 cursor-pointer" onClick={() => setView(user?.role === 'admin' ? 'admin-dashboard' : 'home')}>
              <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-primary-500 to-primary-800 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-md">
                M
              </div>
              <span className="truncate font-serif font-bold text-xl sm:text-2xl tracking-tight text-stone-800">
                Miheret Naturals
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {(!user || user.role === 'customer') && (
                <>
                  <button onClick={() => setView('home')} className={`font-medium transition-colors ${view === 'home' ? 'text-primary-700' : 'text-stone-500 hover:text-stone-800'}`}>Home</button>
                  <button onClick={() => setView('store')} className={`font-medium transition-colors ${view === 'store' ? 'text-primary-700' : 'text-stone-500 hover:text-stone-800'}`}>Store</button>
                  <button onClick={() => setView('how-to-use')} className={`font-medium transition-colors ${view === 'how-to-use' ? 'text-primary-700' : 'text-stone-500 hover:text-stone-800'}`}>How To Use</button>
                  <div className="relative cursor-pointer" onClick={() => setView('cart')}>
                    <ShoppingCart className="text-stone-600 hover:text-primary-700 transition-colors" />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </div>
                </>
              )}

              {user ? (
                <div className="flex items-center gap-4 border-l border-stone-200 pl-6">
                  <span className="text-sm font-medium text-stone-600 flex items-center gap-2">
                    <User size={16}/> {user.name}
                  </span>
                  <button onClick={handleLogout} className="text-stone-400 hover:text-red-500 transition-colors p-2" title="Log out">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Button onClick={() => setView('login')} variant="outline" className="ml-4">
                  Sign In
                </Button>
              )}
            </div>

            <div className="md:hidden flex flex-shrink-0 items-center gap-3">
              {(!user || user.role === 'customer') && (
                <button className="relative p-2 text-stone-600" onClick={() => setView('cart')} aria-label="Open cart">
                  <ShoppingCart />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </button>
              )}
              <button
                className="p-2 text-stone-700"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-stone-200 py-4 space-y-3">
              {user?.role === 'admin' ? (
                <>
                  <button onClick={() => setView('admin-dashboard')} className={`block w-full text-left px-2 py-2 font-medium rounded-lg ${view === 'admin-dashboard' ? 'text-primary-700 bg-primary-50' : 'text-stone-600'}`}>Dashboard</button>
                  <button onClick={() => setView('admin-inventory')} className={`block w-full text-left px-2 py-2 font-medium rounded-lg ${view === 'admin-inventory' ? 'text-primary-700 bg-primary-50' : 'text-stone-600'}`}>Inventory</button>
                  <button onClick={() => setView('admin-stock')} className={`block w-full text-left px-2 py-2 font-medium rounded-lg ${view === 'admin-stock' ? 'text-primary-700 bg-primary-50' : 'text-stone-600'}`}>Stock</button>
                  <button onClick={() => setView('admin-staff')} className={`block w-full text-left px-2 py-2 font-medium rounded-lg ${view === 'admin-staff' ? 'text-primary-700 bg-primary-50' : 'text-stone-600'}`}>Staff</button>
                  <button onClick={() => setView('admin-orders')} className={`block w-full text-left px-2 py-2 font-medium rounded-lg ${view === 'admin-orders' ? 'text-primary-700 bg-primary-50' : 'text-stone-600'}`}>Orders</button>
                </>
              ) : (
                <>
                  <button onClick={() => setView('home')} className={`block w-full text-left px-2 py-2 font-medium rounded-lg ${view === 'home' ? 'text-primary-700 bg-primary-50' : 'text-stone-600'}`}>Home</button>
                  <button onClick={() => setView('store')} className={`block w-full text-left px-2 py-2 font-medium rounded-lg ${view === 'store' ? 'text-primary-700 bg-primary-50' : 'text-stone-600'}`}>Store</button>
                  <button onClick={() => setView('how-to-use')} className={`block w-full text-left px-2 py-2 font-medium rounded-lg ${view === 'how-to-use' ? 'text-primary-700 bg-primary-50' : 'text-stone-600'}`}>How To Use</button>
                  <button onClick={() => setView('cart')} className={`block w-full text-left px-2 py-2 font-medium rounded-lg ${view === 'cart' ? 'text-primary-700 bg-primary-50' : 'text-stone-600'}`}>Cart</button>
                </>
              )}

              <div className="border-t border-stone-200 pt-3">
                {user ? (
                  <div className="flex items-center justify-between gap-3 px-2">
                    <span className="text-sm font-medium text-stone-600 flex items-center gap-2">
                      <User size={16}/> {user.name}
                    </span>
                    <button onClick={handleLogout} className="text-stone-400 hover:text-red-500 transition-colors p-2" title="Log out">
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <Button onClick={() => setView('login')} variant="outline" className="w-full">
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="pb-20">
        {view === 'login' && (
          <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-stone-100 animate-in slide-in-from-bottom-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Welcome Back</h2>
              <p className="text-stone-500">Sign in to your account.</p>
            </div>
            
            <div className="bg-primary-50 p-4 rounded-xl mb-6 text-sm text-primary-800 border border-primary-200">
              <strong>Demo Hint:</strong><br/>
              Type <code>admin</code> for Employee/Admin Dashboard.<br/>
              Type <code>user</code> for Customer account.
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Username / Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-stone-400" size={20} />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="Enter username"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full py-3 text-lg mt-6">
                Sign In
              </Button>
              <div className="flex items-center gap-3 my-2">
                <div className="flex-grow h-px bg-stone-200" />
                <div className="text-stone-400 text-sm">or</div>
                <div className="flex-grow h-px bg-stone-200" />
              </div>
              <button
                type="button"
                onClick={() => {
                  // simulate Google sign-in (replace with real OAuth flow as needed)
                  setUser(USERS['customer']);
                  setView('store');
                  showToast('Signed in with Google');
                }}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-stone-200 bg-white hover:shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.35 11.1h-9.17v2.92h5.26c-.23 1.45-1.4 3.02-5.26 3.02-3.16 0-5.74-2.62-5.74-5.85s2.58-5.85 5.74-5.85c1.8 0 3.01.78 3.7 1.45l2.52-2.43C17.27 3.2 15.34 2 12.92 2 7.96 2 4 5.97 4 10.92s3.96 8.92 8.92 8.92c5.14 0 8.56-3.6 8.56-8.64 0-.58-.06-1.02-.13-1.1z" fill="#4285F4"/>
                </svg>
                <span className="text-sm">Sign in with Google</span>
              </button>
            </form>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-4xl mx-auto mt-12 px-4 animate-in fade-in">
            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-8 flex items-center gap-3">
              <ShoppingBag className="text-primary-700" /> Your Shopping Bag
            </h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart size={40} className="text-stone-400" />
                </div>
                <h3 className="text-xl font-medium text-stone-800 mb-2">Your bag is empty</h3>
                <p className="text-stone-500 mb-8">Looks like you haven't added any natural oils yet.</p>
                <Button onClick={() => setView('store')}>Start Shopping</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-4 bg-white p-4 rounded-2xl border border-stone-100 shadow-sm items-center">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                      <div className="flex-grow">
                        <h4 className="font-bold text-stone-800">{item.name}</h4>
                        <p className="text-sm text-stone-500">{item.category}</p>
                      </div>
                      <div className="font-bold text-lg">${item.price.toFixed(2)}</div>
                      <button onClick={() => removeFromCart(index)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <XCircle size={20} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm h-fit">
                  <h3 className="text-xl font-bold mb-4 border-b border-stone-100 pb-4">Order Summary</h3>
                  <div className="flex justify-between mb-3 text-stone-600">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-stone-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-stone-800 border-t border-stone-100 pt-4 mb-6">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <Button onClick={checkout} className="w-full py-3">
                    Checkout Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {user?.role === 'admin' && view.startsWith('admin') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden sticky top-28">
                <div className="p-6 border-b border-stone-100 bg-primary-50/50">
                  <p className="text-sm font-medium text-primary-800 uppercase tracking-wider mb-1">Workspace</p>
                  <p className="font-bold text-stone-800 flex items-center gap-2"><ShieldCheck size={18} className="text-green-600"/> Admin Portal</p>
                </div>
                <div className="p-3 space-y-1">
                  <button 
                    onClick={() => setView('admin-dashboard')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'admin-dashboard' ? 'bg-primary-600 text-white shadow-md' : 'text-stone-600 hover:bg-stone-50'}`}
                  >
                    <LayoutDashboard size={20} /> Dashboard
                  </button>
                  <button 
                    onClick={() => setView('admin-inventory')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'admin-inventory' ? 'bg-primary-600 text-white shadow-md' : 'text-stone-600 hover:bg-stone-50'}`}
                  >
                    <Package size={20} /> Inventory
                  </button>
                  <button 
                    onClick={() => setView('admin-stock')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'admin-stock' ? 'bg-primary-600 text-white shadow-md' : 'text-stone-600 hover:bg-stone-50'}`}
                  >
                    <Package size={20} /> Stock
                  </button>
                  <button 
                    onClick={() => setView('admin-staff')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'admin-staff' ? 'bg-primary-600 text-white shadow-md' : 'text-stone-600 hover:bg-stone-50'}`}
                  >
                    <Users size={20} /> Staff Management
                  </button>
                  <button 
                    onClick={() => setView('admin-orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'admin-orders' ? 'bg-primary-600 text-white shadow-md' : 'text-stone-600 hover:bg-stone-50'}`}
                  >
                    <ShoppingBag size={20} /> Order Management
                    {orders.filter(o => o.status === 'Pending').length > 0 && (
                      <span className="ml-auto bg-primary-100 text-primary-800 text-xs py-0.5 px-2 rounded-full font-bold">
                        {orders.filter(o => o.status === 'Pending').length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-grow">
              {view === 'admin-dashboard' && <AdminDashboard salesData={SALES_DATA} orders={orders} products={products} />}
              {view === 'admin-inventory' && <AdminInventory products={products} setProducts={setProducts} materials={materials} setMaterials={setMaterials} />}
              {view === 'admin-stock' && <AdminStock products={products} setProducts={setProducts} />}
              {view === 'admin-staff' && <AdminStaff staff={staff} setStaff={setStaff} />}
              {view === 'admin-orders' && <AdminOrders orders={orders} setOrders={setOrders} />}
            </div>
          </div>
        )}

        {view === 'home' && (
          <Storefront products={products} setView={setView} user={user} addToCart={addToCart} />
        )}

        {view === 'store' && (
          <StorePage products={products} setView={setView} user={user} addToCart={addToCart} />
        )}

        {view === 'how-to-use' && (
          <HowToUsePage products={products} />
        )}

        {/* Contact section shown on customer-facing pages only */}
        {view !== 'login' && view !== 'cart' && !view.startsWith('admin') && <ContactSection />}
      </main>

      {/* Footer (hidden on login) */}
      {view !== 'login' && view !== 'cart' && <Footer />}
    </div>
  );
}

