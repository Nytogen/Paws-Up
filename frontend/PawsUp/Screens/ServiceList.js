import React, {useState, useEffect} from 'react';
// import global thing here
import {Card} from 'react-native-elements'
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, RefreshControl } from 'react-native'
import {ip} from '../global'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

var verifiedColour = '#d10a4d';



function ServiceList({ navigation, route, refreshing, setRefreshing }) {

   const { userId, token } = route;

   /*function setVerifiedColour(status) {
      if (status==="Pending") verifiedColour = '#000000';
   }*/

   const [serviceData, setServiceData] = useState([])

   const Item = ({ name, service_type, id, userId, verified_status}) => (
      <TouchableOpacity style={styles.item} onPress = {
           () => navigation.navigate('ServiceDetails', {token:token, id:id, userId:userId, own:true})
        }>
     <Card>
       <Text style={styles.text}>{name}</Text>
       <Text style={styles.text}>{service_type}</Text>
       <Text style={styles.text}>{verified_status}</Text>
     </Card>
     </TouchableOpacity>
   );

   const addNew = () => (
      <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('ServiceCreation',  {userId: userId, token: token})}>
        <Card style={styles.item}> 
        <MaterialCommunityIcons style={{textAlign:'center'}} name='plus' color={'#34BDC3'} size={29}/>
            <Text style={styles.text}>create service</Text>
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
         setRefreshing(false)
      })
      .catch(error => {
         console.log(error)
      })
    }

    useEffect(() => {
       viewCard()
    }, [refreshing])

    return (
        //this container will hold basic account information
         <View style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => viewCard()}/>}>
            <FlatList
               ListHeaderComponent={addNew}
               horizontal ={true}
               data={serviceData}
               renderItem={renderItem}
               keyExtractor={item => item.id}
               />
         </View>
  );

}   

export default ServiceList

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

