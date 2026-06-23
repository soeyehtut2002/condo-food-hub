const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const sequelize = require('../config/db');
const { User, Vendor, Product, Category, Order, OrderItem, CartItem } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log('✅ Tables recreated');

    const hashedPassword = await bcrypt.hash('password123', 12);

    // ── Create Users ────────────────────────────────────────
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@condofoodhub.com',
      password: hashedPassword,
      role: 'admin',
      phone: '0800000000',
      status: 'active',
    });

    const resident1 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@resident.com',
      password: hashedPassword,
      role: 'resident',
      room_number: 'A-1201',
      phone: '0812345678',
      status: 'active',
    });

    const resident2 = await User.create({
      name: 'Mike Chen',
      email: 'mike@resident.com',
      password: hashedPassword,
      role: 'resident',
      room_number: 'B-805',
      phone: '0823456789',
      status: 'active',
    });

    const resident3 = await User.create({
      name: 'Lisa Park',
      email: 'lisa@resident.com',
      password: hashedPassword,
      role: 'resident',
      room_number: 'C-302',
      phone: '0834567890',
      status: 'active',
    });

    const vendorUser1 = await User.create({
      name: 'Chef Arun',
      email: 'arun@vendor.com',
      password: hashedPassword,
      role: 'vendor',
      phone: '0845678901',
      status: 'active',
    });

    const vendorUser2 = await User.create({
      name: 'Mama Noi',
      email: 'noi@vendor.com',
      password: hashedPassword,
      role: 'vendor',
      phone: '0856789012',
      status: 'active',
    });

    const vendorUser3 = await User.create({
      name: 'David Kim',
      email: 'david@vendor.com',
      password: hashedPassword,
      role: 'vendor',
      phone: '0867890123',
      status: 'active',
    });

    const vendorUser4 = await User.create({
      name: 'Suki Fresh',
      email: 'suki@vendor.com',
      password: hashedPassword,
      role: 'vendor',
      phone: '0878901234',
      status: 'active',
    });

    const vendorUser5 = await User.create({
      name: 'Bella Brew',
      email: 'bella@vendor.com',
      password: hashedPassword,
      role: 'vendor',
      phone: '0889012345',
      status: 'active',
    });

    console.log('✅ Users created');

    // ── Create Vendors ──────────────────────────────────────
    const vendor1 = await Vendor.create({
      user_id: vendorUser1.id,
      shop_name: "Arun's Kitchen",
      description: 'Authentic Thai cuisine made fresh daily with local ingredients. Specializing in pad thai, green curry, and tom yum.',
      category: 'food',
      is_approved: true,
      is_open: true,
      rating: 4.8,
      total_orders: 156,
    });

    const vendor2 = await Vendor.create({
      user_id: vendorUser2.id,
      shop_name: "Mama Noi's Home Cooking",
      description: 'Homestyle comfort food just like mom makes. Rice dishes, stir-fries, and traditional soups.',
      category: 'food',
      is_approved: true,
      is_open: true,
      rating: 4.6,
      total_orders: 203,
    });

    const vendor3 = await Vendor.create({
      user_id: vendorUser3.id,
      shop_name: "K-Bite Korean BBQ",
      description: 'Korean BBQ bowls, bibimbap, and Korean street food. Fast delivery right to your door!',
      category: 'food',
      is_approved: true,
      is_open: true,
      rating: 4.7,
      total_orders: 98,
    });

    const vendor4 = await Vendor.create({
      user_id: vendorUser4.id,
      shop_name: 'Fresh & Fit Juicery',
      description: 'Cold-pressed juices, smoothie bowls, and healthy snacks. Start your day right!',
      category: 'drink',
      is_approved: true,
      is_open: true,
      rating: 4.9,
      total_orders: 312,
    });

    const vendor5 = await Vendor.create({
      user_id: vendorUser5.id,
      shop_name: "Bella's Coffee House",
      description: 'Specialty coffee, artisan teas, and freshly baked pastries. Your neighborhood café.',
      category: 'drink',
      is_approved: false,
      is_open: true,
      rating: 0,
      total_orders: 0,
    });

    console.log('✅ Vendors created');

    // ── Create Categories ───────────────────────────────────
    const categories = await Category.bulkCreate([
      { name: 'Thai Food', icon: '🍜', type: 'food' },
      { name: 'Korean Food', icon: '🥘', type: 'food' },
      { name: 'Home Cooking', icon: '🍳', type: 'food' },
      { name: 'Desserts', icon: '🍰', type: 'food' },
      { name: 'Coffee', icon: '☕', type: 'drink' },
      { name: 'Juices & Smoothies', icon: '🥤', type: 'drink' },
      { name: 'Laundry', icon: '👔', type: 'service' },
      { name: 'Cleaning', icon: '🧹', type: 'service' },
    ]);

    console.log('✅ Categories created');

    // ── Create Products ─────────────────────────────────────

    // Arun's Kitchen products
    await Product.bulkCreate([
      {
        vendor_id: vendor1.id,
        name: 'Pad Thai Goong',
        description: 'Classic stir-fried rice noodles with prawns, bean sprouts, peanuts, and tamarind sauce.',
        price: 120,
        category: 'Thai Food',
        is_available: true,
        is_popular: true,
      },
      {
        vendor_id: vendor1.id,
        name: 'Green Curry with Chicken',
        description: 'Rich coconut-based green curry with tender chicken, Thai eggplant, and sweet basil. Served with jasmine rice.',
        price: 140,
        category: 'Thai Food',
        is_available: true,
        is_popular: true,
      },
      {
        vendor_id: vendor1.id,
        name: 'Tom Yum Goong',
        description: 'Spicy and sour prawn soup with lemongrass, galangal, kaffir lime leaves, and mushrooms.',
        price: 150,
        category: 'Thai Food',
        is_available: true,
        is_popular: true,
      },
      {
        vendor_id: vendor1.id,
        name: 'Mango Sticky Rice',
        description: 'Sweet coconut sticky rice topped with fresh ripe mango slices and coconut cream.',
        price: 80,
        category: 'Desserts',
        is_available: true,
        is_popular: false,
      },
      {
        vendor_id: vendor1.id,
        name: 'Som Tum (Papaya Salad)',
        description: 'Spicy green papaya salad with tomatoes, green beans, peanuts, and dried shrimp.',
        price: 90,
        category: 'Thai Food',
        is_available: true,
        is_popular: false,
      },
    ]);

    // Mama Noi's products
    await Product.bulkCreate([
      {
        vendor_id: vendor2.id,
        name: 'Chicken Basil Rice',
        description: 'Stir-fried minced chicken with holy basil and chili over steamed rice, topped with a fried egg.',
        price: 85,
        category: 'Home Cooking',
        is_available: true,
        is_popular: true,
      },
      {
        vendor_id: vendor2.id,
        name: 'Pork Fried Rice',
        description: 'Classic fried rice with marinated pork, egg, Chinese broccoli, and soy sauce.',
        price: 75,
        category: 'Home Cooking',
        is_available: true,
        is_popular: false,
      },
      {
        vendor_id: vendor2.id,
        name: 'Egg Noodle Soup',
        description: 'Egg noodles in rich pork broth with wontons, crispy pork, and fresh vegetables.',
        price: 90,
        category: 'Home Cooking',
        is_available: true,
        is_popular: true,
      },
      {
        vendor_id: vendor2.id,
        name: 'Crispy Pork Belly Rice',
        description: 'Crispy roasted pork belly over steamed rice with sweet soy sauce and pickled greens.',
        price: 95,
        category: 'Home Cooking',
        is_available: true,
        is_popular: false,
      },
    ]);

    // K-Bite Korean BBQ products
    await Product.bulkCreate([
      {
        vendor_id: vendor3.id,
        name: 'Bibimbap Bowl',
        description: 'Mixed rice bowl with assorted vegetables, beef, gochujang sauce, and a sunny-side-up egg.',
        price: 160,
        category: 'Korean Food',
        is_available: true,
        is_popular: true,
      },
      {
        vendor_id: vendor3.id,
        name: 'Korean Fried Chicken',
        description: 'Double-fried crispy chicken glazed with sweet and spicy gochujang sauce. 6 pieces.',
        price: 180,
        category: 'Korean Food',
        is_available: true,
        is_popular: true,
      },
      {
        vendor_id: vendor3.id,
        name: 'Japchae',
        description: 'Stir-fried glass noodles with beef, vegetables, and sesame oil.',
        price: 130,
        category: 'Korean Food',
        is_available: true,
        is_popular: false,
      },
      {
        vendor_id: vendor3.id,
        name: 'Tteokbokki',
        description: 'Spicy rice cakes in gochujang sauce with fish cakes and green onions.',
        price: 100,
        category: 'Korean Food',
        is_available: true,
        is_popular: false,
      },
    ]);

    // Fresh & Fit Juicery products
    await Product.bulkCreate([
      {
        vendor_id: vendor4.id,
        name: 'Green Detox Juice',
        description: 'Cold-pressed kale, spinach, apple, ginger, and lemon juice. 100% natural.',
        price: 95,
        category: 'Juices & Smoothies',
        is_available: true,
        is_popular: true,
      },
      {
        vendor_id: vendor4.id,
        name: 'Acai Smoothie Bowl',
        description: 'Blended acai berries topped with granola, banana, strawberries, and honey.',
        price: 150,
        category: 'Juices & Smoothies',
        is_available: true,
        is_popular: true,
      },
      {
        vendor_id: vendor4.id,
        name: 'Tropical Mango Smoothie',
        description: 'Fresh mango, pineapple, coconut milk, and a hint of turmeric.',
        price: 85,
        category: 'Juices & Smoothies',
        is_available: true,
        is_popular: false,
      },
      {
        vendor_id: vendor4.id,
        name: 'Berry Blast Juice',
        description: 'Mixed berries, pomegranate, and beetroot. Packed with antioxidants.',
        price: 90,
        category: 'Juices & Smoothies',
        is_available: true,
        is_popular: false,
      },
      {
        vendor_id: vendor4.id,
        name: 'Protein Power Shake',
        description: 'Banana, peanut butter, oat milk, and plant protein. Perfect post-workout fuel.',
        price: 110,
        category: 'Juices & Smoothies',
        is_available: true,
        is_popular: false,
      },
    ]);

    console.log('✅ Products created');

    // ── Create Sample Orders ────────────────────────────────
    const order1 = await Order.create({
      user_id: resident1.id,
      vendor_id: vendor1.id,
      total: 270,
      status: 'delivered',
      room_number: 'A-1201',
      notes: 'Extra spicy please!',
    });

    await OrderItem.bulkCreate([
      { order_id: order1.id, product_id: 1, quantity: 1, price: 120 },
      { order_id: order1.id, product_id: 3, quantity: 1, price: 150 },
    ]);

    const order2 = await Order.create({
      user_id: resident2.id,
      vendor_id: vendor2.id,
      total: 175,
      status: 'preparing',
      room_number: 'B-805',
    });

    await OrderItem.bulkCreate([
      { order_id: order2.id, product_id: 6, quantity: 1, price: 85 },
      { order_id: order2.id, product_id: 8, quantity: 1, price: 90 },
    ]);

    const order3 = await Order.create({
      user_id: resident3.id,
      vendor_id: vendor4.id,
      total: 245,
      status: 'pending',
      room_number: 'C-302',
      notes: 'No sugar in the smoothie please',
    });

    await OrderItem.bulkCreate([
      { order_id: order3.id, product_id: 14, quantity: 1, price: 95 },
      { order_id: order3.id, product_id: 15, quantity: 1, price: 150 },
    ]);

    console.log('✅ Sample orders created');
    console.log('\n🎉 Seed complete! Demo accounts:');
    console.log('─'.repeat(45));
    console.log('Admin:    admin@condofoodhub.com / password123');
    console.log('Resident: sarah@resident.com     / password123');
    console.log('Resident: mike@resident.com      / password123');
    console.log('Vendor:   arun@vendor.com        / password123');
    console.log('Vendor:   noi@vendor.com         / password123');
    console.log('Vendor:   david@vendor.com       / password123');
    console.log('─'.repeat(45));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
