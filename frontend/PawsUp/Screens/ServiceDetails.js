import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Button, ScrollView, Alert, Dimensions } from 'react-native';
import { ip } from '../global';


var heightY = Dimensions.get("window").height;


//Placeholder data
const tempService = {
    type: "Boarding",
    start: "9:00AM",
    end: "10:00AM",
    address: "123 Pet Street",
    name: "Pet Heaven",
    details: "Spacious, loving home",
    facilityList: "House, Backyard, Litter box",
    checkInNotes: "Please ensure your pet is clean",
    pricingList: "Cat: 15, Dog: 20",
    paypal_id: "1234",
    addOnList: "Tuna: 6, Toys: 10"
}

/* Styles to format the page */
const styles = StyleSheet.create({
    Viewing: {
      paddingRight: 50,
      paddingLeft: 50,
      paddingTop: 30,
    },

    FieldBox:{
        padding: heightY*0.008,
        fontSize:heightY*0.021,
        borderWidth: 1,
        borderColor:'#A9A9A9'

        
    },
    invis:{ 
        color: '#f2f2f2'
    },
    FieldTitle:{
        paddingTop: heightY*0.01,
        paddingBottom:1,
        fontSize:heightY*0.021,
    }
});

function ServiceDetails({navigation, route}) {
    //console.log(route.params)

    //Service Info
    const [type, setType] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [address, setAddress] = useState('')
    const [name, setName] = useState('')
    const [details, setDetails] = useState('')
    const [facilityList, setFlist] = useState([""])
    const [checkInNotes, setCheckIn] = useState('') 
    const [paypal, setPayPal] = useState('') 
    const [pricingList, setPrice] = useState('')
    const [addOnList, setAddons] = useState('')

    //Error Messages
    const[Error, setError] = useState()

    //Locations
    /*
    const Token = route.params.token.slice()
    const FullToken = 'Token ' + Token*/

    const serviceId = route.params.id
    const own = route.params.own

    const retrieveData = () => {
        fetch(`http://${ip}:8000/api/services/${serviceId}`, {
            method: 'GET',
        })
        .then(resp => resp.json())
        .then(data => {
            setType(data.service_type)
            setName(data.name)
            console.log(data.service_start)
            setStart(data.service_start)
            setEnd(data.service_end)
            setAddress(data.address)
            setDetails(data.details)
            setFlist(data.facilityList)
            setCheckIn(data.checkInNotes)
            setPrice(undoJSON(data.pricingList))
            setPayPal(data.paypal_id)
            setAddons(undoJSON(data.additionalServiceList))

        })
        .catch(error => Alert.alert('Error:', error.message))
    }

    useEffect(() => {
        retrieveData()
    }, [])

    
    /* This function goes back to the previous page */
    function Back(){
        if(own){
            navigation.navigate('Account', {token: route.params.token, userId: route.params.userId})
        }
        else{
            navigation.navigate('ServiceProviderProfile', {serviceId:serviceId, userId: route.params.userId})
        }
    }
    function Edit(){
        navigation.navigate('EditService', {token:route.params.token, id:serviceId, userId:route.params.userId})
    }

    function HasPerms(){
        if(own){
            return(<View><Button onPress={() => Edit()} color='#34BDC3' title='Edit'/>
            <Text style={styles.invis}>line break</Text>
            <Button onPress={() => navigation.navigate('FileUpload', {token:route.params.token, id:serviceId, userId:route.params.userId})} color='#34BDC3' title='Upload file'/>
             <Text style={styles.invis}>line break</Text>
            <Button onPress={() => navigation.navigate('PurchaseRecord', 
            {token: route.params.token, id: serviceId, userId: route.params.userId})} color='#FE9834' title = "View Purchases" /></View>)
        }
        return(<View></View>)
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
            console.log(petType)

            //Get price
            price = currentSplit[1].split(":")
            price = price[1]
            
            //Add type:price to the list
            unJSON.push(petType + ":" + price)        
        }
        
        console.log(unJSON.join(", "))
        return unJSON.join(", ")
    }

    function seePayId(){
        if(own){
            return(<View>
                <Text style={styles.FieldTitle}>Paypal ID</Text>
                <Text style={styles.FieldBox}>{paypal}</Text>             
                </View>)
        }
        return <View></View>
    }

    return (
        <ScrollView style={styles.Viewing}>
            <Text style={{fontSize: 40, color: '#d68a2d'}}>Service Details</Text>
            <View>
                <Text style={styles.FieldTitle}>Name</Text>
                <Text style={styles.FieldBox}>{name}</Text>
            </View>

            <View>
                <Text style={styles.FieldTitle}>Type</Text>
                <Text style={styles.FieldBox}>{type}</Text>
            </View>

            <View>
                <Text style={styles.FieldTitle}>Details</Text>
                <Text style={styles.FieldBox}>{details}</Text>                
            </View>

            <View>
                <Text style={styles.FieldTitle}>Address</Text>
                <Text style={styles.FieldBox}>{address}</Text>              
            </View>

            <View>
                <Text style={styles.FieldTitle}>Start time</Text>
                <Text style={styles.FieldBox}>{start}</Text>                
            </View>

            <View>
                <Text style={styles.FieldTitle}>End time</Text>
                <Text style={styles.FieldBox}>{end}</Text>           
            </View>

            <View>
                <Text style={styles.FieldTitle}>Facility List</Text>
                <Text style={styles.FieldBox}>{facilityList}</Text>             
            </View>

            <View>
                <Text style={styles.FieldTitle}>Check-in Notes</Text>
                <Text style={styles.FieldBox}>{checkInNotes}</Text>             
            </View>

            <View>
                <Text style={styles.FieldTitle}>Prices</Text>
                <Text style={styles.FieldBox}>{pricingList}</Text>             
            </View>

            <View>
                <Text style={styles.FieldTitle}>Additional Services ($)</Text>
                <Text style={styles.FieldBox}>{addOnList}</Text>             
            </View>

            {seePayId()}
            
            <Text style={{color:'#FF0000'}}>
                {Error}
            </Text>

            <Text></Text>
            {HasPerms()}
            <Text></Text>
            <Button onPress={() => Back()} color='#FE9834' title='Back'/> 
            <Text></Text>
            
            <Text></Text>
            <Text></Text>

        </ScrollView>       
    )
}

export default ServiceDetails