import React, { useState, useEffect } from "react";
import { data } from "@/components/layouts/admin/services_data";
import Image from "next/image";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { useRouter } from "next/router";
import Link from "next/link";
import { TbReportAnalytics } from "react-icons/tb";
import { FiFolder } from "react-icons/fi";
import { HiOutlineCog } from "react-icons/hi";

export default function LeftMenu({ setVertical }: any) {
  const { asPath } = useRouter();
  const [open, setOpen] = useState(true);

  const menus = [
    { name: "Dashboard", link: "/portal", icon: MdOutlineDashboard },
    { name: "Packages", link: "/portal/packages", icon: FiFolder },
    { name: "Payments", link: "/portal/payments", icon: TbReportAnalytics },
  ];

  useEffect(() => {
    if (open) {
      setVertical(["20%", "auto", "20%"]);
    } else {
      setVertical(["5%", "auto", "5%"]);
    }
  }, [open]);

  //filter out data on typing in search input
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setFilteredData(
      data
        .filter((item) => {
          const filteredChildren = item.children.filter((child) =>
            child.title.toLowerCase().includes(search.toLowerCase())
          );
          return filteredChildren.length > 0;
        })
        .map((item) => {
          return {
            ...item,
            children: item.children.filter((child) =>
              child.title.toLowerCase().includes(search.toLowerCase())
            ),
          };
        })
    );
  }, [search, data]);

  return (
    <section className="flex gap-6">
      <div
        className={` min-h-screen z-50 ${
          open ? "w-full" : "w-16"
        } duration-500  px-4 flex flex-col`}
      >
        <div className="py-2 flex justify-between">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        {open && (
          <Link href="/" className=" flex justify-center items-center p-2">
            <div>Welcome UserName</div>
          </Link>
        )}

        <div>
          <input
            type="search"
            placeholder="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none px-4 py-2 text-primary rounded-2xl "
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative overflow-y-auto overflow-x-hidden max-h-[80vh]">
          {filteredData?.map(
            (item) =>
              item.children.length > 0 && (
                <div key={item.id} className="flex flex-col">
                  <div className="text-secondary text-2xl font-bold">
                    {item.title}
                  </div>
                  {item.children.map((sub) => (
                    <div
                      className={` group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-secondary rounded-md ${
                        asPath === item.link ? "bg-secondary" : ""
                      }`}
                    >
                      <div>
                        {/* {React.createElement(item?.icon, { size: "20" })} */}
                        <Image
                          src={sub.image}
                          width={50}
                          height={50}
                          alt="service image"
                          objectFit="cover"
                          objectPosition="center"
                        />
                      </div>
                      <h2
                        style={{
                          transitionDelay: `${sub.id + 3}00ms`,
                        }}
                        className={`whitespace-pre duration-500 cursor-pointer ${
                          !open && "opacity-0 translate-x-28 overflow-hidden"
                        }`}
                      >
                        {sub?.title}
                      </h2>
                      <h2
                        className={`${
                          open && "hidden"
                        } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                      >
                        {sub?.title}
                      </h2>
                    </div>
                  ))}
                </div>
              )
          )}
        </div>
        {/* <div className="grow  flex items-end  cursor-pointer"> */}
        <div className="grow  flex items-end  cursor-pointer flex-wrap">
          <Link href={"/Settings"}>
            <div
              className={` group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-[var(--hoverbg)] rounded-md `}
            >
              <div>{React.createElement(HiOutlineCog, { size: "20" })}</div>
              <h2
                style={{
                  transitionDelay: `${4}00ms`,
                }}
                className={`whitespace-pre duration-500 cursor-pointer ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                Settings
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                Settings
              </h2>
            </div>
          </Link>

          {/* <div>
            <Order />
          </div> */}
        </div>
      </div>
      {/* <div className="m-0 -ml-6 text-xl  font-semibold bg-blue- text-center w-full max-h-screen overflow-auto">
        <main>{children}</main>
      </div> */}
    </section>
  );
}
