"use client";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";
import { openPopUp, closePopUp } from "@/lib/store";
import { VscCircuitBoard, VscListUnordered, VscOrganization, VscTable } from "react-icons/vsc";
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
import BranchCrud from "./branchesCrud";
import { TypeBranchSchema } from "@/lib/types/users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const defaultBranch = {
  code: "",
  name: "",
  address: "",
  phone: "",
  email: "",
  status: true,
  description: "",
};

export default function Page() {
  const [branches, setBranches] = useState({} as any);
  const [branch, setBranch] = useState<TypeBranchSchema>(defaultBranch);
  const [showModal, setShowModal] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [active_code, setActiveCode] = useState("");
  const [search_value, setSearchValue] = useState("");

  useEffect(() => {
    get_all_branches();
  }, []);

  const get_all_branches = async () => {
    closePopUp();
    await invoke("get_all_branches")
      .then((response: any) => {
        if (response.status === 200) {
          setBranches(response.data);
          // console.log(response.data);
        }
        //add a toast here
      })
      .catch(console.error);
  };

  const prepare_updating_branch = async (code: string) => {
    setActiveCode(code);
    const branch = branches.filter((branch: any) => branch.code === code)[0];
    setBranch(branch);
    openPopUp();
    // console.log(branch, code);
  };

  const initiateDeleteBranch = async (code: string) => {
    setActiveCode(code);
    //set branchName to the name of the branch
    const branch = branches.filter((branch: any) => branch.code === code)[0];
    setBranchName(branch.name);
    setShowModal(true);
  };
  const deleteBranch = async () => {
    let code = active_code;
    await invoke("delete_branch", { code })
      .then((response) => {
        setShowModal(false), get_all_branches();
        toast.success("Branch deleted successfully");
      })
      .catch(console.error);
  };

  const reset_branches = async () => {
    setBranch(defaultBranch);
    setActiveCode("");
  };

  const newBranch = async () => {
    openPopUp();
    reset_branches();
  };

  return (
    <div className="w-full h-full ">
      <div className="flex items-center gap-2 pt-5 text-2xl font-bold lg:text-4xl">
        <div>
          <VscCircuitBoard />
        </div>
        <div>Branches</div>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          {/* <DialogTrigger>Open</DialogTrigger> */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want delete branch: {branchName}?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone.{" "}
                <span className="px-2 py-1 my-2 bg-gray-300 rounded">
                  {branchName}
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
                onClick={() => deleteBranch()}
              >
                Delete permanently
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <p className="py-2 ">
        Manage branches before adding any other details inthe system. All
        products, staffs, and reports are attached to a branch.{" "}
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
            <Button className="bg-green-500 hover:bg-black" onClick={newBranch}>
              Add Branch
            </Button>
          </div>
          <BranchCrud
            branch={branch}
            get_all_branches={get_all_branches}
            active_code={active_code}
          />
        </div>
      </div>

      <Table>
        <TableCaption className="py-4 font-bold border-t border-blue-800 text-start">
          You have a total of {Object.values(branches).length} branches. Active
          branches are{" "}
          {
            Object.values(branches).filter((branch: any) => branch.status)
              .length
          }{" "}
          while inactive branches are{" "}
          {
            Object.values(branches).filter((branch: any) => !branch.status)
              .length
          }
        </TableCaption>
        <TableHeader>
          <TableRow className="text-white uppercase bg-gray-500 hover:bg-gray-500">
            <TableHead className="text-white ">Code</TableHead>
            <TableHead className="text-white ">Branch Name</TableHead>
            <TableHead className="text-white ">Address</TableHead>
            <TableHead className="text-white w-[100px]">Phone</TableHead>
            <TableHead className="text-white w-[100px]">Email</TableHead>
            <TableHead className="text-white ">Description</TableHead>
            <TableHead className="text-white w-[100px]">Status</TableHead>
            <TableHead className="text-right text-white ">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(branches).map((branch: any, index: number) => (
            <TableRow
              key={index + 1}
              className="py-0 my-0 border-gray-400 border-opacity-50 border-y"
            >
              <TableCell className="font-medium capitalize">
                {branch.code}
              </TableCell>
              <TableCell className="font-medium capitalize">
                {branch.name}
              </TableCell>
              <TableCell className="lowercase">{branch.address}</TableCell>
              <TableCell className="w-{100px]">{branch.phone}</TableCell>
              <TableCell className="w-{100px]">{branch.email}</TableCell>
              <TableCell className="">{branch.description}</TableCell>
              <TableCell className="w-{100px]">
                {branch.status ? (
                  <div className="px-2 py-1 text-center text-white bg-green-500 rounded">
                    Active
                  </div>
                ) : (
                  <div className="px-2 py-1 text-center text-white bg-red-500 rounded">
                    Inactive
                  </div>
                )}
              </TableCell>
              <TableCell className="flex justify-end gap-2 text-sm lg:text-lg">
                <div
                  className="cursor-pointer hover:text-blue-500 hover:scale-125"
                  onClick={() => {
                    prepare_updating_branch(branch.code);
                  }}
                >
                  <HiPencilSquare />
                </div>
                <div
                  className="cursor-pointer hover:text-red-500 hover:scale-125"
                  onClick={() => initiateDeleteBranch(branch.code)}
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
