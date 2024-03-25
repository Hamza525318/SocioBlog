import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./features/user/userSlice"
import blogReducer from "./features/blogs/blogSlice"

export const store = configureStore({

    reducer: {
        users: userReducer,
        blogs: blogReducer,
    }
})

//store is like the global state of application , basically a single immutable object