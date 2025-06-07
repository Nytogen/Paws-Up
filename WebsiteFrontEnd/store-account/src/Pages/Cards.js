import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

import CardContent from "@material-ui/core/CardContent";
import { Grid } from "@material-ui/core";
import noImage from '../No-Image.jpg';

import {ip, AuthContext} from '../global'


const useStyles = makeStyles(theme => ({
  root: {
  },
  title: {
    marginBottom: "30px"
  },
  header: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  card: {
    Width: 500,
    // margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  content: {
    textAlign: "left",
    padding: theme.spacing(3)
  },
  divider: {
    margin: `${theme.spacing(3)}px 0`
  },
  heading: {
    fontWeight: "bold"
  },
  subheading: {
    lineHeight: 1.8
  },
}));




export default function SimpleCard() {


  const [productData, setProductData] = useState([])
  var purchases = useState({})
  const navigate = useNavigate();


  // function to connect ot backend

   const viewCard = () => {
      fetch(`http://${ip}:8000/api/products`, {method: 'GET',
      headers: {
          //bc we are sending JSON data
          'Content-Type': 'application/json',
      },
    })
    .then(resp => resp.json())
    .then(data => {
      //checking if successful
      for (var i = 0;  i < data.length; i++) {
        if (data[i].image==null) {
          data[i].image = noImage;
        }

        /*data.map(i =>
          fetch(`http://${ip}:8000/api/products/${i.id}/getPurchaseRecords`, {method: 'GET',
            headers: {
                //bc we are sending JSON data
                'Content-Type': 'application/json',
            },
          })
          .then(resp => resp.json())
          .then(purchaseData => {
          //checking if successful
          var purchaseCount = 0;
            for (var j = 0;  j < purchaseData.length; j++) {
              purchaseCount = purchaseCount + purchaseData[j].quantity;
            }
            purchases[0][`id${i.id}`] = purchaseCount;
          })
          .catch(error => {
            console.log(error)
          })
        )*/
    }
      setProductData(data)
    })
    .catch(error => {
      console.log(error)
    })
  }


    useEffect(() => {
      viewCard()
      },[])

    
  const classes = useStyles();

  

  return (
    <div className="root">
      <div className={classes.title}>
        <h2>Cards</h2>
      </div>


      <Grid container spacing={1}>
        {productData.map((item, Key) => {
          const name = item.name;
          const price = item.price;
          return (
            <Grid item>
              <div>
              <Card key={Key} variant="outlined" className={classes.card} onClick={()=> navigate(`/${item.id}`)}>
                <CardContent>
                  <img style={{width: 150, height: 150}} src = {item.image} />
                  <br/>
                    {item.name}

                  <br/>
                    ${price}
                    
                  <br/>
                    Purchases: { purchases[0][`id${item.id}`]}
                </CardContent>
              </Card>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
