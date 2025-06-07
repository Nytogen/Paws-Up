import React, {useState, useEffect, useContext} from 'react'
import {Card, TextInput, Title} from 'react-native-paper'
import { StyleSheet, Text, View, FlatList, Alert, ActivityIndicator, ScrollView} from 'react-native';
import Button from '../components/Button';
import {ip, AuthContext} from '../global'
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import DateField from 'react-native-datefield';
import DatePicker from 'react-native-date-picker'

function Checkout({navigation, route}) {
    //useStates needed for payment info and text inputs
    const [petOptions, setPetOptions] = useState([])
    const [service, setService] = useState(null)
    const [payOutID, setPayOutId] = useState(null)
    const [additionalServices, setAdditionalServices] = useState([])

    //useStates needed for error checking
    const [errorMsg, setErrorMsg] = useState(null)
    const [ownerId, setOwnerId] = useState(null)

    //useStates for date input
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const [time, setTime] = useState(new Date())
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    const [serveStart, setServeStart] = useState('')
    const [serveEnd, setServeEnd] = useState('')
    
    let pets = {}

    let err = null

    const {serviceId, home} = route.params

    const {id} = useContext(AuthContext);

    const calculatePrice = (form) => {
      let total = 0
      let petBill = []

      console.log("this is the form")
      console.log(form)
      console.log(payOutID)
      //for each pet in the pet options, we need to add an object to the petBill array that holds the
      //name of the animal, quantity, and price
      petOptions.forEach(element => {
        if (element.pet_type in form) {
          total += element.price * form[element.pet_type]

          petBill.push({"name": element.pet_type, 
          "description": element.pet_type, 
          "quantity": form[element.pet_type], 
          "price": element.price, 
          "tax": "0",
          "currency": "CAD"})
        }
      })
      if (total === 0) {
        err = ['You must register at least one pet to purchase the service']
        setErrorMsg(err)
      }
      //for each additional service in the addition options array, we need to add a similar object to
      //the petBill array
      additionalServices.forEach(service => {
        if (service.name in form) {
          console.log(form[service.name])
          total += service.price * form[service.name]

          petBill.push({"name": service.name, 
          "description": service.name, 
          "quantity": form[service.name], 
          "price": service.price, 
          "tax": "0",
          "currency": "CAD"})
        }
      })
      console.log('this is the total ' + total)
      petBill.push(service)
      console.log(petBill)
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
      console.log(totalAmount)
      console.log(formatData(total, form))
      if (startDate != '' && endDate != '' && startTime != '' && endTime != '') {
        if (serveStart <= startTime && serveEnd >= endTime) {
          if (startTime <= endTime) {
            if (id != ownerId && err == null) {
              err = null
              setErrorMsg(err)
              console.log('wah')
              navigation.navigate("PayPal", {itemList: petBill, amount: totalAmount, payOutReceiver: payOutID, sendBack: formatData(total, form), sendId: serviceId, home:home, products:false})
            } else {
              if (err == null) {
                err = ['You cannot purchase your own service']
                setErrorMsg(err)
              }
            }
          } else {
            err = ['Start time must be less than end time']
            setErrorMsg(err)
          }
        } else {
          console.log(serveStart <= startTime && serveEnd >= endTime)
          err = ['The times you chose exceed the service times']
          setErrorMsg(err)
        }
      } else {
        err = ['You must give a time and date different from the default']
        setErrorMsg(err)
      }
    }


    const formatData = (total, form) => {
      //function to format the data so it can be sent to the backend
      let month = new Date(Date.parse(startDate.toString().slice(4, 15))).getMonth() + 1
      let date = new Date(Date.parse(startDate.toString().slice(4, 15))).getDate()
      let year = new Date(Date.parse(startDate.toString().slice(4, 15))).getFullYear()
      let start_date = `${year}-${month}-${date} ${startTime}`
      console.log("THIS IS START DATE")
      console.log(start_date)

      month = new Date(Date.parse(endDate.toString().slice(4, 15))).getMonth() + 1
      date = new Date(Date.parse(endDate.toString().slice(4, 15))).getDate()
      year = new Date(Date.parse(endDate.toString().slice(4, 15))).getFullYear()
      let end_date = `${year}-${month}-${date} ${endTime}`
      console.log(end_date)

      //need to use JSON stuff to copy the array and all its objects
      let pricingQuantities = JSON.parse(JSON.stringify(petOptions))
      console.log(pricingQuantities)
      petOptions.forEach(option => {
        //since we want to manipulate the pricing quantities array, we need to find the object in it
        //that that has the properties we want
        let idx = pricingQuantities.findIndex(x => x.pet_type == option.pet_type)
        console.log(idx)
        if (option.pet_type in form) {
          //for every pet option, we want to change the key of price in the pricing quantities
          //list to quantity instead
          console.log(option)
          Object.defineProperty(pricingQuantities[idx], "quantity",
            Object.getOwnPropertyDescriptor(pricingQuantities[idx], "price"));
          //delete old key
          delete pricingQuantities[idx]['price'];
          //assign quantity
          pricingQuantities[idx].quantity = form[option.pet_type]
        } else {
          pricingQuantities.splice(idx, 1)
        }
      });
      console.log(pricingQuantities)
      console.log(form)
      let additionalServiceQuantities = JSON.parse(JSON.stringify(additionalServices))
      console.log(additionalServiceQuantities)
      additionalServices.forEach(service => {
        let idx = additionalServiceQuantities.findIndex(x => x.name == service.name)
        console.log(idx)
        console.log(service)
        if (service.name in form) {
          //for every service, we want to change the key of price in the additional service quantity
          //list to quantity instead
          Object.defineProperty(additionalServiceQuantities[idx], "quantity",
            Object.getOwnPropertyDescriptor(additionalServiceQuantities[idx], "price"));
          //delete old key
          delete additionalServiceQuantities[idx]['price'];
          //assign quantity
          additionalServiceQuantities[idx].quantity = form[service.name]
        } else {
          additionalServiceQuantities.splice(idx, 1)
        }
      })
      console.log(additionalServiceQuantities)

      return {total_price: total, start_date, end_date, pricingQuantities, additionalServiceQuantities, payerId: id}

    }

    const fetchInfo = () => {
      fetch(`http://${ip}:8000/api/services/${serviceId}`, {
            method: 'GET'
        })
        .then(resp => resp.json())
        .then(data => {
          console.log(data)
          let serviceDetails = {"name": data.name, "description": data.details, "quantity": 1, "price": 0, "tax": 0, "currency": "CAD"}
          //need to set this for the overall price and service info in the payment bill
          setService(serviceDetails)
          //need this for the number of pets chosen by the user
          setPetOptions(data.pricingList)
          //need this to get the paypal of the service owner in order to pay them for their service
          setPayOutId(data.paypal_id)
          //need this to check if the person trying to buy the service is the owner of the service
          setOwnerId(data.owner)
          //need this for number of additional services chosen by user
          setAdditionalServices(data.additionalServiceList)
          //getting service start time
          setServeStart(data.service_start)
          //getting service end time
          setServeEnd(data.service_end)
          //object for the form. In this part we are adding the pets
          petOptions.forEach(pet => {
            pets[pet.pet_type] = 0
          });
          //adding additional services to the form object
          additionalServices.forEach(service => {
            pets[service.name] = 0
          })
          console.log("this is the pets")
          console.log(pets)
          console.log(service)
        })
        .catch(error => Alert.alert('Error:', error.message))
    }

    useEffect(() => {
      fetchInfo()
    }, [])

    return (
        <ScrollView contentContainerStyle={{alignItems: 'center'}}>
            <Card style={styles.date} >
                <Card.Title title="Check In Date"/>
                <DateField
                labelDate="Date"
                labelMonth="Month"
                labelYear="Year"
                onSubmit={(value) => setStartDate(value)}
                containerStyle={{ marginHorizontal: 10, borderColor:'#000000'}}
                />
                <DatePicker date={time} mode="time" style={{height: 100, margin: 'auto', alignSelf: 'center'}} 
                onDateChange={(time) => setStartTime(`${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}:00`)}/>
            </Card>
            <Card style={styles.date} >
                <Card.Title title="Check Out Date"/>
                <DateField
                labelDate="Date"
                labelMonth="Month"
                labelYear="Year"
                onSubmit={(value) => setEndDate(value)}
                containerStyle={{ marginHorizontal: 10, borderColor:'#000000'}}
                />
                <DatePicker date={time} mode="time" style={{height: 100, margin: 'auto', alignSelf: 'center'}} 
                onDateChange={(time) => setEndTime(`${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}:00`)}/>
            </Card>
            <Form submit={calculatePrice} 
                    buttName={`Proceed to Payment`}
                    buttColour='#34BDC3'
                    formInitialValues={pets}>
                    <View>
                      <Text style={{marginLeft: 20, fontSize: 20}}>Number of pets</Text>
                        {//here we are rendering out the inputs for the pet options
                          petOptions.map((item, key) => {
                            return <FormInput label={`${item.pet_type} ($${item.price} each)`} name={item.pet_type} key={key} numeric={true}/>
                          })
                        }
                        <Text style={{marginLeft: 20, fontSize: 20}}>Additional Services</Text>
                        {
                          //now we render out the additional services and their inputs
                          additionalServices.map((item, key) => {
                            return <FormInput label={`${item.name} ($${item.price} each)`} name={item.name} key={key} numeric={true}/>
                          })
                        }
                    </View>
                    {errorMsg ? 
                    <Card style={styles.errorContainer}>
                      <Text style={styles.error}> { errorMsg } </Text>
                    </Card> : null}
                    <Button color='#FE9834' title='cancel' onPress={() => navigation.navigate('ServiceDetailsPetOwner', {home:home, serviceId:serviceId})}/>
            </Form>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    date: {
        margin: 10,
        borderColor: '#000',
        borderRadius: 5,
        flexDirection: 'row',
    },
    error: {
      color: 'white',
    },
    errorContainer: {
        backgroundColor: 'red',
        height: 20,
        alignSelf: 'center',
        margin: 10,
    },
})

export default Checkout