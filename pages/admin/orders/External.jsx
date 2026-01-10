import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import { OrderDetails } from "pages-sections/admin";
import React,{ useState } from "react";
import api from "utils/api/dashboard";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { getSession } from "next-auth/react"
import {useSession} from 'next-auth/react';
import useSWR from 'swr'
import axios from "axios";
import {server_ip} from "utils/backend_server_ip.jsx"

const OrderEdit = (props) => {
  const router = useRouter();
  const { data: session, status } = useSession()
  const callAPI = async () => {
    try {
        const res = await fetch(
            `/api/auth/session`,
            {
                method: 'GET',
            }
        );
        const data = await res.json();
        session = data;
        
    } catch (err) {
      toast.error('Session refresh failed!', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
      callAPI();
  };
  const products=props.products;
  const orderDetail = props.orderDetail;
  const orderNo     = props.orderNo;
  const orderStatusFlag = orderDetail["status"];

  //////////// Paginated Items
  const [useSwrFlag,setUseSwrFlag] = useState(true);
  const [productList, setProductList] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [search,setSearch] = useState('');
  const [searchText,setSearchText] = useState('');
   
   // For Pagination 
   const fetcher = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);
   const { data, error } = useSWR(useSwrFlag?server_ip+`getAllPaginatedItemsForBundle?page=${pageIndex}&search=${search}`:null, fetcher);
   if (error) <p>Loading failed...</p>;
   if (!data) <h1>Loading...</h1>;
   if(useSwrFlag){
   if (data){setProductList(data['results']);setUseSwrFlag(false);}
    }

  ////// Paginated Items END

  const [OrderShippingAddress,setOrderShippingAddress] = useState(orderDetail["shippingAddress"]);
  const [OrderStatus,setOrderStatus] = useState(orderDetail["status"]);
  const [ProductSelected,setProductSelected] = useState();
  const handleProductSelectedChange = (product) => {
    setProductSelected(product);
  }
  const [deliveryCharges,setDeliveryCharges] = useState(orderDetail['deliveryCharges']);
  const [subTotal,setSubTotal] = useState(orderDetail['totalBill']-orderDetail['deliveryCharges']);
  const [totalBill,setTotalBill] = useState(orderDetail['totalBill']);
  const [deletedProduct,setDeletedProduct] = useState([]);
  const updateTotalBill = () => {
    let productPrice = 0;
    for(let index=0;index<products.length;index++){
      productPrice = productPrice + (parseInt(products[index]['price']) * parseInt(products[index]['qty']) )
    }
    setSubTotal(productPrice);
    if(productPrice){
      setTotalBill(parseInt(productPrice)+parseInt(orderDetail['deliveryCharges']));
    }
    else{
      setTotalBill(0)
    }
    setDeliveryCharges(orderDetail['deliveryCharges']);
 }

 async function updateOrder(orderNo,deliveryCharges,totalBill,deletedProduct,updatedProduct,OrderStatus,OrderShippingAddress){
  const data = await api.updateOrder(orderNo,deliveryCharges,totalBill,deletedProduct,updatedProduct,OrderStatus,OrderShippingAddress,session.accessToken).then((response) => {
    if(response.data['ErrorCode']==1){
      toast.error(response.data['ErrorMsg'], {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else{
      toast.success(response.data['ErrorMsg'], {
        position: toast.POSITION.TOP_RIGHT
      });
      // if(OrderStatus=="PENDING"){sentToPos(orderNo)}
      // router.push('/admin/orders');
      if(OrderStatus=='PENDING'){sentToPos(orderNo);}
      else{
        // window.location.href = '/admin/orders';
        router.push({
          pathname: `/admin/orders`,
          query: { pageIndexRouter: router.query.pageIndexRouter, scrollPosition:router.query.scrollPosition, rowsPerPageRouter:router.query.rowsPerPageRouter },
        })
      }
    }
    return response.data
  }).catch((error) => {
    if (error.response) {
      //// if api not found or server responded with some error codes e.g. 404
      toast.error('Error Occured', {
        position: toast.POSITION.TOP_RIGHT
      });
      return error.response
    } else if (error.request) {
      /// Network error api call not reached on server
      toast.error('Network Error', {
        position: toast.POSITION.TOP_RIGHT
      });
      return error.request
    } else {
      toast.error('Error Occured', {
        position: toast.POSITION.TOP_RIGHT
      });
      return error
    }
  });
}
// SENT TO POS //
async function sentToPos(orderNo){
  // const payload = {
    
  // };
  try {
    const response1 = await fetch(`${server_ip}getOrderSentToPosDetails`,{method:'POST',body:JSON.stringify({'orderNo':orderNo}),headers: {"Authorization":"Bearer "+session.accessToken,'Content-Type': 'application/json'}})
    const payload = await response1.json();
    if(payload['ErrorCode']==0){
      toast.success('Sent To POS! '+payload['ErrorMsg'], {position: toast.POSITION.TOP_RIGHT});
      // window.location.href = '/admin/orders';
      router.push({
        pathname: `/admin/orders`,
        query: { pageIndexRouter: router.query.pageIndexRouter, scrollPosition:router.query.scrollPosition, rowsPerPageRouter:router.query.rowsPerPageRouter },
      })
    }
    else if(payload['ErrorCode']==1){
      toast.error(payload['ErrorMsg'], {position: toast.POSITION.TOP_RIGHT});
    }
    else{
      toast.error('Sent To POS! '+payload['ErrorMsg'], {position: toast.POSITION.TOP_RIGHT});
    }
  } catch (error) {
    if (error.response) {
        toast.error('Error Occured While Order Sent to POS! Kindly Contact Administrator '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
        return error.response
    } else if (error.request) {toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
        return error.request
      } else {toast.error('Error Occured', {position: toast.POSITION.TOP_RIGHT});
        return error
      }
  }
  }
  // END SENT TO POS ///

 const handleFormSubmit = (values) => {
  if(Math.floor(new Date(Date.now()))>Math.floor(new Date(session.expires))){
    reloadSession();
    toast.info('Session Expired! Refreshing Session.... Kindly try again to submit', {
      position: toast.POSITION.TOP_RIGHT
    });
  }
  else if(Math.floor(new Date(Date.now()))<Math.floor(new Date(session.expires))){
    // if(OrderStatus=='PENDING'){sentToPos(orderNo);}
    updateOrder(orderNo,deliveryCharges,totalBill,deletedProduct,products,OrderStatus,OrderShippingAddress);
  }
  };
 
  return (
    <Box py={4}>
      <H3 mb={2}>Order Details</H3>

      <OrderDetails
      products = {products} 
      orderDetail= {orderDetail} 
      productList={productList}
      handleProductSelectedChange = {handleProductSelectedChange}
      ProductSelected   = {ProductSelected}
      deliveryCharges   = {deliveryCharges}
      subTotal          = {subTotal}
      totalBill         = {totalBill}
      OrderShippingAddress    = {OrderShippingAddress}
      setOrderShippingAddress = {setOrderShippingAddress}
      OrderStatus       = {OrderStatus}
      setOrderStatus    = {setOrderStatus}
      updateTotalBill   = {updateTotalBill}
      setDeletedProduct = {setDeletedProduct}
      handleFormSubmit  = {handleFormSubmit}
      searchText        = {searchText}
      setSearchText     = {setSearchText}
      setSearch         = {setSearch}
      setUseSwrFlag     = {setUseSwrFlag}
      orderStatusFlag   = {orderStatusFlag}

      />
    </Box>
  );
}; // =============================================================================

OrderEdit.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

export default OrderEdit;

export async function getServerSideProps(context) {
  var sessionValue = await getSession(context);
  if (!sessionValue) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const orderNo = context.query['id'];
  const products = await api.getOrderProduct(orderNo,sessionValue.accessToken);
  const orderDetail = await api.getOrder(orderNo,sessionValue.accessToken);
  if(orderDetail[0]['orderNotification']==0){
    await api.seenOrderNotification(orderNo,sessionValue.accessToken);
  }

  return { props: { products:products,orderDetail:orderDetail[0],orderNo:orderNo } }
}

OrderEdit.auth = true
