import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import { BundleForm } from "pages-sections/admin";
import React,{ useState, useEffect, useRef  } from "react";
import * as yup from "yup";
import api from "utils/api/dashboard";
import axios from "axios";
import axiosInstance from "axios";
import {server_ip} from "utils/backend_server_ip.jsx"
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { getSession } from "next-auth/react"
import useSWR from 'swr'
import {useSession} from 'next-auth/react';

const CreateBundle = (props) => {
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
  const [BundleProduct,setBundleProduct] = useState([]);
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
  const [BundleType, setBundleType] = useState("BRAND");
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

   if (data){setProductList(data['results']);setUseSwrFlag(false);setNextLink(data['next']);data=null}


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

  const [brandSelected, setbrandSelected] = useState("");
  const [brandDisabled, setbrandDisabled] = useState(false);
  const [ProductSelected,setProductSelected] = useState();
  const [Price,setPrice] = useState(0);
  const [SalePrice,setSalePrice] = useState(0);
  const brandList = props.brandList['results'];

  const handleProductSelectedChange = (product) => {
    setProductSelected(product);
  }
  const handleBundleProductChange = (product) => {
    setBundleProduct((prevList) =>  [...prevList, product]);
  }
  const [disableButtonCheck,setdisableButtonCheck] = useState(false)
  const initialValues = {
    name: "",
    slug: "",
    sku: "",
    bundleType: BundleType,
    brand: "",
    product: ProductSelected,
    price:Price,
    salePrice:SalePrice,
    description:"",
    image:"bundle_images/default-bundle.png",
  };
  function convertToSlug(Text) {
    return Text.toLowerCase()
              .replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+|_/g,'');
  }

  async function addBundle(data,items,setdisableButtonCheck){
    const myNewModel = await axiosInstance
      .post(`${server_ip}addBundle`, data, {
          headers: {
              "Content-Type": "multipart/form-data",
              "Authorization":'Bearer '+session.accessToken,
          },
      }).then((res) => {
          if(res.status == 201){
            toast.success("Bundle Created Successfully", {position: toast.POSITION.TOP_RIGHT});
            addBundleProduct(items,res.data['id'],res.data['bundleType'],setdisableButtonCheck);
          }
          return res;
      }).catch((error) => {
          if (error.response) {
            //// if api not found or server responded with some error codes e.g. 404
          if(error.response.status==400){
            for(var i=0;i<Object.keys(error.response.data).length;i++){
              var key = Object.keys(error.response.data)[i];
              var value = error.response.data[key].toString();
              toast.error(<div>Field: {key} <br/>Error Message: {value}</div>, {position: toast.POSITION.TOP_RIGHT});
            }
          }
          else{
            toast.error('Error Occured while creating Bundle '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
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
  async function addBundleProduct(data,id,type,setdisableButtonCheck){
    const myNewModel = await axiosInstance
      .post(`${server_ip}addBundleItem`, {data:data,id:id}, {
          headers: {
              "Content-Type": "application/json",
              "Authorization":'Bearer '+session.accessToken
          },
      }).then((res) => {
        if(res.status == 200 || res.status == 201){
          setdisableButtonCheck(true);
          toast.success("Products Added to Bundle", {position: toast.POSITION.TOP_RIGHT});
          if (type=='BRAND'){window.location.href = '/admin/bundles/brand';}
          else{window.location.href = '/admin/bundles/product';}
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
    if(values['bundleType']=="BRAND" && values['brand'] && brandSelected || values['bundleType']=="PRODUCT"){
    let slug = convertToSlug(values['name']);
    const formData = new FormData();
    if (values.imageFile){
      formData.append("image", values['imageFile'], 
      values['imageFile'].name);
    }
    formData.append("name", values['name']);
    formData.append("slug", slug);
    formData.append("mrp", Price);
    formData.append("salePrice", SalePrice);
    formData.append("sku", values['sku']);
    formData.append("description", values['description']);
    formData.append("bundleType", values['bundleType']);
    formData.append("categoryId", values['brand']);
    formData.append("metaUrl", values['metaUrl']);
    formData.append("metaTitle", values['metaTitle']);
    formData.append("metaDescription", values['metaDescription']);

    // let apiResponse = addBundle(formData,BundleProduct,setdisableButtonCheck);
    
    if(Math.floor(new Date(Date.now()))>Math.floor(new Date(session.expires))){
      reloadSession();
      toast.info('Session Expired! Refreshing Session.... Kindly try again to submit', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else if(Math.floor(new Date(Date.now()))<Math.floor(new Date(session.expires))){
      // addbrand(formData,setdisableButtonCheck);
      addBundle(formData,BundleProduct,setdisableButtonCheck);
    }

  }
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Add New Bundle</H3>

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
        setBundleProduct  = {setBundleProduct}
        BundleProduct     = {BundleProduct}
        handleBundleProductChange = {handleBundleProductChange}
        Price             = {Price}
        SalePrice         = {SalePrice}
        setbrandSelected = {setbrandSelected}
        brandSelected    = {brandSelected}
        setBundleType     = {setBundleType}
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

CreateBundle.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

const validationSchema = yup.object().shape({
  name: yup.string().required("Bundle Name Required"),
  sku: yup.string().required("Sku Required"),
  slug: yup.string().required("Slug required"),
  bundleType: yup.string().required("Bundle Type Required"),
  brand: yup.number(),
  product: yup.array().required("required").min(1),
  description: yup.string().required("Bundle Description Required"),

});
export default CreateBundle;

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

  const brandList = await api.getAllBrand(sessionValue.accessToken);

  return {
    props: {
      brandList
    }
  };
};

CreateBundle.auth = true

