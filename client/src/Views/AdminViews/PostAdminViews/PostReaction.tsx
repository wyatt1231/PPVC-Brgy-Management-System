import React, { memo, FC, useEffect, useState, useCallback } from "react";
import ThumbUpAltRoundedIcon from "@material-ui/icons/ThumbUpAltRounded";
import ThumbDownAltRoundedIcon from "@material-ui/icons/ThumbDownAltRounded";
import { Button, Collapse, IconButton, TextField } from "@material-ui/core";
import PostApi from "../../../Services/Api/PostApi";
import {
  PostCommentModel,
  PostReactionModel,
} from "../../../Services/Models/PostModels";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../../Services/Store";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import CircularLoadingProgress from "../../../Component/CircularLoadingProgress";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ThumbDownOutlinedIcon from "@material-ui/icons/ThumbDownOutlined";
import PostActions from "../../../Services/Actions/PostActions";
import LoadingButton from "../../../Component/LoadingButton";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";
import CustomAvatar from "../../../Component/CustomAvatar";
import moment from "moment";
interface IPostReaction {
  posts_pk: number;
}

export const PostReaction: FC<IPostReaction> = memo(({ posts_pk }) => {
  const dispatch = useDispatch();
  const user_pk = useSelector(
    (store: RootStore) => store.UserReducer.user.user_pk
  );

  const [reactions, set_reactions] = useState<Array<PostReactionModel> | null>(
    null
  );

  const [loading, set_loading] = useState(false);
  const [total_likes, set_total_likes] = useState(0);
  const [user_liked, set_user_liked] = useState(false);

  const [reload_reactions, set_reload_reactions] = useState(0);

  const [open_comment, set_open_comment] = useState(false);
  const [loading_comment, set_loading_comment] = useState(false);
  const [reload_comment, set_reload_comment] = useState(0);
  const [comments, set_comments] = useState<Array<PostCommentModel> | null>(
    null
  );

  const handleSetOpenComment = useCallback((open: boolean) => {
    set_open_comment(open);
  }, []);

  const handleLike = async (reaction: string) => {
    const response = await PostApi.addPostReaction({
      posts_pk: posts_pk,
      reaction: reaction,
    });

    if (response.success) {
      set_reload_reactions((prev) => prev + 1);
    }
  };

  const [chat_message, set_chat_message] = useState("");

  const handleSubmitComment = async () => {
    if (chat_message.length > 0) {
      const payload: PostCommentModel = {
        body: chat_message,
        posts_pk: posts_pk,
      };

      const response = await PostApi.addPostComment(payload);

      console.log(`add reponse`, response);

      if (response.success) {
        set_chat_message("");
        set_reload_comment((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    const load_data = async () => {
      set_loading(true);
      const reponse = await PostApi.getPostReactionsAdmin(posts_pk);
      set_loading(false);

      if (reponse.success) {
        set_reactions(reponse.data);
      }
    };

    mounted && load_data();

    return () => {
      mounted = false;
    };
  }, [posts_pk, reload_reactions]);

  useEffect(() => {
    let mounted = true;

    const load_data = async () => {
      set_loading_comment(true);
      const reponse = await PostApi.getPostCommentsAdmin(posts_pk);
      set_loading_comment(false);

      if (reponse.success) {
        set_comments(reponse.data);
      }
    };

    mounted && load_data();

    return () => {
      mounted = false;
    };
  }, [posts_pk, reload_comment]);

  useEffect(() => {
    const countLikes = () => {
      let likes = 0;

      let is_user_liked = false;

      reactions?.forEach((r) => {
        if (r.reaction.toLowerCase() === "like") {
          likes++;
          if (r.user_pk === user_pk) {
            is_user_liked = true;
          }
        }
      });

      set_user_liked(is_user_liked);

      set_total_likes(likes);
    };

    countLikes();
  }, [reactions, user_pk]);

  return (
    <>
      {loading && !reactions ? (
        <CircularLoadingProgress />
      ) : (
        <>
          <div className="reactions">
            <div className="stats">
              <div className="stats-item">
                <b>{total_likes}</b> Likes
              </div>
              <div className="stats-item">
                <b>{comments?.length}</b> Comments
              </div>
            </div>

            <div className="actions">
              <LoadingButton
                handleClick={() => handleLike(user_liked ? "Dislike" : "Like")}
                type="button"
                loading={loading}
                startIcon={
                  user_liked ? (
                    <ThumbUpAltRoundedIcon style={{ color: `blue` }} />
                  ) : (
                    <ThumbUpAltOutlinedIcon />
                  )
                }
              >
                Like
              </LoadingButton>
              <LoadingButton
                // handleClick={() => handleLike(user_liked ? "Dislike" : "Like")}
                handleClick={() => handleSetOpenComment(!open_comment)}
                type="button"
                loading={loading_comment}
                startIcon={<CommentOutlinedIcon />}
              >
                Comments
              </LoadingButton>
            </div>
          </div>

          <Collapse in={open_comment}>
            <>
              <form
                noValidate
                className="add-comment"
                onSubmit={(e) => e.preventDefault()}
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
                    disabled={loading_comment}
                    placeholder="Write your comment here."
                    size="small"
                    variant="outlined"
                    value={chat_message}
                    onChange={(e) => set_chat_message(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13 && e.shiftKey === false) {
                        handleSubmitComment();
                      }
                    }}
                  />
                </div>
              </form>
              <div className="comment">
                {comments?.map((c, i) => (
                  <div className="comment-item" key={i}>
                    <CustomAvatar
                      className="img"
                      src={c.user.pic}
                      errorMessage={c?.user.full_name?.charAt(0)}
                    />

                    <div className="time">{moment(c.encoded_at).fromNow()}</div>
                    <div className="user-name">{c.user.full_name}</div>
                    <div className="content">{c.body}</div>
                  </div>
                ))}
              </div>
            </>
          </Collapse>
        </>
      )}
    </>
  );
});

export default PostReaction;
