import axios from "axios";
import {server_ip} from "../backend_server_ip.jsx"

const getAllCard = async () => {
  const response = await axios.get("/api/dashboard-cards");
  return response.data;
};

const recentPurchase = async () => {
  const response = await axios.get("/api/recent-purchase");
  return response.data;
};

const stockOutProducts = async () => {
  const response = await axios.get("/api/stock-out-products");
  return response.data;
};

const products = async () => {
  const response = await axios.get(server_ip+"getAllItems");
  return response.data;
};

const getAllItems = async () => {
  const response = await axios.get(server_ip+"getAllItems");
  return response.data;
};
const getAllStatistics = async () => {
  const response = await axios.get(server_ip+"getStatistics");
  return response.data;
};
const getAllReviews = async () => {
  const response = await axios.get(server_ip+"getReviews");
  return response.data;
};
const updateItem = async (data) => {
  const context = {}
  const response = await axios({
                    method: 'post',
                    url: server_ip+'updateItem',
                    data,
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'multipart/form-data'
                    },
                  });

  return response.data
};

const getAllCategories = async () => {
  const response = await axios.get(server_ip+"getAllCategories");
  return response.data;
};
const getAllLocalCategories = async () => {
  const response = await axios.get(server_ip+"getAllLocalCategories");

  console.log("Response",response.data)
  return response.data;
};

const getParentCategories = async () => {
  const response = await axios.get(server_ip+"getParentCategories");
  return response.data;
};
const getLocalParentCategories = async () => {
  const response = await axios.get(server_ip+"getLocalParentCategories");
  return response.data;
};
const getSubCategories = async () => {
  const response = await axios.get(server_ip+"getSubCategories");
  return response.data;
};
const getLocalSubCategories = async () => {
  const response = await axios.get(server_ip+"getLocalSubCategories");
  return response.data;
};
const getNavCategories = async () => {
  const response = await axios.get(server_ip+"getProductCategories");
  return response.data;
};
const getLocalProductCategories = async () => {
  const response = await axios.get(server_ip+"getLocalProductCategories");
  return response.data;
};

getLocalProductCategories
const getCategory = async (catSlug,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getCategory',
                          data: {
                            slug: catSlug,
                            pos:1
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};





const getLocalCategory = async (catSlug,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getLocalCategory',
                          data: {
                            slug: catSlug
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};


const getAllBrand = async (accessToken) => {
  const response = await axios({
    method: 'get',
    url: server_ip+'getAllBrand',
    headers: {
      "Authorization":'Bearer '+accessToken
    },
  });

  return response.data;
};

const getBrand = async (slug,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getBrand',
                          data: {
                            slug: slug
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};
const getBundle = async (slug,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getBundle',
                          data: {
                            slug: slug
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};

const getItem = async (itemId,accessToken) => {
  console.log('getItem');
  console.log(itemId);
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getItem',
                          data: {
                            id: itemId
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};
const getItemCategory = async (itemId,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getItemCategory',
                          data: {
                            id: itemId
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};
const getItemGallery = async (itemId,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getItemGallery',
                          data: {
                            id: itemId
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};

// let axiosConfig = {
//   headers: {
//       'Content-Type': 'application/json;charset=UTF-8',
//       "Access-Control-Allow-Origin": "*",
//   }
// };



const getAllProductBundle = async () => {
  const response = await axios.get(server_ip+"getAllProductBundle");
  return response.data;
};

const getAllBrandBundle = async () => {
  const response = await axios.get(server_ip+"getAllBrandBundle");
  return response.data;
};

const getAllAdmin = async (accessToken) => {
  return axios({
    method: 'get',
    url: server_ip+'getAllAdmin',
    headers: {
      "Authorization":'Bearer '+accessToken
    },
  });
  // const response = await axios.get(server_ip+"getAllAdmin");
  // return response.data;

};

const getAdmin = async (adminId,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getAdmin',
                          data: {
                            id: adminId
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};

const addAdmin = async (values,accessToken) => {
  const context = {}
  return axios({
                    method: 'post',
                    url: server_ip+'addAdmin',
                    headers: {
                      'content-type': 'application/json',
                      "Authorization":'Bearer '+accessToken
                    },
                    data: {
                      valueDict: values
                    }
                  });
};
const updateAdmin = async (values,accessToken) => {
  const context = {}
  return axios({
                    method: 'post',
                    url: server_ip+'updateAdmin',
                    headers: {
                      'content-type': 'application/json',
                      "Authorization":'Bearer '+accessToken
                    },
                    data: {
                      valueDict: values
                    }
                  });

  // return response.data
};
const updateAdminProfile = async (values,accessToken) => {
  const context = {}
  return axios({
                    method: 'post',
                    url: server_ip+'updateAdminProfile',
                    headers: {
                      'content-type': 'application/json',
                      "Authorization":'Bearer '+accessToken
                    },
                    data: {
                      valueDict: values
                    }
                  });

  // return response.data
};
const deleteAdmin = async (values,accessToken) => {
  const context = {}
  return axios({
                    method: 'post',
                    url: server_ip+'deleteAdmin',
                    headers: {
                      'content-type': 'application/json',
                      "Authorization":'Bearer '+accessToken
                    },
                    data: {
                      id: values
                    }
                  });

  // return response.data
};



const brands = async () => {
  const response = await axios.get("/api/brands");
  return response.data;
};

const reviews = async () => {
  const response = await axios.get("/api/reviews");
  return response.data;
};

const orders = async () => {
  const response = await axios.get("/api/orders");
  return response.data;
};

const getAllOrder = async (accessToken) => {
  // const response = await axios.get(server_ip+"getAllOrder");
  const response = await  axios({
    method: 'get',
    url: server_ip+'getAllOrder',
    headers: {
      "Authorization":'Bearer '+accessToken
    },
  });
  return response.data;
};

const getOrderProduct = async (orderNo,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getOrderProduct',
                          data: {
                            orderNo: orderNo
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};




const getOrder = async (orderNo,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getOrder',
                          data: {
                            orderNo: orderNo
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};
const seenOrderNotification = async (orderNo,accessToken) => {
  const response = await  axios({
                          method: 'post',
                          url: server_ip+'seenOrderNotification',
                          data: {
                            orderNo: orderNo
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};
const updateOrder = async (orderNo,deliveryCharges,totalBill,deletedProduct,updatedProduct,status,shippingAddress,accessToken) => {
  const context = {}
  return axios({
                    method: 'post',
                    url: server_ip+'updateOrder',
                    headers: {
                      'content-type': 'application/json',
                      "Authorization":'Bearer '+accessToken,
                    },
                    data: {
                      orderNo: orderNo,
                      deliveryCharges: deliveryCharges,
                      totalBill:totalBill,
                      deletedProduct:deletedProduct,
                      updatedProduct:updatedProduct,
                      status:status,
                      shippingAddress:shippingAddress,

                    }
                  });

  // return response.data
};

// ==============================homePage==============================

const AllIndividualBoxOrder = async () => {
  const response = await axios.get(server_ip+"AllIndividualBoxOrder");
  return response.data;
};

const AllSectionSequence = async () => {
  const response = await axios.get(server_ip+"AllSectionSequence");
  return response.data;
};

const AllCategories = async () => {
  const response = await axios.get(server_ip+"AllCategories");
  return response.data;
}

const AllConfiguration = async () => {
  const response = await axios.get(server_ip+"AllConfiguration");
  return response.data;
}

const getConfiguration = async (ConfigId) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getConfiguration',
                          data: {
                            id: ConfigId
                          },
                          // headers: {
                          //   "Authorization":'Bearer '+accessToken
                          // },
                        });
  return response.data;
  console.log("getConfig response.data: ",  response.data);
};

// const IndividualBoxOrder_Delete = async () => {
//   const response = await axios.get(server_ip+"IndividualBoxOrder_Delete");
//   return response.data;
// }

const IndividualBoxOrder_Post = async () => {
  const response = await axios.get(server_ip+"IndividualBoxOrder_Post");
  return response.data;
}

// ====================================================================


const customers = async () => {
  const response = await axios.get("/api/customers");
  return response.data;
};

const refundRequests = async () => {
  const response = await axios.get("/api/refund-requests");
  return response.data;
};

const sellers = async () => {
  const response = await axios.get("/api/sellers");
  return response.data;
};

const packagePayments = async () => {
  const response = await axios.get("/api/package-payments");
  return response.data;
};

const earningHistory = async () => {
  const response = await axios.get("/api/earning-history");
  return response.data;
};

const payouts = async () => {
  const response = await axios.get("/api/payouts");
  return response.data;
};

const payoutRequests = async () => {
  const response = await axios.get("/api/payout-requests");
  return response.data;
}; // eslint-disable-next-line import/no-anonymous-default-export

const getVoucher = async (id,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getnewvoucher',
                          data: {
                            id: id,
                     
                          },
                          headers: {
                            'content-type': 'application/json',

                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};


const getCourier = async (id,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getidcourier',
                          data: {
                            id: id,
                     
                          },
                          headers: {
                            'content-type': 'application/json',

                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};

const getCityConfiguration = async (ConfigId,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getCityConfiguration',
                          data: {
                            id: ConfigId
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};
const getCountryConfiguration = async (ConfigId,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getCountryConfiguration',
                          data: {
                            id: ConfigId
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};

const getAllCourier = async (accessToken) => {
  const response = await axios({
    method: 'get',
    url: server_ip+'getAllCourier',
    headers: {
      "Authorization":'Bearer '+accessToken
    },
  });

  // const response = await axios.get(server_ip+"getAllSchool");
  return response.data;
};
const getChargesConfiguration = async (ConfigId,accessToken) => {
  const response = await  axios({
                          method: 'get',
                          url: server_ip+'getChargesConfiguration',
                          data: {
                            id: ConfigId
                          },
                          headers: {
                            "Authorization":'Bearer '+accessToken
                          },
                        });
  return response.data;
};

const api = {
  brands,
  orders,
  reviews,
  sellers,
  payouts,
  products,
  // items,
  getAllItems,
  getItem,
  getItemCategory,
  getItemGallery,
  updateItem,
  // category,
  getAllCategories,
  getCategory,
  getParentCategories,
  getSubCategories,
  getNavCategories,
 
  // Bundle
  getAllProductBundle,
  getAllBrandBundle,
  getBundle,
  getAllBrand,
  getBrand,
  // Admin
  getAllAdmin,
  addAdmin,
  updateAdmin,
  updateAdminProfile,
  getAdmin,
  deleteAdmin,
  
  // Orders 
  getAllOrder,
  getOrderProduct,
  getOrder,
  updateOrder,
  seenOrderNotification,
  
  customers,
  getAllCard,
  payoutRequests,
  recentPurchase,
  refundRequests,
  earningHistory,
  packagePayments,
  stockOutProducts,

  // Iffa Shah Homepage
  AllIndividualBoxOrder,
  AllCategories,
  AllSectionSequence,
  AllConfiguration,
  getConfiguration,
  getAllLocalCategories,
  getLocalCategory,
  // IndividualBoxOrder_Delete,
  IndividualBoxOrder_Post,

  getLocalProductCategories,
  getLocalParentCategories,
  getLocalSubCategories,
  getAllStatistics,
  getAllReviews,
  getVoucher,
  getCityConfiguration,
  getCountryConfiguration,
  getCourier,
  getAllCourier,
  getChargesConfiguration
};

export default api;
