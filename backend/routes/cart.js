const express = require('express');
const auth = require('../middleware/auth');
const { CartItem, Product, Vendor } = require('../models');

const router = express.Router();

// Get cart items
router.get('/', auth, async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Product,
        as: 'product',
        include: [{
          model: Vendor,
          as: 'vendor',
          attributes: ['id', 'shop_name'],
        }],
      }],
      order: [['created_at', 'ASC']],
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);

    res.json({
      success: true,
      cart: cartItems,
      total: total.toFixed(2),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add to cart
router.post('/', auth, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product || !product.is_available) {
      return res.status(404).json({ success: false, message: 'Product not available' });
    }

    // Check if item already in cart
    const existingItem = await CartItem.findOne({
      where: { user_id: req.user.id, product_id },
    });

    if (existingItem) {
      await existingItem.update({
        quantity: existingItem.quantity + parseInt(quantity),
      });

      const item = await CartItem.findByPk(existingItem.id, {
        include: [{
          model: Product,
          as: 'product',
          include: [{ model: Vendor, as: 'vendor', attributes: ['id', 'shop_name'] }],
        }],
      });

      return res.json({ success: true, cartItem: item });
    }

    const cartItem = await CartItem.create({
      user_id: req.user.id,
      product_id,
      quantity: parseInt(quantity),
    });

    const item = await CartItem.findByPk(cartItem.id, {
      include: [{
        model: Product,
        as: 'product',
        include: [{ model: Vendor, as: 'vendor', attributes: ['id', 'shop_name'] }],
      }],
    });

    res.status(201).json({ success: true, cartItem: item });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update cart item quantity
router.put('/:id', auth, async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    const { quantity } = req.body;
    if (quantity <= 0) {
      await cartItem.destroy();
      return res.json({ success: true, message: 'Item removed from cart' });
    }

    await cartItem.update({ quantity: parseInt(quantity) });

    const item = await CartItem.findByPk(cartItem.id, {
      include: [{
        model: Product,
        as: 'product',
        include: [{ model: Vendor, as: 'vendor', attributes: ['id', 'shop_name'] }],
      }],
    });

    res.json({ success: true, cartItem: item });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Remove cart item
router.delete('/:id', auth, async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Clear cart
router.delete('/', auth, async (req, res) => {
  try {
    await CartItem.destroy({
      where: { user_id: req.user.id },
    });

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
