import { Delete, KeyboardArrowDown } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { FlexBetween, FlexBox } from "components/flex-box";
import { H5, H6, Paragraph, Span } from "components/Typography";
import React from "react"; // list data
import Autocomplete from '@mui/material/Autocomplete';
import Image from 'next/image'

// Icons
import PersonIcon from '@mui/icons-material/Person';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import {server_ip} from "utils/backend_server_ip.jsx"
import SearchIcon from '@mui/icons-material/Search';

const OrderDetails = ({products,orderDetail,productList,handleProductSelectedChange,ProductSelected,deliveryCharges,subTotal,totalBill,updateTotalBill, handleFormSubmit,setDeletedProduct,OrderStatus,setOrderStatus,searchText,setSearchText,setSearch,setUseSwrFlag,OrderShippingAddress,setOrderShippingAddress,orderStatusFlag}) => {
  const dateFormat = new Date(orderDetail['timestamp']);
  // const imgBaseUrl = server_ip+"media/";
  const imgBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL
  const myLoader = ({ src, width, quality }) => {
    return imgBaseUrl+`${src}?w=${width}&q=${quality || 75}`
  }
  var date = dateFormat.getDate()+
           "/"+(dateFormat.getMonth()+1)+
           "/"+dateFormat.getFullYear()+
           " "+dateFormat.getHours()+
           ":"+dateFormat.getMinutes()+
           ":"+dateFormat.getSeconds();
  const defaultProps = {
    options: productList.filter(function(item){
      let duplicate = false
      for(let index=0;index<products.length;index++){ 
        if(item.sku == products[index]['sku']) {
          duplicate=true
        }
      }
      if(!duplicate){
        return item
      } 
    }),
  
    getOptionLabel: (option) => option.name,
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card
          sx={{
            p: 3,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <FlexBox alignItems="center" gap={1}>
                <PersonIcon
                  color="success"
                  fontSize="small"
                  className="nav-icon"
                />
                <span>{orderDetail['custName']}</span>
              </FlexBox>
              <FlexBox alignItems="center" gap={1}>
                <PhoneIphoneIcon
                  color="disabled"
                  fontSize="small"
                  className="nav-icon"
                />
                <span>{orderDetail['custPhone']}{orderDetail['cust_phone2']?' | '+orderDetail['cust_phone2']:''} </span>
              </FlexBox>
              <FlexBox alignItems="center" gap={1}>
                <EmailIcon
                  color="secondary"
                  fontSize="small"
                  className="nav-icon"
                />
                <span>{orderDetail['custEmail']}</span>
              </FlexBox>
              <FlexBox alignItems="center" gap={1}>
                <LocationOnIcon
                  sx={{ color: 'red' }}
                  fontSize="small"
                  className="nav-icon"
                />
                <span>{orderDetail['custCity']}</span>
              </FlexBox>
            </Grid>

            <Grid item xs={4}>
            <Paragraph>
              <Span color="grey.600">Order No:</Span> <b>{orderDetail['orderNo']}</b>
            </Paragraph>
            <Paragraph>
              <Span color="grey.600">Placed on:</Span> <b>{date}</b>
            </Paragraph>
            </Grid>
          </Grid>

          <FlexBox
            gap={3}
            my={3}
            flexDirection={{
              sm: "row",
              xs: "column",
            }}
          >
            <TextField
              select
              disabled={orderStatusFlag=="UNCONFIRMED"?false:true}
              fullWidth
              color="info"
              size="medium"
              value={OrderStatus}
              label="Order Status"
              onChange = {e=>setOrderStatus(e.target.value)}
              inputProps={{
                IconComponent: () => (
                  <KeyboardArrowDown
                    sx={{
                      color: "grey.600",
                      mr: 1,
                    }}
                  />
                ),
              }}
            >
              <MenuItem key="UNCONFIRMED" value="UNCONFIRMED">UNCONFIRMED</MenuItem>
              <MenuItem key="PENDING" value="PENDING">SEND TO POS</MenuItem>
              <MenuItem key="CANCELLED" value="CANCELLED">CANCELLED</MenuItem>
            </TextField>
          </FlexBox>
          <FlexBox style={{'margin-top':'2%'}} alignItems="center" gap={4}>

            <Grid xs={8}>
              <Autocomplete
                disabled={orderStatusFlag=="UNCONFIRMED"?false:true}
                {...defaultProps}
                id="product"
                value={ProductSelected || null}
                onChange={(event, newValue) => {
                  handleProductSelectedChange(newValue);
                }}
                openOnFocus={true}
                onKeyUp={(event,newValue) => {
                  event.defaultMuiPrevented = true;
                  setSearchText(event.target.value);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Product"  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Image
                      // loading="lazy"
                      loader={myLoader}
                      width="50"
                      height="40"
                      src={option.image || '/fallback-image.jpg'}
                      // srcSet={`${option.image} 2x`}
                      alt=""
                    />
                      ({option.sku}) {option.name}
                  </Box>
                )}
              />
            </Grid>
            <Grid xs={0}>
                        <IconButton disabled={orderStatusFlag=="UNCONFIRMED"?false:true} padding={2} onClick={() => {
                            setSearch(searchText);
                            setUseSwrFlag(true);
                            setSearchText('');
                            document.getElementById("product").focus();                            
                            }
                            }>
                            <SearchIcon />
                        </IconButton>
                      </Grid>
            <Grid item xs={2}>
              <Button
                disabled={orderStatusFlag=="UNCONFIRMED"?false:true}
                color="info"
                variant="contained"
                onClick={() => {
                  if(ProductSelected){
                  products.push({
                    // id: ProductSelected['id'],
                    name: ProductSelected['name'],
                    qty: 1,
                    price: ProductSelected['mrp'],
                    sku:  ProductSelected['sku'],
                    image: ProductSelected['image'].split('media/').pop(),
                    mrp:  ProductSelected['mrp'],
                    salePrice: ProductSelected['salePrice'],
                    isDeleted: false,
                  });
                  handleProductSelectedChange(null);
                  updateTotalBill();
                }
                }}
              >
              Add Item
              </Button>
            </Grid>
          </FlexBox>

          {products.map((item, index) => (
            <Box
              my={2}
              gap={2}
              key={index}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  md: "1fr 1fr",
                  xs: "1fr",
                },
              }}
            >
              <FlexBox flexShrink={0} gap={1.5} alignItems="center">
                <Avatar
                  src={imgBaseUrl+item.image}
                  sx={{
                    height: 64,
                    width: 64,
                    borderRadius: "8px",
                  }}
                />

                <Box>
                  <H6 mb={1}>{item.name}</H6>

                  <FlexBox alignItems="center" gap={1}>
                    <Paragraph fontSize={14} color="grey.600">
                      {item.price} x
                    </Paragraph>

                    <Box maxWidth={60}>
                      <TextField disabled={orderStatusFlag=="UNCONFIRMED"?false:true} InputProps={{inputProps: { min: 1 }}} defaultValue={item.qty} type="number" fullWidth onChange={(event, value) => {
                                item.qty=event.target.value;
                                updateTotalBill();
                              }} />
                    </Box>
                  </FlexBox>
                </Box>
              </FlexBox>

              <FlexBetween flexShrink={0}>
                <Paragraph color="grey.600">
                  SKU / ISBN: {item.sku}{item.isbn?' | '+item.isbn:''}
                </Paragraph>

                <IconButton disabled={orderStatusFlag=="UNCONFIRMED"?false:true} padding={2} onClick={() => {
                    if(products[index]['id']){
                      products[index]['isDeleted'] = true
                      setDeletedProduct(oldArray => [...oldArray, products[index]])
                    }
                    products.splice(index, 1);
                    updateTotalBill();
                  }
                  }>
                  <Delete
                    sx={{
                      color: "grey.600",
                      fontSize: 22,
                    }}
                  />
                </IconButton>
              </FlexBetween>
            </Box>
          ))}
        </Card>
      </Grid>

      <Grid item md={6} xs={12}>
        <Card
          sx={{
            px: 3,
            py: 4,
          }}
        >
          <TextField
            disabled={orderStatusFlag=="UNCONFIRMED"?false:true}
            rows={5}
            multiline
            fullWidth
            color="info"
            variant="outlined"
            label="Shipping Address"
            defaultValue={OrderShippingAddress}
            onChange = {e=>setOrderShippingAddress(e.target.value)}
            sx={{
              mb: 4,
            }}
          />
        </Card>
      </Grid>

      <Grid item md={6} xs={12}>
        <Card
          sx={{
            px: 3,
            py: 4,
          }}
        >
          <H5 mt={0} mb={2}>
            Total Summary
          </H5>

          <FlexBetween mb={1.5}>
            <Paragraph color="grey.600">Subtotal:</Paragraph>
            <H6>Rs. {parseInt(subTotal).toFixed(2)}</H6>
          </FlexBetween>

          <FlexBetween mb={1.5}>
            <Paragraph color="grey.600">Shipping fee:</Paragraph>

            <FlexBox alignItems="center" gap={1} maxWidth={100}>
              <Paragraph>Rs.</Paragraph>
              <TextField
                disabled={orderStatusFlag=="UNCONFIRMED"?false:true}
                color="info"
                defaultValue={parseInt(deliveryCharges)}
                type="number"
                InputProps={{ inputProps: { min: 0} }}
                onChange ={(event, value) => {
                  if(event.target.value){
                    orderDetail['deliveryCharges'] = event.target.value
                    updateTotalBill();
                  }
                  else{
                    orderDetail['deliveryCharges'] = 0
                    updateTotalBill();
                  }
                }}
                fullWidth
              />
            </FlexBox>
          </FlexBetween>
          <Divider
            sx={{
              my: 2,
            }}
          />

          <FlexBetween mb={2}>
            <H6>Total</H6>
            <H6>Rs. {parseInt(totalBill).toFixed(2)}</H6>
          </FlexBetween>

          <Paragraph>Payment Method: {orderDetail['paymentMethod']}</Paragraph>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Button disabled={orderStatusFlag=="UNCONFIRMED"?false:true} variant="contained" color="info" onClick={handleFormSubmit}>
          Save Changes
        </Button>
      </Grid>
    </Grid>
  );
};

export default OrderDetails;
