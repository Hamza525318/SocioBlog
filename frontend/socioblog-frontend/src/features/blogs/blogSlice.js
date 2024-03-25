import {createSlice} from "@reduxjs/toolkit"

const initialState = {

    allBlogs: [],
    blogsFetched: false,
    deletedBlog: false,
    blogClickCount: 1,
      
}

export const blogSlice = createSlice({

    name:'blogSlice',
    initialState: initialState,
    reducers:{
        updateIsFetched: (state,action)=>{
            state.blogsFetched = !state.blogsFetched
        },
        updateAllBlogs: (state,action)=>{
            state.allBlogs = [...state.allBlogs,...action.payload.blogs];
        },
        updateDeletedBlog:(state,action)=>{
            state.deletedBlog = !state.deletedBlog;
        },
        updateBlogClickCount: (state,action)=>{
            state.blogClickCount = state.blogClickCount+1;
        }
    }
})

//state - holds the current state of your application
/*actions are plain javascript object that represents changes or events in your appln, they have a type property
  which is a string describing the action and can have payload data in additional
*/

/*
reducers are function that specifies how the state is going to update in response to action , takes in two arguements
state and action, returns a new state based on the action
*/

/*
dispatch method dispatches action, when you dispatch action corresponding reducer function is called from the store
*/

/* subscribe -> allows you to register a callback function which is called when an action is dispatched */


export const {updateIsFetched,updateAllBlogs,updateDeletedBlog,updateBlogClickCount} = blogSlice.actions
export default blogSlice.reducer;