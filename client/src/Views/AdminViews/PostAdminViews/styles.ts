import styled from "styled-components";

export const StyledPostItem = styled.div`
  padding: 1em;
  background-color: #fff;
  border-radius: 7px;
  align-items: start;
  align-content: start;
  display: grid;
  grid-gap: 0.7em;
  .header {
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

  .body {
    padding: 0.5em;
    border-radius: 10px;
    background-color: #f5f5f5;
    font-size: 0.83em;
    justify-self: start;
  }

  .reactions {
  }

  .comments {
  }
`;
