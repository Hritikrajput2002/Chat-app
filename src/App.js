import Navbar from './components/navbar';
import Login from './components/login';
import Signup from './components/signup';
import Home from './components/home';
import Alert from './components/alert';
import Setavatar from './components/setAvatar';
import { useState } from 'react';
import { BrowserRouter as Router,Route,Routes,Link } from 'react-router-dom';
//import './App.css';

function App() {
  const[alert,setalert]=useState(null);
  const callalert=(type,msg)=>{
      setalert({type:type,
               msg:msg
               
      })

      setTimeout(() => {
        setalert(null)
      },1500);
  }

  return (
    <>
      <Router>
        {/* <Navbar/> */}
        

        
          <Routes>
          <Route exact path="/" element={<Home/>}     />
          <Route exact path="/login" element={<Login alert={alert} callalert={callalert}/>}     />
          <Route exact path="/signup"  element={<Signup alert={alert} callalert={callalert}/>}  />
          <Route exact path="/Setavatar"  element={<Setavatar />}  />

          </Routes>

      </Router>
    
    </>
  );
}

export default App;
