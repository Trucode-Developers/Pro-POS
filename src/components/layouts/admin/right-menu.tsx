import React from "react";
import Image from "next/image";
import img from "./report.png";
import Link from "next/link";

export default function RightMenu() {
  const menu = [
    {
      id: 1,
      image: img,
      title: "Reports",
      description: "View order,sales and usage reports",
      link: "/admin/reports",
    },
    {
      id: 2,
      image: img,
      title: "Data Sync",
      description: "View order,sales and usage reports",
      link: "/admin/products",
    },
    {
      id: 3,
      image: img,
      title: "Store Exchange",
      description: "View order,sales and usage reports",
      link: "/admin/customers",
    },
    {
      id: 4,
      image: img,
      title: "Financial center",
      description: "View order,sales and usage reports",
      link: "/admin/employees",
    },
    {
      id: 5,
      image: img,
      title: "Payment Methods",
      description: "View order,sales and usage reports",
      link: "/admin/settings",
    },
    {
      id: 6,
      image: img,
      title: "App Preferences",
      description: "View order,sales and usage reports",
      link: "/admin/settings",
    },
    {
      id: 5,
      image: img,
      title: "Support Center",
      description: "View order,sales and usage reports",
      link: "/admin/settings",
    },
  ];

  return (
    <div className="flex justify-between flex-col min-h-screen p-2 overflow-">
      <div>leftmenu</div>
      <div className="flex flex-col gap-2">
        {menu.map((item) => (
          <div key={item.id}>
            <Link href={item.link} className="flex justify-end items-center ">
              <div className="flex items-center gap-4 hover:text-secondary">
                <div className="flex flex-col items-end">
                  <h3 className="text-lg truncate ">{item.title}</h3>
                  <p className="text-[10px] truncate ">{item.description}</p>
                </div>
                <Image
                  src={item.image}
                  width={50}
                  height={50}
                  alt="service icon"
                  className="truncate min-w-[40px] min-h-[40px]"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div>leftmenu</div>
    </div>
  );
}
