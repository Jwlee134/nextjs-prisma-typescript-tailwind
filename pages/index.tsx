import React, { useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import useSWRInfinite from "swr/infinite";
import { Tweet as T } from "@prisma/client";
import { useInView } from "react-intersection-observer";
import { Data } from "../lib/client/useMutation";
import Tweet from "../components/Tweet";
import Head from "next/head";
import Link from "next/link";

export type TweetType = T & {
  _count: { likes: number };
  user: { name: string };
  isLiked: boolean;
};

export default function Home() {
  const { data, size, setSize, mutate } = useSWRInfinite<Data<TweetType[]>>(
    (index, prev) => {
      if (index && !prev?.res?.length) return null;
      if (!index) return `/tweets`;
      return `/tweets?lastId=${prev?.res?.at(-1)?.id}`;
    }
  );
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) setSize(size + 1);
  }, [inView]);

  const parsedData = useMemo(
    () => (data && data[0].ok ? data?.flatMap((item) => item?.res) : []),
    [data]
  );

  return (
    <Layout>
      <Head>
        <title>Tweets</title>
      </Head>
      <div className="space-y-4 flex flex-col">
        <Link href="/tweet/create">
          <a className="bg-zinc-700 font-semibold text-white w-full h-12 rounded-md flex justify-center items-center">
            Create a tweet
          </a>
        </Link>
        {parsedData?.map((tweet) => (
          <Tweet key={tweet?.id} mutate={mutate} {...tweet} />
        ))}
      </div>
      {data && <div ref={ref} />}
    </Layout>
  );
}
