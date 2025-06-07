import React, {useState, useEffect} from 'react';
// import global thing here
import {Card} from 'react-native-elements'
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Dimensions } from 'react-native'
import {ip} from '../global'
import { rosybrown } from 'color-name';

function ServiceListPet({ navigation, route }) {

    const { userId, token, result} = route;
 
    const [serviceData, setServiceData] = useState([])
    const [loading, setLoading] = useState(true)

    let length = 0
 
    const Item = ({ item, id, userId }) => {return(
       <TouchableOpacity 
            style={[styles.item]}
            onPress = {            
            () => alert("Cancelled!"), 
            () => navigation.navigate('ServiceDetailsPetOwner', {token:token, serviceId:id, userId:userId})
         }>
      <Card>
        <Text style={styles.text}>{item.name}   {item.service_start.toString()}-{item.service_end.toString()}</Text>
        <Text style={styles.text}>{item.service_type}   {item.address}</Text>
      </Card>
      </TouchableOpacity>
    )};
 
    const renderItem = ( item ) => { return(
       <Item item={item} id={item.id} userId={userId}/>
     )};
 
     // function to connect to backend
     const viewCard = () => {
        setServiceData(result)
    }

     useEffect(() => {
        viewCard()
     }, [])
     
     return (
         //this container will hold basic account information
         <SafeAreaView style={[styles.itemContainer]}>
             {serviceData.map((item) => <View key={item.id}>{renderItem(item)}</View>)}
         </SafeAreaView>

   );
 
 }   
 
 export default ServiceListPet

const styles = StyleSheet.create({
    itemContainer:{
        width: Dimensions.get('window').width,
        flex:1
    },

   container: {
      height: 200
   },

    item: {
       width: Dimensions.get('window').width,
       flex: 0.5
   },

   text: {
    fontSize: 20, 
    color: '#d68a2d'
   },
})

