const User = require('../models/User')
const bcrypt = require('bcrypt')

class UserController {
    // GET users?username=... || user?userId=...
    async index (req, res) {
        const userId = req.query.userId
        const username = req.query.username
        try {
            const user = userId 
                ? await User.findById(userId) 
                : await User.findOne({username: username})

            const {password, updatedAt, ...rest} = user._doc
            res.status(200).json(rest)
        } catch (error) {
            res.status(500).json(err)
        }
    }

    // GET users/friends/:userId
    async friends (req, res) {
        try {
            const user = await User.findById(req.params.userId)
            const friends = await Promise.all(
                user.followings.map(friendId => 
                    User.findById(friendId)
                )
            )
            let friendList = []
            friends.map(friend => {
                const { _id, username, profilePicture} = friend
                friendList.push({ _id, username, profilePicture})
            })
            res.status(200).json(friendList)
        } catch (error) {
            res.status(500).json(err)
        }
    }

    // POST auth/register 
    async register(req, res) {
        try {
            // generator new password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)

            // create new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            })

            const user = await newUser.save()
            res.status(200).json(user)
        } catch (err) {
            res.status(500).json(err)
        }

    }

    // POST auth/login
    async login(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });
            !user && res.status(400).json("User not found")

            const validPassword = await bcrypt.compare(req.body.password, user.password)
            !validPassword && res.status(400).json("Wrong password")

            res.status(200).json(user)
        } catch (err) {
            res.status(500).json(err)
        }
    }

    // PUT users/:id
    async update(req, res) {
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            if (req.body.password) {
                try {
                    const salt = await bcrypt.genSalt(10)
                    req.body.password = await bcrypt.hash(req.body.password, salt)

                } catch (error) {
                    return res.status(500).json(err)  
                }
            }
            try {
                const user = await User.findByIdAndUpdate(req.params.id,  {
                    $set: req.body
                })
                res.status(200).json("Account has been updated")
            } catch (error) {
                return res.status(500).json(err)  
            }
        } else {
            return res.status(403).json("You can update only your account")
        }
    }

    // DELETE users/:id/force
    async forceDelete(req, res) {
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            try {
                const user = await User.deleteOne({ _id: req.params.id})
                res.status(200).json("Account has been deleted")
            } catch (error) {
                return res.status(500).json(err)  
            }
        } else {
            return res.status(403).json("You can delete only your account")
        }
    }

    // PUT users/:id/follow
    async follow(req, res) {
        if (req.body.userId !== req.params.id) {
            try {
                const user = await User.findById(req.params.id)
                const curUser = await User.findById(req.body.userId)

                if (!user.followers.includes(req.body.userId)) {
                    await user.updateOne({ $push: {followers: req.body.userId} })
                    await curUser.updateOne({ $push: {followings: req.params.id} })

                    res.status(200).json("user has been followed")
                } else {
                    res.status(403).json("You already follow this user")
                }
            } catch (error) {
                return res.status(500).json(err)  
            }
        } else {
            res.status(403).json("You can't follow yourself")
        }
    }

    // PUT users/:id/unfollow
    async unfollow(req, res) {
        if (req.body.userId !== req.params.id) {
            try {
                const user = await User.findById(req.params.id)
                const curUser = await User.findById(req.body.userId)

                if (user.followers.includes(req.body.userId)) {
                    await user.updateOne({ $pull: {followers: req.body.userId} })
                    await curUser.updateOne({ $pull: {followings: req.params.id} })
                    
                    res.status(200).json("user has been unfollowed")
                } else {
                    res.status(403).json("You don't unfollow this user")
                }
            } catch (error) {
                return res.status(500).json(err)  
            }
        } else {
            res.status(403).json("You can't unfollow yourself")
        }
    }
}

module.exports = new UserController()