import { Button, Card, } from "@mui/material";
import React from "react";
import {server_ip} from "utils/backend_server_ip.jsx"
import axios from "axios";
import useSWR, { useSWRConfig } from 'swr'
import { useState } from "react";
import axiosInstance from "axios";
import { toast } from 'react-toastify';
import {useSession} from 'next-auth/react';
import SyncIcon from '@mui/icons-material/Sync';
import Box from '@mui/material/Box';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import SyncLockIcon from '@mui/icons-material/SyncLock';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useConfirm } from "material-ui-confirm";
// For table import
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// ================================================================
const SyncItemForm = (props) => {
  const { data: session,status} = useSession();
  const { mutate } = useSWRConfig()
  const confirm = useConfirm();
  const [useSwrFlag,setUseSwrFlag] = useState(true);
  const [task,setTask] = useState(null);
  const [swrResult,setSwrResult] = useState(null)
// {headers:{"Authorization":'Bearer '+session.accessToken}}
  const fetcher = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);
  const { data, error } = useSWR(useSwrFlag?server_ip+`itemsTaskProgress`:null,fetcher, { refreshInterval: 5000 });
  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;
  if(data && data!=swrResult){
    if(data['ErrorCode']==1){toast.error(data.ErrorMsg, {position: toast.POSITION.TOP_RIGHT});setUseSwrFlag(false);}
    else{
      if(data['tasks'].length>0){setTask(data['tasks']);setSwrResult(data)}
      // if(data['ErrorCode']==700){}
      if(data['ErrorCode']==701){toast.info(data.ErrorMsg, {position: toast.POSITION.TOP_RIGHT});setUseSwrFlag(false);}
    }
  }
//   , {
//     headers: {"Authorization":'Bearer '+session.accessToken},
//     }
  async function syncItem(){
    const myNewModel = await axiosInstance
      .get(`${server_ip}adminSyncItems`, {
            headers: {"Authorization":'Bearer '+session.accessToken},
            }).then((res) => {
          if(res.data['ErrorCode'] == 700){
            setUseSwrFlag(true);
            toast.success(res.data['ErrorMsg'], {position: toast.POSITION.TOP_RIGHT});
          }
          else if(res.data['ErrorCode'] == 702){toast.info(res.data['ErrorMsg'], {position: toast.POSITION.TOP_RIGHT});}
          else{toast.error(res.data['ErrorMsg'], {position: toast.POSITION.TOP_RIGHT});}
          return res;
      }).catch((error) => {
          if (error.response) {
              //// if api not found or server responded with some error codes e.g. 404
            if(error.response.status==400){
              for(var i=0;i<Object.keys(error.response.data).length;i++){
                var key = Object.keys(error.response.data)[i];
                var value = error.response.data[key].toString()
                toast.error(<div>Field: {key} <br/>Error Message: {value}</div>, {position: toast.POSITION.TOP_RIGHT});
              }}
            else{toast.error('Error Occured! '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});}
            return error.response
          } else if (error.request) {toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
            return error.request
          } else {toast.error('Error Occured', {position: toast.POSITION.TOP_RIGHT});
            return error
          }
      });}
  async function stopTaskSync(id){
    const myNewModel = await axiosInstance
      .get(`${server_ip}stopTaskSync`,{ headers: {"Authorization":'Bearer '+session.accessToken}, params: {id}}).then((res) => {
          if(res.data['ErrorCode'] == 0){
            mutate(server_ip+`itemsTaskProgress`);
            toast.success(res.data['ErrorMsg'], {position: toast.POSITION.TOP_RIGHT});
          }
          else if(res.data['ErrorCode'] == 703){toast.info(res.data['ErrorMsg'], {position: toast.POSITION.TOP_RIGHT});}
          else{toast.error(res.data['ErrorMsg'], {position: toast.POSITION.TOP_RIGHT});}
          return res;
      }).catch((error) => {
          if (error.response) {
              //// if api not found or server responded with some error codes e.g. 404
            if(error.response.status==400){
              for(var i=0;i<Object.keys(error.response.data).length;i++){
                var key = Object.keys(error.response.data)[i];
                var value = error.response.data[key].toString()
                toast.error(<div>Field: {key} <br/>Error Message: {value}</div>, {position: toast.POSITION.TOP_RIGHT});
              }}
            else{toast.error('Error Occured! '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});}
            return error.response
          } else if (error.request) {toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
            return error.request
          } else {toast.error('Error Occured', {position: toast.POSITION.TOP_RIGHT});
            return error
          }
      });}

  const handleCategorySync = () => {
    syncItem();
  };
  const dateFormatter = (olddate) => {
    if(!olddate) return '-'
    const dateFormat = new Date(olddate);
    var date = dateFormat.getDate()+
           "/"+(dateFormat.getMonth()+1)+
           "/"+dateFormat.getFullYear()+
           " "+dateFormat.getHours()+
           ":"+dateFormat.getMinutes()+
           ":"+dateFormat.getSeconds();
    return date
  };
  const rowBackgroundColors = {
    "PROGRESS": "yellow",
    "COMPLETED": "white",
    "PENDING": "red",
  };
  const handleCancelSync = (taskId) =>{
    confirm({ description: `This will stop Synchronization process!` })
      .then(() => stopTaskSync(taskId))
      .catch(() => toast.error('Error Occured in Cancel Sync', {position: toast.POSITION.TOP_RIGHT}));
  
  };
  return (
    <Card
      sx={{
        p: 6,
      }}
    >
      <Box
        m={1}
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
      >
        <Button variant="contained" startIcon={<SyncIcon />} color="success" onClick={handleCategorySync}>Sync Items</Button>
      </Box>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell align="right">Progress</TableCell>
            <TableCell align="right">Start&nbsp;Time</TableCell>
            <TableCell align="right">Completion&nbsp;Time</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Reason</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {task?task.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: rowBackgroundColors[row.status] ?? "#fff" }}
            >
              <TableCell component="th" scope="row">
                {row.syncType}
              </TableCell>
              <TableCell align="right">{row.total?((row.progress*100)/row.total).toFixed(2):"0.00"} %</TableCell>
              <TableCell align="right">{dateFormatter(row.uploadTime)}</TableCell>
              <TableCell align="right">{dateFormatter(row.completionTime)}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
              <TableCell align="right">{row.statusReason?row.statusReason:'-'}</TableCell>
              <TableCell align="right">{row.status=="PROGRESS"?
                <Tooltip title="Cancel Synchronization">
                  <IconButton onClick={()=>handleCancelSync(row.taskId)}>
                    <SyncDisabledIcon color="secondary" fontSize="small"  />
                  </IconButton>
                </Tooltip>
                :
                <Tooltip title="Completed Synchronization">
                  <IconButton onClick={()=>handleCancelSync(row.taskId)}>
                  <SyncLockIcon color="success" fontSize="small"  />
                  </IconButton>
                </Tooltip>
              }</TableCell>
            </TableRow>
          )):''}
        </TableBody>
      </Table>
    </TableContainer>

    </Card>
  );
};

export default SyncItemForm;
