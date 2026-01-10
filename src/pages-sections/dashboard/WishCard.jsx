import { Box, Card } from "@mui/material";
import { H3, H5, Paragraph } from "components/Typography";
import NextImage from "next/image";
import React from "react";
import {useSession} from 'next-auth/react';

const WishCard = ({data}) => {

  const { data: session } = useSession()


  return (
    <Card
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <H5 color="info.main" mb={0.5}>
        Welcome,{session.user.name}
!
      </H5>
      <Paragraph color="grey.600">
      Here’s what is happening at your store !
      </Paragraph>

    

      <H3 mt={1.5}>PKR : {data && data?data:0}</H3>
      <Paragraph color="grey.600">This month’s total sales.</Paragraph>

      <Box
        sx={{
          right: 24,
          bottom: 0,
          position: "absolute",
          display: {
            xs: "none",
            sm: "block",
          },
        }}
      >
        <NextImage
          src="/assets/images/illustrations/dashboard/welcome.svg"
          width={195}
          height={171}
          alt="Welcome"
        />
      </Box>
    </Card>
  );
};

export default WishCard;
