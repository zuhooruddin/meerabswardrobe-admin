import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import { BundleForm } from "pages-sections/admin";
import React,{ useState, useEffect, useRef } from "react";
import * as yup from "yup";
import api from "utils/api/dashboard";
import axios from "axios";
import axiosInstance from "axios";
import {server_ip} from "utils/backend_server_ip.jsx";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { getSession } from "next-auth/react";
import useSWR from 'swr';
import {useSession} from 'next-auth/react';


const EditBundle = (props) => {
  const router = useRouter();
  const { data: session,status} = useSession();

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
   // Scroll Position on dropdown Start
  const [scrollPosition, setScrollPosition] = useState(0);
  const listElem = useRef();
  const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) mounted.current = true;
        else if (scrollPosition && listElem.current) 
            listElem.current.scrollTop = scrollPosition - listElem.current.offsetHeight;
      })
     // Scroll Position on dropdown END
  const [useSwrFlag,setUseSwrFlag] = useState(true);
  const [BundleProduct,setBundleProduct] = useState(props.bundleItem);
  useEffect(() => {
    if(BundleProduct.length>0){
      let price = 0;
      let salePrice = 0;
      for(let i=0;i<BundleProduct.length;i++){
        price     = price + (BundleProduct[i]['mrp'] * BundleProduct[i]['quantity']);
        salePrice = salePrice + (BundleProduct[i]['salePrice'] * BundleProduct[i]['quantity']);
      }
      setPrice(price);
      setSalePrice(salePrice);
    }
    else{
      setPrice(0);
      setSalePrice(0);
    }
  }, [BundleProduct]);
  const [BundleType, setBundleType] = useState(props.bundleDetail[0]['bundleType']);
  useEffect(() => {
    if(BundleType=="PRODUCT"){
      setbrandSelected('');
      setbrandDisabled(true);
    }
    else{
      setbrandDisabled(false);
    }
  }, [BundleType])
  // For paginated items
  const [productList, setProductList] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [search,setSearch] = useState('');
  const [searchText,setSearchText] = useState('');
  const [nextLink,setNextLink] = useState(null);

  // For Pagination 
  const fetcher = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);
   const { data, error } = useSWR(useSwrFlag?server_ip+`getAllPaginatedItemsForBundle?page=${pageIndex}&search=${search}`:null, fetcher);
   if (error) <p>Loading failed...</p>;
   if (!data) <h1>Loading...</h1>;
   if(useSwrFlag){
   if (data){setProductList(data['results']);setUseSwrFlag(false);setNextLink(data['next'])}
    }

  const loadMoreResults = () =>{
    if(nextLink){
    loadMoreApiCall(nextLink);
  }
}
  async function loadMoreApiCall(nextUrl){
    const apiResponse = await axiosInstance
      .get(nextUrl, {
          headers: {
              "Authorization":'Bearer '+session.accessToken
          },
      }).then((res) => {
        setNextLink(res.data['next']);
        setProductList([...productList, ...res.data['results']]);
        return res;
      }).catch((error) => {
          if (error.response) {
              //// if api not found or server responded with some error codes e.g. 404
              toast.error('Load More Products Not Successfull! Request '+error.response.statusText, {
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

  // Eng paginated items
  const [brandSelected, setbrandSelected] = useState(props.bundleDetail[0]['categoryId']);
  const [brandDisabled, setbrandDisabled] = useState(false);
  const [ProductSelected,setProductSelected] = useState();
  const [Price,setPrice] = useState(props.bundleDetail[0]['mrp']);
  const [SalePrice,setSalePrice] = useState(props.bundleDetail[0]['salePrice']);
  const brandList = props.brandList['results'];

  const handleProductSelectedChange = (product) => {
    setProductSelected(product);
  }
  const handleBundleProductChange = (product) => {
    setBundleProduct((prevList) =>  [...prevList, product]);
  }
  const [disableButtonCheck,setdisableButtonCheck] = useState(false)
  const initialValues = {
    name: props.bundleDetail[0]['name'],
    slug: props.bundleDetail[0]['slug'],
    sku: props.bundleDetail[0]['sku'],
    bundleType: BundleType,
    brand: props.bundleDetail[0]['categoryId'],
    product: BundleProduct,
    price:Price,
    salePrice:SalePrice,
    description:props.bundleDetail[0]['description'],
    image:props.bundleDetail[0]['image'],

  };
  function convertToSlug(Text) {
    return Text.toLowerCase()
              .replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+|_/g,'');
  }

  async function updateBundle(data,items,id,setdisableButtonCheck){
    const myNewModel = await axiosInstance
      .patch(`${server_ip}updateBundle/${id}`, data, {
          headers: {
              "Content-Type": "multipart/form-data",
              "Authorization":'Bearer '+session.accessToken,
          },
      }).then((res) => {
          if(res.status == 200){
          toast.success("Bundle Updated Successfully", {position: toast.POSITION.TOP_RIGHT});
          updateBundleProduct(items,res.data['id'],res.data['bundleType'],setdisableButtonCheck);
          }
          return res;
      }).catch((error) => {
          if (error.response) {
            //// if api not found or server responded with some error codes e.g. 404
          if(error.response.status==400){
            var a =Object.keys(error.response.data)[0]
            toast.error("Name or "+error.response.data[a].toString(), {position: toast.POSITION.TOP_RIGHT});
          }
          else{
            toast.error('Error Occured while Updating Bundle '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
          }
          return error.response
        } else if (error.request) {
          /// Network error api call not reached on server 
          toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
          return error.request
        } else {
          toast.error('Error Occured', {position: toast.POSITION.TOP_RIGHT});
          return error
        }
      });
  }
  async function updateBundleProduct(data,id,type,setdisableButtonCheck){
    const myNewModel = await axiosInstance
      .post(`${server_ip}updateBundleItem`, {data:data,id:id}, {
          headers: {
              "Content-Type": "application/json",
              "Authorization":'Bearer '+session.accessToken
          },
      }).then((res) => {
          if(res.status==200){
            setdisableButtonCheck(true);
            toast.success("Products Updated", {position: toast.POSITION.TOP_RIGHT});
            if (type=='BRAND'){
              // window.location.href = '/admin/bundles/brand';
              router.push({
                pathname: `/admin/bundles/brand`,
                query: { pageIndexRouter: router.query.pageIndexRouter, scrollPosition:router.query.scrollPosition, rowsPerPageRouter:router.query.rowsPerPageRouter },
              })
          }
            else{
              // window.location.href = '/admin/bundles/product';
              router.push({
                pathname: `/admin/bundles/product`,
                query: { pageIndexRouter: router.query.pageIndexRouter, scrollPosition:router.query.scrollPosition, rowsPerPageRouter:router.query.rowsPerPageRouter },
              })
            }
            // if (type=='brand'){router.push('/admin/bundles/brand');}
            // else{router.push('/admin/bundles/product');}
            // router.push('/admin/bundles');
          }
          return res;
      }).catch((error) => {
          if (error.response) {
            //// if api not found or server responded with some error codes e.g. 404
          if(error.response.status==400){
            var a =Object.keys(error.response.data)[0]
            toast.error(error.response.data[a].toString(), {position: toast.POSITION.TOP_RIGHT});
          }
          else{
            toast.error('Error Occured while adding products '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
          }
          return error.response
        } else if (error.request) {
          /// Network error api call not reached on server 
          toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
          return error.request
        } else {
          toast.error('Error Occured', {position: toast.POSITION.TOP_RIGHT});
          return error
        }
      });
  }
  const handleFormSubmit = (values) => {
    let slug = convertToSlug(values['name']);
    const formData = new FormData();
    if (values.imageFile){
      if(values['imageFile'].name != initialValues['image']){
        formData.append("image", values['imageFile'], 
        values['imageFile'].name);
      }
    }
    if(values.name!=initialValues['name']){formData.append("name", values['name']);formData.append("slug", slug)}
    // if(values.slug!=initialValues['slug']){formData.append("slug", slug)}
    if(Price!=props.bundleDetail[0]['mrp']){formData.append("mrp", Price)}
    if(SalePrice.slug!=props.bundleDetail[0]['salePrice']){formData.append("salePrice", SalePrice)}
    if(values.sku!=initialValues['sku']){formData.append("sku", values['sku'])}
    if(values.description!=initialValues['description']){formData.append("description", values['description'])}
    if(values.bundleType!=props.bundleDetail[0]['bundleType']){formData.append("bundleType", values['bundleType'])}
    if(values.brand!=initialValues['brand']){formData.append("categoryId", values['brand'])}

    
    // let apiResponse = updateBundle(formData,BundleProduct,props.bundleDetail[0]['id'],setdisableButtonCheck);

    if(Math.floor(new Date(Date.now()))>Math.floor(new Date(session.expires))){
      reloadSession();
      toast.info('Session Expired! Refreshing Session.... Kindly try again to submit', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else if(Math.floor(new Date(Date.now()))<Math.floor(new Date(session.expires))){
      updateBundle(formData,BundleProduct,props.bundleDetail[0]['id'],setdisableButtonCheck)
    }

  };

  return (
    <Box py={4}>
      <H3 mb={2}>Update Bundle</H3>

      <BundleForm
        initialValues     = {initialValues}
        validationSchema  = {validationSchema}
        handleFormSubmit  = {handleFormSubmit}
        handleProductSelectedChange = {handleProductSelectedChange}
        productList       = {productList}
        brandList        = {brandList}
        ProductSelected   = {ProductSelected}
        brandDisabled    = {brandDisabled}
        BundleType        = {BundleType}
        setBundleProduct    = {setBundleProduct}
        BundleProduct       = {BundleProduct}
        handleBundleProductChange = {handleBundleProductChange}
        Price             = {Price}
        SalePrice         = {SalePrice}
        setbrandSelected = {setbrandSelected}
        brandSelected    = {brandSelected}
        setBundleType     = {setBundleType}
        updateHeading     = "Update Bundle"
        disableButtonCheck = {disableButtonCheck}
        convertToSlug     = {convertToSlug}
        setSearch         = {setSearch}
        setSearchText     = {setSearchText}
        searchText        = {searchText}
        setUseSwrFlag     = {setUseSwrFlag}
        loadMoreResults   = {loadMoreResults}
        setPageIndex      = {setPageIndex}
        listElem          = {listElem}
        setScrollPosition = {setScrollPosition}


      />
    </Box>
   
  );
}; // =============================================================================

EditBundle.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

const validationSchema = yup.object().shape({
  name: yup.string().required("Name required"),
  sku: yup.string().required("Sku required"),
  slug: yup.string().required("Slug required"),
  bundleType: yup.string().required("Bundle Type required"),
  brand: yup.string().nullable(),
  product: yup.array().required("Min 1 Product required").min(1),
  description: yup.string().required("Description required"),

});
export default EditBundle;

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
  const slug = context.query['id'];
  const brandList = await api.getAllBrand(sessionValue.accessToken);
  const bundle = await api.getBundle(slug,sessionValue.accessToken);
  const bundleDetail = bundle['bundleDetail']
  const bundleItemTemp = bundle['bundleItem']
  var bundleItem =[]
  for(var i=0;i<bundleItemTemp.length;i++){
    bundleItem.push({'id':bundleItemTemp[i]['itemId'],'name':bundleItemTemp[i]['name'],'quantity':bundleItemTemp[i]['quantity'],'price':bundleItemTemp[i]['mrp'],'mrp':bundleItemTemp[i]['mrp'],'salePrice':bundleItemTemp[i]['salePrice']});
  }

  return {
    props: {
      brandList,
      bundleDetail,
      bundleItem
    },
  };
};

EditBundle.auth = true