import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import useMutation from "../lib/client/useMutation";
import Input from "./Input";

interface Form {
  comment: string;
}

interface Props {
  name?: string;
  parentId?: number;
  onSubmitComplete?: () => void;
}

export default function CommentForm({
  name,
  parentId,
  onSubmitComplete,
}: Props) {
  const { query } = useRouter();
  const [comment, { loading: commentLoading }] = useMutation(
    `/tweets/${query.id}/comments`
  );
  const { register, handleSubmit, setValue } = useForm<Form>();
  const { mutate, cache } = useSWRConfig();

  const onValid = async (data: Form) => {
    if (commentLoading) return;
    await comment(parentId ? { ...data, parentId } : data);
    mutate(
      parentId
        ? `/tweets/${query.id}/comments/${parentId}/replies`
        : `/tweets/${query.id}/comments`
    );
    if (onSubmitComplete) onSubmitComplete();
    setValue("comment", "");
  };

  return (
    <form className="flex items-center mt-6" onSubmit={handleSubmit(onValid)}>
      <Input
        placeholder={name ? `Add a reply to ${name}...` : "Write a comment..."}
        register={register("comment", { required: true })}
      />
      <button
        type="submit"
        className="text-gray-300 text-sm w-14 h-10 flex justify-center items-center"
        onClick={handleSubmit(onValid)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </button>
    </form>
  );
}
