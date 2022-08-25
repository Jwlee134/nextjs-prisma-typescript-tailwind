import React, { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { cls } from "../lib/client/utils";
import ErrorMessage from "./ErrorMessage";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  name: string;
  register: UseFormRegisterReturn;
  errorMsg?: string;
  hideLabel?: boolean;
}

export default ({
  id,
  name,
  register,
  errorMsg,
  hideLabel = false,
  ...rest
}: Props) => {
  return (
    <>
      {!hideLabel && (
        <label htmlFor={id} className="text-sm">
          {name}
        </label>
      )}
      <input
        id={id}
        {...register}
        className={cls(
          "bg-zinc-800 h-10 px-2 outline-none rounded-md mt-2 text-sm",
          errorMsg ? "mb-1" : "mb-2"
        )}
        {...rest}
      />
      {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
    </>
  );
};
