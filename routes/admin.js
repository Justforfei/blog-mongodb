const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const PostModel = require('../models/posts')

router.get('/', function (req, res, next) {

	Promise.all([
		UserModel.getAllUserInfo(),
		PostModel.getPosts()
	])
		.then(function(result) {
			res.render('admin', {
				usersInfo: result[0],
				posts: result[1]
			})
		})
	    .catch(next)

})

router.post('/', function(req, res, next) {
	username = req.fields.username

	try {
		if(!username.length) {
			throw new Error('请输入用户名')
		}
	} catch(e) {
		req.flash('error', e.message)
		return res.redirect('back')
	}

	Promise.all([
		UserModel.getUsersByName(username),
		PostModel.getPosts()
	])
		.then(function (result) {
			if(!result[0]) {
				req.flash('error', '用户不存在')
				return res.redirect('back')
			}
			res.render('admin', {
				usersInfo: result[0],
				posts: result[1]
			})
		})
})

module.exports = router