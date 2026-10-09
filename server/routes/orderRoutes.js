const express = require("express");

const {
    createCustomOrder,
    getCustomerOrders,
    getCustomerOrderById,
    getCustomerOrderTracking,
    getArtisanOrders,
    updateOrderStatus,
    cancelOrder,
    getOrderStatusHistory,
    updatePaymentStatus
} = require("../controllers/orderController");

const {
    createNormalOrder
} = require("../controllers/normalOrderController");

const {
    simulatePayment
} = require("../controllers/paymentController");

const {
    protect,
    artisanOnly
} = require("../middleware/authMiddleware");
const router = express.Router();

// Create order from approved custom request
router.post(
    "/custom/:customRequestId",
    protect,
    createCustomOrder
);

router.post(
    "/normal",
    protect,
    createNormalOrder
);

// Get orders for logged-in customer
router.get("/customer", protect, getCustomerOrders);

// Get orders for logged-in artisan
router.get("/artisan", protect, artisanOnly, getArtisanOrders);

// Update order status - Artisan only
router.put("/:id/status", protect, artisanOnly, updateOrderStatus);

//order cancle route
router.put("/:id/cancel", protect, cancelOrder);


// Get order tracking - Customer
router.get(
    "/:id/tracking",
    protect,
    getCustomerOrderTracking
);

router.get("/:id/history", protect, getOrderStatusHistory);

router.put(
    "/:orderId/pay",
    protect,
    simulatePayment
);

// Get single order details - Customer
router.get("/:id", protect, getCustomerOrderById);


router.put(
    "/:orderId/payment",
    protect,
    updatePaymentStatus
);



module.exports = router;