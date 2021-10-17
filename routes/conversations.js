const express = require('express');
const router = express.Router();

const conversationController = require('../app/controllers/ConversationController')

router.get('/:userId', conversationController.index);
router.get('/find/:firstUserId/:secondUserId', conversationController.find);
router.post('/create', conversationController.create);

module.exports = router