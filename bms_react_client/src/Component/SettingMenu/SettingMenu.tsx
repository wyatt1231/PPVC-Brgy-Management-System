import {
  Badge,
  Button,
  IconButton,
  Popover,
  useTheme,
} from "@material-ui/core";
import SettingsApplicationsRoundedIcon from "@material-ui/icons/SettingsApplicationsRounded";
import React, { memo } from "react";
import { removeToken } from "../../Helpers/AppConfig";
import { StyledTaskMenu, StyledTaskMenuPopOver } from "./styles";

const SettingMenu = memo(() => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <StyledTaskMenu>
      <IconButton
        aria-describedby={id}
        color="default"
        onClick={handleClick}
        className="icon-header"
      >
        <SettingsApplicationsRoundedIcon />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <StyledTaskMenuPopOver theme={theme} className="content-container">
          <div className="buttons">
            <Button color="primary">My Profile</Button>
            <Button
              color="primary"
              onClick={() => {
                removeToken();
                window.location.href = "/login";
              }}
            >
              Sign Out
            </Button>
          </div>
        </StyledTaskMenuPopOver>
      </Popover>
    </StyledTaskMenu>
  );
});

export default SettingMenu;
