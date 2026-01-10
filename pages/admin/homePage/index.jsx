import { Box, Card, Autocomplete, Button, Grid} from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import React from "react";
import { useState, useRef, useEffect } from "react";
import useSWR from 'swr'
import axios from "axios";
import axiosInstance from "axios";
import {server_ip} from "utils/backend_server_ip.jsx";
import {Sections} from "pages-sections/admin";
import {SectionSequence} from "pages-sections/admin";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { useSession } from "next-auth/react"


// =============================================================================

HomePageSetup.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================
export default function HomePageSetup({ props }) {
  const { data: session, status } = useSession()
  const router = useRouter();
  const address3 = server_ip+`AllConfiguration`;
  const fetcher3 = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);
  const { data:allConfiguration, error:allConfigurationError } = useSWR(address3, fetcher3);
  if (allConfigurationError) <p>Loading failed...</p>;
  if (!allConfiguration) <h1>Loading...</h1>;

  const address2 = server_ip+`AllIndividualBoxOrder`;
  const fetcher2 = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);
  const { data:boxOrderData, error:boxOrderError } = useSWR(address2, fetcher2);


  if (boxOrderError) <p>Loading failed...</p>;
  if (!boxOrderData) <h1>Loading...</h1>;

  const address = server_ip+`AllCategories`;
  const fetcher = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);
  const { data:allCategoriesData, error:allCategoriesError } = useSWR(address, fetcher);




  if (allCategoriesError) <p>Loading failed...</p>;
  if (!allCategoriesData) <h1>Loading...</h1>;
  
  const [BoxValue, setBoxValue]=useState(null);

  if(allConfiguration !== undefined && BoxValue === null){
    let boxValueLength=allConfiguration.filter(item=> item.name === "box").map(item=>item.value);
    let boxValueParsed = parseInt(boxValueLength);
    setBoxValue(boxValueParsed)
  } else {<p>Loading...</p>}

  const [SectionValue, setSectionValue]=useState(null);

  if(allConfiguration !== undefined && SectionValue === null){
    let sectionValueLength=allConfiguration.filter(item=> item.name === "section").map(item=>item.value);
    let sectionValueParsed = parseInt(sectionValueLength);
    setSectionValue(sectionValueParsed)

  } else {<p>Loading...</p>}

  const [SubCategoryValue, setSubCategoryValue]=useState(null);

  if(allConfiguration !== undefined && SubCategoryValue === null){
    let subCategoryValueLength=allConfiguration.filter(item=> item.name === "section_subcategory").map(item=>item.value);
    let subCategoryValueParsed = parseInt(subCategoryValueLength);
    setSubCategoryValue(subCategoryValueParsed)
  } else {<p>Loading...</p>}

  const [Individual_BoxOrder, setIndividualBoxOrder]=useState([]);
  if(boxOrderData !== undefined && allCategoriesData !== undefined && Individual_BoxOrder.length === 0 && BoxValue){
    let newIndividualBoxOrderList = []
    
    let boxOrderDataFilter = boxOrderData.filter(item => item.type === "box")

    boxOrderDataFilter.sort((a, b) => a.sequenceNo - b.sequenceNo);

    if (boxOrderDataFilter.length === 0){



      for (let i = 0; i < BoxValue; i++) {
        newIndividualBoxOrderList.push({ sequenceNo: i+1, image: allCategoriesData[i].icon, category_slug: allCategoriesData[i].slug, name: allCategoriesData[i].name, id: allCategoriesData[i].id, type: 'box', parent: allCategoriesData[i].parentId_id});
      }
      console.log("New ind", newIndividualBoxOrderList)

    }
    else if (boxOrderDataFilter.length === BoxValue){
      for (let i = 0; i < BoxValue; i++) {
        newIndividualBoxOrderList.push({ sequenceNo: boxOrderDataFilter[i].sequenceNo, image: boxOrderDataFilter[i].image, category_slug: boxOrderDataFilter[i].category_slug, name: boxOrderDataFilter[i].category_name, id: boxOrderDataFilter[i].category_id_id, type: boxOrderDataFilter[i].type, parent: boxOrderDataFilter[i].parent});
      }
    }
    else{
      if (boxOrderDataFilter.length < BoxValue){
        for (let i = 0; i < boxOrderDataFilter.length; i++) {
          newIndividualBoxOrderList.push({ sequenceNo: boxOrderDataFilter[i].sequenceNo, image: boxOrderDataFilter[i].image, category_slug: boxOrderDataFilter[i].category_slug, name: boxOrderDataFilter[i].category_name, id: boxOrderDataFilter[i].category_id_id, type: boxOrderDataFilter[i].type, parent: boxOrderDataFilter[i].parent});
        }
        // here
        let filteredAllCategories = allCategoriesData.filter(({ id: id1 }) => !newIndividualBoxOrderList.some(({ id: id2 }) => id1 === id2))
        for (let i = boxOrderDataFilter.length; i < BoxValue; i++) {
          newIndividualBoxOrderList.push({ sequenceNo: i+1, image: filteredAllCategories[i].icon, category_slug: filteredAllCategories[i].slug, name: filteredAllCategories[i].name, id: filteredAllCategories[i].id, type: 'box', parent: filteredAllCategories[i].parentId_id});
        }
      }
      else{
        for (let i = 0; i < BoxValue; i++) {
          newIndividualBoxOrderList.push({ sequenceNo: boxOrderDataFilter[i].sequenceNo, image: boxOrderDataFilter[i].image, category_slug: boxOrderDataFilter[i].category_slug, name: boxOrderDataFilter[i].category_name, id: boxOrderDataFilter[i].category_id_id, type: boxOrderDataFilter[i].type, parent: boxOrderDataFilter[i].parent});
        }
      }
    }
    setIndividualBoxOrder(newIndividualBoxOrderList);
  } else {<p>Loading...</p>}

  const [Section_Sequence, setSection_Sequence]=useState([]);
  if(boxOrderData !==undefined && allCategoriesData !== undefined && Section_Sequence.length === 0 && SectionValue){
    let newSection_SequenceList = []
    let sectionDataFilter = boxOrderData.filter(item => item.type === "section")
    sectionDataFilter.sort((a, b) => a.sequenceNo - b.sequenceNo); 
    // ================================================================================================ SectionValue categorySectionData sectionDataFilter
    let categorySectionData = allCategoriesData.filter(item => item.parentId_id === null && item.isBrand === false)
    if (sectionDataFilter.length === 0){
      for (let i = 0; i < SectionValue; i++) {
        newSection_SequenceList.push({ sequenceNo: i+1, image: categorySectionData[i].icon, category_slug: categorySectionData[i].slug, name: categorySectionData[i].name, id: categorySectionData[i].id, type: 'section', parent: categorySectionData[i].parentId_id});
      }
    }
    else if (sectionDataFilter.length === SectionValue){
      for (let i = 0; i < SectionValue; i++) {
        newSection_SequenceList.push({ sequenceNo: sectionDataFilter[i].sequenceNo, image: sectionDataFilter[i].image, category_slug: sectionDataFilter[i].category_slug, name: sectionDataFilter[i].category_name, id: sectionDataFilter[i].category_id_id, type: sectionDataFilter[i].type, parent: sectionDataFilter[i].parent});
      }
    }
    else{
      if (sectionDataFilter.length < SectionValue){
        for (let i = 0; i < sectionDataFilter.length; i++) {
          newSection_SequenceList.push({ sequenceNo: sectionDataFilter[i].sequenceNo, image: sectionDataFilter[i].image, category_slug: sectionDataFilter[i].category_slug, name: sectionDataFilter[i].category_name, id: sectionDataFilter[i].category_id_id, type: sectionDataFilter[i].type, parent: sectionDataFilter[i].parent});
        }
        let filteredAllCategories_seq = categorySectionData.filter(({ id: id1 }) => !newSection_SequenceList.some(({ id: id2 }) => id1 === id2))
        for (let i = sectionDataFilter.length; i < SectionValue; i++) {
          newSection_SequenceList.push({ sequenceNo: i+1, image: filteredAllCategories_seq[i].icon, category_slug: filteredAllCategories_seq[i].slug, name: filteredAllCategories_seq[i].name, id: filteredAllCategories_seq[i].id, type: 'section', parent: filteredAllCategories_seq[i].parentId_id});
        }
      }
      else{
        for (let i = 0; i < SectionValue; i++) {
          newSection_SequenceList.push({ sequenceNo: sectionDataFilter[i].sequenceNo, image: sectionDataFilter[i].image, category_slug: sectionDataFilter[i].category_slug, name: sectionDataFilter[i].category_name, id: sectionDataFilter[i].category_id_id, type: sectionDataFilter[i].type, parent: sectionDataFilter[i].parent});
        }
      }
    }
    setSection_Sequence(newSection_SequenceList);
  } 
  else {<p>Loading...</p>}

  const handleChange = (value, index) => {
    const updatedIndividualBoxOrder = [...Individual_BoxOrder];
    updatedIndividualBoxOrder[index] = value;
    setIndividualBoxOrder(updatedIndividualBoxOrder);
  }

  const handleChange2 = (value, index) => {
    const updatedSectionSequence = [...Section_Sequence];
    updatedSectionSequence[index] = value;
    setSection_Sequence(updatedSectionSequence);
  }

  const [GetSubcategoryData, setGetSubcategoryData] = useState ([]);
  
  Section_Sequence.forEach(function(element) {
    let index=(element['sequenceNo']-1).toString();
    element['subCategories']=GetSubcategoryData['Subcategories'+index];
    
  });

  // Individual_BoxOrder

  let data = [...Individual_BoxOrder, ...Section_Sequence];

  async function IndividualBoxOrder_Update(data){
    const myNewModel = await axiosInstance
      .post(`${server_ip}IndividualBoxOrder_Update`, JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json'
          },
      }).then((res) => {
        console.log('res', res);
        if(res.status==200){
          toast.success("Updated Successfully", {position: toast.POSITION.TOP_RIGHT});
        }
          return res;
      }).catch((error) => {
        // return error.response;
        if (error.response) {
          //// if api not found or server responded with some error codes e.g. 404
        if(error.response.status==400){
          var a =Object.keys(error.response.data)[0]
          toast.error(error.response.data[a].toString(), {position: toast.POSITION.TOP_RIGHT});
        }
        else{
          toast.error('Error Occured while updating '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
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

  const handleClick = (event) => {
    event.preventDefault(); // prevent default button behavior
    IndividualBoxOrder_Update(data); // call the API function with data
  };

  if(boxOrderData !== undefined && allConfiguration !== undefined){
    return (
      <Box py={4}>
        {/* <Paper elevation={6} style={{background: '#FFFFFF', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)'}}> */}
        <Card style={{background: '#FFFFFF', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)'}}>
          <H3 pt={2} mt={2} mb = {1} mx = {2} style = {{color: '#d23f57'}}>Sections</H3>
          <Box sx={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            justifyContent: 'space-between'
          }}>

            {BoxValue&&BoxValue?(Array(BoxValue).fill('').map((val, index) => index)).map((ind) => (
              <Sections key={"Box"+ind} id={"Box"+ind} value={Individual_BoxOrder[ind]} allCategoriesData={allCategoriesData} index={ind} handleChange={handleChange} label={"Box "+(ind+1)} IndividualBoxOrder={Individual_BoxOrder}/>
            )):[]}
          </Box>
          <H3 mt={1} mb = {1} mx = {2} style = {{color: '#d23f57'}}>Section Sequence</H3>
          <Box pb={2} sx={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          }}>
              
            {SectionValue&& SectionValue?(Array(SectionValue).fill('').map((val, index) => index)).map((ind) => (
              <SectionSequence key={"Section"+ind} id={"Section"+ind} value={Section_Sequence[ind]} allCategoriesData={allCategoriesData} index={ind} handleChange={handleChange2} label={"Section "+(ind+1)} Section_Sequence={Section_Sequence} SubCategoryValue={SubCategoryValue} boxOrderData={boxOrderData} GetSubcategoryData={GetSubcategoryData} setGetSubcategoryData={setGetSubcategoryData}/>
            )):[]}
          </Box>
        </Card>
        <Box py={4} sx={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit,minmax(100px, 1fr))',
          // maxWidth: '150px',
          // justifyContent: 'end',
        }}>
          <Button 
            variant="contained" 
            color="info" 
            type="submit" 
            onClick={handleClick} 
            sx={{
              width: '180px',
              justifySelf: 'end',
              '@media (max-width: 600px)': {
                width: '100%',
              }
            }}
          >
            Update
          </Button>
        </Box>

      </Box>  
    );
  } else {<p>Loading...</p>}
}
HomePageSetup.auth = true;
