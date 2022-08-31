import React, { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  loading?: boolean;
}

export default function Button({ children, loading, ...rest }: Props) {
  return (
    <button
      disabled={loading}
      className="bg-slate-600 text-sm text-white w-full h-10 rounded-md transition-all ring-0 focus:ring-1 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-slate-500 mt-4"
      {...rest}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
