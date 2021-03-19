import React, { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { RootStore } from "../../Services/Store";
import Body from "./Body";
import Header from "./Header";
import MobileSidebar from "./MobileSidebar";

export interface IPageNavLinks {
  hasSubLinks: boolean;
  text: string;
  to: string;
  parentKey?: string;
  navLinks?: Array<any>;
}

const generateNavLinks = (user: any): Array<IPageNavLinks> => {
  if (!user) {
    return [];
  }

  let PageNavLinks: Array<IPageNavLinks> = [];

  if (user.user_type === "admin") {
    // PageNavLinks.push({
    //   hasSubLinks: false,
    //   text: page.pagename,
    //   to: page.link,
    // });
    PageNavLinks = [
      {
        to: "/admin/dashboard",
        text: "Dashboard",
        hasSubLinks: false,
      },
      {
        to: "/admin/resident",
        text: "Residents",
        hasSubLinks: false,
      },
      {
        to: "/admin/brgy-official",
        text: "Brgy. Officials",
        hasSubLinks: false,
      },
      {
        to: "/admin/news",
        text: "News",
        hasSubLinks: false,
      },
      {
        to: "/admin/complaint",
        text: "Complaints",
        hasSubLinks: false,
      },
      {
        to: "/admin/administrator",
        text: "Administrators",
        hasSubLinks: false,
      },
    ];
  } else if (user?.user_type === "tutor") {
    PageNavLinks = [
      {
        to: "/tutor/calendar",
        text: "Calendar",
        hasSubLinks: false,
      },
      {
        to: "/tutor/class",
        text: "Classes",
        hasSubLinks: false,
      },
    ];
  }

  // if (user?.user_info.usertype === "admin") {

  // } else if (user === "clinic") {
  // } else if (user === "students") {
  // }

  return PageNavLinks;
};

const Layout = memo(({ children }) => {
  const user = useSelector((reducers: RootStore) => reducers.UserReducer.user);

  console.log(`user`, user);

  const [isOpenMobileHeader, setIsOpenMobileHeader] = useState(false);

  const handleToggleHeader = useCallback(() => {
    setIsOpenMobileHeader((prevHeader) => !prevHeader);
  }, []);

  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  const handleCloseMobileSidebar = useCallback(() => {
    setIsOpenMobileSidebar(false);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsOpenMobileSidebar((prevSidebar) => !prevSidebar);
  }, []);

  return (
    <>
      <Header
        PageNavLinks={generateNavLinks(user)}
        isOpenMobileHeader={isOpenMobileHeader}
        handleToggleHeader={handleToggleHeader}
        handleToggleSidebar={handleToggleSidebar}
        isOpenMobileSidebar={isOpenMobileSidebar}
        user={user}
      />
      <MobileSidebar
        PageNavLinks={generateNavLinks(user)}
        isOpenMobileSidebar={isOpenMobileSidebar}
        handleCloseMobileSidebar={handleCloseMobileSidebar}
        user={user}
      />
      <Body isOpenMobileHeader={isOpenMobileHeader}>{children}</Body>
    </>
  );
});

export default Layout;
