import React, {useState, useEffect} from 'react';
// import global thing here
import {Card} from 'react-native-elements'
import { Image, View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Dimensions } from 'react-native'
import {ip} from '../global'
import { rosybrown } from 'color-name';

function ProductList({ navigation, route }) {

    const {result} = route;
 

    function displayImage(url){
        if(url == null){
            return(<Image source={require('../img/No-Image.jpg')} style={{width:100, height:100, flex:1}}/>)
        }
        return(<Image source={{uri: url}} style={{width:100, height:100, flex:1}}/>)
    }
 
    const Item = ({item, id}) => {
        return(

            <TouchableOpacity 
                style={styles.cardStyle}
                onPress = {            
                () => alert("Cancelled!"), 
                () => navigation.navigate('ProductDetails', {productId:id})}>      
                <View style={{flex:1, flexDirection:'row'}}>
                    <View style={{width:100, height:100}}>
                        {displayImage(item.image)}
                    </View>

                    <View style={{flex:1, justifyContent:'center'}}>
                        <Text style={styles.text}>{item.name}</Text>
                        <Text style={styles.text}>${item.price}/item</Text>
                    </View>
                </View>
            </TouchableOpacity>
    )};
 
    const renderItem = ( item ) => { return(
       <Item item={item} id={item.id}/>
     )};
      
     return (
         //this container will hold basic account information
         <SafeAreaView style={[styles.itemContainer]}>
             {result.map((item) => <View key={item.id}>{renderItem(item)}</View>)}
         </SafeAreaView>

   );
 
 }   
 
 export default ProductList

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
       flex: 0.5,
   },

   text: {
    fontSize: 30, 
    paddingLeft: 50
   },
   cardStyle: {
    padding: 10,
    margin: 10,
    textAlign: 'center',
    borderWidth:3,
    borderColor: "#DDBBF8",
    backgroundColor: "#E3E3FF"
  },   
})

