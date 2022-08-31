import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import ErrorMessage from "../../components/ErrorMessage";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import useMutation from "../../lib/client/useMutation";
import { cls } from "../../lib/client/utils";

interface Form {
  title: string;
  content: string;
}

export default function CreateATweet() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();
  const [trigger, { data, loading }] = useMutation<{ id: number }>("/tweets");
  const router = useRouter();

  const onValid = (data: Form) => {
    if (loading) return;
    trigger(data);
  };

  useEffect(() => {
    if (data?.ok) router.replace(`/tweet/${data.res.id}`);
  }, [data]);

  return (
    <Layout center>
      <Head>
        <title>Create</title>
      </Head>
      <form className="flex flex-col">
        <Input
          placeholder="Title"
          register={register("title", { required: "Title is required." })}
          errorMsg={errors.title?.message}
        />
        <textarea
          rows={5}
          placeholder="Content"
          className={cls(
            "bg-zinc-800 p-2 outline-none rounded-md mt-2 text-sm text-gray-300",
            errors.content?.message ? "mb-1" : "mb-4"
          )}
          {...register("content", { required: "Content is required." })}
        />
        {errors.content?.message && (
          <ErrorMessage>{errors.content.message}</ErrorMessage>
        )}
        <Button loading={loading} onClick={handleSubmit(onValid)}>
          Create
        </Button>
      </form>
    </Layout>
  );
}
