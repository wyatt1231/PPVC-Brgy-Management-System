import { AppBar, IconButton, useMediaQuery, useTheme } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Message from "../../Component/Message/Message";
import Notification from "../../Component/Notification/Notification";
import PageLinks from "../../Component/PageLinks";
import SettingMenu from "../../Component/SettingMenu/SettingMenu";
import { RootStore } from "../../Services/Store";
import { IPageNavLinks } from "./Layout";

interface IHeader {
  PageNavLinks: Array<IPageNavLinks>;
  isOpenMobileHeader: boolean;
  isOpenMobileSidebar: boolean;
  handleToggleHeader: () => void;
  handleToggleSidebar: () => void;
  user: any;
}

const Header: React.FC<IHeader> = memo(
  ({
    PageNavLinks,
    isOpenMobileHeader,
    handleToggleHeader,
    handleToggleSidebar,
    isOpenMobileSidebar,
    user,
  }) => {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("md"));
    // const history = useHistory();

    const page_links = useSelector(
      (store: RootStore) => store.PageReducer.page_links
    );

    return (
      <>
        <StyledHeader
          theme={theme}
          className={clsx("", {
            "mobile-menu-open": isOpenMobileHeader,
          })}
        >
          {mobile && (
            <IconButton
              className="btn-open-drawer"
              onClick={handleToggleSidebar}
            >
              <MenuIcon />
            </IconButton>
          )}

          <div className="page-links">
            <PageLinks links={page_links} />
          </div>

          <section className="tools">
            {/* <Notification />
            <Message /> */}
            <SettingMenu />
          </section>
        </StyledHeader>
      </>
    );
  }
);

export default Header;

const StyledHeader = styled(AppBar)`
  /*  */
  /* grid-gap: 1em !important; */

  display: grid !important;
  height: ${(p) => p.theme.header.height}px !important;
  align-items: center !important;
  align-content: center !important;
  grid-template-areas: "links tools";
  padding-left: ${(p) => p.theme.sidebar.maxWidth + 10}px !important;
  padding-right: 10px !important;
  background: ${(p) => p.theme.header.backgroundColor} !important;
  box-shadow: none !important;
  border: none !important;
  color: ${(p) => p.theme.header.color} !important;
  grid-auto-rows: ${(p) => p.theme.header.height}px;

  .btn-open-drawer {
    grid-area: btn-sidebar;
    justify-self: end;
    display: grid;
    justify-content: center;
    align-content: center;
  }

  .page-links {
    grid-area: links;
  }

  .tools {
    grid-area: tools;
    justify-self: end;
    display: grid;
    grid-gap: 0.3em;
    grid-auto-flow: column;
    align-items: center;
  }

  /* MOBILE SCREEN */
  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.values.lg}px) {
    padding: 0 10px !important;
    grid-template-areas: "btn-sidebar tools" "links links";
    grid-auto-rows: ${(p) => p.theme.header.height}px
      ${(p) => p.theme.header.height}px;
    height: ${(p) => p.theme.header.height * 2}px !important;
    grid-auto-columns: auto 1fr !important;
    align-items: center;
    align-content: center;
  }
`;
