const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController')

router.get('/', userController.index);
router.get('/friends/:userId', userController.friends);
router.put('/:id', userController.update);
router.put('/:id/follow', userController.follow);
router.put('/:id/unfollow', userController.unfollow);
router.delete('/:id/force', userController.forceDelete);

module.exports = router
