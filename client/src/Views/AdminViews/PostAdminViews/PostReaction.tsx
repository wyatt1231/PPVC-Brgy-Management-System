import React, { memo, FC } from "react";
import ThumbUpAltRoundedIcon from "@material-ui/icons/ThumbUpAltRounded";
import ThumbDownAltRoundedIcon from "@material-ui/icons/ThumbDownAltRounded";
import { Button } from "@material-ui/core";
interface IPostReaction {}

export const PostReaction: FC<IPostReaction> = memo(() => {
  return (
    <>
      <div>
        <div className="stats">
          <div className="stats-item">10 Likes</div>
          <div className="stats-item">20 Dislikes</div>
        </div>
      </div>
      <div>
        <Button startIcon={<ThumbUpAltRoundedIcon style={{ color: `blue` }} />}>
          Like
        </Button>
        <Button
          startIcon={<ThumbDownAltRoundedIcon style={{ color: `red` }} />}
        >
          Dislike
        </Button>
      </div>
    </>
  );
});

export default PostReaction;
