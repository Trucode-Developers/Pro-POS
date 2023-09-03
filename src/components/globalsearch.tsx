import React, { useContext, useEffect, useState } from "react";
import { HiOutlineX, HiSearch } from "react-icons/hi";
// import { ThemeContext } from "../../pages/_app";
import Link from "next/link";
//import navigate from "next-navigate";
import { useRouter } from "next/router";
// import axios from "axios";

export default function GlobalSearch() {
  // const theme: any = useContext(ThemeContext);
  // const [colorMode, setColorMode] = useState(theme);
  const [open, setOpen] = useState(false);
  const [gettingdata, setGettingdata] = useState(false);
  const [searchdata, setSearchdata] = useState([]);
  const [searchvalue, setSearchvalue] = useState("");
  const [searchdisplay, setSearchdisplay] = useState("");
  const router = useRouter();



  // function searchHandler() {
  //   if (searchvalue.length > 0) {
  //     setGettingdata(true);
  //     axios
  //       .get(`https://account.centalyne.com/api/globalsearch/${searchvalue}`)
  //       .then((res) => {
  //         setSearchdata(res.data);
  //         setGettingdata(false);
  //         setSearchdisplay(searchvalue);
  //       })
  //       .catch((err) => {
  //         // console.log(err);
  //         setSearchdisplay(searchvalue);
  //       });
  //   }
  // }

  function navigate(link: string) {
    setOpen(false);
    router.push(link);
  }

  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-center items-center p-2 hover:text-yellow-500 font-bold cursor-pointer"
      >
        <HiSearch className="text-base md:text-xl lg:text-2xl " />
      </div>
      {open && (
        <div
          onClick={() => setOpen(!open)}
          className="absolute top-0 right-0 w-full  h-screen bg-black bg-opacity-50 z-[99999]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="m-10  md:mx-20 h-[90vh] overflow-y-auto text-sm md:text-md lg:text-xl relative bg-white"
            // style={colorMode}
          >
            <div
              className="absolute top-0 right-0 p-1 md:p-5 font-bold hover:cursor-pointer hover:text-yellow-500"
              onClick={() => setOpen(false)}
              // style={colorMode}
            >
              <HiOutlineX className="text-2xl" />
            </div>
            <form
              className="flex flex-col justify-center items-center w-full px-10 pt-10"
              // style={colorMode}
              onSubmit={(e) => {
                e.preventDefault();
                // searchHandler();
              }}
            >
              <input
                type="search"
                onChange={(e) => setSearchvalue(e.target.value)}
                className="w-full p-2 pr-20 bg-transparent border-b-2 border-yellow-500 outline-none text-center"
                placeholder="What are you looking for?"
                onFocus={() => setOpen(true)}
              />
              <div>
                <button
                  // onClick={searchHandler}
                  className={`p-3 m-5 bg-yellow-500 text-black ${
                    gettingdata && "animate-bounce cursor-not-allowed"
                  }`}
                >
                  {gettingdata ? "Searching..." : "Search Results "}
                </button>
              </div>
            </form>
            <div className="w-full p-2">
              {searchdata?.length > 0 ? (
                searchdata?.map((data: any, i) => (
                  <div
                    className="w-full p-2 m-2 hover:border-b-2 border-yellow-500"
                    key={i}
                  >
                    <div onClick={() => navigate(data.link)}>
                      <div className="flex gap-2 cursor-pointer text-blue-700 hover:text-yellow-500">
                        <h1 className="font-bold">{i + 1}.</h1>
                        <a className="">{data.title}</a>
                      </div>
                    </div>
                    <p className="text-sm pl-6">{data.description}</p>
                  </div>
                ))
              ) : (
                <div className="w-full p-2 m-2 ">
                  {searchdisplay.length > 0 ? (
                    <>
                      <div>
                        <div className="flex gap-2 justify-center text-blue-700 ">
                          <a className="">
                            Search results for{" "}
                            <span className="text-2xl text-yellow-500">
                              {searchdisplay}
                            </span>{" "}
                            not found!
                          </a>
                        </div>
                      </div>
                      <p className="text-sm pl-6 w-full text-center">
                        Try searching something else or page search!
                      </p>
                    </>
                  ) : (
                    <p className="text-sm md:text-md lg:text-xl pl-6 w-full text-center">
                      Search by title, name, description or clause for any
                      content you want to find!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
