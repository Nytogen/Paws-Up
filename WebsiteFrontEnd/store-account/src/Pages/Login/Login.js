import React, {useState} from 'react'
import '../../App.css'
import './Login.scss'
import { ip } from '../../global'

function Login({setToken, id}) {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    const [errorMsg, setErrorMsg] = useState(null)

    const enterAccount = () => {
        //fetch from api using method post
        fetch(`http://${ip}:8000/api/accounts/login`, {
            method: 'POST',
            headers: {
                //bc we are sending JSON data
                'Content-Type': 'application/json'
            },
            //body of the JSON object we are sending
            body: JSON.stringify({email: email, password: password})
        })
        //convert data into JSON object
        .then(resp => resp.json())
        .then(data => {
            //checking if successful
            console.log(data)
            if ('token' in data) {
                console.log(data.token)
                console.log(data.id)
                setToken(data.token)
                id = data.id

            } else {
                //an array to hold the errors if login is not successful
                let err_arr = []
                for (const key in data) {
                    if (key === 'non_field_errors') {
                        err_arr.push(`${data[key]}`)
                    }
                    err_arr.push(`${key}: ${data[key]}`)
                }
                setErrorMsg(err_arr[0])
            }
        })
        .catch(error => {
            console.log(error)
            setErrorMsg(error.message)
        })
    }

    return (
        <div className="container">
            <div className="welcome">
                <img src="images/welcome_cat.svg" alt="welcome" className="img"/>
            </div>
            <div className="form-container">
                <img src="images/pawsuppic.jpg" alt="PawsUp" className="img"/>
                <h1 className="title">Please Log In</h1>
                <div>
                    <label>
                        <h2>Email</h2>
                        <input className="input" type="email" onChange={(event) => setEmail(event.target.value)}/>
                    </label>
                    <label>
                        <h2>Password</h2>
                        <input className="input" type="password" onChange={(event) => setPassword(event.target.value)}/>
                    </label>
                    <div>
                        <button className="butt" type="submit" onClick={enterAccount}>Log In</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
