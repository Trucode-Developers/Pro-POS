"use client";
import CustomSheet from "@/components/customSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { closePopUp, openPopUp, useThemeStore } from "@/lib/store";
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
    <CustomSheet>
      <div>
        <form className="flex flex-col gap-4">
          <label htmlFor="name">Upload images</label>
          <div className="relative">
            <label
              title="Click to upload"
              htmlFor="button2"
              className="flex items-center gap-4 px-6 py-4 cursor-pointer before:border-gray-400/60 hover:before:border-gray-300 group before:bg-gray-100 before:absolute before:inset-0 before:rounded-3xl before:border before:border-dashed before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95"
            >
              <div className="relative w-max">
                <img
                  className="w-12"
                  src="https://www.svgrepo.com/show/485545/upload-cicle.svg"
                  alt="file upload icon"
                  width="512"
                  height="512"
                />
              </div>
              <div className="relative">
                <span className="relative block text-base font-semibold text-blue-900 group-hover:text-blue-500">
                  Upload a file
                </span>
                <span className="mt-0.5 block text-sm text-gray-500">
                  Max 2 MB
                </span>
              </div>
            </label>
            <input hidden type="file" name="button2" id="button2" />
          </div>
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
