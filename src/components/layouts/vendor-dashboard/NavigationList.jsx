import duotone from "components/icons/duotone";
import PackageBox from "components/icons/PackageBox";
import Category from "components/icons/Category";

export const navigations = [
  {
    type: "label",
    label: "Admin",
  },
  {
    name: "Dashboard",
    icon: duotone.Dashboard,
    path: "/",
  },
  // {
  //   name: "Admin Management",
  //   icon: duotone.Products,
  //   children: [
  //     {
  //       name: "Add Admin",
  //       path: "/admin/users/create",
  //     },
  //     {
  //       name: "View All Admins",
  //       path: "/admin/users",
  //     },

  //   ],
  // },
  {
    name: "Packages",
    icon: PackageBox,
    children: [
      {
        name: "Add Bundle",
        path: "/admin/bundles/create",
      },
      {
        name: "View Brand Bundles",
        path: "/admin/bundles/brand",
      },
      {
        name: "View Product Bundles",
        path: "/admin/bundles/product",
      },
      {
        name: "Brand Bundle Priority",
        path: "/admin/bundles/bundle-priority",
      },
      {
        name: "Brand Bundle Item Priority",
        path: "/admin/bundles/bundle-item-priority",
      },
      {
        name: "Add Brand",
        path: "/admin/brand/create",
      },
      {
        name: "View All Brands",
        path: "/admin/brand",
      },
    ],
  },
  {
    name: "Products",
    icon: duotone.Products,
    children: [
      {
        name: "Add Product",
        path: "/admin/products/create",
      },
      {
        name: "View All Products",
        path: "/admin/products",
      },
    ],
  },
  {
    name: "Categories",
    icon:Category ,
    children: [
      {
        name: "Add Category",
        path: "/admin/categories/create",
      },
      {
        name: "View All Categories",
        path: "/admin/categories",
      },
    ],
  },
  {
    name: "Orders",
    icon: duotone.Order,
    children: [
      {
        name: "Order List",
        path: "/admin/orders",
      },
    ],
  },
  {
    name: "Customers",
    icon: duotone.Customers,
    path: "/admin/customers",
  },
  {
    name: "Synchronization",
    icon: duotone.Settings,
    path: "/admin/sync",
  },



  {
    name: "Homepage Setup",
    icon: duotone.SiteSetting,
    path: "/admin/homePage",
    // children: [
    //   // {
    //   //   name: "Configurations",
    //   //   path: "/admin/homePage/configurations"
    //   // },
    //   {
    //     name: "Section Sequencing",
    //     path: "/admin/homePage",
    //   }
    // ]
  },
 
  {
    name: "Reviews",
    icon: duotone.Review,
    path: "/admin/reviews/reviews",
  },
  {
    name: "Voucher",
    icon: duotone.Review,
    path: "/admin/voucher/create",
  },

  
];

export const superAdminNavigations = [
  {
    type: "label",
    label: "Admin",
  },
  {
    name: "Dashboard",
    icon: duotone.Dashboard,
    path: "/",
  },
  {
    name: "Admin Management",
    icon: duotone.Products,
    children: [
      {
        name: "Add Admin",
        path: "/admin/users/create",
      },
      {
        name: "View All Admins",
        path: "/admin/users",
      },

    ],
  },
  {
    name: "Packages",
    icon: PackageBox,
    children: [
      {
        name: "Add Bundle",
        path: "/admin/bundles/create",
      },
      {
        name: "View Brand Bundles",
        path: "/admin/bundles/brand",
      },
      {
        name: "View Product Bundles",
        path: "/admin/bundles/product",
      },
      {
        name: "Brand Bundle Priority",
        path: "/admin/bundles/bundle-priority",
      },
      {
        name: "Brand Bundle Item Priority",
        path: "/admin/bundles/bundle-item-priority",
      },
      {
        name: "Add Brand",
        path: "/admin/brand/create",
      },
      {
        name: "View All Brands",
        path: "/admin/brand",
      },
    ],
  },
  {
    name: "Products",
    icon: duotone.Products,
    children: [
      {
        name: "Add Product",
        path: "/admin/products/create",
      },
      {
        name: "View All Products",
        path: "/admin/products",
      },
    ],
  },
  {
    name: "Categories",
    icon:Category ,
    children: [
      {
        name: "Add Category",
        path: "/admin/categories/create",
      },
      {
        name: "View All Categories",
        path: "/admin/categories",
      },
    ],
  },
  {
    name: "Orders",
    icon: duotone.Order,
    children: [
      {
        name: "Order List",
        path: "/admin/orders",
      },
    ],
  },
  {
    name: "Customers",
    icon: duotone.Customers,
    path: "/admin/customers",
  },
  {
    name: "Synchronization",
    icon: duotone.Settings,
    path: "/admin/sync",
  },



  
  {
    name: "Homepage Setup",
    icon: duotone.SiteSetting,
    children: [
      {
        name: "Configurations",
        path: "/admin/homePage/configurations"
      },
      {
        name: "Section Sequencing",
        path: "/admin/homePage",
      }
    ]
  },
  {
    name: "Dynamic Text",
    icon: duotone.TodoList,
    children: [
      {
        name: "Add Text",
        path: "/admin/dynamicText/dynamictext",
      },
      {
        name: "View Text",
        path: "/admin/dynamicText/viewdynamictext",
      },
    ],
  },
  {
    name: "Reviews",
    icon: duotone.Review,
    path: "/admin/reviews/reviews",
  },

  {
    name: "Site Setting",
    icon: duotone.SiteSetting,
    path: "/admin/siteSetting/site-settings",
  },

  {
    name: "Voucher",
    icon: duotone.Review,
    children: [
      {
        name: "Add Voucher",
    path: "/admin/voucher/create",
      },
      {
        name: "View Vouchers",
        path: "/admin/voucher",
      },
    ],
  },
  {
    name: "Country Setup",
    icon: duotone.Settings,
    children: [
      // {
      //   name: "Courier",
      //   path: "/admin/country"
      // },
      {
        name: "Country Configurations",
        path: "/admin/country/country-configuration"
      },
      {
        name: "City Configurations",
        path: "/admin/country/city-configuration"
      },
      
    ]
  },
  {
    name: "Courier Setup",
    icon: PackageBox,
    children: [
      // {
      //   name: "Courier",
      //   path: "/admin/country"
      // },
      {
        name: "Add Courier ",
        path: "/admin/courier/create"
      },
      {
        name: "Charges Configuration",
        path: "/admin/courier/charges-configuration"
      },
      {
        name: "View Couries",
        path: "/admin/courier"
      }

    ]
    }  
];
