import {
    Box,
    Card,
    Table,
    TableContainer,
    TablePagination,
    TableRow,
    TableCell,
    IconButton,
    Dialog,
    DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
    TextField,
    MenuItem,
    Button,
  } from "@mui/material";
  import RichTextEditor from "components/RichTextEditor";
  
  import TableBody from "@mui/material/TableBody";
  import SearchArea from "components/dashboard/SearchArea";
  import TableHeader from "components/data-table/TableHeader";
  import VendorDashboardLayout from "components/layouts/vendor-dashboard";
  import Scrollbar from "components/Scrollbar";
  import { H3 } from "components/Typography";
  import useMuiTable from "hooks/useMuiTable";
  import React, { useState, useEffect } from "react";
  import useSWR from 'swr';
  import axios from "axios";
  import { server_ip } from "utils/backend_server_ip.jsx";
  import { useSession } from 'next-auth/react';
  import { toast } from 'react-toastify';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  
  const tableHeading = [
    {
      id: "name",
      label: "Title",
      align: "left",
    },
    {
      id: "status",
      label: "Status",
      align: "left",
    },
    {
      id: "content",
      label: "Content",
      align: "left",
    },
    {
      id: "action",
      label: "Action",
      align: "center",
    },
  ];
  
  DynamicList.getLayout = function getLayout(page) {
    return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
  };
  
  export default function DynamicList(props) {
    const { data: session, status } = useSession();
    const { data, error } = useSWR(`${server_ip}getalldynamictext`, (url) =>
      axios.get(url, { headers: { "Authorization": 'Bearer ' + session.accessToken } }).then((res) => res.data)
    );
    const [content, setContent] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    
    const [dynamicList, setDynamicList] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editData, setEditData] = useState({
      id: null,
      key: "",
      value: "",
      status: "",
    });
    const handleContentChange = (value) => {
        setContent(value); 
      };
    useEffect(() => {
      if (data) {
        setDynamicList(data);
      }
    }, [data]);
  
    
    const handleDelete = (item) => {
        setDeleteItem(item);
        setDeleteDialogOpen(true);
      };
      const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
      };

      const handleConfirmDelete = () => {
        const deleteData = {
            id: deleteItem.id,}
    
        axios
          .post(`${server_ip}deletedynamictext`,deleteData, {
            headers: {  
                "Authorization":'Bearer '+session.accessToken,},
          })
          .then((response) => {
            if (response.status === 200) {
              toast.success("DynamicText Deleted Successfully", {
                position: toast.POSITION.TOP_RIGHT,
              });
              window.location.reload(); 

            } else {
              toast.error("Failed to delete DynamicText", {
                position: toast.POSITION.TOP_RIGHT,
              });
            }
          })
          .catch((error) => {
            toast.error(error, { position: toast.POSITION.TOP_RIGHT });
          });
      
        setDeleteDialogOpen(false);
      };
      
            
      
  const handleEdit = (item) => {
    setEditData(item);
    setContent(item.value); 
    setEditDialogOpen(true);
  };
  
    const handleEditDialogClose = () => {
      setEditDialogOpen(false);
    };
  
    const handleEditDataChange = (event) => {
      const { name, value } = event.target;
      setEditData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      setEditDialogOpen(true);
    };
  
    const handleEditSubmit = () => {
        const updatedData = {
          id: editData.id,
          key: editData.key,
          value: content, 
          status: editData.status,
        };
      
        
        axios.post(`${server_ip}updatedynamictext`, updatedData, {
          headers: {  
          "Authorization":'Bearer '+session.accessToken,},
        })
          .then((response) => {
          if(response.status==200){
            toast.success("DynamicText Updated Successfully", {position: toast.POSITION.TOP_RIGHT});
            window.location.reload(); 


          }
          else{
            toast.error("DynamicText Not Updated", {position: toast.POSITION.TOP_RIGHT});

          }
        
          })
          .catch((error) => {
            toast.error(error, {position: toast.POSITION.TOP_RIGHT});

          });
      
        setEditDialogOpen(false);
      };
      
  
    const {
      order,
      orderBy,
      selected,
      handleRequestSort,
    } = useMuiTable({
      listData: dynamicList || [],
    });
  
    if (error) return <p>Loading failed...</p>;
    if (!data) return <h1>Loading...</h1>;
  
    return (
      <Box py={4}>
        <H3 mb={2}>DynamicText List</H3>
  
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 900 }}>
              <Table>
                <TableHeader
                  order={order}
                  hideSelectBtn
                  orderBy={orderBy}
                  heading={tableHeading}
                  rowCount={dynamicList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
  
  <TableBody>
  {dynamicList.map((item, index) => (
    <TableRow key={item.id} sx={{ borderBottom: '3px solid #ddd' }}>
      <TableCell>{item.key}</TableCell>
      {item.status === 1 ? (
  <TableCell style={{ color: 'green' }}>Active</TableCell>
) : (
  <TableCell style={{ color: 'red' }}>InActive</TableCell>
)}

    
      <TableCell dangerouslySetInnerHTML={{ __html: item.value }} />
      <TableCell align="center">
        <IconButton onClick={() => handleEdit(item)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDelete(item)} color="error">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
  
        <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
  <DialogTitle>Edit Dynamic Text</DialogTitle>
  <Box p={2}>
    <TextField
      fullWidth
      name="key"
      label="Title"
      color="info"
      size="medium"
      placeholder="Title"
      value={editData.key}
      onChange={handleEditDataChange}
    />

    <TextField
      select
      fullWidth
      color="info"
      size="medium"
      name="status"
      value={editData.status}
      onChange={handleEditDataChange}
      label="Status"
      sx={{ mt: 2 }}
    >
      <MenuItem value="">Select Status</MenuItem>
      <MenuItem value="1">Active</MenuItem>
      <MenuItem value="2">Inactive</MenuItem>
    </TextField>
    <br /><br />
    <RichTextEditor
          value={content}
          onChange={handleContentChange}
        />

<br />
    <Button variant="contained" color="info" onClick={handleEditSubmit}>
      Update
    </Button>
  </Box>
</Dialog>
<Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete this ?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleDeleteDialogClose} color="info">
      No
    </Button>
    <Button onClick={handleConfirmDelete} color="primary">
      Yes
    </Button>
  </DialogActions>
</Dialog>


      </Box>
    );
  }
  
  DynamicList.auth = true;
  