const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

const roleMiddleware = require('../middlewares/role.middleware');

const validate = require('../middlewares/validate.middleware');

const { addToCart, getCart, removeFromCart, clearCart } = require('../controllers/cart.controller');

const { addToCartSchema } = require('../validations/cart.validation');

router.post('/', authMiddleware, roleMiddleware('student'), validate(addToCartSchema), addToCart);

router.get('/', authMiddleware, roleMiddleware('student'), getCart);

router.delete('/:courseId', authMiddleware, roleMiddleware('student'), removeFromCart);

router.delete('/', authMiddleware, roleMiddleware('student'), clearCart);

module.exports = router;
