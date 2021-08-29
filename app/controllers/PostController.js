const Post = require('../models/Post')
const User = require('../models/User')

class PostController {
    // POST posts/create
    async create(req, res) {
        const newPost = new Post(req.body);
        try {
            const savePost = await newPost.save();
            res.status(200).json(savePost)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // PUT posts/update/:id
    async update(req, res) {
        try {
            const post = await Post.findById(req.params.id)
            if (post.userId === req.body.userId) {
                await post.updateOne({ $set: req.body })
                res.status(200).json("Your post has been updated")
            } else {
                res.status(403).json("You can update only your post")
            }    
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // DELETE posts/delete/:id
    async delete(req, res) {
        try {
            const post = await Post.findById(req.params.id)
            if (post.userId === req.body.userId) {
                await post.deleteOne({ _id: req.params.id })
                res.status(200).json("Your post has been deleted")
            } else {
                res.status(403).json("You can delete only your post")
            }    
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // PUT posts/like/:id
    async like(req, res) {
        try {
            const post = await Post.findById(req.params.id)
            if (!post.likes.includes(req.body.userId)) {
                await post.updateOne({ $push: { likes: req.body.userId }})
                res.status(200).json("The post has been liked")
            } else {
                await post.updateOne({ $pull: { likes: req.body.userId }})
                res.status(403).json("The post has been disliked")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // GET posts/:id
    async index(req, res) {
        try {
            const post = await Post.findById(req.params.id)
            res.status(200).json(post)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // GET posts/newfeed/:userId
    async newfeed(req, res) {
        try {
            const curUser = await User.findById(req.params.userId)
            const userPosts = await Post.find({ userId: curUser._id })
            const friendPosts = await Promise.all(
                curUser.followings.map(friendId => 
                    Post.find({ userId: friendId})
                )
            )
            res.status(200).json(userPosts.concat(friendPosts.flat()))
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // GET posts/profile/:username
    async profile(req, res) {
        try {
            const user = await User.findOne({username: req.params.username})
            const posts = await Post.find({ userId: user._id })
            res.status(200).json(posts)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = new PostController()
