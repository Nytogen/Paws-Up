import React, {useState, useEffect, useContext} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import styles from '../Edit.css'
import {ip, AuthContext} from '../global'

function ProductCreation() {
    //const [test, setTest] = useState("PlaceHolder");
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [desc, setDesc] = useState("");   
    const [img, setImg] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [newImg, setNewImg] = useState(null)

    let params = useParams();
    const {token} = useContext(AuthContext)

    const AccLocation = `http://${ip}:8000/api/products/`

    //const[Error, setError] = useState('')

    function checkData(){
        if(name.localeCompare("") == 0 || desc.localeCompare("") == 0 || img == null){
            setError("An input field was not filled in")
            return true
        }

        if(price <= 0){
            setError("Invalid Price was inputted")
            return true
        }

        return false
    }

    const createProduct = () => {
        if(checkData()){
            return;
        }

        var formData = new FormData();
        formData.append("name",name);

        let tempPrice = price
        tempPrice = tempPrice*100
        let leftovers = tempPrice % 1
        tempPrice = tempPrice - leftovers
        tempPrice = tempPrice / 100

        formData.append("price", tempPrice);
        formData.append("description", desc);
        
        if(!(newImg == null)){
            formData.append("image", newImg);
        }
     
        fetch(AccLocation, {
            method: 'POST',
            headers: {
                'Authorization': "Token " + token
            },
            body: formData
        })
        .then(resp => resp.json())
        .then(Back())
        .catch(error => setError(error.message))
    }    


    const descBox = {
        width: '50%',
        height: '200'
    };

    
    const imageBox = {
        width: 150,
        height: 150
    };

    const editBox = {
        paddingLeft: 10,
        paddingTop: 10
    };

    const errorBox = {
        paddingLeft: 10,
        paddingTop: 10,
        color:"#FF0000"       
    }


    const Back = (e) =>{
        navigate("/")
    }


    const changeImage = (data) =>{
        setImg(URL.createObjectURL(data.target.files[0]))
        setNewImg(data.target.files[0])
    }






    return (
        <div>
            <div style={{margin:10, backgroundColor:"#D3D3D3"}}>   
                <div style={editBox}>
                    <button className={"button"} style={{backgroundColor:"#f1bb4e"}}onClick={Back}>Back</button>
                </div>

                <div style={editBox}>
                    <div>Name</div>
                    <label>                
                        <input type="text" value={name} onChange={e => setName(e.target.value)} />
                    </label>
                </div>

                <div style={editBox}>
                    <div>Price($/item)</div>
                    <label>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)}/>
                    </label>
                </div>

                <div style={editBox}>
                    <div>Description</div>
                    <label>
                        <textarea style = {descBox} type="text" value={desc} onChange={e => setDesc(e.target.value)}>{desc}</textarea>
                    </label>
                </div>

                <div style={editBox}>
                    <div style={{paddingBottom:10}}>Image</div>
                    <img style={imageBox} src={img}/>
                    <div>
                        <input type="file" onChange={(data) =>{changeImage(data)}}/>
                    </div>
                </div>

                <div style={errorBox}>
                    <div style={{paddingBottom:10}}>{error}</div>
                </div>

                <div style={{paddingLeft:10, paddingBottom:10, paddingTop: 10}}>
                    <button className={"button"} style={{backgroundColor:"#4e9af1"}} onClick={createProduct}>Create Product</button>
                </div>
            </div>
        </div>
    )
}

export default ProductCreation
