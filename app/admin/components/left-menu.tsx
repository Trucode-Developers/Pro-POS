import React, { useState, useEffect } from "react";
import { data } from "./services_data";
import Image from "next/image";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { TbReportAnalytics } from "react-icons/tb";
import { FiFolder } from "react-icons/fi";
import { HiOutlineCog } from "react-icons/hi";
import pos from "./pos.png";
import { useThemeStore } from "@/lib/store";
import CustomInput from "@/components/custom/input";

export default function LeftMenu({ setVertical }: any) {
  const adminSidebarSize = useThemeStore((state) => state.adminSidebarSize);
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (open) {
      useThemeStore.setState({ adminSidebarSize: [20, 80] });
    } else {
      useThemeStore.setState({ adminSidebarSize: [0, 100] });
    }
  }, [open]);

  //filter out data on typing in search input‰‰
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
        <div className="flex items-center justify-between py-2">
          {open && (
            <Link href="/">
              <Image src={pos} width={50} height={50} alt="service image" />
            </Link>
          )}
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <Link href="/" className="flex items-center justify-center p-2 ">
          <div className="truncate ">Welcome UserName</div>
        </Link>

        <div>
          <CustomInput
            label="Search "
            type="search"
            placeholder="search"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            className="w-full px-4 py-2 outline-none text-primary rounded-2xl "
            register={"name"} //this should not be here but for code reuse it is here
          />
          {/* <input
            type="search"
            placeholder="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 outline-none text-primary rounded-2xl "
          /> */}
        </div>
        <div className="mt-4 flex flex-col gap-4 relative overflow-y-auto overflow-x-hidden max-h-[80vh]">
          {filteredData?.map(
            (item) =>
              item.children.length > 0 && (
                <div key={item.id} className="flex flex-col">
                  <div className="text-2xl font-bold truncate text-secondary ">
                    {item.title}
                  </div>
                  {item.children.map((sub) => (
                    <Link
                      key={sub.id}
                      href={sub.link}
                      className={` group flex items-center text-sm  gap-3.5 font-medium px-2 py-2 my-1 hover:bg-gray-400 rounded-md ${
                        pathname === sub.link ? "bg-gray-300" : ""
                      }`}
                    >
                      <div>
                        {React.createElement(MdOutlineDashboard, {
                          size: "20",
                        })}
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
                    </Link>
                  ))}
                </div>
              )
          )}
        </div>
        {/* <div className="flex items-end cursor-pointer grow"> */}
        <div className="flex flex-wrap items-end cursor-pointer grow">
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
        </div>
      </div>
    </section>
  );
}
