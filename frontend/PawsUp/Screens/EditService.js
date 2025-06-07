import React, {useState,useEffect} from 'react';
import { ip } from '../global';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView} from 'react-native'
import DatePicker from 'react-native-date-picker'

function EditService({ navigation, route}) {

   //Service details
    const [type, setType] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [address, setAddress] = useState('')
    const [name, setName] = useState('')
    const [details, setDetails] = useState('')
    const [facilityList, setFlist] = useState([""])
    const [checkInNotes, setCheckIn] = useState ('') 
    const [paypal, setPayPal] = useState('') 
    const [pricingList, setPrice] = useState('')
    const [addOnList, setAddons] = useState('')

    //Error code
    const [Error, setError] = useState('')

    //Tokens and other user info
    const Token = route.params.token
    const UserId = route.params.userId
    const ServiceId = route.params.id

    const FullToken = 'Token ' + Token
    const AccLocation = 'http://' + ip + ':8000/api/services/' + ServiceId

   function Back(){
      navigation.navigate('Account', {token: Token, userId: UserId})
   }

   function Delete() {
      fetch(AccLocation, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': FullToken
        }
      })
      .then(resp => resp.json())
      .then(Back())
      .catch(error => setError(error.message))
   }

   function setList(text) {
      var facilities = text.split(",");
      return facilities;
   }

   const retrieveData = () => {
    fetch(AccLocation, {
        method: 'GET',
        headers: {
         //To show that we are sending JSON data and to send the user's Token
         'Authorization': FullToken
         }
    })
    .then(resp => resp.json())
    .then(data => {        
        setType(data.service_type)
        setStart(data.service_start.toString())
        setEnd(data.service_end.toString())
        setAddress(data.address)
        setName(data.name)
        setDetails(data.details)
        setFlist(data.facilityList)
        setCheckIn(data.checkInNotes)
        setPayPal(data.paypal_id)
        setPrice(undoJSON(data.pricingList))
        setAddons(undoJSON(data.additionalServiceList))
    })
    .catch(error => setError(error.message))
    }

    useEffect(() => {
        retrieveData()
    }, [])

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

   function setJSON(text, which) {
      if(text == ""){
         return [];
      }

      let jarray = [];
      let pets = text.split(",");
      for (let i =0; i < pets.length; i++) {
         let petprice = pets[i].split(":");
         let pet = petprice[0];
         let price=petprice[1];

         if(price <= 0){
            setError("Invalid Prices")
            return null
         }

         if (which==0) {
            var obj = JSON.parse("{\"pet_type\":\""+ pet + "\",\"price\":"  + price +"}");
         } else {
            var obj = JSON.parse("{\"name\":\""+ pet + "\",\"price\":"  + price +"}");
         }
         jarray.push(obj);
      }
      return jarray;

   }

   function checkInputs(){
      //Not filled Fields
      let notEmpty = [type, start, end, address, name, details, paypal]
      for(let i = 0; i < notEmpty.length; i++){
         if(notEmpty[i].localeCompare('') == 0){
            setError("Missing Fields")
            return false
         }
      }
      
      //Not Pet Prices
      let Services = setJSON(pricingList, 0);
      let ServiceAdd = setJSON(addOnList, 1);

      //Negative Prices
      if(Services == null || ServiceAdd == null){
         return false
      }

      if(Services.length == 0){
         setError("No Pet Prices Listed")
         return false
      }
      

      let timeSplit = start.split(":")
      let timeSplit2 = end.split(":")
      
      //Time Input
      if(timeSplit.length < 2 || timeSplit2.length < 2){
         setError("Times are Invalid")
         return false
      }
      if(timeSplit.length > 3 || timeSplit2.length > 3){
         setError("Times are Invalid")
         return false
      }
      
      //Start Time
      if(timeSplit[0] < 0 || timeSplit[0] >= 24 ){
         setError("Start Time is Invalid")
         return false
      }
      if(timeSplit[1] >= 60 || timeSplit[1] < 0){
         setError("Start Time is Invalid")
         return false
      }
      if(timeSplit.length == 3){
         if(timeSplit[2] >= 60 || timeSplit[2] < 0){
            setError("Start Time is Invalid")
            return false
         }
      }      
      
      //End Time
      if(timeSplit2[0] < 0 || timeSplit2[0] >= 24 ){
         setError("End Time is Invalid")
         return false
      }
      if(timeSplit2[1] >= 60 || timeSplit2[1] < 0){
         setError("End Time is Invalid")
         return false
      }
      if(timeSplit2.length == 3){
         if(timeSplit2[2] >= 60 || timeSplit2[2] < 0){
            setError("End Time is Invalid")
            return false
         }
      }

      if(start > end){
         setError("Service Times are Invalid")
         return false        
      }

      return true
   }

    // function to edit info in the backend
    const editCard = () => {
         if(!checkInputs()){
            return
         }

        fetch(AccLocation, {
            method: 'PATCH',
            headers: {
            //To show that we are sending JSON data and to sned the user's Token
            'Content-Type': 'application/json',
            'Authorization': FullToken
            },
            //body of the JSON object we are sending
            body: JSON.stringify({
               service_type: type,
               service_start: start,
               service_end: end,
               address: address,
               name: name,
               details: details,
               facilityList: facilityList,
               checkInNotes: checkInNotes,
               pricingList: setJSON(pricingList, 0),
               additionalServiceList: setJSON(addOnList, 1),
               paypal_id: paypal
            })})
    .then(resp => resp.json())
    .then(data => {
        //checking if successful
        Back()
    })
    .catch(error => {
        setError(error)
    })
    }

    return (
        //this container will hold basic account information
        <ScrollView style={styles.container}>
            <View style={styles.row}>
               <TouchableOpacity
                  style = {styles.cancelButton}
                  onPress = {
                     () => Back()
                  }>
                  <Text style = {styles.cancelButtonText}> Cancel </Text>
               </TouchableOpacity>
            </View>

            <KeyboardAvoidingView>
               
               <Text style = {styles.title}> Edit Service</Text>
               <Text style= {styles.fieldLabel}>Type</Text>
                  <TextInput style = {styles.input}
                     underlineColorAndroid = "transparent"
                     defaultValue={type}
                     placeholder = "Boarding"
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     onChangeText = {text => setType(text)}/>
                  
                     
                  <Text style= {styles.fieldLabel}>Name</Text>
                  <TextInput style = {styles.input}
                     underlineColorAndroid = "transparent"
                     defaultValue={name}
                     placeholder = "Pet Heaven"
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     onChangeText = {text => setName(text)}/>

                  <Text style= {styles.fieldLabel}>Description</Text>
                  <TextInput style = {styles.input}
                     underlineColorAndroid = "transparent"
                     placeholder = "A spacious, caring home for all pets"
                     defaultValue={details}
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     onChangeText = {text => setDetails(text)}/>

               <Text style= {styles.fieldLabel}>Start Time (24h format)                                 End Time (24h format)   </Text>          
               
               <View style={styles.ageRow}>
                     <TextInput style = {styles.ageRowInput}
                        underlineColorAndroid = "transparent"
                        placeholder = "9:00"
                        defaultValue={start}
                        placeholderTextColor = "#9a73ef"
                        autoCapitalize = "none"
                        keyboardType = 'numeric'
                        onChangeText = {text => setStart(setTime(text))}/>

                     <TextInput style = {styles.ageRowInput}
                        underlineColorAndroid = "transparent"
                        placeholder = "17:00"
                        defaultValue={end}
                        placeholderTextColor = "#9a73ef"
                        autoCapitalize = "none"
                        keyboardType = 'numeric'
                        onChangeText = {text => setEnd(setTime(text))}/>
               </View>

               <Text style= {styles.fieldLabel}>Address</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "123 Pet Street"
                  defaultValue={address}
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setAddress(text)}/>

               <Text style= {styles.fieldLabel}>Facility List (Separate by commas)</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "House, Backyard, Cat food, Dog food"
                  defaultValue={facilityList.join(",")}
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setFlist(setList(text))}/>

               <Text style= {styles.fieldLabel}>Check-in Notes</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "Wash pet before coming"
                  defaultValue={checkInNotes}
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setCheckIn(text)}/>

               <Text style= {styles.fieldLabel}>Price per hour ($), per animal</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "cat: 15, dog: 20"
                  defaultValue={pricingList}
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setPrice(text)}/>

               <Text style= {styles.fieldLabel}>Additional services ($) </Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  defaultValue={addOnList}
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setAddons(text)}/>
                  
               <Text style= {styles.fieldLabel}>Paypal ID</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  defaultValue={paypal}
                  placeholder = "paypalid13dig"
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setPayPal(text)}/>

               <Text style={{color:'#FF0000', paddingLeft:20, paddingTop:10}}>
                  {Error}
               </Text>              
               <View style={styles.row}>
               <TouchableOpacity
                  style = {styles.deleteButton}
                  onPress = {
                     () => Delete()
                  }>
                  <Text style = {styles.deleteButtonText}> Delete </Text>
               </TouchableOpacity>
               <TouchableOpacity
                  style = {styles.submitButton}
                  onPress = {
                     () => editCard()
                  }>
                  <Text style = {styles.submitButtonText}> Edit </Text>
               </TouchableOpacity>
               </View>

         </KeyboardAvoidingView>
         </ScrollView>
      )
   }

export default EditService

const styles = StyleSheet.create({
    container: {
       paddingTop: 30,
       paddingLeft: 30,
       paddingRight: 30,
    },
    title: {
     fontSize: 40, 
     color: '#d68a2d'
    },
    fieldLabel: {
      marginLeft: 15,
      marginTop: 15,
    },
    input: {
       margin: 15,
       marginBottom: 2,
       height: 40,
       paddingLeft: 10,
       borderColor: '#7a42f4',
       borderWidth: 1
    },
    submitButton: {
       backgroundColor: '#d68a2d',
       padding: 10,
       margin: 15,
       height: 40,
       flex: 3,
    },
    submitButtonText:{
       color: 'white',
       textAlign: 'center'
    },
    deleteButton: {
       backgroundColor: '#ff7f7f',
       borderWidth: 1,
       padding: 10,
       margin: 15,
       height: 40,
       flex: 3
    },
    deleteButtonText:{
       color: '#000000',
       textAlign: 'center'
    },
    row: {
       flex: 1,
       flexDirection: 'row',
       margin: 10,
       marginLeft:20, 
       width: 295,
    },
    ageRow: {
       flex: 1,
       flexDirection: "row",
       marginLeft: 6,
       marginTop: 15,
       marginBottom: 15,
       width: 300,
       marginRight: -10
    },
    ageRowInput: {
       height: 40,
       marginLeft: 10,
       marginRight: 15,
       marginBottom: -10,
       paddingLeft: 10,
       borderColor: '#7a42f4',
       borderWidth: 1,
       flex: 1,
    },

    cancelButton: {
        backgroundColor: '#ffffff',
        borderColor: '#d68a2d',
        borderWidth: 1,
        padding: 10,
        margin: 15,
        height: 40,
        flex: 3
     },
     cancelButtonText:{
        color: '#d68a2d',
        textAlign: 'center'
     }
 })

