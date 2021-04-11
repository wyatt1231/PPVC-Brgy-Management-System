import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledNewsContainer = styled(Container)`
  display: grid !important;
  grid-gap: 1em !important;
  width: 100%;
  padding: 0.5em 1em;
  margin: 0 1em;
  border-bottom: 0.05em solid rgba(0, 0, 0, 0.2);

  .news-item {
    padding: 1em;
    background-color: #fff;
    border-radius: 7px;
    display: grid;
    grid-gap: 0.5em;

    .header {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr auto;
      .profile {
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
      }
    }

    .news-title {
      justify-self: start;
      font-weight: 600;
      display: grid;
      justify-content: start;
      justify-items: start;
      justify-self: start;
      grid-auto-flow: column;
      align-items: center;
      align-content: center;
      grid-gap: 0.5em;
      text-transform: capitalize;
      font-size: 1.1em;
    }

    .body {
      padding: 0.7em;
      /* justify-self: start; */
      font-size: 0.85em;
      background-color: #f5f5f5;
      border-radius: 8px;
      font-weight: 400;
    }

    .react-stats {
      display: grid;
      grid-auto-flow: column;
      grid-gap: 1em;
      align-items: center;
      align-content: center;
      justify-content: start;
      font-size: 0.87em;
      opacity: 0.8em;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding: 0.5em 0;
    }

    .reactions {
      grid-area: react-actions;
      display: grid;
      grid-auto-flow: column;
      justify-content: center;
      justify-items: center;
      align-items: center;
      grid-gap: 0.5em;
      padding: 0.2em;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding: 0.5em 0;
    }

    .add-comment {
      grid-area: add-comment;
      display: grid;
      align-items: center;
      grid-auto-flow: column;
      grid-auto-columns: 1fr auto;
      grid-gap: 0.5em;
    }

    .comment {
      grid-area: comment;
      display: grid;
      grid-gap: 0.5em;
      width: 100%;
      .comment-item {
        display: grid;
        grid-template-areas: "img user-name time" "img content content";
        justify-content: start;
        align-content: start;
        width: 100%;
        padding: 0.5em;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        grid-auto-columns: auto 1fr auto;

        .img {
          grid-area: img;
          margin-right: 0.5em;
        }
        .user-name {
          grid-area: user-name;
          font-weight: 600;
          font-size: 0.9em;
        }

        .content {
          grid-area: content;
          font-size: 0.84em;
          /* opacity: 0.6; */
          padding: 7px;
          border-radius: 7px;
          background-color: #f5f5f5;
        }
        .time {
          font-size: 0.8em;
          opacity: 0.9;
        }
      }
    }
  }
`;
