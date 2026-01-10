import { Grid, Pagination,Box } from "@mui/material";
import { FlexBetween } from "components/flex-box";
import ProductCard1 from "components/product-cards/ProductCard1";

import { Span,H3 } from "components/Typography";
import productDatabase from "data/product-database";
import React, { Fragment } from "react"; // ========================================================
import { useState,useEffect } from "react";
import useSWR from 'swr'
import axios from "axios";
// import {server_ip} from "utils/backend_server_ip.jsx"

// ========================================================

const SearchCard1List = ({category}) => {
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
//   console.log("Search Card 1 list",category)
  const [pageIndex, setPageIndex] = useState(1);

  const fetcher = async (url) => await axios.get(url).then((res) => res.data);
//   const { data, error } = useSWR(server_ip+`PaginatedCategory?page=${pageIndex}&slug=${category}`, fetcher);
  const { data, error } = useSWR(server_ip+`getAllPaginatedItem?page=${pageIndex}`, fetcher);

 
console.log("My Search Data",data)
  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;

  const handleChange = (event, value) => {
    setPageIndex(value);
  };
  return (
    <Fragment>
      <Grid container spacing={3}>
      {/* .slice(95, 104) */}
      {data && data['results'].length>0?
        data['results'].map((item, ind) => (
          <Grid item lg={3} sm={6} xs={12} key={ind}>
            <ProductCard1 {...item} category={category}/>
          </Grid>
        ))
        :
        <Grid item lg={6} sm={6} xs={12}><H3 color="red" >No Product Found</H3></Grid>}
      </Grid>

      <FlexBetween flexWrap="wrap" mt={4}>
        <Span color="grey.600">Showing {data?((pageIndex-1)*9)+1:''}-{data?((pageIndex-1)*9) + data['results'].length:''} of {data?data['count']:''} Products</Span>
        <Pagination count={data?Math.ceil(data['count']/9):''} variant="outlined" color="primary" onChange={handleChange} />
        {/* {data?data['results'].map(item => <div key={item.id}>{item.name}</div>):""} */}
        {/* <button onClick={() => setPageIndex(pageIndex - 1)}>Previous</button>
        <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button> */}
      </FlexBetween>
    </Fragment>
  );
};

export default SearchCard1List;
