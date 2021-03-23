import { Avatar, useTheme } from "@material-ui/core";
import React, { memo } from "react";
interface ICustomAvatar {
  src: string | null;
  errorMessage: string;
  className?: string;
  variant?: "circle" | "rounded" | "square";
  height?: number;
  width?: number;
}

const CustomAvatar: React.FC<ICustomAvatar> = memo(
  ({ src, errorMessage, className, variant, height, width }) => {
    const theme: any = useTheme();
    return src === "" ||
      src === "null" ||
      src === null ||
      typeof src === "undefined" ? (
      <Avatar
        className={className}
        variant={variant ? variant : "circle"}
        style={{
          height: theme.spacing(height ? height : 5),
          width: theme.spacing(width ? width : 5),
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.secondary.contrastText,
        }}
      >
        <div
          style={{
            textAlign: "center",
            textTransform: "uppercase",
            fontSize: `1em`,
            fontWeight: 900,
            letterSpacing: ".3pt",
          }}
        >
          {errorMessage}
        </div>
      </Avatar>
    ) : (
      <Avatar
        variant={variant ? variant : "circle"}
        className={className}
        style={{
          height: theme.spacing(height ? height : 5),
          width: theme.spacing(width ? width : 5),
        }}
        src={`data:image/jpg;base64,${src}`}
      />
    );
  }
);

export default CustomAvatar;
