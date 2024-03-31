"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import CustomInput from "@/components/custom/input";
import CustomSheet from "@/components/customSheet";
import { closePopUp } from "@/lib/store";
import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect } from "react";
import Loading from "@/components/loading";
import { RoleSchema, TypeRoleSchema } from "@/lib/types/users";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RolesCrud({
  branch,
  get_all_branches,
  active_code,
}: any) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TypeRoleSchema>({
    resolver: zodResolver(RoleSchema),
    defaultValues: branch,
  });

  useEffect(() => {
    reset(branch); // Update the form values when `user` changes
  }, [branch, reset]);

  const onSubmit = async (data: TypeRoleSchema) => {
    let branch = data;
    try {
      if (active_code) {
        updateBranch(data);
        return;
      }
      const response: any = await invoke("create_branch", { branch });
      if (response.status === 200) {
        reset();
        get_all_branches();
        toast.success("Branch created successfully");
      } else {
        toast.error("Branch creation failed, check your inputs and try again");
      }
    } catch (error: any) {
      // toast.error(error.message);
      toast.error(
        "Failed, check your inputs  ensure you have a unique branch code then try again"
      );
    }
  };

  const updateBranch = async (data: TypeRoleSchema) => {
    let branch = data;
    let code = active_code; //as rust expects an object with a key of code
    console.log(code, branch);
    await invoke("update_branch", { code, branch })
      .then((response: any) => {
        if (response.status === 200) {
          toast.success("Branch updated successfully");
        } else {
          toast.error("Branch update failed, check your inputs and try again");
        }
        get_all_branches();
      })
      .catch(console.error);
    closePopUp();
  };

  return (
    <CustomSheet title="Roles">
      <div className="p-4 m-auto max-w-7xl ">
        <div>
          <h1 className="text-2xl font-bold text-center">
            {active_code ? "Update Role" : "Create New Role"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 "> */}
          <div className="grid gap-4 py-5">
           
              <CustomInput
                label="Role code"
                type="text"
                placeholder="Enter role code"
                innerClass=""
                outerClass=""
                register={register("code")}
                error={errors.code}
              />
              <CustomInput
                label="Role name"
                type="text"
                placeholder="Enter role name"
                innerClass=""
                outerClass=""
                register={register("name")}
                error={errors.code}
              />
          
          </div>
          <div className="flex justify-center">
            <button
              disabled={isSubmitting}
              className="px-10 py-5 text-white duration-500 ease-in-out bg-blue-500 rounded-lg hover:bg-blue-800 hover:shadow-lg "
            >
              {isSubmitting ? (
                <Loading color="#ffffff" width="40" />
              ) : active_code ? (
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
