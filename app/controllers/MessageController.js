const Message = require('../models/Message')

class MessageController {
    // GET messages/:conversationId
    async index(req, res) {
        try {
            const messages = await Message.find({ conversationId: req.params.conversationId })
            res.status(200).json(messages)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // POST messages/create
    async create(req, res) {
        const newMessage = new Message(req.body);
        try {
            const saveMessage = await newMessage.save();
            res.status(200).json(saveMessage)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // DELETE messages/delete/:id
    async delete(req, res) {
        try {
            const post = await Message.findById(req.params.id)
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
}

module.exports = new MessageController()
