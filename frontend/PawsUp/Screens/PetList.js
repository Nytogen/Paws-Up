import React, {useState, useEffect} from 'react';
// import global thing here
import {Card} from 'react-native-elements'
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Alert, RefreshControl } from 'react-native'
import {ip} from '../global'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';




function PetList({ navigation, route, refreshing, setRefreshing }) {
   console.log(route)
   
   const { userId, token, own } = route;

   const [petData, setPetData] = useState([])

   const Item = ({ title, breed, species, id, userId }) => (
      <TouchableOpacity onPress = {
           () => navigation.navigate('PetCardDetails', {token:token, id:id, userId:userId, own:own})
        }>
     <Card style={styles.item}>
       <Text style={styles.title}>{title}</Text>
       <Text style={styles.title}>{species}</Text>
       <Text style={styles.title}>{breed}</Text>
     </Card>
     </TouchableOpacity>
   );

   const renderItem = ({ item }) => (
      <Item title={item.name} breed={item.breed} species={item.species} id={item.id} userId={userId} />
    );

    const addNew = () => (
      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('PetCreation', {userId: userId, token: token})}>
        <Card style={styles.item}> 
        <MaterialCommunityIcons style={{textAlign:'center'}} name='plus' color={'#34BDC3'} size={29}/>
            <Text style={styles.title}>create pet card</Text>
         </Card>
      </TouchableOpacity>
      
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
         console.log(data.pet_cards)
         setPetData(data.pet_cards)
         setRefreshing(false)
      })
      .catch(error => {
         console.log(error)
      })
    }

    useEffect(() => {
       viewCard()
    }, [refreshing])

   if(own){
    return (
        //this container will hold basic account information
         <View style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => viewCard()}/>}>
            <FlatList
               ListHeaderComponent={addNew}
               horizontal ={true}
               data={petData}
               renderItem={renderItem}
               keyExtractor={item => item.id}/>
         </View>
  )}
  else{
   return (
      //this container will hold basic account information
       <View style={styles.container}>
          <FlatList
             horizontal ={true}
             data={petData}
             renderItem={renderItem}
             keyExtractor={item => item.id}/>
       </View>
)     
  };

}   

export default PetList

const styles = StyleSheet.create({
   container: {
      height: 150,
   },
   item: {
   },
   button: {
      height: 127,
      width: 150,
   },

   title: {
    fontSize: 20, 
    color: '#d68a2d',
    textAlign: 'center'
   }
})

