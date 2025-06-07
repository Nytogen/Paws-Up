import React,{useState, useContext, useEffect}from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import ProductList from './ProductList';
import Button from '../components/Button';
import {SearchBar} from 'react-native-elements';
import { ip, AuthContext } from '../global';
import AntDesign from 'react-native-vector-icons/AntDesign'

function Products({navigation, route}) {

    const [searchCriteria, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [searchResults, setRes] = useState([]) // Search results stores an array of ints corresponding
                                                // to the 

    const FullLocation = 'http://' + ip + ':8000/api/products/'
    const {logout, id, token } = useContext(AuthContext)
    const Token = token
    const FullToken = 'Token ' + Token
    
    
    const retrieveData = () => {
        fetch(FullLocation, {
            method: 'GET',})
        .then(resp => resp.json())
        .then(data => {     
            ah(data)
            
        })
        .catch(error => console.log(error.message))
        }
    
        function ah(data){
            let result = []

            for(let i = 0; i< data.length; i++){
                result.push(data[i])
            }
            setRes(result)
            setLoading(false)
        }

        const sendSearch = () => {
        
            console.log(JSON.stringify({
                product: searchCriteria,
             }));
            fetch(`http://${ip}:8000/api/products/search`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': FullToken
                },
                //body of the JSON object we are sending
                body: JSON.stringify({
                   product: searchCriteria,
                })})
        .then(resp => resp.json())
        .then(data => {
            //checking if successful
            console.log("WORKED")
            ah(data);
                    
        })
        .catch(error => {
            
            console.log("ERROR")
            console.log(error)
        })
        }
 
    useEffect(()=> {
        sendSearch()
    }, [])

    if(loading){
        return(<View><Text>Loading...</Text></View>)
    }
    return (
        <ScrollView>
            <View>
            <TouchableOpacity style={{marginBottom: 5, flexDirection: 'row', justifyContent: "flex-end", marginRight: 10,}} onPress={() => navigation.navigate('Cart')}>
                <AntDesign name="shoppingcart" color="#34BDC3" size={30}/>
            </TouchableOpacity>
            <SearchBar style={styles.search}
                            placeholder="Search by name" 
                            lightTheme='true'
                            round='true'
                            onChangeText={text =>setSearch(text)} 
                            value={searchCriteria}
                            />
                            <Button style={styles.searchButton} color='#34BDC3' title='Search' onPress={() => sendSearch()}/>
            </View>
            <SafeAreaView>
                    <ProductList navigation={navigation} route={{result:searchResults}} />
            </SafeAreaView>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    
    row: {
        flexDirection: 'row',
        margin: 10,
        marginLeft:20, 
     }, 
     searchButton: {
         flex: 1
     },
     search: {
         flex: 3
     }
    })

export default Products
