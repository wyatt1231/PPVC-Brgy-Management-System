import { Breadcrumbs, useTheme } from "@material-ui/core";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
interface ILink {
  link: string;
  title: string;
}

interface IPageLinks {
  links: Array<ILink>;
  isOpenMobileHeader?: boolean;
}

const PageLinks: FC<IPageLinks> = ({ links, isOpenMobileHeader }) => {
  const theme = useTheme();
  return (
    <StyledPageLinks
      theme={theme}
      // className={clsx("", {
      //   "expand-navlinks": isOpenMobileHeader,
      // })}
    >
      <Breadcrumbs aria-label="breadcrumb" className="bread-crumb">
        {links.map((v, i) => (
          <Link key={i} color="inherit" to={v.link} className="navText">
            {v.title}
          </Link>
        ))}
      </Breadcrumbs>
    </StyledPageLinks>
  );
};

export default PageLinks;

const StyledPageLinks = styled.div`
  /* margin-top: 0.5em; */
  background-color: ${(p) => p.theme.header.backgroundColor};
  display: grid !important;
  align-content: center !important;
  align-items: center !important;
  align-self: center !important;
  border: none !important;
  box-shadow: none !important;
  transition: 0.2s margin-top ease-in-out !important;

  .bread-crumb {
    .navText {
      text-decoration: none !important;
      font-weight: 900 !important;
      font-family: "Nunito" !important;
      font-size: 0.93em !important;
    }
  }
`;
