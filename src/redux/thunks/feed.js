import { createAsyncThunk } from '@reduxjs/toolkit'
import { setAvailablePosts } from '../reducers/feed'
import posts from "../../data/Post.js"
import comments from "../../data/Comment.js"
import moment from 'moment'

export const fetchPosts = createAsyncThunk("feed/fetchPosts", async (userIdUrl, thunkApi) => {
    
    const stateUserOrganizationId = thunkApi.getState().user.organizationId;
    const currentPage = thunkApi.getState().feed.pagination.currentPage
    const postsPerPage = thunkApi.getState().feed.pagination.postsPerPage
    
    const startIndex = (currentPage - 1) * postsPerPage;
    try {
        let filteredPosts = [];

        if (userIdUrl) {
            filteredPosts = posts.filter(post => post.organizationId === stateUserOrganizationId && post.author.id === userIdUrl);
        }
        else{
            filteredPosts = posts.filter(post => post.organizationId === stateUserOrganizationId);
        }
        
        const sortedPosts = filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const endIndex = startIndex + Math.min(postsPerPage, sortedPosts.length - startIndex);

        const totalPosts = sortedPosts.length;

        const availablePosts = totalPosts > endIndex;
        thunkApi.dispatch(setAvailablePosts(availablePosts));

        const slicedPosts = sortedPosts.slice(startIndex, endIndex);
        return slicedPosts;
        
    } catch (error) {
        throw new Error("Une erreur s'est produite");
    }
});

export const fetchComments = createAsyncThunk("feed/fetchComments", async (postId) => {
    try {
        const postComments =
            comments.filter((comment) => comment.post_id === postId);

        return {postComments, postId}

    }
    catch (error) {
        throw new Error( "Une erreur s'est produite");
    }
})


export const addNewComment = createAsyncThunk("feed/addNewComment", async ({text, postId}, thunkApi) => {
    
    
    try {
        

        // fetch of logged-in user data
        const userLogged = thunkApi.getState().user

        const comments = thunkApi.getState().feed.posts.find((post) => post.id === postId).comments
        
        const lastcomment = comments[comments.length - 1];
        const newId = (lastcomment?.id || 0) + 1;
        
        const now = moment() ;

        const date = now.format('YYYY-MM-DD');
        const time = now.format('HH:mm:ss');
        const formattedDate = `${date} ${time}`

        const newComment = {
            id: newId,
            text: text,
            author: userLogged,
            createdAt: formattedDate,
            post_id: postId
        };

        delete newComment.author.error
        return {newComment, postId}

    }
    catch (error) {
        throw new Error( "Une erreur s'est produite");
    }
})


export const addNewPost = createAsyncThunk("feed/addNewPost", async (text, thunkApi) => {
    try {

        // fetch of logged-in user data
        const userLogged = thunkApi.getState().user

        const posts = thunkApi.getState().feed.posts
        
        const lastpost = posts[posts.length - 1];
        const newId = (lastpost?.id || 0) + 1;
        
        const now = moment() ;

        const date = now.format('YYYY-MM-DD');
        const time = now.format('HH:mm:ss');
        const formattedDate = `${date} ${time}`

        const newPost = {
            id: newId,
            text: text,
            reactions:[],
            commentsCount: 0,
            author: {
                id: userLogged.id,
                email: userLogged.email,
                name: userLogged.name,
                surname: userLogged.surname,
                job: userLogged.job,
                role: {
                    tag: userLogged.role.tag,
                    name: userLogged.role.name,
                },
                profilePicture: userLogged.profilePicture,
                disabled: userLogged.disabled,
            },
            createdAt: formattedDate
        };
        
        return newPost;

    }
    catch (error) {
        throw new Error( "Une erreur s'est produite");
    }
})

export const addReaction = createAsyncThunk("post/addReaction", async ({postId, reaction}, thunkApi) => {
    try {
        const userLogged = thunkApi.getState().user
        const posts = thunkApi.getState().feed.posts
        const post = posts.find(({id}) => id === postId)  
        
        if (!post) {
            return thunkApi.rejectWithValue({ status: 409, message: "Ce post n'existe pas" });
        } 

        const lastReaction = post.reactions[post.reactions.length - 1];
        
        const newId = (lastReaction?.id || 0) + 1 ;
        
        const  newReaction = {
            id: newId, 
            author:{
                id: userLogged.id,
                name: userLogged.name,
                surname: userLogged.surname,
                job: userLogged.job,
                profilePicture: userLogged.profilePicture,
            },
            type:{
                tag: `${reaction}`,
                name: `${reaction}`,
            },
        };
       
        return {newReaction, postId}
        
    }
    catch (error) {
        return thunkApi.rejectWithValue({ status: 500, message: "Une erreur s'est produite lors de l'ajout de la reaction" });  
    }
})



export const updateReaction = createAsyncThunk("post/updateReaction", async ({postId, reaction}, thunkApi) => {

    try {
        const posts = thunkApi.getState().feed.posts
        const post = posts.find(({id}) => id === postId)  
        
        if (!post) {
            return thunkApi.rejectWithValue({ status: 409, message: "Ce post n'existe pas" });
        } 

        const updatedReaction = {
            tag: `${reaction}`,
            name: `${reaction}`,
        };
       
        return {updatedReaction, postId, authorId: post.author.id}
    }
    catch (error) {
        return thunkApi.rejectWithValue({ status: 500, message: "Une erreur s'est produite lors de l'ajout de la reaction" });  
    }
})


export const removeReaction = createAsyncThunk("post/removeReaction", async ({postId, reaction}, thunkApi) => {

    try {
        const userLogged = thunkApi.getState().user
        const posts = thunkApi.getState().feed.posts
        const exist = posts.some(({id}) => id ===postId)  
        
        if (!exist) {
            return thunkApi.rejectWithValue({ status: 409, message: "Ce post n'existe pas" });
        } 

        const  removedReaction = {
            
            author:{
                id: userLogged.id,
                name: userLogged.name,
                surname: userLogged.surname,
                job: userLogged.job,
                profilePicture: userLogged.profilePicture,
            },
            type:{
                tag: `${reaction}`,
                name: `${reaction}`,
            },
        };
       
        return {removedReaction, postId}
        
    }
    catch (error) {
        return thunkApi.rejectWithValue({ status: 500, message: "Une erreur s'est produite lors de l'ajout de la reaction" });  
    }
});
