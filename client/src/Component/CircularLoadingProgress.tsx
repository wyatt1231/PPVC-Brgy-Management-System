import { CircularProgress } from "@material-ui/core";
import React, { memo } from "react";

interface ILinearLoadingProgress {}

const CircularLoadingProgress: React.FC<ILinearLoadingProgress> = memo(() => {
  return (
    <div
      style={{
        display: `grid`,
        justifyContent: `center`,
        justifyItems: `center`,
        alignContent: `center`,
        alignItems: `center`,
        padding: `2em`,
      }}
    >
      <CircularProgress />
    </div>
  );
});

export default CircularLoadingProgress;
