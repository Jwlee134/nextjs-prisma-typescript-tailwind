import { User } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import Input from "../components/Input";
import Layout from "../components/Layout";
import useMutation from "../lib/client/useMutation";
import useUser from "../lib/client/useUser";

interface Form {
  name: string;
  email: string;
  password: string;
  apiError?: string;
}

export default function CreateAccount() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
  } = useForm<Form>();
  const [createAccount, { data, loading, error }] = useMutation(
    "/user/create-account"
  );
  const [login, { data: loginData, loading: loginLoading }] =
    useMutation<User>("/user/log-in");
  const { user, mutate } = useUser();
  const router = useRouter();

  const onValid = (data: Form) => {
    if (loading) return;
    createAccount(data);
  };

  useEffect(() => {
    if (!data?.ok) return;
    const { email, password } = getValues();
    login({ email, password });
  }, [data]);

  useEffect(() => {
    if (!loginData?.ok) return;
    mutate((prev) => prev && { ...loginData, res: loginData?.res });
  }, [loginData]);

  useEffect(() => {
    if (!error) return;
    setError("apiError", { message: error });
  }, [error]);

  useEffect(() => {
    if (!user) return;
    router.replace("/");
  }, [user]);

  return (
    <Layout center>
      <Head>
        <title>Create Account</title>
      </Head>
      <form className="flex flex-col" onSubmit={handleSubmit(onValid)}>
        <Input
          id="name"
          name="Name"
          placeholder="Name"
          register={register("name", { required: "Name is required." })}
          errorMsg={errors.name?.message}
        />
        <Input
          id="email"
          name="Email"
          type="email"
          placeholder="Email"
          onChange={() => clearErrors("apiError")}
          register={register("email", {
            required: "Email is required.",
            pattern: {
              value:
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
              message: "Invalid email format detected.",
            },
          })}
          errorMsg={errors.email?.message}
        />
        <Input
          id="password"
          name="Password"
          type="password"
          placeholder="Password"
          register={register("password", {
            required: "Password is required.",
            minLength: {
              value: 10,
              message: "Should be at least 10 characters.",
            },
          })}
          errorMsg={errors.password?.message}
        />
      </form>
      <Button
        type="submit"
        onClick={handleSubmit(onValid)}
        loading={loading || loginLoading}
      >
        Create Account
      </Button>
      {errors.apiError?.message && (
        <ErrorMessage>{errors.apiError.message}</ErrorMessage>
      )}
      <span className="text-sm mt-2 block text-gray-300">
        Already have an account?
        <Link href="/log-in">
          <a className="ml-2 font-medium">Log in</a>
        </Link>
      </span>
    </Layout>
  );
}
