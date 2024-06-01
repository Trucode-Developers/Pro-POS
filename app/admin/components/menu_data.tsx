import {
  HiBuildingLibrary,
  HiClipboardDocumentList,
  HiCpuChip,
  HiGiftTop,
  HiIdentification,
  HiInboxArrowDown,
  HiNewspaper,
} from "react-icons/hi2";
import img from "./report.png";
import { MdCastForEducation, MdDeviceHub } from "react-icons/md";
import {
  VscCircuitBoard,
  VscKey,
  VscOrganization,
  VscSettingsGear,
} from "react-icons/vsc";
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
        link: "/admin",
        icon: HiBuildingLibrary,
      },
      {
        id: 1,
        title: "Customer Orders",
        link: "/admin/customer-orders",
        icon: HiClipboardDocumentList,
      },
      {
        id: 2,
        title: "Make a Sale",
        link: "/admin/make-a-sale",
        icon: HiCpuChip,
      },
      {
        id: 3,
        title: "Sale History",
        link: "/admin/sale-history",
        icon: HiGiftTop,
      },
      {
        id: 4,
        title: "Customer List",
        link: "/admin/customer-list",
        icon: HiIdentification,
      },
      {
        id: 5,
        title: "Order List",
        link: "/admin/order-list",
        icon: HiInboxArrowDown,
      },
      {
        id: 6,
        title: "Held Receipts",
        link: "/admin/held-receipts",
        icon: HiNewspaper,
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
    id: 2,
    title: "Purchasing",
    //description: "View order, sales and usage reports",
    link: "/admin/reports",
    image: img,
    children: [
      {
        id: 1,
        title: "Sale History",
        link: "/admin/sale-history",
        icon: HiClipboardDocumentList,
      },
      {
        id: 2,
        title: "Point of Sale",
        link: "/admin/reports",
        icon: HiCpuChip,
      },
    ],
  },
  {
    id: 3,
    title: "Users Management",
    //description: "View order, sales and usage reports",
    link: "/admin/reports",
    image: img,
    children: [
      {
        id: 1,
        title: "Staff",
        link: "/admin/users",
        icon: HiCpuChip,
      },
      {
        id: 2,
        title: "Branches",
        icon: VscCircuitBoard,
        link: "/admin/branches",
      },
      {
        id: 3,
        title: "Roles",
        icon: VscKey,
        link: "/admin/roles",
      },
      {
        id: 4,
        title: "Settings",
        icon: VscSettingsGear,
        link: "/admin/settings",
      },
    ],
  },
];
