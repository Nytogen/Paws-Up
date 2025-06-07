import React, {useState, useEffect} from 'react';
import { ip } from '../global';
import { View, Text, TouchableOpacity, Card, FlatList, Button, StyleSheet, ScrollView, KeyboardAvoidingView, DrawerLayoutAndroidComponent } from 'react-native'

function PurchaseRecord({ navigation, route}) {

    const [purchasedata, setPData] = useState([]);

    //Tokens and stuff
    const Token = route.params.token
    const UserId = route.params.userId
    const id = route.params.id

    const FullToken = 'Token ' + Token

   function Back(){
      navigation.navigate('ServiceDetails', {token:Token, id:id, userId:UserId, own:true})
   }

   function undoJson(petList){
      var unJSON = []
      var currentSplit = ""
      var petType = []
      var quantity = []

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
          quantity = currentSplit[1].split(":")
          quantity = quantity[1]
          
          //Add type:price to the list
          unJSON.push(petType + ": " + quantity)        
      }
      
      console.log(unJSON.join(", "))
      return unJSON.join(", ")
  }
  

   const Item = ({ customer, name, totalpaid, quantities, addOns, id}) => {return (
      <View style={styles.card}>
       <Text style={styles.text}>Customer Name: {name}</Text>
       <Text style={styles.text}>Pets: {quantities}</Text>
       <Text style={styles.text}>Additional Services: {addOns}</Text>
       <Text style={styles.text}>Total paid ($): {totalpaid}</Text>
       </View>
   )};

   const renderItem = ( item ) => { return (
      //setVerifiedColour(item.verified_status),
      <Item customer = {item.customer} name = {item.customer_name} totalpaid = {item.total_price} addOns = {undoJson(item.additionalServiceQuantities)} quantities = {undoJson(item.pricingQuantities)} />
    )};

    // function to connect ot backend
    const retrieveData = () => {
        fetch(`http://${ip}:8000/api/services/${id}/purchase`, {
            method: 'GET',
            headers: {
               //bc we are sending JSON data
               'Content-Type': 'application/json'
           },
         })
         .then(resp => resp.json())
         .then(data => {
            setPData(data);
            
         })
         .catch(error=> { console.log(error)})
     }
     console.log("this is purchase data:");
     console.log(purchasedata);
   useEffect(() => {
      retrieveData()
   }, [])

   console.log("this is purchase data:");
     console.log(purchasedata);

    return (
        //this container will hold basic account information
        <ScrollView>
         <View style={styles.container}> 
         <Text style = {styles.title}> Purchase Records</Text>
         <Text style={{fontSize: 30}}></Text>
         <Button onPress={() => Back()} color='#FE9834' title='Back'/> 
         
         <Text></Text>
         {purchasedata.map((item) => <View key={item.id}>{renderItem(item)}</View>)}
         <Text style={{fontSize: 30}}></Text>
         </View>    
         </ScrollView>
      )
   }

export default PurchaseRecord

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
   text: {
      fontSize: 17,
      color: '#5f7e94'
   },
   card: {
      margin: 10, 
      padding: 10, 
      borderWidth: 2,
      borderColor: "#5f7e94"
   }
})

