import React, {useState} from 'react';
import { ip } from '../global';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, DrawerLayoutAndroidComponent } from 'react-native'
import DatePicker from 'react-native-date-picker'

function ServiceCreation({ navigation, route}) {

    const [type, setType] = useState('')
    const [start, setStart] = useState(new Date())
    const [end, setEnd] = useState(new Date())
    const [address, setAddress] = useState('')
    const [name, setName] = useState('')
    const [details, setDetails] = useState('')
    const [facilityList, setFlist] = useState([""])
    const [checkInNotes, setCheckIn] = useState('') 
    const [paypal, setPayPal] = useState('') 
    const [pricingList, setPrice] = useState('')
    const [addOnList, setAddons] = useState('')

    const [startString, setStartString] = useState('')
    const [endString, setEndString] = useState('')

   //Error code
   const [Error, setError] = useState('')

    //Tokens and stuff
    const Token = route.params.token
    const UserId = route.params.userId

    const FullToken = 'Token ' + Token

   function Back(){
      navigation.navigate('Account', {token: Token, userId: UserId})
   }

   function setTime(text) {
      return text;
   }
   function setList(text) {
      var facilities = text.split(",");
      return facilities;
   }

   // 0 for pricelist, 1 for additional services
   function setJSON(text, which) {
      console.log(text)
      if(text == ''){
         return [];
      }
      text=text.split(' ').join('');
      console.log(text)
      var jarray = [];
      let pets = text.split(",");
      console.log(pets)
      for (var i =0; i < pets.length; i++) {
         if (!(pets[i].includes(":"))) {
            return jarray = [];
         }
         var petprice = pets[i].split(":");
         console.log(petprice);
         var pet = petprice[0];
         var price=petprice[1];
         if (which==0) {
            var obj = JSON.parse("{\"pet_type\":\""+ pet + "\",\"price\":"  + price +"}");
         } else {
            var obj = JSON.parse("{\"name\":\""+ pet + "\",\"price\":"  + price +"}");
         }
         console.log(obj);
         jarray.push(obj);
      }
      console.log(jarray);
      return jarray;
   }


   function checkInputs(){
      //Not filled Fields
      let notEmpty = [type, address, name, details, paypal]
      for(let i = 0; i < notEmpty.length; i++){
         if(notEmpty[i].localeCompare('') == 0){
            setError("Missing Fields")
            return false
         }
      }
      
      //No Pet Prices
      let Services = setJSON(pricingList, 0);
      let ServiceAdd = setJSON(addOnList, 1);

      //Negative Prices
      if(Services == null || ServiceAdd == null){
         return false
      }

      console.log(Services)
      if(Services.length == 0){
         setError("No Pet Prices Listed")
         return false
      }

      if(ServiceAdd.length == 0){
         setError("No Additional Services Listed")
         return false
      }
      

      let timeSplit = startString.split(":")
      let timeSplit2 = endString.split(":")
      
      //Time Input
      if(timeSplit.length < 2 || timeSplit2.length < 2){
         setError("Please change both service timings from the default")
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

    // function to connect ot backend
    const addCard = () => {
      if(!checkInputs()){
         return
      }
        fetch(`http://${ip}:8000/api/services/`, {
            method: 'POST',
            headers: {
            //bc we are sending JSON data
            'Content-Type': 'application/json',
            'Authorization': FullToken
            },
            //body of the JSON object we are sending
            body: JSON.stringify({
               service_type: type,
               service_start: startString,
               service_end: endString,
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
        console.log(data)
        Back()
    })
    .catch(error => {
        console.log(error)
        Back()
    })
    }

    return (
        //this container will hold basic account information
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView>
               
               <Text style = {styles.title}> Create a Service</Text>
               <Text style= {styles.fieldLabel}>Type</Text>
                  <TextInput style = {styles.input}
                     underlineColorAndroid = "transparent"
                     placeholder = "Boarding"
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     onChangeText = {text => setType(text)}/>
                  
                     
                  <Text style= {styles.fieldLabel}>Name</Text>
                  <TextInput style = {styles.input}
                     underlineColorAndroid = "transparent"
                     placeholder = "Pet Heaven"
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     onChangeText = {text => setName(text)}/>

                  <Text style= {styles.fieldLabel}>Description</Text>
                  <TextInput style = {styles.input}
                     underlineColorAndroid = "transparent"
                     placeholder = "A spacious, caring home for all pets"
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     onChangeText = {text => setDetails(text)}/>

               <Text style= {styles.fieldLabel}>Start Time</Text>          
               
                  <DatePicker date={start} mode="time" style={{height: 100, margin: 'auto', alignSelf: 'center'}} 
                  onDateChange={(time) => {
                     setStart(time)
                     setStartString(`${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}`)
                     }}/>
               
               <Text style= {styles.fieldLabel}>End Time</Text> 
                  <DatePicker date={end} mode="time" style={{height: 100, margin: 'auto', alignSelf: 'center'}} 
                  onDateChange={(time) => {
                     setEnd(time)
                     setEndString(`${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}`)
                  }}/>

               <Text style= {styles.fieldLabel}>Address</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "123 Pet Street"
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setAddress(text)}/>

               <Text style= {styles.fieldLabel}>Facility List (Separate by commas)</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "House, Backyard, Cat food, Dog food"
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setFlist(setList(text))}/>

               <Text style= {styles.fieldLabel}>Check-in Notes</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "Wash pet before coming"
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setCheckIn(text)}/>

               <Text style= {styles.fieldLabel}>Price per hour ($), per animal</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "cat: 15, dog: 20"
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setPrice(text)}/>

               <Text style= {styles.fieldLabel}>Additional Services ($)</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "Can of tuna: 10, Extra toys: 15"
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setAddons(text)}/>
                  
               <Text style= {styles.fieldLabel}>Paypal ID</Text>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "paypalid13dig"
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  onChangeText = {text => setPayPal(text)}/>

               <Text style={{color:'#FF0000', paddingLeft:20, paddingTop:10}}>
                  {Error}
               </Text>
               <View style={styles.row}>
               <TouchableOpacity
                  style = {styles.cancelButton}
                  onPress = {
                     () => Back()
                  }>
                  <Text style = {styles.cancelButtonText}> Cancel </Text>
               </TouchableOpacity>
               <TouchableOpacity
                  style = {styles.submitButton}
                  onPress = {
                     () => addCard()
                  }>
                  <Text style = {styles.submitButtonText}> Submit </Text>
               </TouchableOpacity>
               </View>

         </KeyboardAvoidingView>
         </ScrollView>
      )
   }

export default ServiceCreation

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
      width: 340,
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
   }
})

