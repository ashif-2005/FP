import React, { useEffect, useState } from 'react'
import Login from './Login';

const Stock = () => {
  const [token, SetToken] = useState("")

  useEffect(() => {
    const tkn = getToken()
    SetToken(tkn)
  }, [])

  const getToken = () => {
    const name = 'token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let c of cookies) {
        c = c.trim();
        if (c.indexOf(name) === 0) {
        return c.substring(name.length);
        }
    }
    return null;
  }

  return (
    token ? 
    <div className='page-container'> LOGGED IN SUCCESSFULL </div>
    : 
    <div>
        <Login />
    </div>
  )
}

export default Stock;