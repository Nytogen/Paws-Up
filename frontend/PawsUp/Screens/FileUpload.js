import React, {useEffect, useState} from 'react';
import { ip } from '../global';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, DrawerLayoutAndroidComponent } from 'react-native'
import DocumentPicker from 'react-native-document-picker'

function fileUpload({ navigation, route}) {

    const [singleFile, setFile] = useState('');
    const [docs, setDocNumber] = useState(0);



    //Tokens and stuff
    const Token = route.params.token
    const UserId = route.params.userId
    const serviceId = route.params.id

    const FullToken = 'Token ' + Token

   function Back(){
      navigation.navigate('ServiceDetails', {token:Token, id:serviceId, userId:UserId, own:true})
   }

   const selectOneFile = async () => {
      // opening document picker
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
          // DocumentPicker.types.allFiles
          // DocumentPicker.types.images
          // DocumentPicker.types.plainText
          // DocumentPicker.types.audio
          // DocumentPicker.types.pdf
        });
        console.log('res : ' + JSON.stringify(res));
        console.log('URI : ' + res[0].uri);
        console.log('Type : ' + res[0].type);
        console.log('File Name : ' + res[0].name);
        console.log('File Size : ' + res[0].size);

        setFile(res[0]);
      } catch (err) {
        //Handling any exception (If any)
        if (DocumentPicker.isCancel(err)) {
          //If user canceled the document selection
          alert('Canceled from single doc picker');
        } else {
          //For Unknown Error
          alert('Unknown Error: ' + JSON.stringify(err));
          throw err;
        }
      }
    };
  

    // function to connect ot backend
    const submitFile = () => {

         var formData = new FormData();
         formData.append("file", singleFile);
        fetch(`http://${ip}:8000/api/services/${serviceId}/upload/`, {
            method: 'POST',
            headers: {
            //bc we are sending JSON data
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': FullToken
            },
            //body of the JSON object we are sending
            body: formData
         })
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



    // function to connect ot backend
    const getDocNumber = () => {
      fetch(`http://${ip}:8000/api/services/${serviceId}/upload/`, {
         method: 'GET',
         headers: {
            'Accept': 'application/json',
            'Authorization': FullToken
            },
      })
 .then(resp => resp.json())
 .then(data => {
     setDocNumber(data.documentCount)
 })
 .catch(error => {
     console.log(error)
 })
 }

 useEffect(() => {
   getDocNumber()
}, [])

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}> Upload a file </Text>

            <TouchableOpacity
                  style = {styles.cancelButton}
                  onPress = {
                     () => Back()
                  }>
                  <Text style = {styles.cancelButtonText}> Back </Text>
               </TouchableOpacity>

               <Text>You have {docs} documents uploaded.</Text>
               <Text></Text>
               <Text>
                  File Name: {singleFile.name ? singleFile.name : ''}
                  {'\n'}
                  Type: {singleFile.type ? singleFile.type : ''}
                  {'\n'}
                  File Size: {singleFile.size ? singleFile.size : ''}
                  {'\n'}
                  URI: {singleFile.uri ? singleFile.uri : ''}
                  {'\n'}
               </Text>

            <View style={styles.row}>
               <TouchableOpacity
                  style = {styles.cancelButton}
                  onPress = {
                     () => selectOneFile()
                  }>
                  <Text style = {styles.cancelButtonText}> Choose Photo </Text>
               </TouchableOpacity>
               <TouchableOpacity
                  style = {styles.submitButton}
                  onPress = {
                     () => submitFile()
                  }>
                  <Text style = {styles.submitButtonText}> Submit </Text>
               </TouchableOpacity>
               </View>
         </ScrollView>
      )
   }

export default fileUpload

const styles = StyleSheet.create({
   container: {
      paddingTop: 30,
      paddingLeft: 30,
      paddingRight: 30,
   },
   title: {
    fontSize: 40, 
    color: '#d68a2d'
   },cancelButton: {
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
   fieldLabel: {
     marginLeft: 15,
     marginTop: 15,
   },
   submitButton: {
      backgroundColor: '#d68a2d',
      padding: 10,
      margin: 15,
      height: 40,
      flex: 3,
   },row: {
      flex: 1,
      flexDirection: 'row',
      margin: 10,
      marginLeft:20, 
      width: 295,
   },
   submitButtonText:{
      color: 'white',
      textAlign: 'center'
   }
})

