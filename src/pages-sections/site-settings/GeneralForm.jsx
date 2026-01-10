import { Box, Button, Grid, styled, TextField,Tab ,Divider,IconButton, Card,MenuItem } from "@mui/material";
import DropZone from "components/DropZone";
import { Formik,FieldArray } from "formik";
import React from "react";
import * as yup from "yup";
import CloseIcon from '@mui/icons-material/Close';
import { TabContext, TabList, TabPanel } from "@mui/lab";
import  { useState,Fragment,useEffect } from "react";
import { H4 } from "components/Typography";
import { FlexBox } from "components/flex-box";
import { Delete } from "@mui/icons-material";
import ReactQuill from "components/ReactQuill"; // import ReactQuill from "components/ReactQuill";
import { FlexBetween } from "components/flex-box";
import { Facebook, Instagram, Twitter, YouTube,Google } from "@mui/icons-material";
import AppleStore from "components/icons/AppleStore";
import PlayStore from "components/icons/PlayStore";
import DeleteIcon from '@mui/icons-material/Delete';


import axios from 'axios';
import Select from 'react-select';

const UploadBox = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  padding: "5px 10px",
  borderRadius: "4px",
  display: "inline-block",
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
})); // form field validation

const validationSchema = yup.object().shape({
  site_name: yup.string().required("site name is required"),
  site_description: yup.string().required("site description is required"),
  site_banner_text: yup.string().required("site banner text required"),
});
const StyledTabPanel = styled(TabPanel)(() => ({
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,
}));
const StyledTabList = styled(TabList)(({ theme }) => ({
  "& .MuiTab-root.Mui-selected": {
    color: theme.palette.info.main,
  },
  "& .MuiTabs-indicator": {
    background: theme.palette.info.main,
  },
})); 

const GeneralForm =(props) => {
  const { initialValues,validationSchema, handleFormSubmit}=props;
  const [selectTab, setSelectTab] = useState("general");
  const [imgsSrc, setImgsSrc] = useState([]);
  const ProviderOptions = [
    { value: 'google', label: 'Google' },
    { value: 'facebook', label: 'Facebook' },
  ];

  const onChangeImage = (e) => {
    setImgsSrc([]);
    for (const file of e.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImgsSrc((imgs) => [...imgs, reader.result]);
      };
      reader.onerror = () => {
      };
    }
  };
  const imgbaseurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "media/";

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          `https://openexchangerates.org/api/currencies.json?app_id=bf5994e3c3f64aa68896418f98ee47b2`
        );

        const options = Object.keys(response.data).map(key => ({
   
          label: key
        }));

        setCurrencies(options);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleCurrencyChange = selectedOption => {
    setSelectedCurrency(selectedOption);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit} encType="multipart/form-data">

<Box py={4}>
      <Card
        sx={{
          px: 3,
          py: 2,
        }}
      >



          <TabContext value={selectTab}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "grey.300",
            }}
          >
            <StyledTabList
              onChange={(_, value) => setSelectTab(value)}
              variant="scrollable"
            >
              <Tab label="General" value="general" disableRipple />
              <Tab label="Topbar" value="topbar" disableRipple />
              <Tab label="Footer" value="footer" disableRipple />
              <Tab label="Social Links" value="social-links" disableRipple />
              <Tab label="Banner Slider" value="banner-slider" disableRipple />
              <Tab label="Shipping & Currency" value="shipping-vat" disableRipple />
              <Tab label="Whatsapp Setup" value="whatsapp" disableRipple />
              <Tab label="Splash Screen" value="splash" disableRipple />

              <Tab label="Social Login Configuration" value="social-login" disableRipple />

            </StyledTabList>
          </Box>

          <StyledTabPanel value="general">
          <Grid container spacing={2}>

          <Grid item xs={12}>
            <DropZone
            onChange={(files) => {
             
                if (files.length > 0) {
                  setFieldValue('logoimage', files[0]);
                } else {
                  setFieldValue('logoimage', values.site_logo || '');
                }
              }}
              

          
            title="Drag & Drop Site Logo"
          />
             <br /><br />
           {values.site_logo || values.logoimage?  
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                // src={values.site_logo?imgbaseurl+values.site_logo:URL.createObjectURL(values.logoimage)}
                src={values.logoimage? URL.createObjectURL(values.logoimage) : values.site_logo?imgbaseurl + values.site_logo:''}

                alt="Selected logo"
                style={{ maxWidth: '200px' }}
              />
              <button
                type="button"
                onClick={() => setFieldValue('logoimage', null)}
                style={{
                  position: 'absolute',
                  top: '10px',
                 right:'90',
                  backgroundColor: 'transparent',
                  color:'red',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <CloseIcon />
              </button>
            </div>:''
          }
       
          {/* {values.logoimage && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={URL.createObjectURL(values.logoimage)}
                alt="Selected logo"
                style={{ maxWidth: '200px' }}
              />
              <button
                type="button"
                onClick={() => setFieldValue('logoimage', null)}
                style={{
                  position: 'absolute',
                  top: '10px',
                 right:'90',
                  backgroundColor: 'transparent',
                  color:'red',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <CloseIcon />
              </button>
            </div>
          )} */}
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="site_name"
                label="Site Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.site_name}
                error={!!touched.site_name && !!errors.site_name}
                helperText={touched.site_name && errors.site_name}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                onBlur={handleBlur}
                onChange={handleChange}
                name="site_description"
                label="Site Description"
                value={values.site_description}
                error={!!touched.site_description && !!errors.site_description}
                helperText={touched.site_description && errors.site_description}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                rows={6}
                fullWidth
                color="info"
                size="medium"
                onBlur={handleBlur}
                onChange={handleChange}
                name="site_metatitle"
                label="Site Meta Title"
                value={values.site_metatitle}
                error={!!touched.site_metatitle && !!errors.site_metatitle}
                helperText={touched.site_metatitle && errors.site_metatitle}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                rows={6}
                fullWidth
                multiline
                color="info"
                size="medium"
                onBlur={handleBlur}
                name="site_banner_text"
                onChange={handleChange}
                label="Site Banner Text"
                value={values.site_banner_text}
                error={!!touched.site_banner_text && !!errors.site_banner_text}
                helperText={touched.site_banner_text && errors.site_banner_text}
              />
            </Grid>

            {/* <Grid item xs={12}>
            <DropZone
            onChange={(files) => {
              setFieldValue('bannerimage', files[0]);
            }}
            title="Drag & Drop Site Banner Image"
          />
          <br /><br />
          {values.bannerimage && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={URL.createObjectURL(values.bannerimage)}
                alt="Selected banner"
                style={{ maxWidth: '200px' }}
              />
              <button
                type="button"
                onClick={() => setFieldValue('bannerimage', null)}
                style={{
                  position: 'absolute',
                  top: '10px',
                 right:'90',
                  backgroundColor: 'transparent',
                  color:'red',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <CloseIcon />
              </button>
            </div>
          )}
            </Grid> */}
            </Grid>
          </StyledTabPanel>

          <StyledTabPanel value="topbar">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <H4>Top Bar Left Content</H4>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                name="phone"
                color="info"
                size="medium"
                label="Phone"
                onBlur={handleBlur}
                value={values.phone}
                onChange={handleChange}
                placeholder="0000000000"
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                name="email"
                size="medium"
                label="Email"
                onBlur={handleBlur}
                value={values.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <FieldArray
              name="links"
              render={(arrayHelper) => (
                <Fragment>
                  <Grid item xs={12}>
                    <FlexBox alignItems="center" justifyContent="space-between">
                      <H4>Top Bar Right</H4>

                      <Button
                        color="info"
                        variant="contained"
                        onClick={() => {
                          arrayHelper.push({
                            id: Date.now(),
                            name: "",
                            link: "",
                          });
                        }}
                      >
                        Add Item
                      </Button>
                    </FlexBox>
                  </Grid>

                  {values.links?.map((item, index) => (
                    <Grid item container spacing={2} key={item.id}>
                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          color="info"
                          size="medium"
                          label="Name"
                          value={item.name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`links.${index}.name`}
                        />
                      </Grid>

                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          color="info"
                          size="medium"
                          label="Link"
                          value={item.link}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`links.${index}.link`}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <IconButton onClick={() => arrayHelper.remove(index)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Fragment>
              )}
            />
          </Grid>
          </StyledTabPanel>

          <StyledTabPanel value="footer">
          <Grid container spacing={3}>
            <Grid item xs={12}>
            <DropZone
            onChange={(files) => {
              setFieldValue('footerLogo', files[0]);
            }}
            title="Drag & Drop Footer Logo"
          />
          <br /><br />
         
          {values.footer_logo || values.footerLogo? 
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={values.footerLogo? URL.createObjectURL(values.footerLogo) : imgbaseurl +values.footer_logo}

                alt="Selected footer logo"
                style={{ maxWidth: '200px' }}
              />
              <button
                type="button"
                onClick={() => setFieldValue('footerLogo', null)}
                style={{
                  position: 'absolute',
                  top: '10px',
                 right:'90',
                  backgroundColor: 'transparent',
                  color:'red',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <CloseIcon />
              </button>
            </div>:''
          }
            </Grid>

            <Grid item xs={12}>
              <TextField
                rows={4}
                multiline
                fullWidth
                color="info"
                size="medium"
                onBlur={handleBlur}
                onChange={handleChange}
                name="footer_description"
                label="Footer Description"
                value={values.footer_description}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <FieldArray
              name="column_two_links"
              render={(arrayHelper) => (
                <Fragment>
                  <Grid item xs={12}>
                    <FlexBetween>
                      <H4>Second Column Content</H4>

                      <Button
                        color="info"
                        variant="contained"
                        onClick={() => {
                          arrayHelper.push({
                            id: Date.now(),
                            name: "",
                            link: "",
                          });
                        }}
                      >
                        Add Item
                      </Button>
                    </FlexBetween>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      color="info"
                      size="medium"
                      onBlur={handleBlur}
                      label="Heading Name"
                      onChange={handleChange}
                      name="column_two_heading"
                      value={values.column_two_heading}
                    />
                  </Grid>

                  {values.column_two_links?.map((item, index) => (
                    <Grid item container spacing={2} key={item.id}>
                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Name"
                          color="info"
                          size="medium"
                          value={item.name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`column_two_links.${index}.name`}
                        />
                      </Grid>

                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Link"
                          color="info"
                          size="medium"
                          value={item.link}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`column_two_links.${index}.link`}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <IconButton onClick={() => arrayHelper.remove(index)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Fragment>
              )}
            />

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <FieldArray
              name="column_three_links"
              render={(arrayHelper) => (
                <Fragment>
                  <Grid item xs={12}>
                    <FlexBetween>
                      <H4>Third Column Content</H4>

                      <Button
                        color="info"
                        variant="contained"
                        onClick={() => {
                          arrayHelper.push({
                            id: Date.now(),
                            name: "",
                            link: "",
                          });
                        }}
                      >
                        Add Item
                      </Button>
                    </FlexBetween>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      color="info"
                      size="medium"
                      onBlur={handleBlur}
                      label="Heading Name"
                      onChange={handleChange}
                      name="column_three_heading"
                      value={values.column_three_heading}
                    />
                  </Grid>

                  {values.column_three_links?.map((item, index) => (
                    <Grid item container spacing={2} key={item.id}>
                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Name"
                          color="info"
                          size="medium"
                          value={item.name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`column_three_links.${index}.name`}
                        />
                      </Grid>

                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Link"
                          color="info"
                          size="medium"
                          value={item.link}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`column_three_links.${index}.link`}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <IconButton onClick={() => arrayHelper.remove(index)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Fragment>
              )}
            />

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <H4 mb={2}>Four Column Content</H4>

              <TextField
                fullWidth
                color="info"
                size="medium"
                label="Heading"
                onBlur={handleBlur}
                onChange={handleChange}
                name="column_four_heading"
                value={values.column_four_heading}
                sx={{
                  mb: 3,
                }}
              />

              <ReactQuill
                box_height={200}
                value={values.column_four_description}
                onChange={(value) =>
                  setFieldValue("column_four_description", value)
                }
              />
            </Grid>
          </Grid>

          </StyledTabPanel>

          <StyledTabPanel value="social-links">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <H4>Social Links</H4>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="facebook"
                label="Facebook"
                value={values.facebook}
                onChange={handleChange}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <Facebook
                      fontSize="small"
                      color="info"
                      sx={{
                        mr: 1,
                      }}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="twitter"
                label="Twitter"
                value={values.twitter}
                onChange={handleChange}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <Twitter
                      fontSize="small"
                      color="info"
                      sx={{
                        mr: 1,
                      }}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="instagram"
                label="Instagram"
                onChange={handleChange}
                value={values.instagram}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <Instagram
                      fontSize="small"
                      color="info"
                      sx={{
                        mr: 1,
                      }}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="youtube"
                label="Youtube"
                value={values.youtube}
                onChange={handleChange}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <YouTube
                      fontSize="small"
                      color="info"
                      sx={{
                        mr: 1,
                      }}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <H4>App Links</H4>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="play_store"
                label="Play Store"
                value={values.play_store}
                onChange={handleChange}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <PlayStore
                      fontSize="small"
                      color="info"
                      sx={{
                        mr: 1,
                      }}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="app_store"
                label="App Store"
                value={values.app_store}
                onChange={handleChange}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <AppleStore
                      fontSize="small"
                      color="info"
                      sx={{
                        mr: 1,
                      }}
                    />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

           
          </Grid>
          </StyledTabPanel>

          <StyledTabPanel value="banner-slider">
          <Grid container spacing={3}>
          <Grid item xs={12}>
          <p>Please upload exactly Five images:</p>

          <input
  onChange={(event) => {
    setFieldValue("galleryFile", event.currentTarget.files);
    onChangeImage(event);
  }}
  type="file"
  name="file"
  multiple
/>

<div style={{ marginTop: '10px' }}>
  {imgsSrc.length > 0 ? (
    imgsSrc.map((link, index) => (
      <div key={index} style={{ display: 'inline-block', position: 'relative', marginRight: '10px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={link} width={100} height={100} alt="Slider Image" />
        <button
          type="button"
          onClick={() => {
            const updatedImgs = [...imgsSrc];
            updatedImgs[index] = null;
            setImgsSrc(updatedImgs.filter(Boolean));
          }}
          style={{
            position: 'absolute',
            top: '5px',
            right: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'red',
            cursor: 'pointer',
          }}
        >
          <CloseIcon />
        </button>
      </div>
    ))
  ) : (
    values.banner_slider_image.map((link, index) => (
      <div key={index} style={{ display: 'inline-block', position: 'relative', marginRight: '10px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgbaseurl + link.image} width={100} height={100} alt="Slider Image" />
      </div>
    ))
  )}
</div>


{/*               
                {imgGallery?
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <H4 style={{marginBottom:'2%'}}>Gallery:</H4>
                  </Grid>
                </Grid>:''}
                {imgGallery?
                imgGallery.map((link) => (
                  <Image
                  key={link['id']}
                  loader={myLoader}
                  src={link['image']}
                  alt="Gallery Image"
                  width={80}
                  height={80}
                  />
                ))
                :''} */}
                
            </Grid>


         
          </Grid>
          </StyledTabPanel>

          <StyledTabPanel value="shipping-vat">

<Grid container spacing={3}>
            <Grid item xs={12}>
              <H4>Shipping and Currency</H4>
            </Grid>
            <Grid item md={7} xs={12}>

            <Select
  name='currency'
  options={currencies}
  value={selectedCurrency}
  onChange={(selectedOption) => {
    const selectedCurrencyValue = selectedOption ? selectedOption.label : ''; 
    setFieldValue('currency', selectedCurrencyValue);
    handleCurrencyChange(selectedOption);
  }}
  isSearchable
  placeholder="Select a currency"
/>



{/* 
              <Select
      options={currencies}
      value={selectedCurrency}
      onChange={handleCurrencyChange}
      isSearchable
      placeholder="Select currency..."
    /> */}
            
            </Grid>

            <Grid item md={7} xs={12} mt={2}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                type="number"
                name="shipping"
                onBlur={handleBlur}
                label="Shipping Charge"
                onChange={handleChange}
                value={values.shipping}
                error={!!touched.shipping && !!errors.shipping}
                helperText={touched.shipping && errors.shipping}
              />
            </Grid>

           
          </Grid>

          </StyledTabPanel>

          <StyledTabPanel value="whatsapp">

<Grid container spacing={3}>
            <Grid item xs={12}>
              <H4>Whatsapp Setup</H4>
            </Grid>
        

            <Grid item md={7} xs={12}>
            <TextField
        fullWidth
        color="info"  
        size="medium"
        type="tel"  
        name="whatsapp"
        onBlur={handleBlur}
        label="WhatsApp Number"
        onChange={handleChange}
        value={values.whatsapp}
        error={touched.whatsapp && !!errors.whatsapp}
        helperText={touched.whatsapp && errors.whatsapp}
        InputProps={{
          inputProps: {
            pattern: '[0-9+]*', 
            inputMode: 'numeric',
            maxLength: 15,  
          },
        }}
      />
            </Grid>

           
          </Grid>

          </StyledTabPanel >

          <StyledTabPanel value="splash">

<Grid container spacing={3}>
            <Grid item xs={12}>
              <H4>Splash Screen</H4>
            </Grid>
        

        
            <Grid item xs={12}>
            <DropZone
            onChange={(files) => {
             
                if (files.length > 0) {
                  setFieldValue('splashimage', files[0]);
                } else {
                  setFieldValue('splashimage', values.site_splash || '');
                }
              }}
              

          
            title="Drag & Drop Splash Screen"
          />
             <br /><br />
           {values.site_splash || values.splashimage?  
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={values.splashimage? URL.createObjectURL(values.splashimage) : values.site_splash?imgbaseurl + values.site_splash:''}

                alt="Selected Splash"
                style={{ maxWidth: '200px' }}
              />
              <button
                type="button"
                onClick={() => setFieldValue('splashimage', null)}
                style={{
                  position: 'absolute',
                  top: '10px',
                 right:'90',
                  backgroundColor: 'transparent',
                  color:'red',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <CloseIcon />
              </button>
            </div>:''
          }
       

            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="splashtime"
                label="Spash Screen Timing(millisecond)"
                value={values.splashtime}
                onChange={handleChange}
                placeholder="Spash Screen Timing(millisecond)"
               
              />
            </Grid>


           
          </Grid>

          </StyledTabPanel >

<StyledTabPanel value="social-login">
<Grid container spacing={4}>

<Grid item xs={12}>
              <H4>Social Login Configuration</H4>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="socialname"
                label="Name"
                value={values.socialname}
                onChange={handleChange}
                placeholder="Name"
               
              />
            </Grid>
            <Grid item md={6} xs={12}>
      <TextField
        fullWidth
        color="info"
        size="medium"
        name="provider"
        label="Provider"
        value={values.provider}
        onChange={handleChange}
        placeholder="Select Provider"
        select  
       
      >
        {ProviderOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="clientid"
                label=" Client ID"
                value={values.clientid}
                onChange={handleChange}
                placeholder=" Client ID"
               
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="clientsecret"
                label=" Client Secret"
                value={values.clientsecret}
                onChange={handleChange}
                placeholder=" Client Secret"
                
               
              />
            </Grid>

            </Grid>
</StyledTabPanel>








        </TabContext>
</Card>
</Box>
           
       

          <Button
            type="submit"
            color="info"
            variant="contained"
            sx={{
              mt: 4,
            }}
          >
            Save Changes
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default GeneralForm;

