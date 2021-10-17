const Conversation = require('../models/Conversation')

class ConversationController {
    // GET conversations/:userId
    async index(req, res) {
        try {
            const conversations = await Conversation.find({
                members: { $in: [req.params.userId] }
            })
            res.status(200).json(conversations)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // POST conversations/create
    async create(req, res) {
        const newConversation = new Conversation({
            members: [req.body.senderId, req.body.receiverId]
        })

        try {
            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // GET conversations/find/:firstUserId/:secondUserId
    async find(req, res) {
        try {
            const conversation = await Conversation.findOne({
                members: { $all: [req.params.firstUserId, req.params.secondUserId] }
            })
            res.status(200).json(conversation)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // DELETE conversations/delete/:id
    async delete(req, res) {
        try {
            const conversation = await Conversation.findById(req.params.id)
            if (conversation.userId === req.body.userId) {
                await conversation.deleteOne({ _id: req.params.id })
                res.status(200).json("Your post has been deleted")
            } else {
                res.status(403).json("You can delete only your post")
            }    
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = new ConversationController()
