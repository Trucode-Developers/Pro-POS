import React from "react";

import PaymentsToggler from "./paymentsToggler";

export default function Queue({ setIsPaymentLeftAligned, isPaymentLeftAligned }: any) {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <div className="absolute top-0 right-0">
        <PaymentsToggler 
        text1="Align Right"
        text2="Align bottom"
        setIsPaymentLeftAligned={setIsPaymentLeftAligned} 
        isPaymentLeftAligned={isPaymentLeftAligned} />
      </div>

      <div>other operations, queue and returns </div>
    </div>
  );
}
