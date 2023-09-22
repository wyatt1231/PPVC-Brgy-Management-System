import { Button, Collapse, IconButton, TextField } from "@material-ui/core";
import ChatRoundedIcon from "@material-ui/icons/ChatRounded";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ThumbUpRoundedIcon from "@material-ui/icons/ThumbUpRounded";
import moment from "moment";
import React, { FC, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomAvatar from "../../../Component/CustomAvatar";
import NewsActions from "../../../Services/Actions/NewsActions";
import { NewsCommentModel } from "../../../Services/Models/NewsCommentModels";
import { NewsLikesModel, NewsModel } from "../../../Services/Models/NewsModels";
import { RootStore } from "../../../Services/Store";

interface INewsCommentAdminView {
  news: NewsModel;
}

export const NewsCommentAdminView: FC<INewsCommentAdminView> = memo(
  ({ news }) => {
    const dispatch = useDispatch();
    const user = useSelector((store: RootStore) => store.UserReducer.user);
    const [open_comment, set_open_comment] = useState(false);

    if (news.likes.length > 0) {
      console.log(`news`, news, user?.user_pk);
    }

    return (
      <>
        <div className="react-stats">
          <div className="div">
            <b>{news?.likes?.length}</b> Likes
          </div>
          <div className="div">
            <b>{news?.comments?.length}</b> Comments
          </div>
        </div>
        <div className="reactions">
          <Button
            disableElevation
            startIcon={
              news.likes.find((x) => x.liked_by === user?.user_pk) ? (
                <ThumbUpRoundedIcon color="primary" />
              ) : (
                <ThumbUpOutlinedIcon />
              )
            }
            onClick={() => {
              const payload: NewsLikesModel = {
                news_pk: news.news_pk,
              };

              dispatch(
                NewsActions.toggleLike(payload, () => {
                  // dispatch(NewsActions.setNewsDataTable());
                })
              );
            }}
          >
            Like
          </Button>
          <Button
            disableElevation
            startIcon={<ChatRoundedIcon />}
            onClick={() => {
              set_open_comment((open) => !open);
            }}
          >
            Comment
          </Button>
        </div>

        <Collapse in={open_comment}>
          <>
            <form
              noValidate
              className="add-comment"
              onSubmit={(e: any) => {
                e.preventDefault();
                if (e?.target?.body?.value) {
                  const payload: NewsCommentModel = {
                    body: e.target.body.value,
                    news_pk: news.news_pk,
                  };

                  dispatch(NewsActions.addNewsComment(payload, () => {}));
                }
              }}
            >
              <div className="textfield">
                <TextField
                  name="body"
                  style={{
                    borderRadius: 20,
                    backgroundColor: `#f5f5f5`,
                    border: `none`,
                    width: `100%`,
                  }}
                  placeholder="Write your comment here."
                  size="small"
                  variant="outlined"
                  // fullWidth
                />
              </div>
              <div>
                <IconButton type="submit" className="send-btn">
                  <SendRoundedIcon />
                </IconButton>
              </div>
            </form>
            <div className="comment">
              {news.comments.map((com, com_index) => (
                <div className="comment-item" key={com_index}>
                  <CustomAvatar
                    className="img"
                    src={com.pic}
                    errorMessage={com?.full_name?.charAt(0)}
                  />

                  <div className="time">{moment(com.encoded_at).fromNow()}</div>
                  <div className="user-name">{com.full_name}</div>
                  <div className="content">{com.body}</div>
                </div>
              ))}
            </div>
          </>
        </Collapse>
      </>
    );
  }
);

export default NewsCommentAdminView;
