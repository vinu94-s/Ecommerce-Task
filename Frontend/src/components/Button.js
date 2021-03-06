import React from 'react'
import {Button} from 'react-bootstrap';

const Button1 = props => {
   // console.log("clicked")
    return(
        <Button  className="btn btn-lg"
        disabled={!props.active}
        onClick = { props.onClick } type={props.type?props.type:'button'} style={{
            backgroundImage: `linear-gradient(315deg, #89d8d3 0%, #03c8a8 74%)`,
            backgroundColor: `#89d8d3`,
            fontWeight:'500',
            fontSize:"1.6em",
            border:'none'
            
            
           
        }}>
    {props.children}
        </Button>
    )
}


export default Button1