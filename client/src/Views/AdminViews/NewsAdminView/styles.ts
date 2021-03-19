import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledNewsContainer = styled(Container)`
  display: grid !important;
  grid-gap: 1em !important;
  width: 100%;

  .news-item {
    padding: 1em;
    margin: 0.5em 0;

    border-radius: 7px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-gap: 0.5em;
    align-items: center;
    align-content: center;
    grid-template-areas: "profile actions" "title title" "body body";
    grid-auto-columns: 1fr auto;

    .profile {
      grid-area: profile;
      display: grid;
      grid-template-areas: "img name" "img time";
      justify-content: start;
      align-content: start;
      .img {
        grid-area: img;
        margin-right: 0.5em;
      }
      .name {
        grid-area: name;
        margin-right: 0.5em;
        font-weight: 600;
      }
      .time {
        grid-area: time;
        margin-right: 0.5em;
        opacity: 0.7;
        font-size: 0.9em;
      }
    }

    .actions {
      grid-area: actions;
    }

    .title {
      grid-area: title;
      justify-self: start;
      font-weight: 600;
    }

    .body {
      grid-area: body;
      justify-self: start;
      font-size: 0.87em;
      background-color: #fcfcfc;
      border-radius: 7px;
    }
  }
`;
