import React, {useState, useEffect} from 'react';
import {Card, TextInput} from 'react-native-paper';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Alert,
  Button as Butt,
  Image,
  RefreshControl,
} from 'react-native';
import Button from '../components/Button';
import {ip} from '../global';
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Callout,
} from 'react-native-maps';
import PetList from './PetList';
import {SafeAreaView} from 'react-native-safe-area-context';
import {removeTypeDuplicates} from '@babel/types';

function DetailsMap({navigation, route}) {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  //For maps
  const [positionData, setPos] = useState();
  const [firstPosition, setFirst] = useState();
  const [Lat, setLat] = useState(37.78825);
  const [Long, setLong] = useState(-122.4324);

  function loadData() {
    getMap();
  }

  //const {Token, ServiceId, UserId, Location} = route.params

  async function getMap() {
    //JUST IN CASE SOMEHOW WE GO OVER LIMIT
    //API KEY 1 -
    //API KEY 2 -

    let givenAdd = route.params.location;

    console.log('------');
    console.log(givenAdd);

    let apiStack =
      'http://api.positionstack.com/v1/forward?access_key=[Redacted for public Repo]&query=';

    console.log(apiStack + givenAdd + '&limit=1');
    fetch(apiStack + givenAdd + '&limit=1', {method: 'GET'})
      .then(resp => resp.json())
      .then(data => {
        console.log(data.data[0]);
        setData(data);
        setFirst(data.data[0]);
        setLong(data.data[0].longitude);
        setLat(data.data[0].latitude);
        setLoading(false);
      })
      .catch(error => Alert.alert(error.message));
  }

  function undoJSON(petList) {
    var unJSON = [];
    var currentSplit = '';
    var petType = [];
    var price = [];

    for (var i = 0; i < petList.length; i++) {
      //Seperate type and price
      var test = JSON.stringify(petList[i]);

      //Remove the quotations and {} with regex
      test = test.replace(/["{}]+/g, '');

      currentSplit = test.split(',');

      //Get type
      petType = currentSplit[0].split(':');
      petType = petType[1].replace(/["{}]+/g, '');
      console.log(petType);

      //Get price
      price = currentSplit[1].split(':');
      price = price[1];

      //Add type:price to the list
      unJSON.push(petType + ':' + price);
    }

    return unJSON.join(', ');
  }

  function Back() {
    //navigation.navigate('ServiceDetailsPetOwner', {token:Token userId:UserId serviceId:ServiceId})
    navigation.navigate('ServiceDetailsPetOwner', {
      serviceId: route.params.serviceId,
      home: home,
    });
  }

  useEffect(() => {
    getMap();
  }, []);

  const map = () => {
    if (loading) {
      return <Text>Loading Info</Text>;
    }
    return (
      <SafeAreaView>
        <Button color="#FE9834" title="Back" onPress={() => Back()} />
        <View style={[styles.fullSection]}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              latitude: Lat,
              longitude: Long,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker coordinate={{latitude: Lat, longitude: Long}}>
              <Callout>
                <Text>{route.params.location.split('%20').join(' ')}</Text>
              </Callout>
            </Marker>

            <Circle
              center={{latitude: Lat, longitude: Long}}
              radius={2500}
              fillColor={'rgba(85, 205, 252, 0.35)'}
            />
          </MapView>
        </View>
      </SafeAreaView>
    );
  };

  return map();
}

const styles = StyleSheet.create({
  cardStyle: {
    padding: 10,
    margin: 10,
    textAlign: 'center',
  },

  fullSection: {
    height: '100%',
  },

  map: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  border: {
    borderWidth: 3,
  },

  title: {
    fontSize: 36,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#957DAD',
  },

  description: {
    fontSize: 26,
    textAlign: 'left',
  },

  text: {
    fontSize: 20,
  },

  heading: {
    fontSize: 24,
    textDecorationLine: 'underline',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  scrollViewItem: {
    flex: 1,
  },
});

export default DetailsMap;
