const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { Order, OrderItem, Product, Vendor, User, CartItem, sequelize } = require('../models');

const router = express.Router();

// Place order from cart
router.post('/', auth, async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { room_number, notes } = req.body;

    // Get cart items
    const cartItems = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Product,
        as: 'product',
        include: [{ model: Vendor, as: 'vendor' }],
      }],
    });

    if (cartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Group items by vendor
    const vendorGroups = {};
    for (const item of cartItems) {
      const vendorId = item.product.vendor_id;
      if (!vendorGroups[vendorId]) {
        vendorGroups[vendorId] = [];
      }
      vendorGroups[vendorId].push(item);
    }

    const orders = [];

    // Create one order per vendor
    for (const [vendorId, items] of Object.entries(vendorGroups)) {
      const total = items.reduce((sum, item) => {
        return sum + parseFloat(item.product.price) * item.quantity;
      }, 0);

      const order = await Order.create({
        user_id: req.user.id,
        vendor_id: parseInt(vendorId),
        total: total.toFixed(2),
        status: 'pending',
        room_number: room_number || req.user.room_number,
        notes,
      }, { transaction: t });

      // Create order items
      for (const item of items) {
        await OrderItem.create({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        }, { transaction: t });
      }

      // Increment vendor total orders
      await Vendor.increment('total_orders', {
        where: { id: vendorId },
        transaction: t,
      });

      orders.push(order);
    }

    // Clear cart
    await CartItem.destroy({
      where: { user_id: req.user.id },
      transaction: t,
    });

    await t.commit();

    res.status(201).json({
      success: true,
      message: `${orders.length} order(s) placed successfully`,
      orders,
    });
  } catch (error) {
    await t.rollback();
    console.error('Place order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get orders (user sees their orders, vendor sees incoming orders)
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = {};

    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ where: { user_id: req.user.id } });
      if (!vendor) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
      }
      where.vendor_id = vendor.id;
    } else {
      where.user_id = req.user.id;
    }

    if (status) where.status = status;

    const { rows: orders, count: total } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'image'],
          }],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'room_number', 'phone'],
        },
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['id', 'shop_name'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
          }],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'room_number', 'phone'],
        },
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['id', 'shop_name'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['name', 'phone'],
          }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update order status (vendor only)
router.put('/:id/status', auth, role('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ where: { user_id: req.user.id } });
    const order = await Order.findOne({
      where: { id: req.params.id, vendor_id: vendor?.id },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await order.update({ status });

    res.json({ success: true, order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
