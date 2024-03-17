import React from "react";
import { HiBars3BottomRight } from "react-icons/hi2";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function PaymentsToggler({
    text1,
    text2,
  setIsPaymentLeftAligned,
  isPaymentLeftAligned,
}: any) {
  return (
        <Popover>
          <PopoverTrigger asChild>
            <Button className="px-2 py-1 text-xl text-black bg-transparent ">
              <HiBars3BottomRight />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div className="grid gap-4">
              <div
                className="space-y-2"
                onClick={() => setIsPaymentLeftAligned(!isPaymentLeftAligned)}
              >
                {isPaymentLeftAligned ? (
                  <Button className="text-black" >{text1}</Button>
                ) : (
                  <Button className="text-black">{text2}</Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
  );
}
