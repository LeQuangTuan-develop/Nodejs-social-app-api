const express = require('express');
const router = express.Router();
const postController = require('../app/controllers/PostController');

router.post('/create', postController.create)
router.put('/update/:id', postController.update)
router.delete('/delete/:id', postController.delete)
router.put('/like/:id', postController.like)
router.get('/newfeed/:userId', postController.newfeed)
router.get('/profile/:username', postController.profile)
router.get('/:id', postController.index)

module.exports = router
