import React from "react";
import { HiOutlineExclamationTriangle, HiOutlineXMark } from "react-icons/hi2";
import { toast } from "sonner";

interface ErrorProps {
  title: string;
  message: string;
}

export default function Error({ title, message }: ErrorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center flex-1 gap-2 text-xl">
          <HiOutlineExclamationTriangle />
          <div>
            {title}
          </div>
        </div>
        <div onClick={() => toast.dismiss()}>
          <HiOutlineXMark className="w-6 h-6 " />
        </div>
      </div>
      <div className="py-2 text-base">
        {message}
      </div>
    </div>
  );
}
