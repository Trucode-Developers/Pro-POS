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
import { BranchSchema, TypeBranchSchema } from "@/lib/types/users";
import { toast } from "sonner";

export default function BranchCrud({
  branch,
  get_all_branches,
  active_code,
}: any) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TypeBranchSchema>({
    resolver: zodResolver(BranchSchema),
    defaultValues: branch,
  });

  useEffect(() => {
    reset(branch); // Update the form values when `user` changes
  }, [branch, reset]);

  const onSubmit = async (data: TypeBranchSchema) => {
    let branch = data;
    // console.log(branch);
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
      // console.log(error);
      // toast.error(error);
      toast.error(
        "Failed, check your inputs  ensure you have a unique branch code then try again"
      );
    }
  };

  const updateBranch = async (data: TypeBranchSchema) => {
    let branch = data;
    let code = active_code; //as rust expects an object with a key of code
    // console.log(code, branch);
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
    <CustomSheet title="Branches">
      <div className="p-4 m-auto max-w-7xl ">
        <div>
          <h1 className="text-2xl font-bold text-center">
            {active_code ? "Update Branch" : "Create New Branch"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 "> */}
          <div className="grid gap-4 py-5">
            {!active_code && (
              <CustomInput
                label="Branch Code"
                type="text"
                placeholder="e.g: Br01"
                innerClass=""
                outerClass=""
                register={register("code")}
                error={errors.code}
              />
            )}

            <CustomInput
              label="Name"
              type="text"
              placeholder="branch name"
              innerClass=""
              outerClass=""
              register={register("name")}
              error={errors.name}
            />

            <CustomInput
              label="Address/Location"
              type="string"
              placeholder="branch address"
              innerClass=""
              outerClass=""
              register={register("address")}
              error={errors.address}
            />
            <CustomInput
              label="Phone"
              type="string"
              placeholder="+254 ... ... .."
              innerClass=""
              outerClass=""
              register={register("phone")}
              error={errors.phone}
            />
            <CustomInput
              label="Branch Email"
              type="email"
              placeholder="branch email"
              innerClass=""
              outerClass=""
              register={register("email")}
              error={errors.email}
            />
            <div>
              <label htmlFor="description">Description</label>
              <textarea
                className="w-full h-32 px-3 py-2 text-base text-gray-700 placeholder-gray-600 border border-b-2 border-gray-400 rounded focus:border-blue-600 focus:outline-none"
                placeholder="more about the branch "
                {...register("description")}
              ></textarea>
            </div>
            <div>
              <label htmlFor="status">Status</label>
              <select {...register("status")} className="w-full">
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
              {errors.status && (
                <span className="text-red-500"> {errors.status.message} </span>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              disabled={isSubmitting}
              className="px-10 py-5 text-white duration-500 ease-in-out bg-blue-500 rounded-lg hover:bg-blue-800 hover:shadow-lg "
            >
              {isSubmitting ? (
                <Loading color="#ffffff" width="40" />
              ) : active_code ? (
                "Update Branch"
              ) : (
                "Create New Branch"
              )}
            </button>
          </div>
        </form>
      </div>
    </CustomSheet>
  );
}
