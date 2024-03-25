"use client";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";
import UserCrud from "./userCrud";
import { openPopUp, closePopUp } from "@/lib/store";
import { VscListUnordered, VscOrganization, VscTable } from "react-icons/vsc";
import {
  HiArchiveBoxXMark,
  HiBarsArrowUp,
  HiFunnel,
  HiPencilSquare,
} from "react-icons/hi2";
import SearchBar from "@/components/expandableSearch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  name: string;
  role: number;
  email: string;
  password: string;
  is_active: boolean;
}

const defaultUser = {
  name: "",
  role: 1,
  email: "",
  password: "",
  is_active: true,
};

export default function Page() {
  const [greeting, setGreeting] = useState("");
  const [users, setUsers] = useState({} as any);
  const [user, setUser] = useState<User>(defaultUser);

  const [active_id, setActive_id] = useState("");
  const [search_value, setSearchValue] = useState("");

  useEffect(() => {
    invoke<string>("greet", {
      name: "Professional POS: Accessed the backend! ",
    })
      .then(
        (greeting) => setGreeting(greeting),
        (error) => console.error(error)
      )
      .catch(console.error);
    get_all_users();
  }, []);

  const get_all_users = async () => {
    closePopUp();
    await invoke("get_all_users")
      .then((response) => {
        setUsers(response);
        // console.log(response);
      })
      .catch(console.error);
  };

  const prepare_updating_user = async (email: string) => {
    setActive_id(email);
    //filter user by id and assign to user
    const user = users.filter((user: any) => user.email === email)[0];
    setUser(user);
    openPopUp();
  };

  const deleteUser = async (email: string) => {
    await invoke("delete_user", { email })
      .then((response) => get_all_users())
      .catch(console.error);
  };

  const reset_users = async () => {
    setUser(defaultUser);
    setActive_id("");
  };

  const newUser = async () => {
    openPopUp();
    reset_users();
  };

  return (
    <div className="w-full h-full ">
      <div className="flex items-center gap-2 pt-5 text-2xl font-bold lg:text-4xl">
        <div>
          <VscOrganization />
        </div>
        <div>Staffs</div>
      </div>
      <p className="py-2 ">{greeting}</p>
      <div className="flex items-center justify-between py-1 mb-2 border-b border-blue-800 lg:mb-5">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <VscListUnordered /> <span> List view</span>
          </div>
          <div className="flex items-center gap-2">
            <VscTable /> <span> Grid view</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <HiFunnel /> <span> Filter</span>
          </div>
          <div className="flex items-center gap-2">
            <HiBarsArrowUp /> <span> Sort</span>
          </div>
          <SearchBar
            value={search_value}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={"Search by name, email, Id ..."}
          />
          <div>
            <Button className="bg-green-500 hover:bg-black" onClick={newUser}>
              New User
            </Button>
          </div>
          <UserCrud
            user={user}
            setUser={setUser}
            reset_users={reset_users}
            get_all_users={get_all_users}
            active_id={active_id}
          />
        </div>
      </div>

      <Table>
        <TableCaption>A list of staff members.</TableCaption>
        <TableHeader>
          <TableRow className="text-white uppercase bg-gray-500 hover:bg-gray-500">
            <TableHead className="text-white ">Name</TableHead>
            <TableHead className="text-white ">Email</TableHead>
            <TableHead className="text-white w-[100px]">Role</TableHead>
            <TableHead className="text-white w-[100px]">Status</TableHead>
            <TableHead className="text-right text-white ">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(users).map((user: any, index: number) => (
            <TableRow
              key={index}
              className="py-0 my-0 border-gray-400 border-opacity-50 border-y"
            >
              <TableCell className="font-medium capitalize">
                {user.name}
              </TableCell>
              <TableCell className="lowercase">{user.email}</TableCell>
              <TableCell className="w-{100px]">{user.role}</TableCell>
              <TableCell className="w-{100px]">
                {user.is_active ? "Yes" : "No"}
              </TableCell>
              <TableCell className="flex justify-end gap-2 text-sm lg:text-lg">
                {" "}
                <div
                  className="cursor-pointer hover:text-blue-500 hover:scale-125"
                  onClick={() => {
                    prepare_updating_user(user.email);
                  }}
                >
                  <HiPencilSquare />
                </div>
                <div
                  className="cursor-pointer hover:text-red-500 hover:scale-125"
                  onClick={() => deleteUser(user.email)}
                >
                  <HiArchiveBoxXMark />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
