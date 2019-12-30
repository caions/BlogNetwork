const express = require('express')
const router = express.Router()
const Post = require('../db/posts')


//static
//estatic
router.use(express.static('public'));
router.use(express.static('node_modules'))

// home
router.get('/', (req, res) =>
    Post.findAll().then((posts) => res.render('pages/home', { posts: posts }))
)

module.exports = router

