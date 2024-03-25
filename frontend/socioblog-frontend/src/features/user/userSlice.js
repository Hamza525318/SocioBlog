import {createSlice} from "@reduxjs/toolkit"
import axios from "axios";

const initialState = {
    user:{
        username:"",
        email:"",
        user_id:"",
        verifyUser:false,
        favTopics: [],
        socket: {},
        realtime_likes: 0,
        realtime_arr: [],
        read_notifications: [],
        unread_notifications: [],
        pending_requests: [],
        accepted_requests:[],
        bgImage_chat: "",
    },
}

export const userSlice = createSlice({

    name:'userSlice',
    initialState: initialState,
    reducers:{
        addUser: (state,action)=>{
           state.user.username = action.payload.username;
           state.user.email = action.payload.email;
           state.user.user_id = action.payload.user_id;
           state.user.verifyUser= true;
           state.user.favTopics = [...action.payload.favTopics];
           state.user.bgImage_chat = action.payload.chatBgImage
        },
        logOutUser: (state,action)=>{
            state.user.verifyUser = false;
            state.user.user_id = "";
            state.user.username = "";
            state.user.email = "";
            state.user.favTopics = [];
            state.user.socket = {};
            state.user.accepted_requests = [];
            state.user.pending_requests = [];
            state.user.read_notifications = [];
            state.user.unread_notifications = [];
            state.user.realtime_likes = 0;
            state.user.realtime_arr = [];
            state.user.bgImage_chat = "";
        },
        updateFavouriteTopics:(state,action)=>{
            state.user.favTopics = action.payload.favTopics;
        },
        addSocketConnection: (state,action)=>{
            state.user.socket = action.payload.socket;
        },
        incrementRealTimeLike: (state,action)=>{
            state.user.realtime_likes = state.user.realtime_likes + 1;
        },
        addNewRealtimeLike: (state,action)=>{
            // state.user.realtime_arr.push({"username":action.payload.username,"title":action.payload.title})
            state.user.unread_notifications.push({"username":action.payload.username,"title":action.payload.title});
        },
        addNotifications: (state,action)=>{
            //state.user.read_notifications = [...action.payload.read_notifications];
            state.user.unread_notifications = [...action.payload.unread_notifications];
            state.user.realtime_likes += action.payload.unread_likes_count;
        },
        updateUnreadtoReadnots:(state,action)=>{
            const { unread_notifications, read_notifications
            } = state.user;
            state.user.read_notifications = [...unread_notifications, ...read_notifications];
            state.user.unread_notifications = [];
            state.user.realtime_likes = 0;
        },
        updateReadNotifications: (state,action)=>{
            console.log(action);
            state.user.read_notifications = [...action.payload.read_notifications];
        },
        initialisePendingRequests: (state,action)=>{
            state.user.pending_requests = [...action.payload.pending_requests];
            //state.user.accepted_requests = [...action.payload.accepted_requests];
        },
        initialiseAcceptedRequests: (state,action)=>{
            state.user.accepted_requests = [...action.payload.accepted_requests];
        },
        addNewConnectionRequest: (state,action)=>{
            state.user.pending_requests.push(action.payload.connObj);
        },
        addAcceptedConnectionRequest: (state,action)=>{
            state.user.pending_requests.splice(action.payload.index,1);
            state.user.accepted_requests.push(action.payload.connObj);
        },
        updateAcceptedConnectionRequests: (state,action)=>{
            const isPresent = state.user.accepted_requests.find((accObj)=> accObj.user_id === action.payload.connObj.user_id);
            if(!isPresent){
                state.user.accepted_requests.push(action.payload.connObj);
            }
        },
        updateBgImageForChat: (state,action)=>{
           state.user.bgImage_chat = action.payload;
        },
        removeChatBg: (state,action)=>{
           state.user.bgImage_chat = "";
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


export const {
addUser,
logOutUser,
updateFavouriteTopics,
addSocketConnection,
incrementRealTimeLike,
addNewRealtimeLike,
addNotifications,
updateUnreadtoReadnots,
removeSocketConnection,
addNewConnectionRequest,
initialisePendingRequests,
initialiseAcceptedRequests,
addAcceptedConnectionRequest,
updateAcceptedConnectionRequests,
updateReadNotifications,
updateBgImageForChat,
removeChatBg
} = userSlice.actions
export default userSlice.reducer;