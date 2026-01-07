const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: "HOMEMADE PROTEIN POWDER",
    subtitle: "Homemade Health in Every Scoop!",
    description: "Because Good Nutrition Should Not Come With Guilt.",
    detailedDescription: "Our homemade protein powder is crafted with care using natural ingredients to provide you with the best nutrition for your body. Made with love and expertise from Dr. Bidita Shah.",
    price: 225,
    pricing: [
      { size: "1 KG", price: 450, unit: "INR" },
      { size: "500 GM", price: 225, unit: "INR" }
    ],
    imageUrl: "/api/uploads/protein-powder.jpg",
    category: "Nutrition Supplements",
    idealFor: [
      "MUSCLE PRESERVATION DURING WEIGHT LOSS",
      "SARCOPENIA PREVENTION",
      "RECOVERY NUTRITION",
      "ELDERLY AND PROTEIN DEFICIENT INDIVIDUALS"
    ],
    benefits: [
      "Balanced mix of dairy protein, nuts, seeds & oats",
      "No artificial sweetener or additives",
      "Supports metabolic and functional health"
    ],
    ingredients: "Skimmed Milk Powder, Mixed Nuts (Almonds, Cashews, Walnuts, Pistachio), Seeds (Pumpkin, Sunflower, Melon), Oats.",
    stockQuantity: 100,
    isAvailable: true,
    isActive: true,
    sortOrder: 1
  },
  {
    name: "Advanced Nutrition Consultation Package",
    description: "Comprehensive 3-month nutrition consultation package with personalized meal plans, weekly check-ins, and progress tracking. Includes dietary analysis, lifestyle assessment, and ongoing support.",
    price: 4999,
    originalPrice: 5999,
    imageUrl: "/api/uploads/sample-product-1.jpg",
    category: "Consultation Packages",
    stockQuantity: 50,
    isAvailable: true,
    isActive: true,
    sortOrder: 2
  },
  {
    name: "Premium Whey Protein Isolate",
    description: "High-quality whey protein isolate with 25g protein per serving. Perfect for muscle recovery and building. Available in chocolate and vanilla flavors.",
    price: 2499,
    originalPrice: 2999,
    imageUrl: "/api/uploads/sample-product-2.jpg",
    category: "Nutrition Supplements",
    stockQuantity: 100,
    isAvailable: true,
    isActive: true,
    sortOrder: 3
  },
  {
    name: "Organic Superfood Blend",
    description: "Nutrient-dense superfood blend containing spirulina, chia seeds, goji berries, and acai powder. Boost your energy and immunity naturally.",
    price: 1299,
    originalPrice: 1599,
    imageUrl: "/api/uploads/sample-product-3.jpg",
    category: "Health Foods",
    stockQuantity: 75,
    isAvailable: true,
    isActive: true,
    sortOrder: 4
  },
  {
    name: "Sports Nutrition Bundle",
    description: "Complete sports nutrition bundle including pre-workout supplement, BCAAs, and recovery protein. Designed for athletes and fitness enthusiasts.",
    price: 3499,
    originalPrice: 4199,
    imageUrl: "/api/uploads/sample-product-4.jpg",
    category: "Nutrition Supplements",
    stockQuantity: 30,
    isAvailable: true,
    isActive: true,
    sortOrder: 5
  },
  {
    name: "Weight Management Program",
    description: "6-week personalized weight management program with meal planning, exercise guidance, and nutritional counseling. Sustainable weight loss approach.",
    price: 6999,
    originalPrice: 8499,
    imageUrl: "/api/uploads/sample-product-5.jpg",
    category: "Consultation Packages",
    stockQuantity: 20,
    isAvailable: true,
    isActive: true,
    sortOrder: 6
  },
  {
    name: "Immunity Boost Kit",
    description: "Natural immunity-boosting kit with vitamin C supplements, zinc, elderberry extract, and herbal teas. Strengthen your body's defense system.",
    price: 1899,
    originalPrice: 2299,
    imageUrl: "/api/uploads/sample-product-6.jpg",
    category: "Wellness Products",
    stockQuantity: 60,
    isAvailable: true,
    isActive: true,
    sortOrder: 7
  }
];

async function seedProducts() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pnc';

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${products.length} products successfully`);

    // Log the created products
    products.forEach(product => {
      console.log(`- ${product.name}: ₹${product.price}`);
    });

    console.log('\nSeeding completed successfully!');
    console.log('You can now view these products at /products');

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeder
seedProducts();
