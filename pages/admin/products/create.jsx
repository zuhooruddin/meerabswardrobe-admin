import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import CreateProductForm from "pages-sections/admin/products/CreateProductForm";
import React from "react";
import * as yup from "yup";
import api from "utils/api/dashboard";
import axiosInstance from "axios";

import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import { server_ip } from "utils/backend_server_ip.jsx";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import { useSession } from "next-auth/react";

import { useState } from "react";

const CreateProduct = (props) => {
  const { data: session, status } = useSession();
  const validationSchema = yup.object().shape({
    name: yup.string().required("required"),
    isFeatured: yup.string().required("required"),
    slug: yup.string().required("required"),
    stock: yup.number().required("required"),
    mrp: yup.number().required("required"),
    salePrice: yup.number().required("required"),
    sku: yup.string().required("Sku is required"),
    description: yup.string(),
    isNewArrival: yup.string().required("required"),
    newArrivalTill: yup.string().required("required"),
    
    author: yup.string(),
    manufacturer: yup.string(),
    isbn: yup.string(),
  });
  const callAPI = async () => {
    try {
      const res = await fetch(`/api/auth/session`, {
        method: "GET",
      });
      const data = await res.json();
      session = data;
    } catch (err) {
      toast.error("Session refresh failed!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
    callAPI();
  };
  const parentCategories = props.parentCategories;
  const subCategories = props.subCategories;
  const navCategories = props.navCategories;
  const allCategories = props.allCategories;

  const initialValues = {
    category: "",
    name: "",
    slug: "",
    sku: "",
    description: "",
    length: 0.0,
    height: 0.0,
    weight: 0.0,
    width: 0.0,
    discount:0,
    mrp: "",
    salePrice: "",
    author: "",
    manufacturer: "",
    isNewArrival: "",
    newArrivalTill: "",
    youtube_link: "",
    facebook_link: "",
    twitter_link: "",
    instagram_link: "",
    metaUrl: "",
    metaTitle: "",
    metaDescription: "",
    stock: "",
    stockCheckQty: "",
    parentCat: [],
    childCat: [],
    galleryImages: [],
    tags: [],
  };
  const [disableButtonCheck, setdisableButtonCheck] = useState(false);
  function convertToSlug(Text) {
    return Text.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[-]+/g, "-")
      .replace(/[^\w-]+|_/g, "");
  }
  async function addItem(data, values, setdisableButtonCheck) {
    const myNewModel = await axiosInstance
      .post(server_ip + `addItem`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + session.accessToken,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          setdisableButtonCheck(true);
          if (Array.isArray(values["category"])) {
            addItemCategory(values["category"], res.data.item.id);
          }

          const galleryData = new FormData();

          if (values.galleryFile) {
            for (let i = 0; i < values.galleryFile.length; i++) {
              galleryData.append(
                "image",
                values["galleryFile"][i],
                // values['galleryFile'][i].name
                initialValues["extPosId"] +
                  "." +
                  values["galleryFile"][i].name.split(".")[1]
              );
            }
            addItemGallery(galleryData, res.data.item.id);
          }
          toast.success("Product Updated Successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
          window.location.href = '/admin/products';

        }
        // window.location.href = '/admin/products';
        // router.back();
        router.push({
          pathname: `/admin/products`,
          query: {
            pageIndexRouter: router.query.pageIndexRouter,
            scrollPosition: router.query.scrollPosition,
            rowsPerPageRouter: router.query.rowsPerPageRouter,
          },
        });
        return res;
      })
      .catch((error) => {
        if (error.response) {
          //// if api not found or server responded with some error codes e.g. 404
          if (error.response.status == 400) {
            var a = Object.keys(error.response.data)[0];
            toast.error(error.response.data[a].toString(), {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else {
            toast.error(
              "Error Occured while Updating Product " +
                error.response.statusText,
              { position: toast.POSITION.TOP_RIGHT }
            );
          }
          return error.response;
        } else if (error.request) {
          /// Network error api call not reached on server
          toast.error("Network Error", { position: toast.POSITION.TOP_RIGHT });
          return error.request;
        } else {
          // toast.error("Error Occured", { position: toast.POSITION.TOP_RIGHT });
          // return error;
        }
      });
  }
  

  async function addItemCategory(data, itemId) {
    const formData = new FormData();
    formData.append("category", JSON.stringify(data));

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + session.accessToken,
      },
      params: {
        itemId: itemId,
      },
    };

    try {
      const response = await axiosInstance.post(
        server_ip + "addItemCategory",
        formData,
        config
      );
      if (response.data["success"]) {
        toast.success("Category added successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error(response.data["error"], {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        toast.error("Error occurred: " + error.response.data, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (error.request) {
        toast.error("Network Error", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("Error occurred: " + error.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      return error;
    }
  }

  async function addItemGallery(galleryData, itemId) {
    try {
      const response = await axiosInstance.post(
        server_ip + "addItemGallery",
        galleryData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + session.accessToken,
          },
          params: {
            itemId: itemId,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        // Request was made and server responded with a status code outside the range of 2xx
        console.log("Error response status:", error.response.status);
        console.log("Error response data:", error.response.data);
      } else if (error.request) {
        // Request was made but no response was received
        console.log("No response received:", error.request);
      } else {
        // Something else happened while setting up the request
        console.log("Error:", error.message);
      }

      return null;
    }
  }



  const handleFormSubmit = (values) => {
  

    const formData = new FormData();

    if (
      Math.floor(new Date(Date.now())) > Math.floor(new Date(session.expires))
    ) {
      reloadSession();
      toast.info("Session Expired! Refreshing Session....", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (
      Math.floor(new Date(Date.now())) < Math.floor(new Date(session.expires))
    ) {
      formData.append("name", values["name"] || null);
      formData.append("image", values["image" || null]);
      formData.append("sku", values["sku"] || null);
      formData.append("description", values["description"] || '');
      formData.append("weight", values["weight"] || 0);
      formData.append("manufacturer", values["manufacturer"] || '');
      formData.append("length", values["length"] ||0);
      formData.append("height", values["height"] || 0);
      formData.append("width", values["width"] || 0);
      formData.append("stock", values["stock"] || null);
      formData.append("mrp", values["mrp"] || null);
      formData.append("salePrice", values["salePrice"] || null);
      formData.append("author", values["author"] ||'');
      formData.append("isbn", values["isbn"] || '');
      formData.append("image", values["imageFile"] || null);
      formData.append("youtube_link", values["youtube_link"] || '');
      formData.append("facebook_link", values["facebook_link"] || '');
      formData.append("twitter_link", values["twitter_link"] || '');
      formData.append("instagram_link", values["instagram_link"] || '');
      formData.append("slug", values["slug"] || null);
      formData.append("metaUrl", values["metaUrl"] || '');
      formData.append("metaTitle", values["metaTitle"] || '');
      formData.append("metaDescription", values["metaDescription"] || '');
      formData.append("isNewArrival", values["isNewArrival"] || '');
      formData.append("newArrivalTill", values["newArrivalTill"] || null);
      formData.append("isFeatured", values["isFeatured"] || null);
      formData.append("discount", values["discount"] || null);

      formData.append("extPosId", 0);

      addItem(formData, values, setdisableButtonCheck);
    }
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Add New Product</H3>

      <CreateProductForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
        parentCategories={parentCategories}
        subCategories={subCategories}
        navCategories={navCategories}
        allCategories={allCategories}
        convertToSlug={convertToSlug}
      />
    </Box>
  );
}; // =============================================================================

CreateProduct.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// const validationSchema = yup.object().shape({
//   name: yup.string().required("required"),
//   category: yup.string().required("required"),
//   description: yup.string().required("required"),
//   stock: yup.number().required("required"),
//   price: yup.number().required("required"),
//   sale_price: yup.number().required("required"),
//   tags: yup.object().required("required"),
// });

export default CreateProduct;

export async function getServerSideProps() {
  const parentCategories = await api.getParentCategories();
  const subCategories = await api.getSubCategories();
  const navCategories = await api.getNavCategories();
  const allCategories = await api.getAllCategories();

  // Pass data to the page via props
  return {
    props: {
      allCategories: allCategories,
      parentCategories: parentCategories,
      subCategories: subCategories,
      navCategories: navCategories,
    },
  };
}
