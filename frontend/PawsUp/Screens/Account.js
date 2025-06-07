import React, {useState, useEffect, useContext, useRef} from 'react'
import {Card, TextInput} from 'react-native-paper'
import { StyleSheet, Text, View, ScrollView, Alert, Image, RefreshControl, Animated, TouchableOpacity, Dimensions } from 'react-native';
import Button from '../components/Button';
import {ip, AuthContext} from '../global'
import PetList from './PetList';
import ServiceList from './ServiceList';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'

function Account({navigation}) {
    //state variables to hold user info retrieved from backend
    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [profile, setProfile] = useState(null)
    const [refreshing, setRefreshing] = useState(false);

    const windowHeight = Dimensions.get('window').height
    const value = useRef(new Animated.Value(windowHeight)).current
    const [hidden, setHidden] = useState(false)

    const {logout, id, token } = useContext(AuthContext);

    const userInfo = () => {
        fetch(`http://${ip}:8000/api/accounts/${id}`, {
            method: 'GET'
        })
        .then(resp => resp.json())
        .then(data => {
            setFirstName(data.first_name)
            setLastName(data.last_name)
            setRefreshing(false);
        })
        .catch(error => Alert.alert('Error:', error.message))
    }

    //getting user info on first render of the page
    useEffect(() => {
        userInfo()
    }, [firstName, lastName, refreshing])

    const showSettings = () => {
        var toValue = windowHeight * 0.05;
    
        if(hidden) {
            toValue = windowHeight;
        }
        
        value.current = new Animated.Value(toValue)
        Animated.spring(value, {
            toValue: toValue,
            velocity: 3,
            tension: 2,
            friction: 8,
            useNativeDriver: true
        }).start()

        setHidden(!hidden)
        console.log(hidden)
        console.log(value.current)
        console.log(toValue)
    } 

    return (
        //this will hold entire account page
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />}>
            
            <TouchableOpacity style={{marginBottom: 5, flexDirection: 'row', justifyContent: "flex-end"}} onPress={() => showSettings()}>
                {!hidden ? <Ionicons name="settings-sharp" color="#34BDC3" size={26}/> :
                          <Entypo name="cross" color="#34BDC3" size={26}/>}
            </TouchableOpacity> 

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image style={styles.userImg} source={profile ? profile : require('../img/noface-square.jpg')}/>
                {firstName && lastName ? <Text style={styles.text}>{firstName + ' ' + lastName}</Text> : null}

                <Text style={{fontSize: 30, color: '#d68a2d'}}>Your Pets</Text>
                <PetList navigation={navigation} route={{userId:id, token:token, own:true}} refreshing={refreshing} setRefreshing={setRefreshing}/>
                
                <Text style={{fontSize: 30, color: '#d68a2d'}}>Your Services</Text>
                <ServiceList navigation={navigation} route={{userId:id, token:token}} refreshing={refreshing} setRefreshing={setRefreshing}/>
                <Animated.View style={[styles.settings, {transform: [{translateY: value}]}]}>
                    <Card onPress={() => navigation.navigate('EditProfile', {userId: id, token: token})} style={styles.edit}>
                        <Card.Title title="Edit Profile"></Card.Title>
                    </Card>
                    <Card onPress={() => {logout()}} style={styles.logout}>
                        <Card.Title title="LOG OUT" titleStyle={{color: "#fff", fontWeight: 'bold'}}></Card.Title>
                    </Card>
                </Animated.View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
    },
    buttContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        margin: 5,
        fontWeight: 'bold',
    },
    settings: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#34BDC3",
        height: 180,
        borderRadius: 10,
        alignItems: 'center',
    },
    edit: {
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 10,
        width: "90%",
    },
    logout: {
        margin: 5,
        backgroundColor: "#FE9834",
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 10,
        width: "90%",
    }
})

export default Account
