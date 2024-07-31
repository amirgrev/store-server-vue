import ShoseModel from "../models/Shose.js";
import OrderModel from "../models/Order.js";

export const create = async (req, res) => {
  try {
    const doc = new ShoseModel({
      title: req.body.title,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
    });

    const Shose = await doc.save();
    console.log(Shose);
    res.json(Shose);
  } catch (error) {
    res.status(500).json({
      error: error.message.includes("duplicate key") ? "Your shose exactly like we have one, so, please, write some one more unique" : `Shose's creating is falied: ${error.message}`,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    let shoeses = [];
    if (req.query.title) {
      shoeses = await ShoseModel.find({ title: { $regex: req.query.title } }).exec();
    } else {
      shoeses = await ShoseModel.find().exec();
    }

    const query = req.query.sortBy;

    const sort = {
      sortCheap: () => shoeses.sort((a, b) => a.price - b.price),
      sortExpensive: () => shoeses.sort((a, b) => b.price - a.price),
      sortTitle: () =>
        shoeses.sort((a, b) => {
          const titleA = a.title.toUpperCase();
          const titleB = b.title.toUpperCase();
          if (titleA < titleB) {
            return -1;
          }
          if (titleA > titleB) {
            return 1;
          }

          return 0;
        }),
    };

    if (query === "cheap") {
      sort.sortCheap();
      res.json(shoeses);
      return;
    }
    if (query === "expensive") {
      sort.sortExpensive();
      res.json(shoeses);
      return;
    } else {
      sort.sortTitle();
    }

    res.json(shoeses);
  } catch (error) {
    res.status(500).json("Failed getting shoess");
  }
};

export const getOne = async (req, res) => {
  try {
    const ShoseId = req.params.id;
    console.log(ShoseId);

    const Shose = await ShoseModel.findOneAndUpdate(
      {
        _id: ShoseId,
      },
      {
        returnDocument: "after",
      }
    );

    res.json(Shose);
  } catch (error) {
    console.log(error);
    res.status(500).json("Shose not found");
  }
};
export const remove = async (req, res) => {
  try {
    const ShoseId = req.params.id;

    const post = await ShoseModel.findOneAndDelete({
      _id: ShoseId,
    });

    res.json({
      message: `Shose id: ${ShoseId ? ShoseId : "*"} deleted successefully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(`Post not found`);
  }
};

export const update = async (req, res) => {
  try {
    const ShoseId = req.params.id;

    const Shose = await ShoseModel.findOneAndUpdate(
      {
        _id: ShoseId,
      },
      req.body
    );

    res.json({ message: "Shose updated successefully" });
  } catch (error) {
    console.log(error);
    res.status(500).json("Shose updating failed");
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    let shoeses = [];

    shoeses = await ShoseModel.find({ isFavorite: true }).exec();

    res.json(shoeses);
  } catch (error) {
    res.status(500).json("Failed getting shoess");
  }
};
