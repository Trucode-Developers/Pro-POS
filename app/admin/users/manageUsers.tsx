"use client";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function UserManagement({
  users,
  user,
  setUser,
  get_all_users,
  active_id,
}: any) {
  // const [active_id, setActive_id] = useState("");
  const id = 2;

  // const prepare_updating_user = async (email: string) => {
  //   setActive_id(email);
  //   //filter user by id and assign to user
  // };
  useEffect(() => {
    const user = users.filter((user: any) => user.email === active_id)[0];
    setUser(user);
  }, [active_id]);

  const updateUser = async () => {
    console.log(id);
    console.log(user);
    await invoke("update", { id, user })
      .then((response) => get_all_users())
      .catch(console.error);
  };

  const createUser = async () => {
    await invoke("create", { user })
      .then((response) => get_all_users())
      .catch(console.error);
  };

  const reset_users = async () => {
    setUser({
      name: "",
      role: 1,
      email: "",
      password: "",
      is_active: true,
    });
    // setActive_id("");
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <form className="flex flex-col gap-4">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            name="name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            id="name"
            placeholder="John Doe"
            className="border-2 border-gray-500"
          />
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="email"
            className="border-2 border-gray-500"
          />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            id="password"
            placeholder="password"
            className="border-2 border-gray-500"
          />
          <Select>
          {/* <Select value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}> */}
            <SelectTrigger className="w-full">
              <SelectValue placeholder=" Select the role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Role</SelectLabel>
                <SelectItem value="1">Admin</SelectItem>
                <SelectItem value="2">USer</SelectItem>
                <SelectItem value="3">User</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Is_Active</SelectLabel>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-4 flex-wrap justify-evenly p-5">
            {/* <Button className="bg-blue-500 hover:bg-black" >Click me</Button> */}
            {active_id !== "" ? (
              <Button
                className="bg-blue-500 hover:bg-black"
                onClick={updateUser}
              >
                Update User
              </Button>
            ) : (
              <Button
                className="bg-green-500 hover:bg-black"
                onClick={createUser}
              >
                Create User
              </Button>
            )}

            <Button
              className="bg-blue-500 hover:bg-black"
              onClick={reset_users}
            >
              Reset users
            </Button>
          </div>
        </form>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
