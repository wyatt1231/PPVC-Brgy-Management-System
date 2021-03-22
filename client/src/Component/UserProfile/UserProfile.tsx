import { useTheme } from "@material-ui/core";
import React, { memo, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { removeToken } from "../../Helpers/AppConfig";
import CustomAvatar from "../CustomAvatar";
import { StyledUserProfile } from "./styles";

interface IUserProfile {
  variant?: "mobile" | "desktop";
  user: any;
}

const UserProfile: React.FC<IUserProfile> = memo(({ variant, user }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  let ProfileLink: any = null;

  if (user?.user_type === "admin") {
    ProfileLink = (
      <NavLink to="/admin/profile" className="link">
        My Profile
      </NavLink>
    );
  } else if (user?.user_type === "tutor") {
    ProfileLink = (
      <NavLink to="/clinic/myprofile" className="link">
        My Profile
      </NavLink>
    );
  }

  return (
    <StyledUserProfile theme={theme}>
      <div className="header" aria-describedby={id} onClick={handleClick}>
        <CustomAvatar
          src={user?.picture}
          errorMessage={`${user?.full_name.charAt(0)}`}
          className="profile-image"
        />

        {variant === "mobile" ? null : (
          <div className="user">
            <div className="fullname">{user?.full_name}</div>
            <div className="designation">{user?.user_type}</div>
          </div>
        )}
      </div>

      {/*       
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
        <StyledPopOverContent theme={theme} className="content-container">
          <div className="content-header">
            <CustomAvatar
              src={user?.picture}
              errorMessage={`${user?.full_name.charAt(0)}`}
              className="content-header-image"
            />
            <div className="content-header-user">
              <div className="name">{user?.full_name}</div>
              <div className="designation">{user?.user_type}</div>
            </div>
          </div>
          <div className="content-body">
            <div className="content-title">MENUS</div>
            <div className="content-items">
              {ProfileLink}
              <div className="link" onClick={handleLogout}>
                Logout
              </div>
            </div>
          </div>
        </StyledPopOverContent>
      </Popover>
    */}
    </StyledUserProfile>
  );
});

export default UserProfile;
