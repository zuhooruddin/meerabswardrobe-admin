import Head from "next/head";
import React from "react";

const SEO = ({ title, description, sitename = "Ecommerce | Admin Portal" }) => {
  return (
    <Head>
      <title>
        {title} | {sitename}
      </title>
      <meta name="description" content={description?description:sitename} />
    </Head>
  );
};

export default SEO;
