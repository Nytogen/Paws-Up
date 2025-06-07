import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Button, ScrollView, Alert, Dimensions } from 'react-native';
import { ip } from '../global';


var heightY = Dimensions.get("window").height;


//Placeholder data
const tempPet = {
    Name:"Pet",
    Age:"10",
    PetType:"Dog",
    Breed:"Golden Retriever",
    SpayedNeutured: "Yes",
    Weight: "15",
    Gender:"Male",
    Description:""
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
    FieldTitle:{
        paddingTop: heightY*0.01,
        paddingBottom:1,
        fontSize:heightY*0.021,
    }
});

function PetCardDetails({navigation, route}) {
    //console.log(route.params)

    //Pet Info
    const[Name, setName] = useState('')
    const[Age, setAge] = useState('')
    const[Species, setSpecies] = useState('')
    const[Breed, setBreed] = useState('')
    const[Spayed, setSpayed] = useState('')
    const[Weight, setWeight] = useState('')
    const[Gender, setGender] = useState('')

    //Error Messages
    const[Error, setError] = useState()

    //Locations
    /*
    const Token = route.params.token.slice()
    const FullToken = 'Token ' + Token*/

    const PetID = route.params.id
    const own = route.params.own

    const retrieveData = () => {
        fetch(`http://${ip}:8000/api/petcards/${PetID}`, {
            method: 'GET',
        })
        .then(resp => resp.json())
        .then(data => {
            setSpecies(data.species)
            setName(data.name)
            setAge(data.age.toString())
            setBreed(data.breed)
            setWeight(data.weight_lbs)
            setGender(data.gender)

            if(data.spayed_or_neutered){
                setSpayed('True')
            }
            else{
                setSpayed('False')
            }

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
            navigation.navigate('ServiceProviderProfile', {serviceId: route.params.serviceId, userId: route.params.userId})
        }
    }
    function Edit(){
        navigation.navigate('EditPetCard', {token:route.params.token, id:PetID, userId:route.params.userId})
    }

    function EditPerms(){
        if(own){
            return(<Button onPress={() => Edit()} color='#34BDC3' title='Edit'/>)
        }
        else{
            return(<View></View>)
        }
    }

    return (
        <ScrollView style={styles.Viewing}>
            <Text style={{fontSize: 40, color: '#d68a2d'}}>Pet Details</Text>
            <View>
                <Text style={styles.FieldTitle}>Name</Text>
                <Text style={styles.FieldBox}>{Name}</Text>
            </View>

            <View>
                <Text style={styles.FieldTitle}>Age</Text>
                <Text style={styles.FieldBox}>{Age}</Text>
            </View>

            <View>
                <Text style={styles.FieldTitle}>Species</Text>
                <Text style={styles.FieldBox}>{Species}</Text>                
            </View>

            <View>
                <Text style={styles.FieldTitle}>Breed</Text>
                <Text style={styles.FieldBox}>{Breed}</Text>              
            </View>

            <View>
                <Text style={styles.FieldTitle}>Spayed/Neutured</Text>
                <Text style={styles.FieldBox}>{Spayed}</Text>                
            </View>

            <View>
                <Text style={styles.FieldTitle}>Weight(lbs)</Text>
                <Text style={styles.FieldBox}>{Weight}</Text>           
            </View>

            <View>
                <Text style={styles.FieldTitle}>Gender</Text>
                <Text style={styles.FieldBox}>{Gender}</Text>             
            </View>
            
            <Text style={{color:'#FF0000'}}>
                {Error}
            </Text>

            <Text></Text>
            {/*<Button onPress={() => Edit()} color='#34BDC3' title='Edit'/> */}
            {EditPerms()}
            <Text></Text>
            <Button onPress={() => Back()} color='#FE9834' title='Back'/> 

        </ScrollView>       
    )
}

export default PetCardDetails