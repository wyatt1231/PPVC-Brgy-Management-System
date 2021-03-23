import { CircularProgress } from "@material-ui/core";
import React, { memo } from "react";

interface ILinearLoadingProgress {
  style?: React.CSSProperties;
}

const CircularLoadingProgress: React.FC<ILinearLoadingProgress> = memo(
  ({ style }) => {
    return (
      <div
        style={{
          display: `grid`,
          justifyContent: `center`,
          justifyItems: `center`,
          alignContent: `center`,
          alignItems: `center`,
          padding: `2em`,
          ...style,
        }}
      >
        <CircularProgress />
      </div>
    );
  }
);

export default CircularLoadingProgress;
