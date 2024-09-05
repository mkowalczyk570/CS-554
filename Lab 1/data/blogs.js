import validation  from '../helpers.js'
import { blogs } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';

const exportedMethods = {
    async get(id){
        id = validation.idCheck(id)
        const blogCollection = await blogs()
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        if(!blog) throw 'No blog with that Id found'
        return blog
    },
    async getPosts(skip = 0, limit = 20){
        skip = validation.numCheck(skip)
        limit = validation.numCheck(limit)
        if(limit > 100) limit = 100
        const blogCollection = await blogs()
        const data = await blogCollection.find().skip(skip).limit(limit).toArray()
        return data
    },
    async createBlogPost(blogTitle, blogBody, user){
        blogTitle = validation.stringCheck(blogTitle)
        if(blogTitle.length < 5) throw "Blog title must be at least length 5"
        blogBody = validation.stringCheck(blogBody)
        if(blogBody.length < 25) throw "Blog body must be at least length 25"
        if(!user) throw 'You must be logged in to post'
        const userThatPosted = {
            _id: new ObjectId(user._id),
            username: user.username
        }

        const blogEntry = {
            blogTitle: blogTitle,
            blogBody: blogBody,
            userThatPosted: userThatPosted,
            comments: []
        }
        const blogCollection = await blogs()
        const insertedInfo = await blogCollection.insertOne(blogEntry)
        if(!insertedInfo.acknowledged || !insertedInfo.insertedId){throw 'Could not add blog post'};

        return blogEntry
    },

    async patchBlogPost(newTitle, newBody, blogId, user){
        blogId = validation.idCheck(blogId)
        const blogInfo = await this.get(blogId);

        if(user._id.toString() !== blogInfo.userThatPosted._id.toString() || 
         user.username !== blogInfo.userThatPosted.username) throw "You must be the author of this blog to edit it."

        if(!newTitle){
            newtitle = blogInfo.blogTitle
        }
        if(!newBody){
            newBody = blogInfo.blogBody
        }

        const updateBlog = {
            "blogTitle": newTitle.trim(),
            "blogBody": newBody.trim()
        }

        const blogCollection = await blogs()
        const updatedInfo = await blogCollection.updateOne(
            {_id: new ObjectId(blogId)},
            {$set: updateBlog},
            {returnDocument: "after"}
          )
          if(updatedInfo.modifiedCount === 0) throw 'could not update blog successfully'
          return await this.get(blogId)
    },
    async editBlogPost(newTitle, newBody, blogId, user){
        newTitle = validation.stringCheck(newTitle)
        if(newTitle.length < 5) throw "Blog title must be at least length 5"
        newBody = validation.stringCheck(newBody)
        if(newBody.length < 25) throw "Blog body must be at least length 25"
        if(!user) throw 'You must be logged in to edit'

        blogId = validation.idCheck(blogId)
        const blogInfo = await this.get(blogId);
        

        if(user._id.toString() !== blogInfo.userThatPosted._id.toString() || 
         user.username !== blogInfo.userThatPosted.username) throw "You must be the author of this blog to edit it."

        const updateBlog = {
            "blogTitle": newTitle,
            "blogBody": newBody
        }

        const blogCollection = await blogs()
        const updatedInfo = await blogCollection.updateOne(
            {_id: new ObjectId(blogId)},
            {$set: updateBlog},
            {returnDocument: "after"}
          )
          if(updatedInfo.modifiedCount === 0) throw 'could not update blog successfully'
          return await this.get(blogId)
    },
    async addComment(blogId, comment, user){
        comment = validation.stringCheck(comment)
        if(comment.length < 3) throw "Comment must be at least 3 characters long"
        blogId = validation.idCheck(blogId)
        if(!user) throw 'You must be logged in to comment'

        const commentInfo = {
            _id: new ObjectId(),
            userThatPostedComment: user.username,
            comment: comment
        }

        const blogCollection = await blogs()
        const updatedInfo = await blogCollection.updateOne(
            {_id: new ObjectId(blogId)},
            {$push: {comments: commentInfo}},
            {returnDocument: "after"}
        )
        
        if(updatedInfo.modifiedCount === 0) throw "Could not update blog successfully"
        return await this.get(blogId)
    },
    async deleteComment(blogId, commentId, user){
        blogId = validation.idCheck(blogId)
        commentId = validation.idCheck(commentId)
        const blogInfo = await this.get(blogId)
        const comments = blogInfo.comments
        let commentInfo;
        if(!user) throw 'You must be logged in to delete'

        for(const comment of comments){
            if(comment._id.toString() === commentId.toString()){commentInfo = comment}
        }
        
        if(!commentInfo) throw "No comment with provided Id"
        if(commentInfo.userThatPostedComment !== user.username.toLowerCase()){
            throw "You cannot delete other users comments."
        }
        
        const blogCollection = await blogs()
        const updatedComments = await blogCollection.updateOne(
            {_id: new ObjectId(blogId)},
            {$pull: {comments: {_id: new ObjectId(commentId)}}},
            {returnDocument: "after"}
        )
        if(updatedComments.modifiedCount === 0) throw "Could not update comments succussfully"
        return await this.get(blogId)
    }

}

export default exportedMethods