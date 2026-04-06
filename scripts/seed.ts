import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, accounts, products } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// ---------------------------------------------------------------------------
// Sellers
// ---------------------------------------------------------------------------
const SELLERS = [
  {
    id: "seller-1",
    name: "TechGadgets Store",
    email: "techgadgets@qshop.dev",
    password: "password123",
    role: "seller" as const,
  },
  {
    id: "seller-2",
    name: "StyleHub Fashion",
    email: "stylehub@qshop.dev",
    password: "password123",
    role: "seller" as const,
  },
  {
    id: "seller-3",
    name: "Home & Living Co.",
    email: "homeliving@qshop.dev",
    password: "password123",
    role: "seller" as const,
  },
  {
    id: "seller-4",
    name: "PageTurner Books",
    email: "pageturner@qshop.dev",
    password: "password123",
    role: "seller" as const,
  },
  {
    id: "seller-5",
    name: "Peak Sports Gear",
    email: "peaksports@qshop.dev",
    password: "password123",
    role: "seller" as const,
  },
];

// ---------------------------------------------------------------------------
// Buyers
// ---------------------------------------------------------------------------
const BUYERS = [
  {
    id: "buyer-1",
    name: "Alice Johnson",
    email: "alice@qshop.dev",
    password: "password123",
    role: "buyer" as const,
  },
  {
    id: "buyer-2",
    name: "Bob Martinez",
    email: "bob@qshop.dev",
    password: "password123",
    role: "buyer" as const,
  },
  {
    id: "buyer-3",
    name: "Clara Wei",
    email: "clara@qshop.dev",
    password: "password123",
    role: "buyer" as const,
  },
  {
    id: "buyer-4",
    name: "David Okafor",
    email: "david@qshop.dev",
    password: "password123",
    role: "buyer" as const,
  },
];

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
const PRODUCTS = [
  // ── Electronics ──────────────────────────────────────────────────────────
  {
    sellerId: "seller-1",
    name: "Sony WH-1000XM5 Wireless Headphones",
    description:
      "Industry-leading noise cancelling headphones with up to 30 hours battery life, crystal-clear hands-free calling, and Alexa voice control.",
    price: "349.99",
    stock: 42,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-1",
    name: "Apple MacBook Pro 14-inch",
    description:
      "Supercharged by the M3 Pro chip. With a stunning Liquid Retina XDR display, all-day battery life and a thin, light design.",
    price: "1999.00",
    stock: 15,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-1",
    name: "iPhone 15 Pro Max",
    description:
      "Titanium design. A17 Pro chip. Pro camera system with 5× Telephoto. USB 3 speeds. Action button.",
    price: "1199.00",
    stock: 30,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      "https://images.unsplash.com/photo-1592950630581-03cb41342cc5?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-1",
    name: "Sony Alpha A7 III Mirrorless Camera",
    description:
      "Full-frame mirrorless camera with 24.2 MP back-illuminated CMOS sensor, 4K video recording, and 693-point phase-detection AF.",
    price: "1999.99",
    stock: 8,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764b60?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-1",
    name: "Mechanical Gaming Keyboard",
    description:
      "TKL compact layout with Cherry MX Red switches. RGB per-key backlighting. Aircraft-grade aluminum frame.",
    price: "129.99",
    stock: 60,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
      "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-1",
    name: "Samsung 65\" QLED 4K Smart TV",
    description:
      "Quantum Dot technology for a billion shades of brilliant color. Real Game Enhancer, Ambient Mode, and built-in voice assistants.",
    price: "1299.99",
    stock: 10,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=800&q=80",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-1",
    name: "Apple Watch Series 9",
    description:
      "All-new S9 SiP chip. Brighter Always-On Retina display. New double tap gesture. Advanced health sensors.",
    price: "399.99",
    stock: 55,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-1",
    name: "Logitech MX Master 3S Mouse",
    description:
      "8K DPI Any-Surface tracking. MagSpeed electromagnetic scrolling. Quiet clicks. Works on glass.",
    price: "99.99",
    stock: 75,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
      "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-1",
    name: "iPad Pro 12.9-inch M2",
    description:
      "The ultimate iPad experience with M2 chip, ProMotion XDR display, and Apple Pencil hover detection.",
    price: "1099.00",
    stock: 22,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
      "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-1",
    name: "Portable Bluetooth Speaker",
    description:
      "360° sound with deep bass. IP67 waterproof and dustproof. 24-hour battery. Built-in power bank.",
    price: "79.99",
    stock: 90,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    ],
  },

  // ── Clothing ──────────────────────────────────────────────────────────────
  {
    sellerId: "seller-2",
    name: "Classic White Oxford Shirt",
    description:
      "Premium 100% cotton Oxford shirt. Button-down collar, chest pocket, and a relaxed fit perfect for casual or smart-casual wear.",
    price: "49.99",
    stock: 120,
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-2",
    name: "Nike Air Max 270",
    description:
      "The Nike Air Max 270 features the biggest Max Air unit yet for a super-soft ride that feels as impossible as it looks.",
    price: "149.99",
    stock: 85,
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-2",
    name: "Slim-Fit Stretch Denim Jeans",
    description:
      "Made with our signature stretch fabric that moves with you all day. Mid-rise, slim fit through thigh and leg.",
    price: "79.99",
    stock: 95,
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1542219550-37153d387c27?w=800&q=80",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-2",
    name: "Patagonia Down Puffer Jacket",
    description:
      "Certified Responsible Down Standard 800-fill-power down insulation. Windproof and water-resistant shell. Packable into its own chest pocket.",
    price: "229.00",
    stock: 40,
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80",
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-2",
    name: "Linen Summer Dress",
    description:
      "Breathable 100% European linen. Relaxed fit with adjustable tie waist. Available in 6 earthy tones.",
    price: "89.00",
    stock: 70,
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-2",
    name: "Merino Wool Crewneck Sweater",
    description:
      "Luxuriously soft 100% Merino wool. Temperature-regulating, naturally odour-resistant, and machine washable.",
    price: "119.00",
    stock: 55,
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-2",
    name: "Leather Chelsea Boots",
    description:
      "Full-grain leather uppers with elastic side panels. Stacked leather heel. Leather-lined interior for all-day comfort.",
    price: "189.00",
    stock: 35,
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-2",
    name: "Structured Canvas Tote Bag",
    description:
      "Heavy-duty 16oz waxed canvas with full leather base and handles. Internal zip pocket. Fits 15\" laptop.",
    price: "69.00",
    stock: 60,
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800&q=80",
    ],
  },

  // ── Home ──────────────────────────────────────────────────────────────────
  {
    sellerId: "seller-3",
    name: "Minimal Concrete Table Lamp",
    description:
      "Handcrafted concrete base with warm Edison bulb. Matte finish. Perfect for bedside tables and reading nooks.",
    price: "69.99",
    stock: 35,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a35c6bb4b?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-3",
    name: "Indoor Monstera Deliciosa Plant",
    description:
      "Comes in a 6-inch ceramic pot. Easy-care tropical houseplant, perfect for bright indirect light.",
    price: "34.99",
    stock: 50,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-3",
    name: "Scented Soy Candle Set (3-pack)",
    description:
      "Hand-poured soy wax candles. Scents: Cedarwood & Amber, Lavender Fields, Fresh Linen. 40-hour burn time each.",
    price: "44.99",
    stock: 80,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1603905016522-b8e286b87f8e?w=800&q=80",
      "https://images.unsplash.com/photo-1602607157006-61b1e6e4ad07?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-3",
    name: "Bamboo Cutting Board Set",
    description:
      "Set of 3 eco-friendly bamboo boards with juice groove. Naturally antimicrobial. Dishwasher safe.",
    price: "39.99",
    stock: 65,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-3",
    name: "Ceramic Pour-Over Coffee Set",
    description:
      "Hand-thrown ceramic dripper and carafe. Comes with reusable stainless steel filter. Makes up to 4 cups.",
    price: "55.00",
    stock: 30,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-3",
    name: "Linen Duvet Cover Set – King",
    description:
      "100% stone-washed French linen. Naturally thermoregulating — cool in summer, warm in winter. Includes 2 pillowcases.",
    price: "159.00",
    stock: 25,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-3",
    name: "Cast Iron Dutch Oven 5.5 Qt",
    description:
      "Pre-seasoned cast iron with tight-fitting lid. Oven-safe to 500°F. Perfect for braising, soups, and no-knead bread.",
    price: "89.99",
    stock: 20,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1584990347449-39ce2c7a5f6a?w=800&q=80",
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-3",
    name: "Rattan Pendant Light Shade",
    description:
      "Handwoven natural rattan. Fits E26/E27 bulbs. Adds warm, textured lighting to any room. 40cm diameter.",
    price: "48.00",
    stock: 45,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80",
    ],
  },

  // ── Sports ────────────────────────────────────────────────────────────────
  {
    sellerId: "seller-5",
    name: "Lululemon The Mat 5mm Yoga Mat",
    description:
      "Our best-selling mat with dense 5mm cushioning for joint support. Antimicrobial additive and non-slip surface.",
    price: "98.00",
    stock: 45,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-5",
    name: "Neoprene Hex Dumbbell Set (5–25 lb)",
    description:
      "Set of 5 pairs of neoprene coated dumbbells (5, 10, 15, 20, 25 lb) with solid chrome steel handles.",
    price: "189.99",
    stock: 20,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-5",
    name: "Hydro Flask 32 oz Water Bottle",
    description:
      "TempShield insulation keeps drinks cold 24 hours, hot 12 hours. Durable 18/8 stainless steel. Lifetime warranty.",
    price: "49.95",
    stock: 110,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-5",
    name: "Adjustable Weight Bench",
    description:
      "7 back-pad positions, 3 seat positions. 600 lb capacity. Folds flat for storage. Ladder-style adjustment.",
    price: "149.99",
    stock: 18,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-5",
    name: "Running Shoes – Lightweight Mesh",
    description:
      "Ultra-lightweight mesh upper with responsive foam midsole. 8mm heel-to-toe drop. Ideal for tempo runs and races.",
    price: "129.99",
    stock: 70,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-5",
    name: "Resistance Bands Set (5 levels)",
    description:
      "Set of 5 latex-free resistance bands from 10–50 lbs. Includes carry bag, door anchor, and exercise guide.",
    price: "29.99",
    stock: 150,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-5",
    name: "Foam Roller – Deep Tissue",
    description:
      "Extra-firm EVA foam with multi-density ridges for targeted trigger-point release. 18\" length.",
    price: "34.99",
    stock: 90,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=800&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    ],
  },

  // ── Books ─────────────────────────────────────────────────────────────────
  {
    sellerId: "seller-4",
    name: "Atomic Habits by James Clear",
    description:
      "The life-changing million-copy #1 bestseller. Tiny Changes, Remarkable Results. An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
    price: "17.99",
    stock: 200,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-4",
    name: "The Design of Everyday Things",
    description:
      "Don Norman's seminal book on user-centred design. A must-read for designers, engineers, and anyone who wonders why some products frustrate us.",
    price: "19.99",
    stock: 80,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-4",
    name: "Deep Work by Cal Newport",
    description:
      "Rules for Focused Success in a Distracted World. The ability to perform deep work is becoming increasingly rare and increasingly valuable.",
    price: "16.99",
    stock: 120,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-4",
    name: "The Lean Startup by Eric Ries",
    description:
      "How constant innovation creates radically successful businesses. Build, Measure, Learn — the methodology that changed Silicon Valley.",
    price: "18.99",
    stock: 90,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=800&q=80",
      "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-4",
    name: "Sapiens: A Brief History of Humankind",
    description:
      "Yuval Noah Harari's landmark narrative of humanity's creation and evolution — a #1 international bestseller.",
    price: "15.99",
    stock: 160,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-4",
    name: "Zero to One by Peter Thiel",
    description:
      "Notes on Startups, or How to Build the Future. Every moment in business happens only once — the next Gates won't build an operating system.",
    price: "14.99",
    stock: 110,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800&q=80",
      "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-4",
    name: "Show Your Work! by Austin Kleon",
    description:
      "10 ways to share your creativity and get discovered. A must-read for creatives who want to get their work out into the world.",
    price: "12.99",
    stock: 140,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
      "https://images.unsplash.com/photo-1463320898484-cdee8141c787?w=800&q=80",
    ],
  },

  // ── Other ─────────────────────────────────────────────────────────────────
  {
    sellerId: "seller-4",
    name: "Moleskine Classic Hardcover Notebook",
    description:
      "A5 ruled notebook, 240 pages. Iconic black hardcover with elastic closure, ribbon bookmark, and expandable inner pocket.",
    price: "24.99",
    stock: 180,
    category: "Other",
    images: [
      "https://images.unsplash.com/photo-1517842536804-bf4629e46b38?w=800&q=80",
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-3",
    name: "Succulent & Cactus Gift Box (6-pack)",
    description:
      "Curated selection of 6 easy-care succulents and cacti in terracotta pots. Perfect as a desk or windowsill set.",
    price: "42.00",
    stock: 40,
    category: "Other",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&q=80",
      "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-1",
    name: "Polaroid Now I‑Type Instant Camera",
    description:
      "Autofocus with double exposure, self-timer, and flash. Compatible with i-Type and 600 film. Prints 3.1×2.4\" photos.",
    price: "109.99",
    stock: 28,
    category: "Other",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
      "https://images.unsplash.com/photo-1484721582734-db5f8e1e8eaf?w=800&q=80",
    ],
  },
  {
    sellerId: "seller-2",
    name: "Leather Cord Organiser Wallet",
    description:
      "Full-grain leather with 6 elastic loops for cables, earphones, and dongles. Fits in any pocket.",
    price: "19.99",
    stock: 100,
    category: "Other",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800&q=80",
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function upsertUser(user: {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "buyer" | "seller" | "admin";
}) {
  const existing = await db.select().from(users).where(eq(users.email, user.email));
  if (existing.length > 0) {
    console.log(`  ⏭  Already exists: ${user.email}`);
    return;
  }

  const hashedPassword = await hashPassword(user.password);

  await db.insert(users).values({
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: true,
    role: user.role,
  });

  await db.insert(accounts).values({
    id: `account-${user.id}`,
    accountId: user.id,
    providerId: "credential",
    userId: user.id,
    password: hashedPassword,
  });

  console.log(`  ✅  ${user.role.padEnd(6)} ${user.name} (${user.email})`);
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
async function seed() {
  console.log("🌱  Seeding database…\n");

  // Sellers
  console.log("── Sellers ──");
  for (const seller of SELLERS) await upsertUser(seller);

  // Buyers
  console.log("\n── Buyers ──");
  for (const buyer of BUYERS) await upsertUser(buyer);

  console.log();

  // Products
  console.log("── Products ──");
  let created = 0;
  let skipped = 0;
  for (const product of PRODUCTS) {
    const existing = await db.select().from(products).where(eq(products.name, product.name));
    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await db.insert(products).values({
      id: crypto.randomUUID(),
      sellerId: product.sellerId,
      name: product.name,
      description: product.description,
      price: product.price,
      currency: "USD",
      stock: product.stock,
      category: product.category,
      images: product.images,
      isActive: true,
    });

    console.log(`  ✅  [${product.category.padEnd(11)}] ${product.name}`);
    created++;
  }

  if (skipped > 0) console.log(`\n  ⏭  Skipped ${skipped} already-existing product(s).`);

  console.log(`\n✨  Done! Created ${created} products across ${SELLERS.length} sellers.\n`);

  console.log("  Seller logins (password: password123)");
  for (const s of SELLERS) console.log(`    ${s.email}`);
  console.log("\n  Buyer logins (password: password123)");
  for (const b of BUYERS) console.log(`    ${b.email}`);
  console.log();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
