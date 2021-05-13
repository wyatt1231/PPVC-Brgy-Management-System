import styled from "styled-components";

export const StyledPostItem = styled.div`
  padding: 0.5em;
  background-color: #fff;
  align-items: start;
  align-content: start;
  display: grid;
  grid-gap: 0.7em;
  margin: 0.5em 1em;
  /* box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1); */
  border-bottom: 0.1em solid rgba(0, 0, 0, 0.3);
  .header {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr auto;

    .profile {
      display: grid;
      grid-auto-columns: auto 1fr;
      grid-template-areas: "img name" "img time";
      align-items: start;
      .img {
        grid-area: img;
        margin-right: 1em;
      }
      .name {
        grid-area: name;
        font-weight: 600;
      }
      .time {
        grid-area: time;
        font-size: 0.87em;
      }
    }
    .actions {
    }
  }

  .body {
    padding: 0.5em;
    border-radius: 10px;
    background-color: #f5f5f5;
    font-size: 0.83em;
    justify-self: start;
  }

  .reactions {
    .stats {
      padding: 0.2em 0;
      display: grid;
      grid-auto-flow: column;
      grid-gap: 1em;
      align-items: center;
      align-content: center;
      justify-content: start;
      justify-items: start;
      width: 100%;

      font-size: 0.85em;
    }

    .actions {
      padding: 0.2em 0;
      display: grid;
      grid-gap: 1em;
      grid-auto-flow: column;
      justify-content: center;
      justify-items: center;
      align-items: center;
      align-content: center;
    }
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
`;
