import React, {useState, useEffect} from 'react'
import {Card} from 'react-native-paper'
import { StyleSheet, Text, View, Button, FlatList, Alert, Image, TouchableOpacity, RefreshControl} from 'react-native';
import {ip} from '../global'
import AntDesign from 'react-native-vector-icons/AntDesign';
import {DisplayRating} from '../components/Ratings';

function Home({navigation}) {
    /* const myData = [
        {id: '1', name: "fi", counter: 0},
        {id: '2', name: "fo", counter: 5},
    ] */

    const [Data, setData] = useState([])
    const[loading, setLoading] = useState(true)
    /* console.log(Data) */

    const loadData = () => {
        fetch(`http://${ip}:8000/api/services/toprated`, {
            method: 'GET'
        })
        .then(resp => resp.json())
        .then(data => {
            setData(data)
            setLoading(false)
        })
        .catch(error => Alert.alert('Error:', error.message))
    }

    useEffect(() => {
        loadData()
    }, [])


    const renderData = (item) => {
        return(
            <Card style={styles.cardStyle}>
                <TouchableOpacity style={styles.sideBySide} 
                onPress={() => navigation.navigate('ServiceDetailsPetOwner', {serviceId:item.id, home:true})}>
                    <Image style={styles.imageSpace} source={require('../img/Nice-Rated.jpg')}/>
                    <View style={{flex:1, paddingLeft:10}}>
                        <Text style={{fontSize:30, color: "#E00F41"}}>{item.name}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10}}>
                            <Text style={{fontSize: 20, marginRight: 10}}>{item.rating}</Text>
                            <AntDesign name="star" color="#FFD700" size={25}/>
                        </View>
                        <Text style={{fontSize:18}}>{item.service_type}</Text>
                        <Text style={{fontSize:18}}>{item.service_start} - {item.service_end}</Text>
                        <Text style={{fontSize:18}}>{item.address}</Text>
                        <Text style={{fontSize:18}}>{item.details}</Text>
                    </View>
                </TouchableOpacity>
            </Card>
        )
    }
    
    return (
        /* console.log('I got here2'), */
        <View style={{paddingBottom:50}}>
            <Text style={{fontSize:30, color: "#FE9834", textAlign:'center'}}>Highest Rated Services</Text>
            <FlatList data={Data} renderItem={({item}) => {
                /* console.log('I got here') */
                return renderData(item)
            }} 
            onRefresh={() => loadData()}
            refreshing={loading}
            keyExtractor={item => item.id}/>
        </View>
       
    )
}

const styles = StyleSheet.create({
    cardStyle: {
      padding: 10,
      margin: 10,
      textAlign: 'center',
      borderWidth:3,
      borderColor: "#DDBBF8",
      backgroundColor: "#E3E3FF"
    },
    sideBySide: {
        flex:2,
        flexDirection:'row',
        alignItems:"center"
    },
    imageSpace:{
        flex:1
    }

});

export default Home