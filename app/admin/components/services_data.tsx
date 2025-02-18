import img from "./report.png";
import {  MdCastForEducation, MdCreateNewFolder, MdDeviceHub, MdDriveFileRenameOutline, MdFactCheck, MdHome, MdInsertEmoticon, MdOutlineDashboard, MdPaid, MdSwapHorizontalCircle, MdTableView } from "react-icons/md";
export const data = [
  {
    id: 1,
    title: "Point of Sale",
    //description: "View order, sales and usage reports",
    link: "/admin/reports",
    image: img,
    children: [
      {
        id: 0,
        title: "Dashboard",
        //description: "View order, sales and usage reports",
        link: "/admin/dashboard",
        image: MdHome,
      },
      {
        id: 1,
        title: "Customer Orders",
        //description: "View order, sales and usage reports",
        link: "/admin/customer-orders",
        image: MdFactCheck,
      },
      {
        id: 2,
        title: "Make a Sale",
        //description: "View order, sales and usage reports",
        link: "/admin/make-a-sale",
        image: MdSwapHorizontalCircle,
      },
      {
        id: 3,
        title: "Sale History",
        //description: "View order, sales and usage reports",
        link: "/admin/sale-history",
        image: MdTableView,
      },
      {
        id: 4,
        title: "Customer List",
        //description: "View order, sales and usage reports",
        link: "/admin/customer-list",
        image: MdInsertEmoticon,
      },
      {
        id: 5,
        title: "Order List",
        //description: "View order, sales and usage reports",
        link: "/admin/order-list",
        image: MdCreateNewFolder,
      },
      {
        id: 6,
        title: "Held Receipts",
        //description: "View order, sales and usage reports",
        link: "/admin/held-receipts",
        image: MdDriveFileRenameOutline,
      },
      {
        id: 7,
        title: "End of Day",
        //description: "View order, sales and usage reports",
        link: "/admin/end-of-day",
        image: MdDeviceHub,
      },
      {
        id: 8,
        title: "Rewards",
        //description: "View order, sales and usage reports",
        link: "/admin/rewards",
        image: MdCastForEducation,
      },
    ],
  },
  {
    id: 1,
    title: "Purchasing",
    //description: "View order, sales and usage reports",
    link: "/admin/reports",
    image: img,
    children: [
      {
        id: 1,
        title: "Sale History",
        //description: "View order, sales and usage reports",
        link: "/admin/sale-history",
        image: MdOutlineDashboard,
      },
      {
        id: 2,
        title: "Point of Sale",
        //description: "View order, sales and usage reports",
        link: "/admin/reports",
        image: MdOutlineDashboard,
      },
    ],
  },
  {
    id: 1,
    title: "Staff Management",
    //description: "View order, sales and usage reports",
    link: "/admin/reports",
    image: img,
    children: [
      {
        id: 1,
        title: "Users",
        //description: "View order, sales and usage reports",
        link: "/admin/users",
        image: MdOutlineDashboard,
      },
      {
        id: 2,
        title: "Point of Sale",
        //description: "View order, sales and usage reports",
        link: "/admin/reports",
        image: MdOutlineDashboard,
      },
    ],
  },
];
