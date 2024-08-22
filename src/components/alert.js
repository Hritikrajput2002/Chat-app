import React from 'react'

const Alert = (props) => {
  return (
    <>
       {props.alert   &&  (<span className="alert alert-warning" style={{position:"absolute", top:"20px"}} role="alert">
              <strong>{props.alert.type}</strong>:{props.alert.msg}
         </span>)
        }
    </>
  )
}

export default Alert