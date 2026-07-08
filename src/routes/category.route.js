const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

const roleMiddleware = require('../middlewares/role.middleware');

const validate = require('../middlewares/validate.middleware');

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');

const { createCategorySchema, updateCategorySchema } = require('../validations/category.validation');

router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  validate(createCategorySchema),
  createCategory
);

router.get('/', getCategories);

router.get('/:id', getCategory);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  validate(updateCategorySchema),
  updateCategory
);

router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteCategory);

module.exports = router;
