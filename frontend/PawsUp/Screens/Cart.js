import React, {useContext, useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import FormInput from '../components/FormInput';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {ip, AuthContext} from '../global'
import Button from '../components/Button';
import Form, { FormContext } from '../components/Form';

function Cart({navigation}) {

    const {id, token } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([])
    const [change, setChange] = useState(false)

    const [form, setForm] = useState({})

    let products = {}

    const processCart = (form, pay) => {
        let prodBill = []
        let total = 0
        let newCart = {}
        for (let index = 0; index < cartItems.length; index++) {
            const element = cartItems[index];
            total += element.product.price
        }
        console.log(form)
        console.log(cartItems)
        console.log(total)

        //for each product in the cartItems, we need to see if their quantities has been changed and
        //then add them to the list we send to paypal. If the quantity hasn't been changed, we still add it
        cartItems.forEach((item) => {
            if (item.product.name in form) {
                newCart = item
                total -= item.product.price
                total += item.product.price * form[item.product.name]

                prodBill.push({"name": item.product.name, 
                "description": item.product.description, 
                "quantity": form[item.product.name], 
                "price": item.product.price, 
                "tax": "0",
                "currency": "CAD"})

                newCart.quantity = form[item.product.name]
                editCart(newCart)


            } else {
                total -= item.product.price
                total += item.product.price * item.quantity
                
                prodBill.push({"name": item.product.name, 
                "description": item.product.description, 
                "quantity": item.quantity, 
                "price": item.product.price, 
                "tax": "0",
                "currency": "CAD"})
            }
            console.log("this is prod bill")
            console.log(prodBill)
        })

        let totalAmount = {"currency": "CAD",
        "total": `${total}`,
        "details": {
            "shipping": "0",
            "subtotal": `${total}`,
            "shipping_discount": "0",
            "insurance": "0",
            "handling_fee": "0",
            "tax": "0"}
        }

        console.log("this is total amount")
        console.log(totalAmount)
        console.log("this is newCart")
        console.log(newCart)

        if (pay) {
            navigation.navigate("PayPal", {itemList: prodBill, amount: totalAmount, payOutReceiver: null, sendBack: {}, sendId: null, home:false, products: true})
        }

    }

    //need to call this method anytime we leave the page so that their changes are saved
    const editCart = (newCart) => {
        //the quantities of a product has changed, so we need to send a patch request to backend
        fetch(`http://${ip}:8000/api/cart/${newCart.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(newCart)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => console.log(error))
    }

    const getCart = () => {
        fetch(`http://${ip}:8000/api/accounts/${id}/getCart`, {
            method: 'GET',
            headers: {
                //bc we are sending JSON data
                'Content-Type': 'application/json',
                'Authorization': "Token " + token,
            }
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            setCartItems(data)
            cartItems.forEach((item) => {
                products[item.product.name] = item.quantity
            })
            console.log('this is products')
            console.log(products)
        })
        .catch(error => console.log(error))
    }

    const deleteItem = (id) => {
        //we want to delete the item, so we send a request to backend
        console.log(id)
        fetch(`http://${ip}:8000/api/cart/${id}`, {
                method:"DELETE",
                headers:{
                    'Authorization': `Token ${token}`
                }
            })
        .then(response => response.json())
        .then(setChange(true))
        .catch(error => {
            setChange(true)
            console.log(error)
        })  
    }

    useEffect(() => {
        getCart()
    }, [change])

    return (
        <ScrollView>
            <Text style={{textAlign: 'center', fontSize: 30, fontWeight: 'bold'}}>Your Cart</Text>
            <Card>
                <Form 
                    formInitialValues={products}
                    cart={true}
                    cartForm={setForm}>
                    {
                        cartItems.map((item, id) => {
                            return (
                                    <View style={styles.prodCard} key={id}>
                                        <Image source={item.product.image ?  {uri: item.product.image} : require('../img/noface-square.jpg')} style={styles.userImg}/>
                                        <View style={styles.prodInfo}>
                                            <FormInput label={`${item.product.name}`} name={item.product.name} numeric={true} start={item.quantity} min={1}/>
                                            <Text style={{marginLeft: 10}}>${item.product.price}</Text>
                                        </View>
                                        <TouchableOpacity style={{justifyContent: 'center', marginLeft: 10, alignItems: 'center'}} onPress={() => deleteItem(item.id)}>
                                            <EvilIcons name="trash" color="#ff0000" size={50}/>
                                            <Text>delete</Text>
                                        </TouchableOpacity>
                                    </View>
                            )
                        })
                    }
                    <TouchableOpacity style={{marginBottom: 5, flexDirection: 'row', justifyContent: "flex-end", marginRight: 20,}} onPress={() => processCart(form, false)}>
                        <Text style={{color: '#1e90ff'}}>save cart</Text>
                    </TouchableOpacity>
                </Form>
                <Button color='#34BDC3' title='Proceed to Payment' onPress={() => processCart(form, true)}/>
                <Button color='#FE9834' title='SHOP MORE' onPress={() => navigation.navigate('ProductScreen')}/>
                {/* <Button color='#FE9834' title='SHOP MORE' onPress={() => console.log(form)}/> */}
            </Card>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    userImg: {
        height: 75,
        width: 75,
        borderRadius: 75,
        marginTop: 5,
        marginLeft: 5,
    },
    prodCard: {
        borderRadius: 10,
        flexDirection: 'row',
        margin: 20,
    },
    prodInfo: {
        flexDirection: 'column',
        marginTop: 10,
        width: 200,
    }
})

export default Cart