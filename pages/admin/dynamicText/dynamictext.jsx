import React, { useEffect, useState } from "react";
import useSWR from "swr";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import { Formik } from "formik";
import RichTextEditor from "components/RichTextEditor";
import { toast } from 'react-toastify';
import {useSession} from 'next-auth/react';

DynamicText.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function DynamicText({ props }) {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [content, setContent] = useState("");
  const { data: session} = useSession();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

 

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };
  const handleSubmit = () => {
    const data = {
      title: title,
      status: parseInt(status),
      content: content,
    };

    fetch(`${apiUrl}dynamictext`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization":'Bearer '+session.accessToken

      },
   
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
     
      .then((responseData) => {
      
        toast.success("Text Created Successfully", {position: toast.POSITION.TOP_RIGHT});
        window.location.href = '/';
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  return (
    <Card sx={{ p: 2, mt: 10 }}>
      <h1 style={styles.heading}>Dynamic Text </h1>
      <div style={styles.formGroup}>
        <TextField
          fullWidth
          name="title"
          label="Title"
          color="info"
          size="medium"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      

      <div style={styles.formGroup}>
        <TextField
          select
          fullWidth
          color="info"
          size="medium"
          name="status"
          value={status}
          onChange={handleStatusChange}
          label="Status"
        >
          <MenuItem value="">Select Status</MenuItem>
          <MenuItem value="1">Active</MenuItem>
          <MenuItem value="2">InActive</MenuItem>
        </TextField>
      </div>

      <RichTextEditor value={content} onChange={handleContentChange} />

      <br />

      <Button variant="contained" color="info" onClick={handleSubmit}>
        Submit
      </Button>
    </Card>
  );
}

const styles = {
  container: {
    margin: "20px auto",
    maxWidth: "500px",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  preview: {
    marginTop: "20px",
  },
  previewHeading: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  submitBtn: {
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
