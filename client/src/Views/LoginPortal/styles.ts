import { Paper } from "@material-ui/core";
import styled from "styled-components";

export const LoginStyles = styled(Paper)`
  min-height: 100vh;
  min-width: 100vw;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-areas: "login";

  background: #ece9e6; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #ffffff,
    #ece9e6
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #ffffff,
    #ece9e6
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  .login-container {
    align-self: center;
    justify-self: center;
    display: grid;
    box-shadow: 0 7px 15px rgba(0, 0, 0, 0.1);
    z-index: 2;
    /* grid-gap: 1em; */
    border-radius: 10px !important;
    padding: 1em !important;
    grid-auto-columns: 1fr;
    background-color: #fff !important;
    min-height: auto;
    align-self: start;
    align-self: center !important;
    width: 400px !important;
    .form-ctnr {
      display: grid;
      /* justify-content: center; */
      align-items: start;
      align-content: start;
      /* grid-gap: 1em; */
      padding: 1em;
      /* padding-top: 0; */

      .header {
        display: grid;
        align-items: start;
        align-content: start;
        justify-items: center;
        /* text-align: center; */

        .brand-logo {
          height: 150px;
          width: 150px;
        }
        .brand-name {
          font-weight: 600;
          font-size: 0.87;
          font-weight: 900;
        }
        .brand-caption {
          font-weight: 600;
          font-size: 0.8em;
        }
      }

      .error {
        /* display: grid;
        grid-auto-flow: column;
        justify-items: start;
        justify-content: start;
        align-items: center; */
      }

      .body {
        margin: 1em 0;
        display: grid;
        grid-gap: 1em;
        align-content: start;

        .body-title {
          /* text-align: center; */
          display: grid;
          grid-auto-flow: column;
          /* justify-content: center; */
          justify-items: start;
          align-items: center;
          font-size: 0.87em;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.7);
        }

        .form {
          display: grid;
          grid-gap: 1em;
          align-content: start;
          align-items: start;

          .buttons {
            display: grid;
            grid-auto-flow: row;
            grid-gap: 0.5em;
            .submit-btn {
            }
          }
        }
      }

      .footer {
        margin-top: 1em;
        border-top: 1px solid black;
        display: grid;
        justify-items: center;
        align-items: center;
        grid-gap: 0.4em;
        .title {
          justify-self: center;
          background-color: #ecfffb;
          margin-top: -10px;
          font-size: 0.7em;
          text-align: center;
          padding: 0 0.5em;
        }

        .forgetpass {
          justify-self: center;
          align-self: center;
          padding: 0;
          font-size: 0.7rem;
          &:hover {
            color: blue !important;
          }

          a {
            color: #333 !important;
            text-decoration: none !important;
          }
        }
      }
    }
  }
`;

export const StyledImageBackground = styled.div<{ src: any }>`
  background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)),
    url("${(p: any) => p.src}") no-repeat center center;
  opacity: 0;
  background-size: cover;
  margin-left: 0;

  transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  -webkit-transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  -moz-transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  -o-transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  .app-name {
    display: grid;
    align-content: end;
    align-items: end;
    text-shadow: 0 3px 0 black;
    color: #fff;
    padding: 0.5em;
    font-size: 2.1em;
    font-weight: 900;
    text-align: center;
    letter-spacing: 1pt;
    word-spacing: 1pt;
    opacity: 0.9;
  }
  &.active {
    opacity: 1;
  }
`;
