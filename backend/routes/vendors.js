const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');
const { Vendor, User, Product } = require('../models');

const router = express.Router();

// Get all approved vendors
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = { is_approved: true };

    if (category) where.category = category;

    const vendors = await Vendor.findAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email', 'phone'],
      }],
      order: [['rating', 'DESC']],
    });

    let result = vendors;
    if (search) {
      const searchLower = search.toLowerCase();
      result = vendors.filter(v =>
        v.shop_name.toLowerCase().includes(searchLower) ||
        (v.description && v.description.toLowerCase().includes(searchLower))
      );
    }

    res.json({ success: true, vendors: result });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get featured vendors
router.get('/featured', async (req, res) => {
  try {
    const vendors = await Vendor.findAll({
      where: { is_approved: true, is_open: true },
      include: [{
        model: User,
        as: 'user',
        attributes: ['name'],
      }],
      order: [['rating', 'DESC'], ['total_orders', 'DESC']],
      limit: 6,
    });

    res.json({ success: true, vendors });
  } catch (error) {
    console.error('Get featured vendors error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single vendor with products
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'phone'],
        },
        {
          model: Product,
          as: 'products',
          where: { is_available: true },
          required: false,
          order: [['category', 'ASC'], ['name', 'ASC']],
        },
      ],
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.json({ success: true, vendor });
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create vendor shop (vendor only)
router.post('/', auth, role('vendor'), upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
]), async (req, res) => {
  try {
    const existingVendor = await Vendor.findOne({ where: { user_id: req.user.id } });
    if (existingVendor) {
      return res.status(400).json({ success: false, message: 'You already have a shop' });
    }

    const { shop_name, description, category } = req.body;
    const vendor = await Vendor.create({
      user_id: req.user.id,
      shop_name,
      description,
      category: category || 'food',
      logo: req.files?.logo?.[0]?.filename || null,
      banner: req.files?.banner?.[0]?.filename || null,
      is_approved: false,
    });

    res.status(201).json({ success: true, vendor });
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update vendor shop
router.put('/:id', auth, role('vendor'), upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
]), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const { shop_name, description, category, is_open } = req.body;
    const updates = {};
    if (shop_name) updates.shop_name = shop_name;
    if (description !== undefined) updates.description = description;
    if (category) updates.category = category;
    if (is_open !== undefined) updates.is_open = is_open === 'true' || is_open === true;
    if (req.files?.logo?.[0]) updates.logo = req.files.logo[0].filename;
    if (req.files?.banner?.[0]) updates.banner = req.files.banner[0].filename;

    await vendor.update(updates);

    res.json({ success: true, vendor });
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
