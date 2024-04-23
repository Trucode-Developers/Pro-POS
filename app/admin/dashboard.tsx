"use client";
import Error from "@/components/error";
import Info from "@/components/info";
import Success from "@/components/success";
import { Button } from "@/components/ui/button";
import { openPopUp } from "@/lib/store";
import React from "react";
import {
  HiOutlineCheckBadge,
  HiOutlineExclamationTriangle,
  HiOutlineXMark,
} from "react-icons/hi2";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { toast } from "sonner";

export default function Dashboard() {
  const showSuccess = () =>
    toast.success(
      <Success
        title="Success!"
        message="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda ut nesciunt alias quibusdam. Vitae maiores error corrupti recusandae pariatur veniam aut omnis, consequuntur adipisci facere, quam, placeat ut non nam."
      />,
      { duration: 10000, position: "top-right" }
    );

  const showError = () =>
    toast.error(
      <Error
        title="Error!!!"
        message="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda ut nesciunt alias quibusdam. Vitae maiores error corrupti recusandae pariatur veniam aut omnis, consequuntur adipisci facere, quam, placeat ut non nam."
      />,
      { duration: 10000, position: "top-right" }
    );

  const showInfo = () =>
    toast.info(
      <Info
        title="Notification"
        message="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda ut nesciunt alias quibusdam. Vitae maiores error corrupti recusandae pariatur veniam aut omnis, consequuntur adipisci facere, quam, placeat ut non nam."
      />,
      { duration: 10000, position: "top-right" }
    );

  return (
    <div className="text-2xl">
      <div>add more dashboard components</div>
      {/* <Toaster richColors /> */}
      <button
        onClick={showError}
        className="px-4 py-2 text-2xl text-white bg-red-500 bg-opacity-50 border rounded-full"
      >
        error notification
      </button>
      <button
        onClick={showSuccess}
        className="px-4 py-2 text-2xl text-white bg-green-500 bg-opacity-50 border rounded-full"
      >
        success notification
      </button>
      <button
        onClick={showInfo}
        className="px-4 py-2 text-2xl text-white bg-blue-500 bg-opacity-50 border rounded-full"
      >
        info notification
      </button>
    </div>
  );
}
