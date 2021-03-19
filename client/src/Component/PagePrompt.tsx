import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import React, { FC, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { resetGeneralPrompt } from "../Services/Actions/PageActions";
import { RootStore } from "../Services/Store";
import SlideTransition from "./Transitions/SlideTransition";
interface IPagePrompt {}

export const PagePrompt: FC<IPagePrompt> = memo(() => {
  const dispatch = useDispatch();
  const {
    open,
    custom_title,
    custom_subtitle,
    continue_callback,
    close_callback,
  } = useSelector((state: RootStore) => state.PageReducer.page_prompt);

  const handleContinue = useCallback(() => {
    if (continue_callback) {
      dispatch(resetGeneralPrompt());

      if (typeof continue_callback === "function") {
        continue_callback();
      }
    }
  }, [continue_callback, dispatch]);
  const handleCancel = useCallback(() => {
    dispatch(resetGeneralPrompt());
    if (close_callback) {
      if (typeof close_callback === "function") {
        close_callback();
      }
    }
  }, [close_callback, dispatch]);

  return (
    <StyledPagePrompt
      open={open}
      scroll="body"
      disableBackdropClick={true}
      onEscapeKeyDown={() => {
        handleCancel();
      }}
      TransitionComponent={SlideTransition}
      PaperProps={{
        style: {
          margin: 0,
          padding: 0,
          borderRadius: 10,
          width: 400,
          overflowY: "visible",
        },
      }}
    >
      <DialogContent className="dialog-content">
        <div
          style={{
            fontWeight: 900,
            fontSize: `1.5em`,
            color: `red`,
          }}
        >
          {custom_title
            ? custom_title
            : "Are you sure that you want to continue?"}
        </div>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button
          color="primary"
          variant="contained"
          disableElevation
          onClick={handleContinue}
        >
          Proceed
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={handleCancel}
          disableElevation
        >
          Dismiss
        </Button>
      </DialogActions>
    </StyledPagePrompt>
  );
});

export default PagePrompt;

const StyledPagePrompt = styled(Dialog)`
  .dialog-content {
    text-align: center;
  }
`;
