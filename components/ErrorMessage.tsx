export default function ErrorMessage({ children }: { children: string }) {
  return <span className="text-red-500 mb-2 text-xs">⚠ {children}</span>;
}
