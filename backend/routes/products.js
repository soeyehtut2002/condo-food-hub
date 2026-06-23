const express = require('express');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');
const { Product, Vendor, User } = require('../models');

const router = express.Router();

// Get all products (with search & filter)
router.get('/', async (req, res) => {
  try {
    const { search, category, vendor_id, page = 1, limit = 20 } = req.query;
    const where = { is_available: true };
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (category) where.category = category;
    if (vendor_id) where.vendor_id = vendor_id;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows: products, count: total } = await Product.findAndCountAll({
      where,
      include: [{
        model: Vendor,
        as: 'vendor',
        attributes: ['id', 'shop_name', 'is_open', 'is_approved'],
        where: { is_approved: true },
        include: [{
          model: User,
          as: 'user',
          attributes: ['name'],
        }],
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get popular products
router.get('/popular', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { is_available: true, is_popular: true },
      include: [{
        model: Vendor,
        as: 'vendor',
        attributes: ['id', 'shop_name', 'is_approved'],
        where: { is_approved: true },
      }],
      limit: 8,
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, products });
  } catch (error) {
    console.error('Get popular products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get product categories
router.get('/categories', async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['category'],
      group: ['category'],
      where: { is_available: true },
    });

    const categories = products.map(p => p.category).filter(Boolean);
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: Vendor,
        as: 'vendor',
        attributes: ['id', 'shop_name', 'is_open', 'rating'],
        include: [{
          model: User,
          as: 'user',
          attributes: ['name'],
        }],
      }],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get related products from same vendor
    const related = await Product.findAll({
      where: {
        vendor_id: product.vendor_id,
        id: { [Op.ne]: product.id },
        is_available: true,
      },
      limit: 4,
    });

    res.json({ success: true, product, related });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create product (vendor only)
router.post('/', auth, role('vendor'), upload.single('image'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ where: { user_id: req.user.id } });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor shop not found' });
    }

    const { name, description, price, category, is_popular } = req.body;

    const product = await Product.create({
      vendor_id: vendor.id,
      name,
      description,
      price: parseFloat(price),
      category,
      image: req.file?.filename || null,
      is_popular: is_popular === 'true' || is_popular === true,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update product
router.put('/:id', auth, role('vendor'), upload.single('image'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ where: { user_id: req.user.id } });
    const product = await Product.findOne({
      where: { id: req.params.id, vendor_id: vendor?.id },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, description, price, category, is_available, is_popular } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price) updates.price = parseFloat(price);
    if (category) updates.category = category;
    if (is_available !== undefined) updates.is_available = is_available === 'true' || is_available === true;
    if (is_popular !== undefined) updates.is_popular = is_popular === 'true' || is_popular === true;
    if (req.file) updates.image = req.file.filename;

    await product.update(updates);

    res.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete product
router.delete('/:id', auth, role('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ where: { user_id: req.user.id } });
    const product = await Product.findOne({
      where: { id: req.params.id, vendor_id: vendor?.id },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.destroy();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
