"use client";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";
import { openPopUp, closePopUp } from "@/lib/store";
import { VscKey, VscListUnordered, VscTable } from "react-icons/vsc";
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
import { TypeRoleSchema } from "@/lib/types/users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RolesCrud from "./rolesCrud";

const defaultBranch = {
  id: 0,
  total_permissions: 0,
  code: "",
  name: "",
};

export default function Page() {
  const [roles, setRoles] = useState({} as any);
  const [permissions, setPermissions] = useState({});
  const [allocatedPermissions, setAllocatedPermissions] = useState([
    1, 2, 4,
  ] as any);
  const [role, setRole] = useState<TypeRoleSchema>(defaultBranch);
  const [showModal, setShowModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [active_id, setActiveId] = useState(0);
  const [search_value, setSearchValue] = useState("");

    
  useEffect(() => {
    get_all_roles();
    get_all_permissions();
    // get_permission_slugs();
  }, []);

  const get_all_roles = async () => {
    closePopUp();
    await invoke("get_all_roles")
      .then((response: any) => {
        if (response.status === 200) {
          setRoles(response.data);
          // console.log(response.data);
        }
      })
      .catch(console.error);
  };
  const get_all_permissions = async () => {
    await invoke("get_all_permissions")
      .then((response: any) => {
        setPermissions(response);
        // console.log(response);
      })
      .catch(console.error);
  };
  const get_allocated_permissions = async (roleId: number) => {
    await invoke("get_role_permissions", { roleId })
      .then((response: any) => {
        setAllocatedPermissions(response.data);
        // console.log(response);
      })
      .catch(console.error);
  };

  const prepare_updating_role = async (id: number) => {
    setActiveId(id);
    get_allocated_permissions(id);
    const role = roles.filter((role: any) => role.id === id)[0];
    setRole(role);
    openPopUp();
  };

  const initiateDeleteRole = async (id: number) => {
    setActiveId(id);
    //set roleName to the name of the role
    const role = roles.filter((role: any) => role.id === id)[0];
    // console.log(role);
    setRoleName(role.name);
    setShowModal(true);
  };
  const deleteRole = async () => {
    let id = active_id;
    await invoke("delete_role", { id })
      .then((response) => {
        setShowModal(false), get_all_roles();
        toast.success("Role deleted successfully");
      })
      .catch(console.error);
  };

  const reset_roles = async () => {
    setRole(defaultBranch);
    setActiveId(0);
  };

  const newRole = async () => {
    openPopUp();
    reset_roles();
  };

  return (
    <div className="w-full h-full ">
      <ToastContainer />
      <div className="flex items-center gap-2 pt-5 text-2xl font-bold lg:text-4xl">
        <div>
          <VscKey />
        </div>
        <div>System Roles</div>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          {/* <DialogTrigger>Open</DialogTrigger> */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want delete role: {roleName}?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone.{" "}
                <span className="px-2 py-1 my-2 bg-gray-300 rounded">
                  {roleName}
                </span>{" "}
                will be deleted permanently. To proceed, click the delete button
                below.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-red-500 rounded"
                onClick={() => deleteRole()}
              >
                Delete permanently
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <p className="py-2 lg:w-[60vw]">
        This are the roles that indicate which permissions a user has. You can
        add, update or delete a role. A role can be assigned to a user to
        determine what they can do in the system.{" "}
      </p>
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
            <Button className="bg-green-500 hover:bg-black" onClick={newRole}>
              Add Role
            </Button>
          </div>
          <RolesCrud
            permissions={permissions}
            role={role}
            get_all_roles={get_all_roles}
            active_id={active_id}
            allocatedPermissions={allocatedPermissions}
            setAllocatedPermissions={setAllocatedPermissions}
          />
        </div>
      </div>

      <Table>
        <TableCaption className="py-4 font-bold border-t border-blue-800 text-start">
          You have a total of {Object.values(roles).length} roles. Active roles
          are {Object.values(roles).filter((role: any) => role.status).length}{" "}
          while inactive roles are{" "}
          {Object.values(roles).filter((role: any) => !role.status).length}
        </TableCaption>
        <TableHeader>
          <TableRow className="text-white uppercase bg-gray-500 hover:bg-gray-500">
            <TableHead className="text-white ">Code</TableHead>
            <TableHead className="text-white ">Role Name</TableHead>
            <TableHead className="text-white ">Permissions</TableHead>
            <TableHead className="text-right text-white ">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(roles).map((role: any, index: number) => (
            <TableRow
              key={index + 1}
              className="py-0 my-0 border-gray-400 border-opacity-50 border-y"
            >
              <TableCell className="font-medium capitalize">
                {role.code} {role.id}
              </TableCell>
              <TableCell className="font-medium capitalize">
                {role.name}
              </TableCell>
              <TableCell className="lowercase">
                <a
                  href="#"
                  onClick={() => {
                    prepare_updating_role(role.id);
                  }}
                  className="text-blue-500"
                >
                  {role.total_permissions} Permissions
                </a>
              </TableCell>
              <TableCell className="flex justify-end gap-2 text-sm lg:text-lg">
                <div
                  className="cursor-pointer hover:text-blue-500 hover:scale-125"
                  onClick={() => {
                    prepare_updating_role(role.id);
                  }}
                >
                  <HiPencilSquare />
                </div>
                <div
                  className="cursor-pointer hover:text-red-500 hover:scale-125"
                  onClick={() => initiateDeleteRole(role.id)}
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
