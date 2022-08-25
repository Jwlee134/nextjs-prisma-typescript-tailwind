import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { cls } from "../lib/client/utils";

interface Props {
  children: ReactNode;
  center?: boolean;
  hasBackBtn?: boolean;
  title?: string;
}

export default ({ children, center, hasBackBtn, title }: Props) => {
  const router = useRouter();

  return (
    <div
      className={cls(
        "bg-zinc-900 min-h-screen",
        center ? "flex items-center" : ""
      )}
    >
      {(hasBackBtn || title) && (
        <div className="relative max-w-lg m-auto h-12 flex justify-center items-center">
          {hasBackBtn && (
            <button
              onClick={router.back}
              className="absolute left-0 w-12 h-12 flex justify-center items-center"
            >
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}
          {title && <span className="text-lg">{title}</span>}
        </div>
      )}
      <div
        className={cls("max-w-lg m-auto py-20 px-5", center ? "w-full" : "")}
      >
        {children}
      </div>
    </div>
  );
};
