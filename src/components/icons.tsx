import type { SVGProps } from "react"

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
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
      <path d="M2 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10l8 8v10a2 2 0 0 1-2 2H2Z" />
      <path d="M14 2v8h8" />
      <path d="M4 12h8" />
      <path d="M4 16h8" />
    </svg>
  ),
}
