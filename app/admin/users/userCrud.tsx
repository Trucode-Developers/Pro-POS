'use client';
import CustomSheet from "@/components/customSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { closePopUp,openPopUp, useThemeStore } from "@/lib/store";
import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect } from "react";

export default function UserCrud({
  user,
  setUser,
  reset_users,
  get_all_users,
  active_id,
}: any) {
  const createUser = async () => {
    console.log(user);
    await invoke("create", { user })
      .then((response) => get_all_users())
      .catch(console.error);
  };

  // const idd = 2;
  const updateUser = async () => {
    await invoke("update", { active_id, user })
      .then((response) => get_all_users())
      .catch(console.error);
    closePopUp();
  };


  return (
    <CustomSheet title="New Staff">
      <div>
        <form className="flex flex-col gap-4">
          <label htmlFor="name">Name</label>
          <Input
            type="text"
            name="name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            id="name"
            placeholder="John Doe"
            className="border-2 border-gray-500"
          />
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            name="email"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="email"
            className="border-2 border-gray-500"
          />
          <label htmlFor="password">Password</label>
          <Input
            type="password"
            name="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            id="password"
            placeholder="password"
            className="border-2 border-gray-500"
          />
          <label htmlFor="role">Role</label>
          <select
            name="role"
            id="role"
            value={user.role}
            className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            // onChange={(e) => setUser({ ...user, role: e.target.value })}
          >
            <option value="1">Admin</option>
            <option value="2">User</option>
          </select>
          <label htmlFor="is_active">Active</label>
          <select
            name="is_active"
            id="is_active"
            className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) =>
              setUser({ ...user, is_active: e.target.value === "1" })
            }
            value={user.is_active ? "1" : "0"}
          >
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </form>
        <div className="flex flex-wrap gap-4 p-5 justify-evenly">
          {/* <Button className="bg-blue-500 hover:bg-black" >Click me</Button> */}
          {active_id !== "" ? (
            <Button className="bg-blue-500 hover:bg-black" onClick={updateUser}>
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

          <Button className="bg-blue-500 hover:bg-black" onClick={reset_users}>
            Reset users
          </Button>
          <Button className="bg-blue-500 hover:bg-black" onClick={closePopUp}>
            Close Modal
          </Button>
        </div>
      </div>
    </CustomSheet>
  );
}
