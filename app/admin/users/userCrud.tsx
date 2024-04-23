"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeUserSchema, UserSchema } from "@/lib/types/users";

import { cn } from "@/lib/utils";
import CustomInput from "@/components/custom/input";
import CustomSheet from "@/components/customSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { closePopUp, openPopUp, useThemeStore } from "@/lib/store";
import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect } from "react";
import Loading from "@/components/loading";
import { toast } from "sonner";
import Info from "@/components/info";
import Error from "@/components/error";

export default function UserCrud({roles,allocatedRoles,setAllocatedRoles, user, get_all_users, active_id }: any) {
  const token = useThemeStore((state) => state.token);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TypeUserSchema>({
    resolver: zodResolver(UserSchema),
    defaultValues: user,
  });

  useEffect(() => {
    reset(user); // Update the form values when `user` changes
  }, [user, reset]);

  const onSubmit = async (data: TypeUserSchema) => {
    if (active_id) {
      updateUser(data);
      return;
    }
    let user = data; //as rust expects an object with a key of user
    try {
      const response:any = await invoke("create", {token, user });
      if (response.status === 200) {
        toast.success("User created successfully");
      } else {
        console.error(response);
      }
      reset();
      get_all_users();
    } catch (error:any) {
      // toast.error("User creation failed, check your inputs and try again");
       toast.error(
         <Error
           title="Error!!!"
           message={error.message}
         />,
         { duration: 10000, position: "top-right" }
       );
      // console.error(error.message);
    }
  };



  const updateUser = async (data: TypeUserSchema) => {
    let user = data;
    let id = parseInt(active_id);
    
    await invoke("update_user", { id, allocatedRoles, user })
      .then((response: any) => {
        if (response.status === 200) {
          toast.success("User updated successfully");
        } else {
          toast.error("User update failed, check your inputs and try again");
        }
        get_all_users();
      })
      .catch(console.error);
    closePopUp();
  };

  const handleAllocation = (e: any) => {
    let role = parseInt(e.target.value); // Convert to integer
    if (e.target.checked) {
      setAllocatedRoles([...allocatedRoles, role]);
    } else {
      setAllocatedRoles(
        allocatedRoles.filter((p: any) => p !== role) // Filter using the integer value
      );
    }
  };

  return (
    <CustomSheet title="Staff">
      <div className="p-4 m-auto max-w-7xl ">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 "> */}
          <div className="grid gap-4 ">
            <div className="col-span-1">
              <div>
                <label htmlFor="name">Upload Profile</label>
                <div className="relative">
                  <label
                    title="Click to upload"
                    htmlFor="button2"
                    className="flex items-center gap-4 px-6 py-4 cursor-pointer before:border-gray-400/60 hover:before:border-gray-300 group before:bg-gray-100 before:absolute before:inset-0 before:rounded-3xl before:border before:border-dashed before:transition-transform before:duration-300 hover:before:scale-100 active:duration-75 active:before:scale-95"
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
                        Max 5 MB
                      </span>
                    </div>
                  </label>
                  <input hidden type="file" name="name" id="button2" />
                </div>
              </div>
            </div>
            <CustomInput
              label="Name"
              type="text"
              placeholder="user name"
              innerClass=""
              outerClass=""
              // {...register("email")}  //has to be spread to the input element
              register={register("name")}
              error={errors.name}
            />
            <CustomInput
              label="Staff Number"
              type="text"
              placeholder="staff001"
              innerClass=""
              outerClass=""
              register={register("staff_number")}
              error={errors.staff_number}
            />

            <CustomInput
              label="Email"
              type="email"
              placeholder="user email"
              innerClass=""
              outerClass=""
              register={register("email")}
              error={errors.email}
            />
            <CustomInput
              label="Password"
              type="password"
              placeholder="password"
              innerClass=""
              outerClass=""
              register={register("password")}
              error={errors.password}
            />
            <CustomInput
              label="Confirm Password"
              type="password"
              placeholder="confirm password"
              innerClass=""
              outerClass=""
              register={register("confirmPassword")}
              error={errors.confirmPassword}
            />
            <select
              {...register("role", { valueAsNumber: true })}
              className="w-full p-2 bg-transparent"
            >
              <option value={1}>Admin</option>
              <option value={2}>Staff</option>
            </select>
            {errors.role && (
              <span className="text-red-500 animate-pulse">
                {" "}
                {errors.role.message}{" "}
              </span>
            )}

            <div className="flex items-center gap-2 py-2 pb-5 ">
              <input
                id="activeNess"
                type="checkbox"
                {...register("is_active")}
                className="text-2xl"
              />
              <label htmlFor="activeNess">Is user active</label>
              {errors.is_active && (
                <span className="text-red-500 animate-pulse">
                  {" "}
                  {errors.is_active.message}{" "}
                </span>
              )}
            </div>
          </div>

          <div className={`${!active_id ? "hidden" : ""} pb-5`}>
            <div>
              <h2 className="py-4 text-lg font-bold text-center lg:text-xl">
                Role Permissions
                {/* {allocatedPermissions.length} */}
              </h2>
            </div>
            <div className="flex flex-col flex-wrap items-start gap-4">
              {Object.values(roles).map((role: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-center gap-1 text-xl cursor-pointer px-2 ${
                    allocatedRoles.includes(role.id)
                      ? "bg-green-500 bg-opacity-30  rounded-lg"
                      : ""
                  }`}
                >
                  {/* <div>
                    <span>{role.id}.</span>
                  </div> */}
                  <input
                    id={role.id}
                    type="checkbox"
                    className="w-5 h-5 border-black"
                    value={role.id}
                    onChange={handleAllocation}
                    checked={allocatedRoles.includes(role.id)}
                  />
                  <label className="cursor-pointer " htmlFor={role.id}>
                    {role.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-black"
            >
              {isSubmitting ? (
                <Loading color="#ffffff" width="50" />
              ) : active_id ? (
                "Update  User"
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </div>
    </CustomSheet>
  );
}
