//import express, express router as shown in lecture code
import express from 'express'
const router = express.Router();
import validation from '../helpers.js'
import userData from '../data/users.js'
import blogData from '../data/blogs.js'
import bcrypt from 'bcrypt'



router
    .route('/sitblog/logout')
    .get(async (req, res) =>{
        req.session.destroy()
        res.json("Logged out")
})

router
    .route('/sitblog/register')
    .post(async (req, res) => {
        const username = req.body.username
        const name = req.body.name
        const password = req.body.password
        try{
            if(req.session.user) throw "You are already signed in"
        }catch(e){
            res.status(401).json({error: e})
            return;
        }
        try{
            const registeredUser = await userData.createUser(name, username, password)
            res.status(200).json(registeredUser)
        }catch(e){
            res.status(500).json(e)
        }
})
router
    .route("/sitblog/signin")
    .post(async (req, res) => {
        
        try{
            if(req.session.user)throw "You are already signed in"
        }catch(e){
            res.status(401).json({error: e})
            return
        }

        try{
            const username = validation.stringCheck(req.body.username)
            validation.stringCheck(req.body.password)

            const user = await userData.getUser(username)
            const passwordConfirmation = await bcrypt.compare(req.body.password, user.password)
            if(!passwordConfirmation || (user.username !== username.toLowerCase())) throw "Incorrect username or password"

            const returnedInfo = {
                _id: user._id,
                name: user.name,
                username: user.username,
            }
            req.session.user = {_id: user._id, username: user.username}
            res.status(200).json(returnedInfo)
        }catch(e){
            res.status(400).json({error: e})
        }

    })

router
    .route('/sitblog')
    .get(async (req, res) => {
        const skippedPosts = req.query.skip
        const postLimit = req.query.limit
        try{
            const blogPosts = await blogData.getPosts(skippedPosts, postLimit)
            res.status(200).json(blogPosts)
        }catch(e){
            res.status(500).json({error: e})
        }
    })
    .post(async (req, res) => {
        try{
            if(!req.session.user) throw "You cannot post without signing in."
        }catch(e){
            res.status(403).json({error: e})
            return;
        }
        try{
            const blogTitle = req.body.blogTitle
            const blogBody = req.body.blogBody
            const userThatPosted = {_id: req.session.user._id, username: req.session.user.username}
            const postData = await blogData.createBlogPost(blogTitle, blogBody, userThatPosted)
            res.status(200).json(postData)
        }catch(e){
            res.status(500).json({error: e})
        }
    })

router
    .route('/sitblog/:id')
    .get(async(req, res) => {
        let blogId = req.params.id
        try{
            blogId = validation.idCheck(blogId)
            const post = await blogData.get(blogId)
            res.status(200).json(post)
        }catch(e){
            res.status(500).json({error:e})
            return
        }
    })
    .put(async(req, res) => {
        let blogId = req.params.id
        const user = req.session.user
        try{
            if(!user)throw 'You must be signed in to edit posts'
        }catch(e){
            res.status(401).json({error: e})
            return
        }

        try{
            blogId = validation.idCheck(blogId)
            const blogPost = await blogData.get(blogId)
            const blogAuthor = blogPost.userThatPosted.username

            if(blogAuthor !== user.username){
                throw 'You cannot edit blog posts that are not your own!'
            }
        }catch(e){
            res.status(403).json({error: e})
            return
        }

        try{
            const newTitle = req.body.blogTitle
            const newBody = req.body.blogBody
            const updatedPost = await blogData.editBlogPost(newTitle, newBody, blogId, user)
            res.status(200).json(updatedPost)
        }catch(e){
            res.status(500).json({error: e})
            return
        }
    })
    .patch(async (req, res) =>{
        let blogId = req.params.id
        const user = req.session.user
        try{
            if(!user)throw 'You must be signed in to edit posts'
        }catch(e){
            res.status(401).json({error: e})
            return
        }
        try{
            blogId = validation.idCheck(blogId)
            const blogPost = await blogData.get(blogId)
            const blogAuthor = blogPost.userThatPosted.username

            if(blogAuthor !== user.username){
                throw 'You cannot edit blog posts that are not your own!'
            }
        }catch(e){
            res.status(403).json({error: e})
            return
        }

        try{
            const newTitle = req.body.blogTitle
            const newBody = req.body.blogBody
            const updatedPost = await blogData.patchBlogPost(newTitle, newBody, blogId, user)
            res.status(200).json(updatedPost)
        }catch(e){
            res.status(500).json({error: e})
            return
        }

    })
router
    .route("/sitblog/:id/comments")
    .post(async (req, res) => {
        let blogId = req.params.id
        const user = req.session.user
        try{
            if(!user)throw 'You must be signed in to add comments'
        }catch(e){
            res.status(401).json({error: e})
            return
        }

        try{
            const comment = validation.stringCheck(req.body.comment)
            const newComment = await blogData.addComment(blogId, comment, user)
            res.status(200).json(newComment)
        }catch(e){
            res.status(500).json({error: e})
            return
        }
    })

router
    .route("/sitblog/:blogId/:commentId")
    .delete(async (req, res) => {
        let blogId = req.params.blogId
        let commentId = req.params.commentId
        const user = req.session.user
        try{
            if(!user)throw "You must be signed in to delete comments"
        }catch(e){
            res.status(401).json({error: e})
            return;
        }
        try{
            blogId = validation.idCheck(blogId)
            commentId = validation.idCheck(commentId)
            const blogPost = await blogData.get(blogId)
            let commentExists = false
            for (const comment of blogPost.comments){
                const checkId = comment._id.toString()
                if(checkId === commentId){
                    commentExists = true
                }
            } 
            if(!commentExists) throw "You cannot delete a comment that doesnt exist!"
        }catch(e){
            res.status(400).json({error: e})
            return
        }
        try{
            let confirmAuthor = false
            const blogPost = await blogData.get(blogId)
            for (const comment of blogPost.comments){
                const checkId = comment._id.toString()
                if(checkId === commentId){
                    if(comment.userThatPostedComment === user.username)
                        confirmAuthor = true
                }
            } 
            if(!confirmAuthor) throw "You cannot delete a comment that is not yours!"
        }catch(e){
            res.status(403).json({error:e})
            return
        }

        try{
            const updatedBlogComments = await blogData.deleteComment(blogId, commentId, user)
            res.status(200).json(updatedBlogComments)
        }catch(e){
            res.status(500).json({error: e})
            return;
        }
    })



export default router