import { TabList, TabPanel } from "@mui/lab";
import { styled } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import GeneralForm from "pages-sections/site-settings/GeneralForm";
import React, { useState } from "react";
import * as yup from "yup";
import { useSession } from "next-auth/react";
import { server_ip } from "utils/backend_server_ip.jsx";
import api from "utils/api/dashboard";
import axios from "axios";
import { toast } from "react-toastify";
import useSWR from "swr";

import { useRouter } from "next/router";

SiteSettings.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

export default function SiteSettings() {
  const { data: session, status } = useSession();

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
  const fetcher = async (url) => await axios.get(url).then((res) => res.data);
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const { data, error } = useSWR(server_ip + "getFooterSettings", fetcher);
  const { data: data1, error: error1 } = useSWR(
    server_ip + "getGeneralSetting",
    fetcher
  );

  const { data: data2, error: error2 } = useSWR(
    server_ip + "getsliderimage",
    fetcher
  );
 

 
  const initialValues = {
   
    site_logo:data1 && data1[0]?data1[0].site_logo:'',
    site_splash:data1 && data1[0]?data1[0].site_splash:'',
    splashtime:data1 && data1[0]?data1[0].splashtime:'',
    currency: data1 && data1[0]?data1[0].currency:'',
    banner_slider_image:data2?data2:[],
    site_name: data1&& data1[0] ? data1[0].site_name : "",
    shipping:data1 && data1[0]? data1[0].shipping: 0,
    whatsapp:data1 && data1[0]? data1[0].whatsapp: '',
    site_description: data1&& data1[0] ? data1[0].site_description : "",
    site_metatitle:data1&&data1[0]? data1[0].site_metatitle:"",
    site_banner_text: data1&& data1[0] ? data1[0].site_banner_text : "",
    footer_description: data1&& data1[0] ? data1[0].footer_description : "",
    footer_logo:data1&& data1[0]?data1[0].footer_logo:'',
    column_two_links: [],
    column_three_links: [],
    column_four_heading: data1&& data1[0] ? data1[0].footer_fourth_column_heading : "",
    column_four_description: data1&& data1[0] ? data1[0].footer_fourth_column_content : "",
    facebook: data1 && data1[0]? data1[0].facebook : "",
    twitter: data1&& data1[0] ? data1[0].twitter : "",
    instagram: data1&& data1[0] ? data1[0].instagram : "",
    linkedin: "",
    youtube: data1&& data1[0] ? data1[0].youtube : "",
    play_store: "",
    app_store: "",
    phone: data1&& data1[0] ? data1[0].top_bar_left_phone : "",
    email: data1 && data1[0]? data1[0].top_bar_left_email : "",
    links: [
      {
        id: 1,
        name: "Theme FAQ's",
        link: "https://www.themefaqs.com",
      },
      {
        id: 2,
        name: "Help",
        link: "https://www.help.com",
      },
    ],
    column_two_heading: data1 && data1[0]? data1[0].footer_second_column_heading : "",
    column_two_links: Array.isArray(data?.column_two_links)
      ? data.column_two_links
        .filter((item) => item.column === 2)
        .map((item) => ({
          name: item.name,
          priority: item.priority,
          link: item.link,
        }))
      : [],
    column_three_heading: data1&& data1[0] ? data1[0].footer_third_column_heading : "",
    column_three_links: Array.isArray(data?.column_three_links)
      ? data.column_three_links
        .filter((item) => item.column === 3)
        .map((item) => ({
          name: item.name,
          priority: item.priority,
          link: item.link,
        }))
      : [],
  };

  const handleFormSubmit = (values) => {


    console.log("Values",values)
    const formData = new FormData();

////////////////Social Login Configuratuion

formData.append("clientid", values.clientid || "");
formData.append("clientsecret", values.clientsecret || "");
formData.append("socialname", values.socialname || "");
formData.append("provider", values.provider || "");







    // General
    formData.append("site_logo", values.logoimage || "");
    formData.append("site_name", values.site_name || "");
    formData.append("site_metatitle", values.site_metatitle || "");
    formData.append("site_description", values.site_description || "");
    formData.append("site_banner_text", values.site_banner_text || "");
    formData.append("column_two_heading", values.column_two_heading || "");
    formData.append("column_three_heading", values.column_three_heading || "");
    formData.append("shipping", values.shipping || 0);
    formData.append("whatsapp", values.whatsapp || "");
    formData.append("currency", values.currency || "");
    formData.append("site_splash", values.splashimage || "");
    formData.append("splashtime", values.splashtime || "");




    

    // TopBar
    formData.append("top_bar_left_phone", values.phone || "");
    formData.append("top_bar_left_email", values.email || "");

    values.links?.forEach((item, index) => {
      const itemData = {
        name: item.name || null,
        priority: item.priority || null,
        link: item.link || null,
      };

      const itemDataJson = JSON.stringify(itemData);

      formData.append(`top_bar_right_items[${index}]`, itemDataJson);
    });

    // Footer
    formData.append("footer_logo", values.footerLogo || "");
    formData.append("footer_description", values.footer_description || "");
    values.column_two_links?.forEach((item, index) => {
      const itemData = {
        name: item.name || null,
        priority: item.priority || null,
        link: item.link || null,
      };

      const itemDataJson = JSON.stringify(itemData);

      formData.append(`column_two_links[${index}]`, itemDataJson);
    });

    values.column_three_links?.forEach((item, index) => {
      const itemData = {
        name: item.name || null,
        priority: item.priority || null,
        link: item.link || null,
      };

      const itemDataJson = JSON.stringify(itemData);

      formData.append(`column_three_links[${index}]`, itemDataJson);
    });

    formData.append(
      "footer_fourth_column_heading",
      values.column_four_heading || ""
    );
    formData.append(
      "footer_fourth_column_content",
      values.column_four_description || ""
    );

    // Social Links
    formData.append("facebook", values.facebook || "");
    formData.append("twitter", values.twitter || "");
    formData.append("instagram", values.instagram || "");
    formData.append("youtube", values.youtube || "");
    formData.append("app_links", values.app_links || "");
    formData.append("app_store", values.app_store || "");

   



    if (values.galleryFile && values.galleryFile.length > 0) {
      for (let i = 0; i < values.galleryFile.length; i++) {
        formData.append(`banner_slider_image[${i}]`, values.galleryFile[i]);
      }
    }

    fetch(server_ip + `addsitesetting`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + session.accessToken,
      },
    })
      .then(async (response) => {
        const status = response.status;

        const data = await response.json();
        return { status, data };
      })
      .then((response) => {
        if (response.status === 201) {
          toast.success("Site Setting Created Successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error(error);
      });



      
  };

  const validationSchema = yup.object().shape({
    site_name: yup.string().required("site name is required"),
    site_metatitle: yup.string().required("site Metattitle is required"),
    currency:yup.string().required("Currency is required"),
    site_description: yup.string().required("site description is required"),
    site_banner_text: yup.string().required("site banner text required"),
    
  });
  if (data1) {
    return (
      <GeneralForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      />
    );
  } else {
    <GeneralForm
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleFormSubmit={handleFormSubmit}
    />;
  }
}

SiteSettings.auth = true;
