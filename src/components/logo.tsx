import * as React from "react";

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>Lienzo Logo</title>
      <path d="M20.32 3.68A2.5 2.5 0 0 0 16.83 2l-2.07.72-8.62 12.38a.5.5 0 0 0 .2.69l.52.36c.2.13.48.07.61-.13L16.2 5.08l2.07-.72c.98-.34 1.58-1.42 1.05-2.68z" />
      <path d="m5.2 11.23-2.07.72a2.5 2.5 0 0 0-1.42 3.76l1.24 2.2a2.5 2.5 0 0 0 3.76-1.42l.36-.52a.5.5 0 0 0-.13-.61l-1.24-2.2a.5.5 0 0 0-.69-.2z" />
    </svg>
  );
}
