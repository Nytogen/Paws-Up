import React, {useState, useEffect} from 'react';
// import global thing here
import {Card} from 'react-native-elements'
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import {ip} from '../global'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

var verifiedColour = '#d10a4d';



function ServiceListOther({ navigation, route }) {
   const {userId, serviceId} = route;

   const [serviceData, setServiceData] = useState([])
   const [visible, setVisible] = useState([])

   const Item = ({ name, service_type, id, userId}) => (
      <TouchableOpacity style={styles.item} onPress = {
           () => navigation.navigate('ServiceDetails', {id:id, userId:userId})
        }>
     <Card>
       <Text style={styles.text}>{name}</Text>
       <Text style={styles.text}>{service_type}</Text>
     </Card>
     </TouchableOpacity>
   );

   const renderItem = ({ item }) => (
      //setVerifiedColour(item.verified_status),
      <Item name={item.name} service_type={item.service_type} id={item.id} userId={userId} verified_status={item.verified_status} />
    );

    // function to connect ot backend
    const viewCard = () => {
        fetch(`http://${ip}:8000/api/accounts/${userId}/profile`, {method: 'GET',
        headers: {
            //bc we are sending JSON data
            'Content-Type': 'application/json'
        },
      })
      .then(resp => resp.json())
      .then(data => {
         //checking if successful
         setServiceData(data.services)
         let currentVisible = [];
         for(let i =0 ; i < data.services.length; i++){
             console.log(data.services[i].verified_status)
             if (data.services[i].verified_status.localeCompare("Verified") == 0){
                currentVisible.push(data.services[i])
                setVisible(currentVisible)
             }
         }
      })
      .catch(error => {
         console.log(error)
      })
    }

    useEffect(() => {
       viewCard()
    }, [])

    return (
        //this container will hold basic account information
         <View style={styles.container}>
            <FlatList
               horizontal ={true}
               data={visible}
               renderItem={renderItem}
               keyExtractor={item => item.id}
               />
         </View>
  );

}   

export default ServiceListOther

const styles = StyleSheet.create({
   container: {
      height: 200,
   },
   item: {
      height: 120,
   },
   card: {
      height: 130,
      width: 150,
   },

   text: {
    fontSize: 20, 
    color: '#d68a2d',
    textAlign: 'center'
   },

   verified: {
      fontSize: 20, 
      color: verifiedColour,
      textAlign: 'center'
   }
})

