import styled from "styled-components";

export const StyledTaskMenu = styled.div``;

export const StyledTaskMenuPopOver = styled.div`
  width: 150px;

  .buttons {
    padding: 0.3em;
    display: grid;
    grid-gap: 0.5em;

    text-align: left;
    .MuiButton-label {
      justify-content: flex-start !important;
    }
  }
`;
