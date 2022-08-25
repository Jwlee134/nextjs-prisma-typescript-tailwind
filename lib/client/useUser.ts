import { User } from "@prisma/client";
import useSWR from "swr";
import { Data } from "./useMutation";

export default function useUser() {
  const { data, mutate } = useSWR<Data<User>>("/user/me");

  return { user: data?.res, mutate };
}
