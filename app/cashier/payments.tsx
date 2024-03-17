

import React from "react";

import PaymentsToggler from "./paymentsToggler";

export default function Payments({ setIsPaymentLeftAligned, isPaymentLeftAligned }: any) {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <div className="absolute top-0 right-0">
        <PaymentsToggler
          text1="Align bottom"
          text2="Align right"
          setIsPaymentLeftAligned={setIsPaymentLeftAligned}
          isPaymentLeftAligned={isPaymentLeftAligned}
        />
      </div>

      <div>payments </div>
    </div>
  );
}
