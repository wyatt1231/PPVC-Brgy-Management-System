import { CircularProgress } from "@material-ui/core";
import React, { memo } from "react";

interface ILinearLoadingProgress {
  style?: React.CSSProperties;
  size?: string | number;
}

const CircularLoadingProgress: React.FC<ILinearLoadingProgress> = memo(
  ({ style, size }) => {
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
        <CircularProgress size={size} />
      </div>
    );
  }
);

export default CircularLoadingProgress;
