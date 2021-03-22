import styled from "styled-components";

export const StyledComplaintItem = styled.div`
  padding: 1em;
  background-color: #fff;
  border-radius: 7px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* border: 0.001em solid rgba(0, 0, 0, 0.1); */
  display: grid;
  grid-gap: 0.3em;

  .header {
    width: 100%;
    grid-template-areas: "img name act" "img time act";
    display: grid;
    align-items: start;
    justify-items: start;
    align-content: start;
    grid-auto-columns: auto 1fr auto;

    .img {
      align-self: start;
      grid-area: img;
      margin-right: 5px;
    }

    .name {
      grid-area: name;
      font-weight: 600;
      font-size: 0.9em;
    }

    .time {
      grid-area: time;
      font-size: 0.78em;
      opacity: 0.8;
    }

    .act {
      grid-area: act;
      justify-self: end;
      align-self: center;
    }
  }

  .title {
    font-weight: 600;
  }

  .body {
    padding: 0.5em;
    background-color: #f5f5f5;
    border-radius: 7px;
  }
`;
