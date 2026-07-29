const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server Running',
  });
});

module.exports = router;
