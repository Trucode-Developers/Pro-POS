"use client";
import { cn } from "@/lib/utils";
import CustomInput from "@/components/custom/input";
import CustomSheet from "@/components/customSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { closePopUp, openPopUp, useThemeStore } from "@/lib/store";
import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect } from "react";
import CustomSelect from "@/components/custom/select";

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

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  return (
    <CustomSheet>
      <div className="max-w-4xl p-4 m-auto ">
        <form className="grid gap-4 md:grid-cols-1 ">
          <div className="col-span-1">
            <div>
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
                <input hidden type="file" name="name" id="button2" />
              </div>
            </div>
          </div>

          <div className="flex flex-col col-span-2 gap-4 ">
            <CustomInput
              label="Name"
              type="text"
              placeholder="user name"
              value={user.name}
              className=""
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, name: e.target.value })
              }
            />
            <CustomInput
              label="Email"
              type="email"
              placeholder="email"
              value={user.email}
              className=""
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, email: e.target.value })
              }
            />
            <CustomInput
              label="Password"
              type="password"
              placeholder="password"
              value={user.password}
              className=""
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, password: e.target.value })
              }
            />

            {/* <CustomSelect
              label="Role"
              data={options}
              className="py-4 bg-transparent"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, role: e.target.value })
              }
            /> */}

            <div>
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
            </div>

            <div>
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
            </div>
          </div>
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

          {/* <Button className="bg-blue-500 hover:bg-black" onClick={reset_users}>
            Reset users
          </Button> */}
        </div>
      </div>
    </CustomSheet>
  );
}
