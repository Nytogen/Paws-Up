import React, {useState, useEffect, useContext} from 'react'
import { StyleSheet, Text, View, FlatList, Alert, ActivityIndicator, ScrollView} from 'react-native';
import { WebView } from 'react-native-webview';
import {ip, AuthContext} from '../global'
import qs from 'qs';
import { decode, encode } from 'base-64'

function PayPal({navigation, route}) {

    const [isWebViewLoading, SetIsWebViewLoading] = useState(false);
    const [paypalUrl, setPaypalUrl] = useState('');
    const [accessToken, setAccessToken] = useState("");
    const [payOutId, setPayOutId] = useState(0);
    const [success, setSuccess] = useState(false)
    const view = "www.screenprank.com/banana.html"

    const {itemList, amount, payOutReceiver, sendBack, sendId, home, products} = route.params
    const {token, id} = useContext(AuthContext);

    console.log("THIS IS SEND BACK")
    console.log(sendBack)

    console.log("This is items and amount")
    console.log(itemList)
    console.log(amount)

      //Fix bug btoa
    useEffect(() => {
      if (!global.btoa) {
        global.btoa = encode;
      }

      if (!global.atob) {
        global.atob = decode;
      }
    }, [])

    //get the batch_sender_id
    useEffect(() => {

      fetch(`http://${ip}:8000/api/services/payoutid`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' +  token
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.payoutID)
        setPayOutId(data.payoutID)
        console.log(payOutId)
      })
      .catch(error => {
        console.log(error)
      })
    }, [])

    const [shouldShowWebViewLoading, setShouldShowWebviewLoading] = useState(true)

    const postPurchase = () => {
      //this function sends purchase info to the backend
      let url = `http://${ip}:8000/api/accounts/${id}/payCart`
      if (!products) {
        url = `http://${ip}:8000/api/services/${sendId}/purchase`
      }

      fetch(url, {
        method: "POST",
        headers: {
          //bc we are sending JSON data
          'Content-Type': 'application/json',
          'Authorization': 'Token ' +  token
        },
        body: JSON.stringify(sendBack)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        console.log(err)
      })
    }

    const buyService = async () => {

        //Check out https://developer.paypal.com/docs/integration/direct/payments/paypal-payments/# for more detail paypal checkout
        const dataDetail = {
          "intent": "sale",
          "payer": {
            "payment_method": "paypal"
          },
          "transactions": [{
            "amount": amount,
            "description": "This is the payment transaction description",
            "payment_options": {
              "allowed_payment_method": "IMMEDIATE_PAY"
            }, "item_list": {
              "items": itemList
            }
          }],
          "redirect_urls": {
            "return_url": `http://${ip}:8000/`,
            "cancel_url": `http://${ip}:8000/api/Home`
          }
        }
    
        const data = {
          grant_type: 'client_credentials'
    
        };
    
        fetch(`https://api.sandbox.paypal.com/v1/oauth2/token`, {
          method: "POST",
          headers: {
            'Accept': 'application/json', 
            'Accept-Language': 'en_US',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + encode('AT0btc7r3FPh1ikl4JISqZsY2deQTzD37GaoCN_SCcidxmqiwi_5qp-33DuolzTr15vHQOgR0LVUCdpF:EDDV_8TmtP436oaXVaLwJ5y-6Z5rmi87FJ2AotbQx3PZUt7ZTPxujzp7XoxrOBSyAw2KKvmaVPx1RJP0')
          },
          body: qs.stringify(data)
        })
          .then(response => response.json())
         .then(data => {
          setAccessToken(data.access_token)
    
            fetch(`https://api.sandbox.paypal.com/v1/payments/payment`, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.access_token}`
              },
              body: JSON.stringify(dataDetail)
            })
            .then(response => response.json())
            .then(data => {
              const { id, links } = data
              const approvalUrl = links.find(data => data.rel == "approval_url").href
              console.log(approvalUrl)
              console.log("response", links)
              setPaypalUrl(approvalUrl)
            })
            .catch(err => {
              console.log({ ...err })
            })
        }).catch(err => {
          console.log(err)
        })
      };

      const onWebviewLoadStart = () => {
        if (shouldShowWebViewLoading) {
          SetIsWebViewLoading(true)
        }
      }

      const _onNavigationStateChange = (webViewState) => {
        console.log("webViewState", webViewState)
    
        if (webViewState.url.includes(`http://${ip}:8000/`)) {
    
          setPaypalUrl(null)
          const urlArr = webViewState.url.split(/(=|&)/);
    
          const paymentId = urlArr[2];
          const payerId = urlArr[10];
    
            fetch(`https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              },
              body: JSON.stringify({ payer_id: payerId })
            })
            .then(response => response.json())
            .then(data => {
              setShouldShowWebviewLoading(true);
              console.log("I'M AT THIS PART");
              console.log(data)
              let approvalTime = data.update_time
              sendBack["approval_time"] = approvalTime
              console.log("NEW SEND BACK")
              console.log(sendBack)
              if (!products) {
                payOut()
              } else {
                let shipping = data.payer.payer_info.shipping_address
                console.log("THIS IS SHIPPING")
                console.log(shipping)
                let shipString = ''
                for (const key in shipping) {
                  shipString += shipping[key] + ' '
                }
                console.log(shipString)
                sendBack["address"] = shipString
                setSuccess(true)
                Alert.alert('Payment Successful!')
                navigation.navigate('ProductScreen')
              }
            })
            .catch(err => {
              setShouldShowWebviewLoading(true)
              console.log({ ...err })
            })
    
        }
      }

      if (success && products) {
        postPurchase()
        setSuccess(false)
      }

      const payOut = () => {
          //this is the function that pays the service owner
          const dataDetails = {
                "sender_batch_header": {
                    //needs to be a different number everytime from what I understand
                  "sender_batch_id": payOutId,
                  "email_subject": "You have a payout!",
                  "email_message": "You have received a payout! Thanks for using our service!"
                },
                "items": [
                  {
                    "recipient_type": "PAYPAL_ID",
                    "amount": {
                      "value": amount.total,
                      "currency": "CAD"
                    },
                    "note": "Thanks for your patronage!",
                    "sender_item_id": "15240864065560",
                    "receiver": payOutReceiver
                  },
                ]
              }
            
              fetch(`https://api.sandbox.paypal.com/v1/payments/payouts`, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(dataDetails)
              })
              .then(response => response.json())
              .then(data => {
                setShouldShowWebviewLoading(true)
                console.log("I GOT HERE")
                console.log(data)
                Alert.alert('Payment Successful!')
                setSuccess(true)
                if(home){
                  navigation.navigate('HomeScreen')
                }
                else{
                  navigation.navigate('ServiceScreen')
                }
              })
              .catch(err => {
                setShouldShowWebviewLoading(true)
                console.log("I GOT HERE INSTEAD")
                console.log({ ...err })
              })
      }

      if(success && !products) {
        postPurchase()
      }

      useEffect(() => {
        buyService()
      }, [])

    return (
      <WebView
        style={{flex: 1, height: "100%", width: "100%", top: 0, right: 0, left: 0, bottom: 0, justifyContent: "center"}}
        source={paypalUrl ? { uri: paypalUrl } : { uri: view }}
        onNavigationStateChange={_onNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        onLoadStart={onWebviewLoadStart}
        onLoadEnd={() => SetIsWebViewLoading(false)}
      />
    )
}

export default PayPal
