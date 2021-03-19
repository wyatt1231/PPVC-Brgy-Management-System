import {
  Avatar,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import React, { memo, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import logo from "../../Assets/Images/Logo/logo.jpg";
import NavSidebarDropDown from "../../Component/NavLinks/NavSidebarDropDown";
import { APP_NAME } from "../../Helpers/AppConfig";
import { IPageNavLinks } from "./Layout";
import styled from "styled-components";
import UserProfile from "../../Component/UserProfile/UserProfile";
interface IMobileSidebar {
  PageNavLinks: Array<IPageNavLinks>;
  isOpenMobileSidebar: boolean;
  handleCloseMobileSidebar: () => void;
  user: any;
}

const MobileSidebar: React.FC<IMobileSidebar> = memo(
  ({ PageNavLinks, isOpenMobileSidebar, handleCloseMobileSidebar, user }) => {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("md"));
    const history = useHistory();

    useEffect(() => {
      let mounted = true;

      if (mounted) {
        handleCloseMobileSidebar();
      }

      return () => {
        mounted = false;
      };
    }, [handleCloseMobileSidebar, mobile]);

    return (
      <StyledMobileSidebar
        theme={theme}
        variant={mobile ? "temporary" : "permanent"}
        open={mobile ? isOpenMobileSidebar : true}
        PaperProps={{
          className: "sidebar-container",
        }}
        onClose={handleCloseMobileSidebar}
      >
        <div className="brand">
          <Avatar src={logo} className="brand-logo" alt="" />
          <div className="brand-name">{process.env.REACT_APP_CLIENT}</div>
          <div className="app-name">{APP_NAME}</div>

          {mobile && (
            <IconButton
              className="btn-close-drawer"
              color="primary"
              onClick={handleCloseMobileSidebar}
            >
              <MenuOpenIcon />
            </IconButton>
          )}
        </div>

        <div className="user">
          <UserProfile user={user} />
        </div>

        <nav className="nav">
          {PageNavLinks.map((nav, index) =>
            nav.hasSubLinks ? (
              <NavSidebarDropDown
                isActive={history.location.pathname
                  .toLowerCase()
                  .includes(nav.parentKey ? nav.parentKey.toLowerCase() : "")}
                text={nav.text}
                navLinks={nav.navLinks ? nav.navLinks : []}
                key={index}
              />
            ) : (
              <NavLink
                key={index}
                activeClassName="dropdown-link-item-active"
                to={nav.to}
                className="nav-item"
              >
                <div className="nav-item-label">{nav.text}</div>
              </NavLink>
            )
          )}
        </nav>
      </StyledMobileSidebar>
    );
  }
);

export default MobileSidebar;

export const StyledMobileSidebar = styled(Drawer)`
  .sidebar-container {
    width: ${(p) => p.theme.sidebar.maxWidth}px!important;
    max-width: ${(p) => p.theme.sidebar.maxWidth}px!important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    display: grid;
    grid-auto-rows: ${(p) => p.theme.header.height}px auto 1fr;
    background-color: ${(p) => p.theme.sidebar.backgroundColor} !important;
    color: ${(p) => p.theme.sidebar.color} !important;
    grid-gap: 1em;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2) !important;
    .brand {
      display: grid;
      grid-auto-flow: column;
      width: ${(p) => p.theme.sidebar.maxWidth}px;
      align-content: center;
      align-items: center;
      justify-items: start;
      justify-content: start;
      grid-gap: 0.5em;
      padding: 0 0.5em;
      grid-template-areas: "logo app icon" "logo name icon";
      grid-auto-columns: 40px 1fr 40px;

      .brand-logo {
        grid-area: logo;
        height: 40px;
        width: 40px;
        box-shadow: 0 10px 25px -8px rgba(0, 0, 0, 0.56),
          0 2px 15px 0px rgba(0, 0, 0, 0.12), 0 4px 8px -3px rgba(0, 0, 0, 0.2);
      }
      .app-name {
        align-self: end;
        justify-self: center;
        grid-area: app;
        white-space: nowrap;
        justify-self: start;
        font-weight: 900;
        white-space: pre-wrap;
        font-size: 0.9em;
        text-transform: capitalize;
      }

      .brand-name {
        grid-area: name;
        font-weight: 600;
        font-size: 0.87em;
        align-self: start;
        white-space: pre-wrap;
        text-transform: capitalize;
      }

      .btn-close-drawer {
        justify-self: end;
        grid-area: icon;
      }
    }

    .nav {
      width: 100%;
      display: grid;
      grid-auto-flow: row;
      align-items: start;
      align-content: start;
      padding: 1em 2em !important;
      grid-gap: 0.5em;
      text-transform: uppercase;

      .nav-item {
        transition: 0.2s all ease-in-out;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        align-content: center;
        grid-gap: 0.5em;
        padding: 0.4em 0.5em;
        width: 100%;
        justify-items: start;
        font-weight: 900 !important;
        text-transform: capitalize;
        font-size: 0.9em;
        color: ${(p) => p.theme.sidebar.color} !important;

        .nav-item-label {
          font-size: 0.87em !important;
          text-transform: capitalize;
          font-family: Nunito !important;
        }

        &:hover {
          cursor: pointer;
          color: ${(p) => p.theme.palette.secondary.main} !important;
        }

        &.dropdown-link-item-active {
          color: ${(p) => p.theme.palette.secondary.main} !important;
        }
      }
    }
  }
`;
