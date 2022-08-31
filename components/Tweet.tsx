import Link from "next/link";
import { MouseEvent } from "react";
import { KeyedMutator } from "swr";
import useMutation, { Data } from "../lib/client/useMutation";
import { deepCopy, formatCreatedAt } from "../lib/client/utils";
import { TweetType } from "../pages";

interface Props extends TweetType {
  mutate: KeyedMutator<Data<TweetType[]>[]>;
}

export default function Tweet({
  id,
  title,
  content,
  user: { name },
  createdAt,
  _count: { likes },
  isLiked,
  mutate,
}: Props) {
  const [trigger, { loading }] = useMutation(`/tweets/${id}/toggleLike`);

  const onLikeClick = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    mutate((prev) => {
      if (!prev) return;
      const copy: Data<TweetType[]>[] = deepCopy(prev);
      const pageIndex = copy.findIndex((item) =>
        item.res.some((tweet) => tweet.id === id)
      );
      const tweetIndex = copy[pageIndex].res.findIndex(
        (tweet) => tweet.id === id
      );
      const isLiked = copy[pageIndex].res[tweetIndex].isLiked;
      const numOfLikes = copy[pageIndex].res[tweetIndex]._count.likes;
      copy[pageIndex].res[tweetIndex].isLiked = !isLiked;
      copy[pageIndex].res[tweetIndex]._count.likes = isLiked
        ? numOfLikes - 1
        : numOfLikes + 1;
      return copy;
    }, false);
    if (loading) return;
    await trigger();
    mutate();
  };

  return (
    <Link href={`/tweet/${id}`}>
      <a className="bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors">
        <div className="px-4 py-2 flex justify-between items-center border-b-[1px] border-b-gray-600">
          <span>{name}</span>
          <span className="text-xs text-gray-400">
            {formatCreatedAt(createdAt)}
          </span>
        </div>
        <div className="px-4 py-2">
          <span className="block font-semibold text-xl">{title}</span>
          <div className="font-light text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
            {content}
          </div>
        </div>
        <div className="px-4 py-2 flex items-center">
          <button
            className="hover:scale-125 transition-transform"
            onClick={onLikeClick}
          >
            {isLiked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-gray-300"
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
                className="w-6 h-6 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            )}
          </button>
          <span className="ml-2 text-sm text-gray-300">
            {likes} {likes === 1 ? "like" : "likes"}
          </span>
        </div>
      </a>
    </Link>
  );
}
