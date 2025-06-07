import React,{useState, useContext, useEffect}from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import {SearchBar} from 'react-native-elements';
import Button from '../components/Button';
import ServiceListPet from './ServiceListPet';
import { ip, AuthContext } from '../global';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


function Services({navigation, route}) {
    let filter = '';
    const [searchCriteria, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [searchResults, setRes] = useState([]) // Search results stores an array of ints corresponding
                                                // to the 


    
    //Tokens and stuff

    const {logout, id, token } = useContext(AuthContext)
    const Token = token
    const FullToken = 'Token ' + Token

    const sendSearch = () => {
        if (route.params!=undefined && route.params.filters!=undefined) {
            console.log(route.params.search);
            setSearch(route.params.search);
        } else {
            filter='';
        }
        if (route.params!=undefined && route.params.filters!=undefined) {
            console.log(route.params.filters);
            filter=route.params.filters;
        } else {
            filter='';
        }
        
        console.log(JSON.stringify({
            address: searchCriteria,
            filter: filter
         }));
        fetch(`http://${ip}:8000/api/services/filter`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': FullToken
            },
            //body of the JSON object we are sending
            body: JSON.stringify({
               address: searchCriteria,
               filter: filter
            })})
    .then(resp => resp.json())
    .then(data => {
        //checking if successful
        console.log("WORKED")
        setLoading(true)
        cleanRes(data)
                
    })
    .catch(error => {
        
        console.log("ERROR")
        console.log(error)
    })
    }

    // this function extracts the service ids from the response body
    function cleanRes(data) {
        var justIds = [];
        for (var i=0; i<data.length; i++) {
            justIds.push(data[i]);
        }
        console.log(justIds)
        setRes(justIds)
        setLoading(false)
    }

    function comeBack() {
        navigation.navigate('SearchFilter', {search: searchCriteria});
    }

    useEffect(() => {
        sendSearch()
    }, [])

    const renderPage = () =>{
        if(loading){
            return(
            <View><Text>Loading...</Text></View>)
        }
        else{
            return(                        
                <ScrollView>
                <View> 
                    <SearchBar style={styles.search}
                    placeholder="Search by address" 
                    lightTheme='true'
                    round='true'
                    onChangeText={text =>setSearch(text)} 
                    value={searchCriteria}
                    />
                    <Button style={styles.searchButton} color='#34BDC3' title='Search' onPress={() => sendSearch()}/>
                    <Button style={styles.searchButton} color='#34BDC3' title='Add Filters' onPress={() => comeBack()}/>
                </View>

                <SafeAreaView>
                    <ServiceListPet navigation={navigation} route={{userId:id,  token:token, result:searchResults}} />
                </SafeAreaView>

                </ScrollView>
            )
        }
    }

    return (
        renderPage()
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

export default Services
