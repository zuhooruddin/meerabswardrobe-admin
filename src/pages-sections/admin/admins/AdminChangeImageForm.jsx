import { Clear } from "@mui/icons-material";
import { Box, Button, Grid, styled } from "@mui/material";
import DropZone from "components/DropZone";
import { FlexBox } from "components/flex-box";
import NextImage from "next/image";
import React, { useState } from "react";
import {server_ip} from "utils/backend_server_ip.jsx";
import { toast } from 'react-toastify';
import axiosInstance from "axios";
import {useSession} from 'next-auth/react';
import { useRouter } from 'next/router';

const UploadBox = styled(Box)(() => ({
  width: 170,
  height: "auto",
  overflow: "hidden",
  borderRadius: "8px",
  position: "relative",
}));
const StyledClear = styled(Clear)(() => ({
  top: 5,
  right: 5,
  fontSize: 14,
  color: "red",
  cursor: "pointer",
  position: "absolute",
}));

const AdminChangeImageForm = ({adminId}) => {
  const [newFiles, setNewFiles] = useState([]);
  const { data: session,status} = useSession();
  const router = useRouter();

  async function updateAdminImage(data,id){
    const schoolModel = await axiosInstance
      .patch(server_ip+`updateAdminImage/${id}`, data, {
          headers: {
              "Content-Type": "multipart/form-data",
              "Authorization":'Bearer '+session.accessToken,
          },
      }).then((res) => {
        if(res.status == 200){
          toast.success("Updated Successfully", {
            position: toast.POSITION.TOP_RIGHT
          });
          router.push('/admin/users/profile');
        }
        else{
          toast.error("Not Updated", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
          return res;
      }).catch((error) => {
          if (error.response) {
            //// if api not found or server responded with some error codes e.g. 404
          if(error.response.status==400){
            var a =Object.keys(error.response.data)[0]
            toast.error(error.response.data[a].toString(), {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          else{
            toast.error('Error Occured! '+error.response.statusText, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (newFiles.length>0){
      formData.append("profile_pic", newFiles[0], 
      newFiles[0].name);
      updateAdminImage(formData,adminId);
    }
    else{
      toast.error('No Image selected. Kindly select an image to update!', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const deleteNewImage = (name) => {
    setNewFiles((state) => state.filter((item) => item.name !== name));
  };

  return (
    <form onSubmit={handleFormSubmit} encType="multipart/form-data">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DropZone
            title="Drag and Drop slide image here"
            imageSize="upload landscape photo"
            onChange={(files) => {
              const uploadFiles = files.map((file) =>
                Object.assign(file, {
                  preview: URL.createObjectURL(file),
                })
              );
              setNewFiles(uploadFiles);
            }}
          />

          <FlexBox gap={1} mt={2}>
            {newFiles.map((file, index) => (
              <UploadBox key={index}>
                <NextImage
                  width={240}
                  height={100}
                  objectFit="cover"
                  src={file.preview}
                  layout="responsive"
                />
                <StyledClear onClick={() => deleteNewImage(file.name)} />
              </UploadBox>
            ))}
          </FlexBox>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" color="info" variant="contained">
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AdminChangeImageForm;
