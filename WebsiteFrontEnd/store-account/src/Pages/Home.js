
import React, {useContext} from 'react'
import Cards from './Cards'
import { BrowserRouter as Router, Routes, Route, Link, } from 'react-router-dom';
import Login from './Login/Login'
import Button from "@material-ui/core/Button";
import {ip, AuthContext} from '../global'

function Home() {

  const {logout, token, id} = useContext(AuthContext);
  console.log(id)
  console.log(token)

  return (
  <>  <div style = {{padding: 30}}>
       <Button variant="contained"
        size="small"
        color="primary" text-decoration="none" onClick={logout}>Log out</Button>
      <div>
        <br></br>
        <Link  to='/create'><Button
       variant="contained"
        size="small"
        color="primary">
        Add Product
      </Button></Link>
      </div>

      <Cards/>
      </div>
  </>
  )
}

export default Home
