const express = require('express');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { User, Vendor, Product, Order, OrderItem, sequelize } = require('../models');

const router = express.Router();

// All admin routes require auth + admin role
router.use(auth, role('admin'));

// Get platform statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'resident' } });
    const totalVendors = await Vendor.count();
    const approvedVendors = await Vendor.count({ where: { is_approved: true } });
    const pendingVendors = await Vendor.count({ where: { is_approved: false } });
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();

    const revenueResult = await Order.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'total_revenue']],
      where: { status: { [Op.ne]: 'cancelled' } },
    });
    const totalRevenue = parseFloat(revenueResult?.dataValues?.total_revenue || 0);

    // Orders by status
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const preparingOrders = await Order.count({ where: { status: 'preparing' } });
    const deliveredOrders = await Order.count({ where: { status: 'delivered' } });
    const cancelledOrders = await Order.count({ where: { status: 'cancelled' } });

    // Recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = await Order.count({
      where: { created_at: { [Op.gte]: sevenDaysAgo } },
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalVendors,
        approvedVendors,
        pendingVendors,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        preparingOrders,
        deliveredOrders,
        cancelledOrders,
        recentOrders,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { role: userRole, search } = req.query;
    const where = {};
    if (userRole) where.role = userRole;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user status (suspend/activate)
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await user.update({ status });

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all vendors (including pending)
router.get('/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'status'],
      }],
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, vendors });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Approve vendor
router.put('/vendors/:id/approve', async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    await vendor.update({ is_approved: true });

    res.json({ success: true, vendor });
  } catch (error) {
    console.error('Approve vendor error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Suspend vendor
router.put('/vendors/:id/suspend', async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    await vendor.update({ is_approved: false });

    res.json({ success: true, vendor });
  } catch (error) {
    console.error('Suspend vendor error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all products (admin)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Vendor,
        as: 'vendor',
        attributes: ['id', 'shop_name'],
      }],
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete product (admin)
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
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
