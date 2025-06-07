import React, {useState, useEffect, useContext} from 'react'
import {Card, TextInput} from 'react-native-paper'
import { StyleSheet, Text, View, ScrollView, FlatList, Alert, Button as Butt, Image, RefreshControl, ActivityIndicator } from 'react-native';
import Button from '../components/Button';
import {ip, AuthContext} from '../global'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ratings, {DisplayRating} from '../components/Ratings';
import { NavigationContainer } from '@react-navigation/native';

function ProductDetails({ navigation, route}) {
    const [Data, setData] = useState([])
    const[loading, setLoading] = useState(true)
    const[Error, setError] = useState("")

    //variable to check if pull to refresh is being triggered
    const [refreshing, setRefreshing] = useState(false);

    const {id, token } = useContext(AuthContext);

    //User Info
    const [name, setName] = useState("CAT CAT");
    const [price, setPrice] = useState(0);
    const [desc, setDesc] = useState("Yum Cat!");
    const [cartText, setCart] = useState("");
    const [image, setImage] = useState("");

    const {productId} = route.params
    const FullLocation = 'http://' + ip + ':8000/api/products/' + productId
    const retrieveData = () => {
        fetch(FullLocation, {
            method: 'GET',})
        .then(resp => resp.json())
        .then(data => {     
            setName(data.name);
            setPrice(data.price);
            setDesc(data.description);
            setImage(data.image);
            setLoading(false);
            setRefreshing(false);
        })
        .catch(error => console.log(error.message))
        }
       
    function Back(){
        navigation.navigate('ProductScreen', {})
    }
    function AddCart(){
        setCart("Adding Item to Cart...")
        fetch(`http://${ip}:8000/api/products/${productId}/addCart`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization':"Token " + token
            },
            body: JSON.stringify({quantity: 1})    
        })
        .then(function(response){
            if(response.status == 208){
                setCart("Item Already in Cart")
            }else if(response.status == 200){
                setCart("Item Added to Cart")
            }
            else{
                setCart("Unkown Error: Item not Added to Cart")
            }
        })
        .catch(error => setCart("Error: " + error))
    }
    useEffect(()=> {
        retrieveData()
    }, [refreshing])

    function determineImage(){
        if(image == null){
            return(<Image source={require("../img/No-Image.jpg")} style={{width:200, height:200, flex:1}}/>    )
        }
        return (<Image source={{uri: image}} style={{width:200, height:200, flex:1}}/>   )
    }

    const map = () =>{          
        if(loading){
            return (<Text>Loading Info</Text>)
        }

        return(
            <SafeAreaView>

                <ScrollView style={styles.pad} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />}>  
                    <Button color='#FE9834' title='Back' logout onPress={() => Back()}/>

                    <View>
                        <Text style={styles.title}>{name}</Text>          
                    </View>
                    
                    <Text/> 

                    <View style={{flex:1, alignItems:'center'}}>
                        {determineImage()}   
                    </View>

                    <Text/>              

                    <View>
                    <Text style={styles.cart}>{cartText}</Text>  
                    <Button color='#FE9834' title='Add to Cart' logout onPress={() => AddCart()}/>                    
                    </View>

                    <Text/>
                    
                    <View>
                        <Text style={styles.heading}>Pricing</Text>  
                        <Text style={styles.text}>${price}/ item</Text>          
                    </View>

                    <Text/>
                    
                    <View>
                        <Text style={styles.heading}>Description</Text>  
                        <Text style={styles.text}>{desc}</Text>          
                    </View>

                </ScrollView>
        </SafeAreaView>           
        ) 
    }

    return(
        map()
    )
}

const styles = StyleSheet.create({
    cart:{
        fontSize:20,
        color: '#0000FF'
    },

    cardStyle: {
      padding: 10,
      margin: 10,
      textAlign: 'center'
    },

    halfSection:{
        height:'25%'
    },

    map: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    border:{
        borderWidth: 3
    },

    title:{
        fontSize: 36,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#34BDC3'
    },

    description:{
        fontSize: 26,
        textAlign: 'left',
        color: '#FE9834'
    },

    text:{
        color: '#FE9834',
        fontSize: 20
    },

    heading:{
        color: '#34BDC3',
        fontSize: 24,
        textDecorationLine: 'underline'
    },

    row:{
        flexDirection:'row',
        justifyContent: 'space-evenly'
    },

    pad: {
        paddingRight: 25,
        paddingLeft: 25
    }

});

export default ProductDetails