import React from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Card } from "@mui/material";
import { H3, H6 } from "components/Typography";

const Card1 = ({data}) => {


  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
      }}
    >
    <Card
  sx={{
    p: 2,
    position: "relative", 
    width: "300px", 
  }}
>
  <H6 mb={1} color="grey.600">
    Total Order
  </H6>
  <H3 mb={0.3}>{data.total_order}</H3>


  <div
    style={{
      position: "absolute", 
      fontSize: "10px", 
      bottom: "1px",
      textAlign: "center", 
      width: "100%", 
    }}
  >
    <p>
      Current Month Order: {data.current_monthorder} | Last 30 Days Order: {data.monthly_order}
    </p>
  </div>
</Card>



      <Card
        sx={{
          p: 2,
        }}
        style={{
          width: "300px", // Increase the width of the card to 300px
        }}
      >
        <H6 mb={1} color="grey.600">
          Total Sales
        </H6>
        <H3 mb={0.3}>PKR {data.total_sale}</H3>
        {/* The remaining content */}
      </Card>

      {/* Cards in the second line */}
      <Card
        sx={{
          p: 2,
        }}
        style={{
          width: "calc(100% - 1px)", // Decrease the width to allow spacing between cards
        }}
      >
        <H6 mb={1} color="grey.600">
          Total OutStock Item
        </H6>
        <H3 mb={0.3}>{data.total_outstock}</H3>
        {/* The remaining content */}
      </Card>

      <Card
        sx={{
          p: 2,
        }}
        style={{
          width: "calc(100% - 1px)", // Decrease the width to allow spacing between cards
        }}
      >
        <H6 mb={1} color="grey.600">
          Total Sale Item
        </H6>
        <H3 mb={0.3}>{data.total_saleItem}</H3>
        {/* The remaining content */}
      </Card>
    </div>
  );
};

Card1.defaultProps = {
  status: "up",
  color: "info.main",
};

export default Card1;
