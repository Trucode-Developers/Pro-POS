"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import CustomInput from "@/components/custom/input";
import CustomSheet from "@/components/customSheet";
import { closePopUp } from "@/lib/store";
import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { RoleSchema, TypeRoleSchema } from "@/lib/types/users";
import { toast } from "sonner";


export default function RolesCrud({
  permissions,
  role,
  get_all_roles,
  active_id,
  allocatedPermissions,
  setAllocatedPermissions,
}: any) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TypeRoleSchema>({
    resolver: zodResolver(RoleSchema),
    defaultValues: role,
  });

  useEffect(() => {
    reset(role); // Update the form values when `role` changes
  }, [role, reset]);

  //create a function that when checbox is checked, it adds the permission to the allocatedPermissions array if unchecked, it removes it
const handlePermission = (e: any) => {
  let permission = parseInt(e.target.value); // Convert to integer
  if (e.target.checked) {
    setAllocatedPermissions([...allocatedPermissions, permission]);
  } else {
    setAllocatedPermissions(
      allocatedPermissions.filter((p: any) => p !== permission) // Filter using the integer value
    );
  }
};


  const onSubmit = async (data: TypeRoleSchema) => {
    let role = data;

    try {
      if (active_id) {
        updateRole(data);
        return;
      }
      const response: any = await invoke("create_role", { role, allocatedPermissions});
      if (response.status === 200) {
        reset();
        get_all_roles();
        toast.success("Role created successfully");
      } else {
        toast.error("Role creation failed, check your inputs and try again");
      }
    } catch (error: any) {
      toast.error(error.message);
      toast.error(
        "Failed, check your inputs  ensure you have a unique role code then try again"
      );
    }
  };

  const updateRole = async (data: TypeRoleSchema) => {
    let role = data;
    let id = active_id; //as rust expects an object with a key of code
    // console.log(id, role);
    await invoke("update_role", { id,allocatedPermissions, role })
      .then((response: any) => {
        if (response.status === 200) {
          toast.success("Role updated successfully");
        } else {
          toast.error("Role update failed, check your inputs and try again");
        }
        get_all_roles();
      })
      .catch(console.error);
    closePopUp();
  };

  return (
    <CustomSheet title="Roles">
      <div className="p-4 m-auto max-w-7xl ">
        <div>
          <h1 className="text-2xl font-bold text-center">
            {active_id ? "Update Role" : "Create New Role"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-5">
            <CustomInput
              label="Role code"
              type="text"
              placeholder="Enter role code"
              innerClass=""
              outerClass=""
              register={register("code")}
              error={errors.code}
              //if active_id is set, then disable the input field
              // disabled={active_id} //as am using id as the unique identifier
            />
            <CustomInput
              label="Role name"
              type="text"
              placeholder="Enter role name"
              innerClass=""
              outerClass=""
              register={register("name")}
              error={errors.name}
            />

            <div className={`${active_id ? "hidden" : ""} text-center`}>
              Create a new role and save , then edit to add permissions!
            </div>

            <div className={`${!active_id ? "hidden" : ""}`}>
              <div>
                <h2 className="py-4 text-lg font-bold text-center lg:text-xl">
                  Role Permissions
                  {/* {allocatedPermissions.length} */}
                </h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {Object.values(permissions).map(
                  (permission: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center gap-1 text-xl cursor-pointer px-2 ${
                        allocatedPermissions.includes(permission.id)
                          ? "bg-green-500 bg-opacity-30  rounded-lg"
                          : ""
                      }`}
                    >
                      <div>
                        <span>{permission.id}.</span>
                      </div>
                      <input
                        id={permission.slug}
                        type="checkbox"
                        className="w-5 h-5 border-black"
                        value={permission.id}
                        onChange={handlePermission}
                        checked={allocatedPermissions.includes(permission.id)}
                      />
                      <label
                        className="cursor-pointer "
                        htmlFor={permission.slug}
                      >
                        {permission.name}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              disabled={isSubmitting}
              className="px-10 py-5 text-white duration-500 ease-in-out bg-blue-500 rounded-lg hover:bg-blue-800 hover:shadow-lg "
            >
              {isSubmitting ? (
                <Loading color="#ffffff" width="40" />
              ) : active_id ? (
                "Update Role"
              ) : (
                "Create New Role"
              )}
            </button>
          </div>
        </form>
      </div>
    </CustomSheet>
  );
}
