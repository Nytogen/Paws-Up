import React, {useState, useEffect, useContext} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import styles from '../Edit.css'
import { ip, AuthContext } from '../global'

function EditProduct() {
    //const [test, setTest] = useState("PlaceHolder");
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [desc, setDesc] = useState("");    
    const [loading, setLoading] = useState(false);
    const [img, setImg] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [valid, setValid] = useState(false);
    const [delPro, setDel] = useState(false);
    const [newImg, setNewImg] = useState(null)

    let params = useParams();

    const AccLocation = `http://${ip}:8000/api/products/` + params.id

    const {token} = useContext(AuthContext);

    //const[Error, setError] = useState('')

    const retrieveData = () => {
        fetch(AccLocation, {
            method: 'GET',
        })
        .then(resp => resp.json())
        .then(data => {
            setName(data.name)
            setPrice(data.price)
            setDesc(data.description)
            setImg(data.image)
            setValid(true);
            setLoading(false)            
        })
        .catch(error => console.log('Error:' + error.message))
    }

    function checkData(){
        if(name.localeCompare("") == 0 || desc.localeCompare("") == 0){
            setError("An input field was not filled in")
            return true
        }

        if(price <= 0){
            setError("Invalid Price was inputted")
            return true
        }

        return false
    }

    const editData = () => {
        setDel(false)
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
            method: 'PATCH',
            headers: {
                'Authorization': "Token " + token
            },
            body: formData
        })
        .then(resp => resp.json())
        .then(Back())
        .catch(error => setError(error.message))
    }    

    useEffect(() => {
        retrieveData()
    }, [])

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
        navigate(`/${params.id}`)
    }

    const deleteProd = () =>{
        //Placeholder
        if(!delPro){
            setError("ARE YOU SURE?")
            setDel(true)
            return
        }
        fetch(AccLocation, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token
            },
            body: JSON.stringify({name:name, price:price, description:desc})
        })
        .then(resp => resp.json())
        .then(navigate(`/`))
        .catch(error => {
            setError(error.message) 
            return})        
    }

    const changeImage = (data) =>{
        setImg(URL.createObjectURL(data.target.files[0]))
        setNewImg(data.target.files[0])
    }

    if(loading){
        return(
            <div><text>Loading...</text></div>
        )
    }

    if(!valid){
        return <div><text>Invalid Product Number</text></div>
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
                    <button className={"button"} style={{backgroundColor:"#4e9af1"}} onClick={editData}>Edit Product</button>
                    <button className={"button"} style={{backgroundColor:"#f14e4e"}} onClick={deleteProd}>DELETE</button>
                </div>
            </div>
        </div>
    )
}

export default EditProduct
