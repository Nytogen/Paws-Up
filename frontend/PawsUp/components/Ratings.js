import React, {useState, useContext, useEffect} from 'react'
import {Card, Title} from 'react-native-paper'
import { StyleSheet, Text, View, FlatList, Alert, TouchableOpacity, RefreshControl} from 'react-native';
import Button from '../components/Button';
import {ip, AuthContext} from '../global'
import AntDesign from 'react-native-vector-icons/AntDesign';

export function DisplayRating({serviceId, refreshing, setRefreshing}) {
    const [rating, setRating] = useState(0)

    //console.log(serviceId)

    const getRating = () => {
        fetch(`http://${ip}:8000/api/services/${serviceId}/rate/`, {
            method: 'GET'
        })
        .then(resp => resp.json())
        .then(data => {
            setRating(data.rating)
            console.log("this is the rating")
            console.log(rating)
            setRefreshing(false)
        })
        .catch(error => Alert.alert('Error:', error.message))
    }

    useEffect(() => {
        getRating()
    }, [refreshing])

    return (
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10}}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => getRating()} />}>
            <Text style={{fontSize: 20, marginRight: 10}}>{rating}</Text>
            <AntDesign name="star" color="#FFD700" size={25}/>
        </View>
    )
}

export default function Ratings({navigation, route}) {
    
    const [rating, setRating] = useState(0)
    const [scale, setScale] = useState([1,2,3,4,5])

    const {token} = useContext(AuthContext);

    const serviceId = route.params.serviceId

    const FullToken = 'Token ' + token

    const submitRating = () => {
        fetch(`http://${ip}:8000/api/services/${serviceId}/rate/`, {
            method: 'POST',
            headers: {
                //bc we are sending JSON data
                'Content-Type': 'application/json',
                'Authorization': FullToken
            },
            //body of the JSON object we are sending
            body: JSON.stringify({rating: rating.toFixed(1)})
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            navigation.navigate("ServiceDetailsPetOwner", {serviceId:serviceId, home:route.params.home})
        })
        .catch(error => {
            console.log(error)
        })
    }

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 30, fontWeight: 'bold', marginBottom: 10}}>Please select a rating:</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10}}>
                {
                    scale.map((number) => {
                        return(
                            <TouchableOpacity activeOpacity={0.5} key={number} onPress={() => setRating(number)}>
                                {number <= rating ? 
                                <AntDesign name="star" color="#FFD700" size={45}/> : 
                                <AntDesign name="staro" color="#FFD700" size={45}/>}
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
            <Button color="#34BDC3" title="submit rating" onPress={submitRating}/>
        </View>
    )
}
