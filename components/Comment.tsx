import { useRouter } from "next/router";
import { useState } from "react";
import { KeyedMutator } from "swr";
import useMutation, { Data } from "../lib/client/useMutation";
import { deepCopy, formatCreatedAt } from "../lib/client/utils";
import CommentForm from "./CommentForm";
import Comments, { TComment } from "./Comments";

interface Props extends TComment {
  mutate: KeyedMutator<Data<TComment[]>[]>;
}

export default function Comment({
  id,
  user: { name },
  createdAt,
  content,
  isLiked,
  _count: { commentLikes, children },
  mutate,
  parentId,
}: Props) {
  const { query } = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [toggleLike, { loading }] = useMutation(
    `/tweets/${query.id}/comments/toggleLike`
  );

  const onBtnClick = () => setShowInput((prev) => !prev);
  const onShowReplyBtnClick = () => setShowReply((prev) => !prev);

  const onHeartClick = async () => {
    mutate((prev) => {
      if (!prev) return;
      const copy: Data<TComment[]>[] = deepCopy(prev);
      const pageIndex = copy.findIndex((item) =>
        item.res.some((comment) => comment.id === id)
      );
      const tweetIndex = copy[pageIndex].res.findIndex(
        (tweet) => tweet.id === id
      );
      const isLiked = copy[pageIndex].res[tweetIndex].isLiked;
      const numOfLikes = copy[pageIndex].res[tweetIndex]._count.commentLikes;
      copy[pageIndex].res[tweetIndex].isLiked = !isLiked;
      copy[pageIndex].res[tweetIndex]._count.commentLikes = isLiked
        ? numOfLikes - 1
        : numOfLikes + 1;
      return copy;
    }, false);
    if (loading) return;
    await toggleLike({ id });
    mutate();
  };

  return (
    <>
      <div className="flex items-center justify-between fle">
        <div className="pr-4">
          <span>{name}</span>
          <span className="text-sm text-gray-400 block font-light break-all">
            {content}
          </span>
          <div className="flex items-center">
            <span className="text-xs font-extralight text-gray-400">
              {formatCreatedAt(createdAt)}
            </span>
            <span className="text-xs font-extralight text-gray-400">﹒</span>
            {commentLikes ? (
              <>
                <span className="text-xs font-extralight text-gray-400">
                  {commentLikes} {commentLikes === 1 ? "like" : "likes"}
                </span>
                <span className="text-xs font-extralight text-gray-400">
                  ﹒
                </span>
              </>
            ) : null}
            <button
              onClick={onBtnClick}
              className="text-xs font-extralight text-gray-400"
            >
              Reply
            </button>
            {children && (
              <>
                <span className="text-xs font-extralight text-gray-400">
                  ﹒
                </span>
                <button
                  onClick={onShowReplyBtnClick}
                  className="text-xs font-extralight text-gray-400"
                >
                  {showReply ? "Hide" : "Show"} {children}{" "}
                  {children === 1 ? "reply" : "replies"}
                </button>
              </>
            )}
          </div>
        </div>
        <button onClick={onHeartClick}>
          {isLiked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-gray-300"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          )}
        </button>
      </div>
      {showInput && (
        <CommentForm
          name={name}
          parentId={parentId || id}
          onSubmitComplete={() => setShowInput(false)}
        />
      )}
      {showReply && (
        <div className="pl-6">
          <Comments numOfComments={children} parentId={id} />
        </div>
      )}
    </>
  );
}
