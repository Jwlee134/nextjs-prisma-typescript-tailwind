import { Tweet } from "@prisma/client";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import Layout from "../../components/Layout";
import useMutation, { Data } from "../../lib/client/useMutation";
import { formatCreatedAt } from "../../lib/client/utils";

type Response = Data<
  Tweet & {
    user: { name: string };
    isLiked: boolean;
    _count: { likes: number };
  }
>;

export default () => {
  const { query } = useRouter();
  const { data: { res } = {}, mutate } = useSWR<Response>(
    query.id ? `/tweets/${query.id}` : null
  );
  const [trigger, { loading }] = useMutation(`/tweets/${query.id}/toggleLike`);

  const onLikeClick = async () => {
    mutate((prev) => {
      if (!prev) return;
      const isLiked = prev.res.isLiked;
      const num = prev.res._count.likes;
      return {
        ...prev,
        res: {
          ...prev.res,
          isLiked: !isLiked,
          _count: { likes: isLiked ? num - 1 : num + 1 },
        },
      };
    }, false);
    if (loading) return;
    await trigger();
    mutate();
  };

  return (
    <Layout hasBackBtn>
      <Head>
        <title>{res?.title}</title>
      </Head>
      <span className="text-5xl">{res?.title}</span>
      <p className="text-gray-400 mt-3 break-words">{res?.content}</p>
      <div className="mt-6 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="hover:scale-125 transition-transform"
            onClick={onLikeClick}
          >
            {res?.isLiked ? (
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
            {res?._count.likes} {res?._count.likes === 1 ? "like" : "likes"}
          </span>
        </div>
        {res?.createdAt && (
          <span className="text-sm">
            {res?.user.name} ﹒ {formatCreatedAt(res?.createdAt)}
          </span>
        )}
      </div>
    </Layout>
  );
};
