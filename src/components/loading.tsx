import React from "react";
import { FallingLines } from "react-loader-spinner";

type loadingProps = {
  width: string;
  color: string;
};

export default function Loading({ width, color }: loadingProps) {
  return (
    <div>
      <FallingLines
        color={color}
        width={width}
        visible={true}
      />
    </div>
  );
}
