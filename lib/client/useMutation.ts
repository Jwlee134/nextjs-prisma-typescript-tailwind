import { useState } from "react";

type Trigger = (data?: unknown) => Promise<void>;

export type Data<T = any> = { ok: boolean; res: T; [key: string]: any };

type ReturnType<T> = [
  Trigger,
  { data: Data<T> | undefined; error: string | undefined; loading: boolean }
];

export default function useMutation<T>(url: string): ReturnType<T> {
  const [data, setData] = useState<Data<T>>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const trigger: Trigger = async (data = {}) => {
    try {
      if (error) setError(undefined);
      setLoading(true);
      const res = await (
        await fetch(`/api${url}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      ).json();
      if (res.ok) {
        setData(res);
      } else {
        setError(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return [trigger, { data, error, loading }];
}
