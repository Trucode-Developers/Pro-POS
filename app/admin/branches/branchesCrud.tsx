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
import CustomTextarea from "@/components/custom/textarea";
import CustomSelect from "@/components/custom/select";
import CustomRadioGroup from "@/components/custom/radio";
import { CustomSwitch } from "@/components/custom/switch";
import Success from "@/components/success";
import Error from "@/components/error";

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

  // console.log(branch);

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
        toast.success(
          <Success title="Success!" message="Branch created successfully" />,
          { duration: 5000, position: "top-right" }
        );
      } else {
        toast.error(
          <Error
            title="Error!!!"
            message="Branch creation failed, check your inputs and try again"
          />,
          { duration: 10000, position: "top-right" }
        );
      }
    } catch (error: any) {
      // console.log(error);
      // toast.error(error);
      toast.error(
        <Error
          title="Error!!!"
          message="Branch creation failed, check your inputs and try again"
        />,
        { duration: 10000, position: "top-right" }
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
          // toast.success("Branch updated successfully");
          toast.success(
            <Success title="Success!" message="Branch updated successfully" />,
            { duration: 5000, position: "top-right" }
          );
        } else {
          toast.error(
            <Error
              title="Error!!!"
              message="Branch update failed, check your inputs and try again!"
            />,
            { duration: 10000, position: "top-right" }
          );
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
          <div className="flex flex-wrap items-end justify-center gap-4 py-5 space-y-2">
            {!active_code && (
              <CustomInput
                isRequired
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
              isRequired
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
              isRequired
              label="Phone"
              type="string"
              placeholder="+254 ... ... .."
              innerClass=""
              outerClass=""
              register={register("phone")}
              error={errors.phone}
            />
            <CustomInput
              isRequired
              label="Branch Email"
              type="email"
              placeholder="branch email"
              innerClass=""
              outerClass=""
              register={register("email")}
              error={errors.email}
            />
            <CustomTextarea
              // isRequired
              label="Description"
              placeholder="more about the branch "
              innerClass=""
              outerClass=""
              register={register("description")}
              error={errors.description}
            />
            {/* <CustomSelect
              label="Status"
              register={register("status")}
              options={[
                { value: "1", label: "Active" },
                { value: "0", label: "Inactive" },
              ]}
              error={errors.status}
            /> */}
            {/* <CustomRadioGroup
              label="Status"
              isRequired
              placeholder="more about the branch "
              innerClass=""
              outerClass=""
              options={[
                { value: "1", label: "Active" },
                { value: "0", label: "Inactive" },
              ]}
              register={register("status")}
              error={errors.status}
            /> */}

            <CustomSwitch
              isRequired
              label="Status"
              register={register("status")}
              error={errors.status}
            />

            {/* <div className="w-[400px]">
              <label htmlFor="status">Status</label>
              <select {...register("status")} className="w-full">
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
              {errors.status && (
                <span className="text-red-500"> {errors.status.message} </span>
              )}
            </div> */}
          </div>
          <div className="flex justify-center">
            <button
              className="px-10 py-5 text-white duration-500 ease-in-out bg-blue-500 rounded-lg hover:bg-yellow-500 hover:shadow-lg "
              disabled={isSubmitting}
            >
              {/* {isSubmitting ? <Loading color="#ffffff" width="30" /> : "Login"} */}
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
