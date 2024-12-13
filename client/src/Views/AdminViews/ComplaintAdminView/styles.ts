import styled from "styled-components";

export const StyledComplaintItem = styled.div`
  padding: 1em;
  margin: 0 1em;
  background-color: #fff;
  /* border-radius: 7px; */
  /* box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); */
  border-bottom: 0.1em solid rgba(0, 0, 0, 0.1);
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

  .complaint-title {
    font-weight: 600;
  }

  .body {
    padding: 0.5em;
    background-color: #f5f5f5;
    border-radius: 7px;
    font-size: 0.8em;
  }
`;

export const StyledManageComplaint = styled.div`
  display: grid;
  grid-template-areas: "profile  chat" "logs chat";
  grid-auto-columns: 1fr 350px;
  grid-gap: 1em;
  align-content: start;
  align-items: start;
  align-self: start;
  padding: 1em;

  /* OTHERS */
  .title {
    font-size: 0.78em;
    opacity: 0.5;
    font-weight: 900;
    padding: 0.5em 0;
  }

  .profile {
    grid-area: profile;
    padding: 1em;
    display: grid;
    /* justify-content: start; */
    background-color: #fff;
    border-radius: 7px;

    .main-info {
      display: grid;
      justify-content: center;
      justify-items: center;
      .img {
        height: 150px;
        width: 150px;
        justify-self: center;
      }

      .name {
        font-weight: 700;
        font-size: 1.3em;
        justify-self: center;
        text-align: center;
      }
      .sub-info {
        display: grid;
        grid-auto-flow: column;
        justify-self: start;
        align-items: center;
        grid-gap: 0.8em;
        padding: 0.4em 0;
        font-size: 0.85em;
        border-bottom: 0.01em solid rgba(0, 0, 0, 0.1);
      }
    }

    .other-info {
      .body {
        margin: 1em 0;
        font-size: 0.87em;
        padding: 0.5em;
        border-radius: 10px;
        background-color: #fafafa;
        width: 100%;
      }

      .files {
        .file {
          padding: 0.3em 0;
          font-size: 0.9em;
          cursor: pointer;

          &:hover {
            color: blue;
            text-decoration: underline;
            transition: 0.2x all ease-in-out;
          }
        }
      }
    }
  }

  .logs {
    grid-area: logs;
    display: grid;
    align-self: start;
    align-items: start;
    align-content: start;
    padding: 1em;
    background-color: #fff;
    border-radius: 7px;

    .actions {
      justify-items: end;
      justify-self: end;
    }

    .table {
      font-size: 0.95em;
      * {
        color: black !important;
        opacity: 1 !important;
      }
    }
  }

  .chat {
    grid-area: chat;
    display: grid;
    padding: 1em;
    background-color: #fff;
    border-radius: 7px;
    .chat-box {
      display: grid;
      grid-gap: 1em;

      .messages {
        overflow-y: scroll;
        max-height: 500px !important;
        min-height: 500px !important;
        display: grid;
        grid-gap: 1em;
        align-content: end;
        align-items: end;
        .message-dialog {
          display: grid;
          grid-gap: 0.2em;
          width: 100%;
          padding: 0.3em;
          border-bottom: 0.01em solid rgba(0, 0, 0, 0.1);

          .sender {
            display: grid;
            grid-template-areas: "img name" "img datetime";
            grid-auto-columns: auto 1fr;
            .img {
              grid-area: img;
              margin-right: 0.5em;
            }
            .name {
              grid-area: name;
              font-weight: 600;
              font-size: 0.9em;
            }
            .datetime {
              grid-area: datetime;
              font-size: 0.8em;
            }
          }

          .body {
            padding: 0.5em;
            background-color: #fafafa;
            border-radius: 10px;
            font-size: 0.87em;
          }
        }
        .form {
          height: 200px !important;
          min-height: 200px !important;
        }
      }
    }
  }
`;
