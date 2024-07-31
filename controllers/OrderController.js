import OrderModel from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const doc = new OrderModel({
      items: req.body.items,
      totalPrice: req.body.totalPrice,
      comment: req.body.comment,
      userInfo: req.body.userInfo,
    });

    const orders = await doc.save();

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      error: error.message.includes("duplicate key") ? "Your orders exactly like we have one, so, please, write some one more unique" : `Order's creating is falied: ${error.message}`,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    let orders = [];

    if (req.query.id) {
      orders = await OrderModel.find({ _id: req.query.id }).exec();
    } else {
      orders = await OrderModel.find().exec();
    }

    if (req.query.sortBy === "createdAt") {
      orders.sort((a, b) => b.createdAt - a.createdAt);
      res.json(orders);
      return;
    }
    if (req.query.sortBy === "expensive") {
      orders.sort((a, b) => b.totalPrice - a.totalPrice);
      res.json(orders);
      return;
    }

    if (req.query.sortBy === "cheap") {
      orders.sort((a, b) => a.totalPrice - b.totalPrice);
      res.json(orders);
      return;
    }

    if (req.query.sortBy === "id") {
      orders.sort((a, b) => {
        if (a._id > b._id) {
          return 1;
        }
        if (a._id < b._id) {
          return -1;
        }
        return 0;
      });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json("Failed getting Orders");
  }
};

export const getOne = async (req, res) => {
  try {
    const OrderId = req.params.id;
    console.log(OrderId);

    const Order = await OrderModel.findOneAndUpdate(
      {
        _id: OrderId,
      },
      {
        returnDocument: "after",
      }
    );

    res.json(Order);
  } catch (error) {
    console.log(error);
    res.status(500).json("Order not found");
  }
};
export const remove = async (req, res) => {
  try {
    const OrderId = req.params.id;

    const post = await OrderModel.findOneAndDelete({
      _id: OrderId,
    });

    res.json({
      message: `Order id: ${OrderId ? OrderId : "*"} deleted successefully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(`Post not found`);
  }
};

export const update = async (req, res) => {
  try {
    const OrderId = req.params.id;

    const Order = await OrderModel.findOneAndUpdate(
      {
        _id: OrderId,
      },
      req.body
    );

    res.json({ message: "Order updated successefully" });
  } catch (error) {
    console.log(error);
    res.status(500).json("Order updating failed");
  }
};
