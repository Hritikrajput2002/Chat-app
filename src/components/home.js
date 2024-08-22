import React, { useState, useEffect } from 'react';
import Contacts from './contacts';
import Chatimg from '../asset/chat.png';
import defaultimage from '../asset/defaultpic.png' 
import { Navigate, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate=useNavigate();
  const [message,setmessage]=useState("");
  const [chat,setchat]=useState([]);
  const [currentuser, setuser] = useState({
          name: '',
          _id:'',
          additionalData: {
          imageUrl: ''
        }
      });
  const [receiver,setreceiver]=useState({
          name: '',
          _id:'',
          additionalData: {
          imageUrl: ''
        }
      })
const setfriend=(element)=>{
    setreceiver(element)
   // refreshchat();
}



  const fetchuser = async () => {
        const response = await fetch('http://localhost:5000/api/auth/getuser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
          }
        });
        const parsed = await response.json();
        setuser(parsed);
  };


  const handlesend=async()=>{
    const response=await fetch('http://localhost:5000/api/msgs/addmsg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
          to:receiver._id,
          from:currentuser._id,
          message:message
      })
    });
    refreshchat();
    document.getElementById("exampleInput").value="";
    
   

  }

  const refreshchat=async()=>{
       const response=await fetch('http://localhost:5000/api/msgs/showmsg', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                to:receiver._id,
                from:currentuser._id
            })
          });
        const resposnparsed=await response.json();
        setchat(resposnparsed)
  }

  const handlemessage=(e)=>{
         setmessage(e.target.value)
  }

  const handlelogout=()=>{
    localStorage.removeItem('token')
    navigate('/login')
  }
 



  useEffect(() => {
    fetchuser();
    if (receiver._id) {
      refreshchat();
    }
  }, [receiver]);

  return (
    <>
      <div className='d-flex' >
            {/* leftspace */}
            <div style={{ height: "100vh", backgroundColor: "#131324"}}>
                <div style={{ height: "15vh", padding: "10px" }}>
                  <img src={Chatimg} style={{ width: "70px", marginRight: "5px" }} alt="Chat Logo" />
                  <span className="text-white fs-3">IndiChat</span>
                </div>
                <Contacts  receiver={setfriend}/>

                <div className='py-2'style={{ height: "15vh", padding: "10px"}}>
                    <button className='btn btn-primary opacity-50 mx-3 mt-5' onClick={handlelogout}>Logout</button> 
                </div>
            </div>


            {/* right space */}
            <div style={{ backgroundColor: "#080420", height: "100vh", width: "calc(100% - 400px)" }}>
                  <div className="d-flex flex-roe " style={{ width: "100%", height: "10vh", backgroundColor: "#0e172e" }}>
                    {receiver.name &&
                    <div className="my-1" style={{ borderRadius: "10px", padding: "5px"}}>
                      <img
                        src={receiver.additionalData.imageUrl}
                        alt={receiver.name}
                        style={{ width: "50px", height: "50px", marginRight: "5px", borderRadius: "50%" }}
                      />
                      <span className="fs-5 fw-bold text-white">{receiver.name}</span>
                    </div>
                    }

                    <div className="my-1" style={{ borderRadius: "10px", padding: "5px" ,position:"absolute",right:"20px"}}>
                      <img
                        src={currentuser.additionalData.imageUrl}
                        alt={currentuser.name}
                        style={{ width: "50px", height: "50px", marginRight: "5px", borderRadius: "50%" }}
                      />
                      <span className="fs-5 fw-bold text-white">{currentuser.name}</span>
                    </div>
                  </div>

                  {/* chat area */}
                  <div  id="chatarea" style={{height:"75vh",overflowY:"scroll",scroll:"hidden",scrollTop:"scrollHeight",padding:"20px"}}>

                            { !receiver.name &&
                                        <div className="opacity-50" style={{position:'absolute',top:"150px",left:"600px",}} >
                                          <img src={defaultimage} width="75%" ></img>
                                        </div>
                            }
                   
                   {chat.map((chat, index) => {
                          return (
                            <div key={index} style={{display: "flex", justifyContent: chat.selfuser ? "flex-end" : "flex-start",marginBottom: "10px"}}>
                              <p style={{
                                  maxWidth: "70%",
                                  minWidth:"5%",
                                  padding: "10px",
                                  borderRadius: "10px",
                                  backgroundColor: chat.selfuser ? "#007bff" : "#343a40",
                                  color: "white",
                                  textAlign: "center",
                                  fontSize:"20px"
                                }}
                              >
                                {chat.message}
                              </p>
                            </div>
                          );
                        })}
                  </div>

                  {/* input area */}
                  <div className='px-3 mt-5' >
                                {receiver.name &&
                                  <div className="d-flex ">
                                    <input type="text"  className="form-control me-2 text-light"  onChange={handlemessage } style={{ backgroundColor: "#0e172e" }} id="exampleInput"/>
                                    <button type="submit" className="btn btn-primary me-3 " onClick={handlesend}>Send</button>
                                  </div>
                                }
                  </div>
            </div>
      </div>
    </>
  );
};

export default Home;
