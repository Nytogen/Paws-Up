import React, {useState, useEffect, useContext} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import styles from '../Edit.css'
import {ip, AuthContext} from '../global'

function ProductDetails() {
    //const [test, setTest] = useState("PlaceHolder");
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [desc, setDesc] = useState("");    
    const [loading, setLoading] = useState(false);
    const [img, setImg] = useState("");
    const [id, setId] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [valid, setValid] = useState(false);
    const [purchases, setPurchases] = useState(0);

    let params = useParams();
    const {token} = useContext(AuthContext)

    const AccLocation = `http://${ip}:8000/api/products/` + params.id

    //const[Error, setError] = useState('')

    const retrieveData = () => {
        fetch(AccLocation, {
            method: 'GET',
            Token: token
        })
        .then(resp => resp.json())
        .then(data => {
            setName(data.name)
            setPrice(data.price)
            setDesc(data.description)
            setImg(data.image)
            setId(data.id);
            setValid(true);
            setLoading(false)            
        })
        .catch(error => console.log('Error:' + error.message))
    }

    const retrievePurchases = () => {
        fetch(`http://${ip}:8000/api/products/${params.id}/getPurchaseRecords`, {
            method: 'GET',
            Token: token
        })
        .then(resp => resp.json())
        .then(purchaseData => {
            var purchaseCount = 0;
            for (var j = 0;  j < purchaseData.length; j++) {
              purchaseCount = purchaseCount + purchaseData[j].quantity;
            }
            setPurchases(purchaseCount)     
        })
        .catch(error => console.log('Error:' + error.message))
    }




    useEffect(() => {
        retrieveData()
        retrievePurchases()
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
        navigate("/")
    }


    if(loading){
        return(
            <div>Loading...</div>
        )
    }

    if(!valid){
        return <div>Invalid Product Number</div>
    }


    return (
        <div> <div style={{fontSize:30, color:'#4e9af1'}}>Product Overview</div>
            <div style={{margin:10, backgroundColor:"#D3D3D3"}}>   

                <div style={editBox}>
                    <div>Name</div>
                    <label>                
                        <input type="text" value={name}  readOnly={true} />
                    </label>
                </div>

                <div style={editBox}>
                    <div>Price($/item)</div>
                    <label>
                        <input type="number" value={price}  readOnly={true}/>
                    </label>
                </div>

                <div style={editBox}>
                    <div>Description</div>
                    <label>
                        <textarea style = {descBox} type="text" value={desc} readOnly={true}></textarea>
                    </label>
                </div>

                <div style={editBox}>
                    <div style={{paddingBottom:10}}>Image</div>
                    <img style={imageBox} src={img}/>
                </div>

                <div style={errorBox}>
                    <div style={{paddingBottom:10}}>{error}</div>
                </div>
                
                <div>Number of Purchases = {purchases}</div>
                

                <div style={editBox}>
                    <button className={"button"} style={{backgroundColor:"#f1bb4e"}}onClick={Back}>Back</button>
                </div>
                <div style={{paddingLeft:10, paddingBottom:10, paddingTop: 10, fontSize: 20}}>
                    <button className={"button"} style={{backgroundColor:"#4e9af1"}} onClick={() => navigate('edit')}>Edit Product</button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails
