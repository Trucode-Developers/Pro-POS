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
import { TypeUserSchema } from "@/lib/types/users";

const defaultUser = {
  id: 0,
  name: "",
  staff_number: "",
  role: 1,
  email: "",
  password: "",
  confirmPassword: "",
  is_active: true,
};

export default function Page() {
  const [greeting, setGreeting] = useState("");
  const [users, setUsers] = useState({} as any);
  const [user, setUser] = useState<TypeUserSchema>(defaultUser);
  const [allocatedRoles, setAllocatedRoles] = useState([] as any);
  const [roles, setRoles] = useState([]);

  const [active_id, setActive_id] = useState("");
  const [search_value, setSearchValue] = useState("");

  //  const user_slugs = async (userId: number) => {
  //  const user_slugs = async () => {
  //   let userId = 1;
  //    await invoke("get_allocated_permission_slugs", { userId })
  //      .then((response: any) => {
  //        setAllocatedRoles(response.data);
  //         console.log("assigned slugs", response.data);
  //      })
  //      .catch(console.error);
  //  };

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
    get_all_roles();
  }, []);

  const get_all_roles = async () => {
    closePopUp();
    await invoke("get_all_roles")
      .then((response: any) => {
        if (response.status === 200) {
          setRoles(response.data);
          //  console.log(roles);
          //  console.log(response.data);
        }
      })
      .catch(console.error);
  };

  const get_assigned_roles = async (userId: number) => {
    await invoke("get_assigned_roles", { userId })
      .then((response: any) => {
        setAllocatedRoles(response.data);
        //  console.log("assigned roles", response.data);
      })
      .catch(console.error);
  };

  const get_all_users = async () => {
    closePopUp();
    await invoke("get_all_users")
      .then((response: any) => {
        // console.log(response.data);
        if (response.status === 200) {
          setUsers(response.data);
        }
      })
      .catch(console.error);
  };

  const prepare_updating_user = async (id: number) => {
    setActive_id(id.toString());
    let userId = id;
    get_assigned_roles(userId);
    //filter user by id and assign to user
    const user = users.filter((user: any) => user.id === id)[0];
    setUser(user);
    openPopUp();
    // console.log(user);
  };

  const deleteUser = async (id: number) => {
    await invoke("delete_user", { id })
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
            roles={roles}
            allocatedRoles={allocatedRoles}
            setAllocatedRoles={setAllocatedRoles}
            user={user}
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
            <TableHead className="text-white w-[100px]">Roles</TableHead>
            <TableHead className="text-white w-[100px]">Status</TableHead>
            <TableHead className="text-right text-white ">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(users).map((user: any, index: number) => (
            <TableRow
              key={index + 1}
              className="py-0 my-0 border-gray-400 border-opacity-50 border-y"
            >
              <TableCell className="font-medium capitalize">
                {user.name}
              </TableCell>
              <TableCell className="lowercase">{user.email}</TableCell>
              <TableCell className="w-{100px]">{user.total_roles}</TableCell>
              <TableCell className="w-{100px]">
                {user.is_active ? (
                  <div className="px-2 py-1 text-center text-white bg-green-500 rounded-full">
                    Active
                  </div>
                ) : (
                  <div className="px-2 py-1 text-center text-white bg-red-500 rounded-full">
                    Inactive
                  </div>
                )}
              </TableCell>
              <TableCell className="flex justify-end gap-2 text-sm lg:text-lg">
                {" "}
                <div
                  className="cursor-pointer hover:text-blue-500 hover:scale-125"
                  onClick={() => {
                    prepare_updating_user(user.id);
                  }}
                >
                  <HiPencilSquare />
                </div>
                <div
                  className="cursor-pointer hover:text-red-500 hover:scale-125"
                  onClick={() => deleteUser(user.id)}
                >
                  <HiArchiveBoxXMark />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* <Button onClick={user_slugs} className="bg-blue-500">View my role slugs in console</Button> */}
    </div>
  );
}
