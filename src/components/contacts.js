import React from 'react'
import { useState,useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';



const Contacts = (props) => {

     const [allcontacts,setcontacts]=useState([]);
     const navigate=useNavigate();

     const fetchcontacts=async()=>{
          const response=await fetch('http://localhost:5000/api/auth/getcontacts',{
            method:'GET',
            headers:{
               'Content-Type': 'application/json',
               'token':localStorage.getItem('token')
            }
          })
        
        const parsed= await response.json();
         setcontacts(parsed);

      
    }
    const handleclick=async(contact)=>{
      props.receiver(contact)
    }

    useEffect(()=>{
          if(!localStorage.getItem('token')){
             navigate('/login')
          }
          fetchcontacts();
    },[]) 

  return (

    <>
       <div className='container ' id="contacts" style={{height:"70vh",width:"400px",backgroundColor:"#131324",overflow:"scroll",padding:"10px"}}>
            <h2 className="text-white" >Contacts</h2>
              <ul className="d-flex flex-column justify-content-start" style={{paddingInlineStart:"5px"}}>
                {
                  allcontacts.map((contact, index) => (
                    <li key={index} onClick={()=>{handleclick(contact)}} style={{listStyleType:"none"}}>
                      <div className=" my-1" style={{borderRadius:"10px", padding:"5px",backgroundColor:"#ffffff39"}}>
                      <img  src={contact.additionalData.imageUrl} alt={contact.name} style={{ width: "50px", height: "50px" ,marginRight:"5px", borderRadius: "50%" }} />
                      <span className="fs-5 fw-bold">{contact.name}</span>
                      </div>
                    </li>
                  ))
                }
              </ul>
      
       </div>
    </>
  )
}

export default Contacts;
