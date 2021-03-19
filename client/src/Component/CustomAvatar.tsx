import { Avatar, useTheme } from "@material-ui/core";
import React, { memo } from "react";
interface ICustomAvatar {
  src: string | null;
  errorMessage: string;
  className: string;
  variant?: "circle" | "rounded" | "square";
}

const CustomAvatar: React.FC<ICustomAvatar> = memo(
  ({ src, errorMessage, className, variant }) => {
    const theme: any = useTheme();
    return src === "" ||
      src === "null" ||
      src === null ||
      typeof src === "undefined" ? (
      <Avatar
        className={className}
        variant={variant ? variant : "circle"}
        style={{
          height: theme.spacing(4),
          width: theme.spacing(4),
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
          height: theme.spacing(5),
          width: theme.spacing(5),
        }}
        src={`data:image/jpg;base64,${src}`}
      />
    );
  }
);

export default CustomAvatar;
