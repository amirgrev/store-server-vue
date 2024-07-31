import PostModel from "../models/Post.js"

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    })
    const post = await doc.save()
    res.json(post)
  } catch (error) {
    res.status(500).json({
      error: error.message.includes("duplicate key")
        ? "Your post exactly like we have one, so, please, write some one more unique"
        : `Post's creating is falied: ${error.message}`,
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec()
    res.json(posts)
  } catch (error) {
    res.status(500).json("Failed getting posts")
  }
}
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id
    const post = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    )

    res.json(post)
  } catch (error) {
    console.log(error)
    res.status(500).json("Post not found")
  }
}
export const remove = async (req, res) => {
  try {
    const postId = req.params.id

    const post = await PostModel.findOneAndDelete({
      _id: postId,
    })

    res.json({
      message: `Post id: ${postId ? postId : "*"} deleted successefully`,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(`Post not found`)
  }
}
export const update = async (req, res) => {
  try {
    const postId = req.params.id
    const post = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.taga,
      }
    )

    res.json({ message: "Post updated successefully" })
  } catch (error) {
    console.log(error)
    res.status(500).json("Post updating failed")
  }
}
