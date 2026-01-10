import { Box, Card, Stack, Table, TableContainer,Pagination } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3,H4,Span } from "components/Typography";
import { ItemPriority } from "pages-sections/admin";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { curry } from "lodash";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import {server_ip} from "utils/backend_server_ip.jsx";
import axiosInstance from "axios";
import { toast } from 'react-toastify';
import {useSession} from 'next-auth/react';
import useSWR,{ useSWRConfig } from 'swr'
import axios from "axios";
import { Button, ButtonGroup } from '@chakra-ui/react';

const Column = dynamic(() => import("components/Column"), { ssr: false });

const reorderTasks = (tasks, startIndex, endIndex) => {
  const newTaskList = Array.from(tasks);
  const [removed] = newTaskList.splice(startIndex, 1);
  newTaskList.splice(endIndex, 0, removed);
  return newTaskList;
};

 // =============================================================================

BundleItemPriority.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================
export default function BundleItemPriority(props) {
  const { data: session,status} = useSession();


  const [useSwrFlag,setUseSwrFlag] = useState(true);
  const [BundleList, setBundleList] = useState(null);

  const fetcher = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);
  const { data, error } = useSWR(useSwrFlag?`${server_ip}getBundleForAdminConfiguration`:null, fetcher);
  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;
  if(data){console.log(data)}
  if(useSwrFlag && data && data!= BundleList){setBundleList(data);setUseSwrFlag(false);}

  const queryAttr = "data-rbd-drag-handle-draggable-id";
  const [state, setState] = useState(initialData);
  const [placeholderProps, setPlaceholderProps] = useState({});

  const getDraggedDom = (draggableId) => {
    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    return draggedDOM;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // if the user drops outside of a droppable destination
    if (!destination) return;

    // If the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If the user drops in a different postion
    const { tasks } = state;
    const newTasks = reorderTasks(tasks, source.index, destination.index);

    const newState = {
      ...state,
      tasks: newTasks,
    };
    setState(newState);
  };

  const onDragUpdate = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const draggedDOM = getDraggedDom(draggableId);

    if (!draggedDOM.parentNode) return;

    const { clientHeight, clientWidth } = draggedDOM;
    const destinationIndex = destination.index;
    const sourceIndex = source.index;

    const childrenArray = draggedDOM.parentNode.children
      ? [...draggedDOM.parentNode.children]
      : [];

    const movedItem = childrenArray[sourceIndex];
    childrenArray.splice(sourceIndex, 1);

    const updatedArray = [
      ...childrenArray.splice(0, destinationIndex),
      movedItem,
      ...childrenArray.splice(destinationIndex + 1),
    ];

    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      updatedArray.splice(0, destinationIndex).reduce((total, current) => {
        const style = current.currentStyle || window.getComputedStyle(current);
        const marginBottom = parseFloat(style.marginBottom);
        return total + current.clientHeight + marginBottom;
      }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
    });
  };

  const onDragStart = (result) => {
    const { source, draggableId } = result;
    const draggedDOM = getDraggedDom(draggableId);

    if (!draggedDOM) return;

    const { clientHeight, clientWidth } = draggedDOM;
    const sourceIndex = source.index;

    if (!draggedDOM.parentNode) return;

    /**
     * 1. Take all the items in the list as an array
     * 2. Slice from the start to the where we are dropping the dragged item (i.e destinationIndex)
     * 3. Reduce and fetch the styles of each item
     * 4. Add up the margins, widths, paddings
     * 5. Accumulate and assign that to clientY
     */
    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children]
        .slice(0, sourceIndex)
        .reduce((total, current) => {
          const style =
            current.currentStyle || window.getComputedStyle(current);
          const marginBottom = parseFloat(style.marginBottom);

          return total + current.clientHeight + marginBottom;
        }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
    });
  };

  async function getBundleItemApi(bundleId){
    const myNewModel = await axiosInstance
      .post(`${server_ip}getBundleItemsForAdminConfiguration`, {id:bundleId}, {
          headers: {
              "Authorization":'Bearer '+session.accessToken
          },
      }).then((res) => {
          if(res.status==200){
            setState(res.data);
            toast.success("Bunle Items Fetched Successfully", {position: toast.POSITION.TOP_RIGHT});
          }
          return res;
      }).catch((error) => {
          if (error.response) {
            //// if api not found or server responded with some error codes e.g. 404
          toast.error('Error Occured while fetching bundle items '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
          return error.response
        } else if (error.request) {
          /// Network error api call not reached on server 
          toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
          return error.request
        } else {
          toast.error('Error Occured', {position: toast.POSITION.TOP_RIGHT});
          return error
        }
      });
  }
  const handleBundleSelect = (id) => {
    getBundleItemApi(id);
  }
  async function handleSubmitPriority(){
    
  if(state['tasks'].length > 1){
    state['tasks'].map((value,index)=>{
      state['tasks'][index]['priority'] = index+1 
    })
    const myNewModel = await axiosInstance
      .post(`${server_ip}updatePriorityBundleItem`, state['tasks'], {
          headers: {
              "Authorization":'Bearer '+session.accessToken,
          },
      }).then((res) => {
          if(res.status == 200){
          toast.success("Priority Updated Successfully", {position: toast.POSITION.TOP_RIGHT});
          }else{toast.error("Priority not Updated!", {position: toast.POSITION.TOP_RIGHT});}
          return res;
      }).catch((error) => {
          if (error.response) {
            //// if api not found or server responded with some error codes e.g. 404
          if(error.response.status==400){
            var a =Object.keys(error.response.data)[0]
            toast.error("Name or "+error.response.data[a].toString(), {position: toast.POSITION.TOP_RIGHT});
          }
          else{toast.error('Error Occured while Updating Bundle '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});}
          return error.response
        } else if (error.request) {
          /// Network error api call not reached on server 
          toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
          return error.request
        } else {toast.error('Error Occured', {position: toast.POSITION.TOP_RIGHT});return error}
      });
    }
    else if(state['tasks'].length == 1) {toast.info('Bundle should have more than one item to set priority.', {position: toast.POSITION.TOP_RIGHT});}
    else{toast.info('Kindly select any bundle to update priority.', {position: toast.POSITION.TOP_RIGHT});}
  }

  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      <Flex
        flexDir="column"
        bg="main-bg"
        minH="100vh"
        w="full"
        color="white-text"
        pb="2rem"
      >
        <Flex py="2rem" flexDir="column" align="center">
          <Heading as='h1' color="red" fontSize="4xl" fontWeight={600}>
            Bundle Item Configuration
          </Heading>
          <Text fontSize="20px" fontWeight={600} color="subtle-text"></Text>
        <ItemPriority bundles={BundleList} handleBundleSelect={handleBundleSelect} />
        </Flex>

        <Flex justify="center" >
          <Column placeholderProps={placeholderProps} tasks={state.tasks} />
        </Flex>
        <Flex justify="center" style={{marginTop:'2%'}}>
          <Button  size='lg' type="button" onClick={() => handleSubmitPriority()} style={{'color':'#FFFFFF','background-color':'#4E97FD','border-radius':'8px','font-size':'0.875rem','box-shadow':'0px 4px 16px rgba(43, 52, 69, 0.1)','line-height':'1.75','font-weight':'600','border':'0','padding':'6px 16px','cursor':'pointer'}} >Update Priority</Button>
        </Flex>
      </Flex>
    </DragDropContext>
  );
}

const initialData = {
  tasks: [
  ],
};

BundleItemPriority.auth = true