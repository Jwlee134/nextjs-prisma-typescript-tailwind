import { Comment as CommentType } from "@prisma/client";
import { useRouter } from "next/router";
import { Data } from "../lib/client/useMutation";
import Comment from "./Comment";
import useSWRInfinite from "swr/infinite";
import { useMemo } from "react";

interface Props {
  numOfComments?: number;
  parentId?: number | null;
}

export type TComment = CommentType & {
  user: { name: string };
  isLiked: boolean;
  _count: { commentLikes: number; children: number };
};

export default function Comments({ numOfComments, parentId }: Props) {
  const { query } = useRouter();
  const { data, size, setSize, mutate } = useSWRInfinite<Data<TComment[]>>(
    (index, prev) => {
      if (prev && !prev.res.length) return;
      if (index === 0) {
        if (!query.id) return null;
        if (parentId) return `/tweets/${query.id}/comments/${parentId}/replies`;
        return `/tweets/${query.id}/comments`;
      }
      if (parentId)
        return `/tweets/${query.id}/comments/${parentId}/replies?lastId=${
          prev?.res.at(-1)?.id
        }`;
      return `/tweets/${query.id}/comments?lastId=${prev?.res.at(-1)?.id}`;
    }
  );

  const parsedData = useMemo(
    () => (data && data[0].ok ? data?.flatMap((res) => res.res) : []),
    [data]
  );

  if (!data) return null;
  return (
    <div className="mt-2 flex flex-col">
      <div className="space-y-2">
        {parsedData?.map((comment) => (
          <Comment key={comment.id} mutate={mutate} {...comment} />
        ))}
      </div>
      {numOfComments !== parsedData.length && (
        <button
          onClick={() => setSize(size + 1)}
          className="text-gray-400 text-sm mt-4 w-fit m-auto"
        >
          Load more
        </button>
      )}
    </div>
  );
}
