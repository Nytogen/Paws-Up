import React, {useState, useEffect, useContext} from 'react'
import {Card, TextInput} from 'react-native-paper'
import { StyleSheet, Text, View, ScrollView, FlatList, Alert, Button as Butt, Image, RefreshControl } from 'react-native';
import Button from '../components/Button';
import {ip, AuthContext} from '../global'
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps'
import PetList from './PetList';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ratings, {DisplayRating} from '../components/Ratings';
import { NavigationContainer } from '@react-navigation/native';

function ServiceDetails({ navigation, route}) {
    const [Data, setData] = useState([])
    const[loading, setLoading] = useState(true)
    const[Error, setError] = useState("")

    //variable to check if pull to refresh is being triggered
    const [refreshing, setRefreshing] = useState(false);

    //For maps
    const[positionData, setPos] = useState()
    const[firstPosition, setFirst] = useState()
    const[Lat, setLat] = useState(37.78825)
    const[Long, setLong] = useState(-122.4324) 

    //User Info
    const [userId, setId] = useState('')
    const [type, setType] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [address, setAddress] = useState('')
    const [name, setName] = useState('')
    const [details, setDetails] = useState('')
    const [facilityList, setFlist] = useState([""])
    const [checkInNotes, setCheckIn] = useState ('') 
    const [pricingList, setPrice] = useState('')
    const [additional, setAdditional] = useState('')

    const {serviceId, home} = route.params
    const FullLocation = 'http://' + ip + ':8000/api/services/' + serviceId
    const retrieveData = () => {
        fetch(FullLocation, {
            method: 'GET',})
        .then(resp => resp.json())
        .then(data => {     
            setId(data.owner)  
            setType(data.service_type)
            setStart(data.service_start.toString())
            setEnd(data.service_end.toString())
            setAddress(data.address)
            setName(data.name)
            setDetails(data.details)
            setFlist(data.facilityList)
            setCheckIn(data.checkInNotes)
            setPrice(undoJSON(data.pricingList))
            setAdditional(undoJSON(data.additionalServiceList))
            setLoading(false)
        })
        .catch(error => console.log(error.message))
        }
   
    function undoJSON(petList){
        var unJSON = []
        var currentSplit = ""
        var petType = []
        var price = []

        for(var i=0; i<petList.length; i++){            
            //Seperate type and price
            var test =  JSON.stringify(petList[i])
            
            //Remove the quotations and {} with regex
            test = test.replace(/["{}]+/g,"")

            currentSplit = test.split(",")

            //Get type
            petType = currentSplit[0].split(":")
            petType = petType[1].replace(/["{}]+/g,"")

            //Get price
            price = currentSplit[1].split(":")
            price = price[1]
            
            //Add type:price to the list
            unJSON.push(petType + ":" + price)        
        }
        
        return unJSON.join(", ")
    }
    
    function Back(){
        if(home){
            navigation.navigate('HomeScreen', {}) 
        }
        else{
            navigation.navigate('ServiceScreen', {})
        }
    }
    function Buy(){
        navigation.navigate('Checkout', {serviceId:serviceId, home:home})
    }
    function SeeMap(){
        navigation.navigate('DetailsMap', {serviceId:serviceId, location:address.split(" ").join("%20"), home:home})
    }
    function rateService(){
        navigation.navigate('Rating', {serviceId:serviceId, home:home})
    }
    function ViewProiderProfile(){
        navigation.navigate('ServiceProviderProfile', {serviceId:serviceId, userId:userId, home:home})
    }    

    useEffect(()=> {
        retrieveData()
    }, [])

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
                    
                    <View>
                        <Text style={styles.description}>{details}</Text>          
                    </View>

                    <Text/>

                    <View>
                        {/* send refreshing variable and function for display rating to use */}
                        <DisplayRating serviceId={serviceId} refreshing={refreshing} setRefreshing={setRefreshing}/>
                    </View>

                    <Text/>

                    <View>
                        <Button color='#FE9834' title='Rate Service' logout onPress={() => rateService()}/>   
                    </View>

                    <Text/>    

                    <Button color='#AEC6CF' title='View Service Provider Profile' logout onPress={() => ViewProiderProfile()}/>        
                    
                    <View>
                        <Text style={styles.heading}>Service Type</Text>  
                        <Text style={styles.text}>{type}</Text>          
                    </View>
                    
                    <Text/>
                    
                    <View>
                        <Text style={styles.heading}>Time availbility</Text>   
                        <Text style={styles.text}>{start} - {end}</Text>          
                    </View>
                    
                    <Text/>            
                    
                    <View>
                        <Text style={styles.heading}>Location</Text>    
                        <Text style={styles.text}>{address}</Text>          
                    </View>
                    
                    <Text/>  
                    
                    <View>
                        <Text style={styles.heading}>Facilities</Text>    
                        <Text style={styles.text}>{facilityList}</Text>                   
                    </View>
                    
                    <Text/>  
                    
                    <View>                    
                        <Text style={styles.heading}>Additional Notes</Text>  
                        <Text style={styles.text}>{checkInNotes}</Text>          
                    </View>

                    <Text/>
                    
                    <View>
                        <Text style={styles.heading}>Pricing</Text>  
                        <Text style={styles.text}>{pricingList}</Text>          
                    </View>

                    <Text/>

                    <View>
                        <Text style={styles.heading}>Add Ons</Text>  
                        <Text style={styles.text}>{additional}</Text>          
                    </View>

                    <Text/>
                    
                    <View>
                    <Button color='#AEC6CF' title='View Map' logout onPress={() => SeeMap()}/>
                    <Button color='#FE9834' title='Buy' logout onPress={() => Buy()}/>                    
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

export default ServiceDetails