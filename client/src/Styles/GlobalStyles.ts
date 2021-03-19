import styled from "styled-components";

export const StyledTableData = styled.div`
  /* display: grid; */
  grid-gap: 1em;
  align-content: start;
  align-items: start;
  justify-items: start;

  @media all and (min-width: ${(props) =>
      props.theme.breakpoints.values.xs}px) {
    grid-auto-flow: row;
    grid-auto-columns: auto;
  }

  @media all and (min-width: ${(props) =>
      props.theme.breakpoints.values.md}px) {
    /* grid-auto-columns: 250px 100%; */
    grid-auto-flow: column;
  }

  .table-grid {
    .table-ctnr {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
  }
`;

export const StyledBox = styled.div`
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  border-radius: 10px;
  padding: 1em;
  background-color: #fdfdfd;

  .box-title {
    padding: 0.5em 0;
    /* border-bottom: 1px solid rgba(0, 0, 0, 0.2); */
    font-size: 1.2em;
    font-weight: 600;
    letter-spacing: 0.3pt;
    word-spacing: 0.3pt;
  }

  .box-body {
    margin: 1em 0;
  }
`;

export const StyledClassContainer = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 2px 4px #e3f2fd;
  border: 0.01em solid #e3f2fd;

  .image {
    height: 120px;
    width: 100%;
    border-bottom: 0.01em solid rgba(0, 0, 0, 0.2);
    img {
      grid-area: "top";
      height: 120px;
      width: 100%;
    }
  }

  .info-container {
    display: grid;
    padding: 0.5em;
    grid-gap: 0.3em;

    .title {
      font-weight: 900;
      font-size: 0.87em;
      letter-spacing: 0.3pt;
      word-spacing: 0.3pt;
    }

    .time {
      font-size: 0.82em;
      font-weight: 900;
      opacity: 0.7;
    }

    .item {
      font-size: 0.82em;
      font-weight: 900;
      opacity: 0.7;
    }

    .status {
    }
  }
`;

export const StyledDashboardItem = styled.div`
  display: grid;
  align-items: center;
  align-content: center;
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 1.5em 1em;
  border-radius: 10px;
  box-shadow: 0 2px 4px #e3f2fd;
  border: 0.01em solid #e3f2fd;
  align-items: center;
  align-content: center;
  justify-items: center;
  text-align: center;
  width: 200px;

  .value {
    font-weight: 900;
    font-size: 1.8em;
  }
  .label {
    font-weight: 700;
    font-size: 0.82em !important;
  }
`;

export const StyledOpenClasses = styled.div`
  padding: 0.5em;
  margin: 0.5em;
  border: 0.02em solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  background-color: #fff;

  .class-item {
    display: grid;
    border-bottom: 0.01em solid rgba(0, 0, 0, 0.1);
    padding: 0.2em 0;
    .label {
      font-weight: 900;
      font-size: 0.67em;
      opacity: 0.4;
    }
    .value {
      font-weight: 600 !important;
      font-size: 0.9em !important;
    }
  }
`;
