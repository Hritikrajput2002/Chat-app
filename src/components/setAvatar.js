import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Setavatar = () => {
  const [avatars, setAvatars] = useState([]);
  const [selectedimage,setimage]=useState('');
  const navigate= useNavigate();

  const fetchAvatars = async () => {
    try {
      const avatarUrls = [];
      for (let i = 0; i < 5; i++) {
        const randomId = Math.floor(Math.random() * 1000);
        const avatarUrl= `https://api.multiavatar.com/${randomId}.png?apikey=m8tEFp9JIXCSJB`;
        avatarUrls.push(avatarUrl);
      }
      setAvatars(avatarUrls);
    } 
    catch (error) {
      console.error('Error fetching avatars:', error);
    }
  };

  const selecthandle=(avatarUrl)=>{
            setimage(avatarUrl);
          
  }
  const submitavatar=async()=>{
    console.log(selectedimage)
    const response=await fetch('http://localhost:5000/api/auth/setavatar',{
      method:'POST',
      headers:{
         'Content-Type': 'application/json',
         'token':localStorage.getItem('token')
      },
      body:JSON.stringify({
          imageurl:selectedimage
      })

    })
      navigate('/')
  }

  useEffect(() => {
    if(!localStorage.getItem('token')){
           navigate('/login');
    }
    fetchAvatars();
  }, []); // Run fetchAvatars only once on component mount

  return (
    <>
        <div className="" style={{height:"100vh",paddingTop:"200px",background:"#162a61"}}>
          
          <div className="d-flex flex-column justify-content-center ">
              <h1 style={{ textAlign: 'center',fontSize:"70px",color:"blue",marginBottom:"40px" }}>Select Avatar</h1>
              {avatars.length > 0 && ( // Render only if avatars are fetched successfully
                <ul className="d-flex justify-content-center" >
                  {avatars.map((avatarUrl, index) => (
                    <li key={index} style={{listStyleType:'none',display:'inline-block'}}>
                      <img src={avatarUrl}  onClick={()=>{selecthandle(avatarUrl)}}  style={{width:"120px",margin:"20px",borderRadius:"50%",border:selectedimage ===avatarUrl ?  '10px solid blue': null}}   alt={`Avatar ${index + 1}`} />
                    </li>
                            //   

                  ))}
                </ul>
              )}
              <div className="d-flex  justify-content-center mt-5">
                  <button  type="button" className="btn btn-primary ml-2" style={{width:"100px"}} onClick={submitavatar}>Set Avatar</button>
              </div>

          </div>
                   

        </div>
    </>
  );
};

export default Setavatar;
