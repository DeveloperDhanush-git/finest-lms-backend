const cartService = require(
  "../services/cart.service"
);

const addToCart = async (
  req,
  res,
  next
) => {

  try {

    const cart =
      await cartService.addToCart(

        req.user._id,

        req.body.courseId

      );

    return res.status(200).json({

      success: true,

      message:
        "Course added to cart successfully.",

      data: cart,

    });

  }

  catch (error) {

    next(error);

  }

};

const getCart = async (
  req,
  res,
  next
) => {

  try {

    const cart =
      await cartService.getCart(

        req.user._id

      );

    return res.status(200).json({

      success: true,

      data: cart,

    });

  }

  catch (error) {

    next(error);

  }

};

const removeFromCart = async (
  req,
  res,
  next
) => {

  try {

    const cart =
      await cartService.removeFromCart(

        req.user._id,

        req.params.courseId

      );

    return res.status(200).json({

      success: true,

      message:
        "Course removed from cart successfully.",

      data: cart,

    });

  }

  catch (error) {

    next(error);

  }

};

const clearCart = async (
  req,
  res,
  next
) => {

  try {

    await cartService.clearCart(

      req.user._id

    );

    return res.status(200).json({

      success: true,

      message:
        "Cart cleared successfully.",

    });

  }

  catch (error) {

    next(error);

  }

};

module.exports = {

  addToCart,

  getCart,

  removeFromCart,

  clearCart,

};