import React, { useEffect, useState } from 'react';
import {useSelector,useDispatch} from 'react-redux';
import axios from 'axios';
import SingleAcceptedRequest from './SingleAcceptedRequest';
import SingleRequest from './SingleRequest';
import { initialisePendingRequests,initialiseAcceptedRequests } from '../../features/user/userSlice';

function PendingRequests() {
  
    const user = useSelector(state => state.users.user);
    const dispatch = useDispatch();
    //const [pendingRequests,setPendingRequests] = useState([]);
    const[no_connections,setNoConnections] = useState(true);
    const accepted_requests = user.accepted_requests;
    const pending_requests = user.pending_requests;
    axios.defaults.withCredentials = true;


    useEffect(()=>{
        if(user.username){
            fetchPendingRequests();
            fetchAcceptedRequests();
        }
    },[])

    const fetchPendingRequests = async()=>{

        const url = `http://localhost:3000/conn-request/pending-requests?authorId=${user.user_id}`
        try {

          const requests = (await axios.get(url)).data.pending_requests;
          dispatch(initialisePendingRequests({"pending_requests":requests}));
            
        } catch (error) {
            alert(error);
            return;
        }
    }

    const fetchAcceptedRequests = async()=>{

        const url = `http://localhost:3000/conn-request/accepted-requests?user_id=${user.user_id}`
        try {
            const acc_requests = (await axios.get(url)).data.accepted_users;
            if(pending_requests.length == 0 && acc_requests.length == 0){
                setNoConnections(true);
                return;
            }
            dispatch(initialiseAcceptedRequests({
            "accepted_requests":acc_requests}
            ))
        } catch (error) {
            alert(error);
            return;
        }
    }

  return (
    <div>
        {   
            pending_requests.length > 0 &&
            <>
                <h2 className='p-5 text-xl font-poppins font-bold'>Pending Requests</h2>
                {
                    pending_requests.map((req)=>{
                        return(
                            <SingleRequest conn_id={req._id} username={req.sender.username}/>
                        )
                    })
                }

            </>
        }
        {
            accepted_requests.length >0 &&
            <>
            <h2 className='p-5 text-xl font-poppins font-bold'>Friends</h2>
            {
            accepted_requests.map((req)=>{

                return(<SingleAcceptedRequest firebaseId={req.firebaseId} username={req.username} user_id={req.user_id}/>)
            })
            }
            </>
            
        }
        {    
            (pending_requests.length<=0 && accepted_requests.length <= 0) &&
            <div className='mt-[10%]'>
            <h2 className='text-xl font-bold font-poppins text-center'>You have no connections as of now:</h2>
            <p className='text-lg font-medium font-poppins text-center mt-10'>Embark on a literary journey! Connect with authors from around the globe and explore the</p>
            <p className='text-lg font-medium font-poppins text-center'>diverse worlds they've created with their words</p>
            </div> 

        }
    </div>
  )
}

export default PendingRequests

