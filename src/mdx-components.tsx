import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-8 scroll-m-20 text-4xl font-bold tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="mt-6 scroll-m-20 text-lg font-semibold tracking-tight">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="mt-6 scroll-m-20 text-base font-semibold tracking-tight">
        {children}
      </h6>
    ),
    p: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
    ),
    a: ({ href, children }) => (
      <Link
        href={href as string}
        className="font-medium text-cyan underline underline-offset-4 hover:text-cyan/80"
      >
        {children}
      </Link>
    ),
    ul: ({ children }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-cyan pl-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-black p-4">
        {children}
      </pre>
    ),
    table: ({ children }) => (
      <div className="my-8 w-full overflow-x-auto rounded-lg border border-purple/30 bg-card/50 backdrop-blur-sm">
        <table className="w-full border-collapse">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-purple/20 border-b border-purple/30">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-purple/20">
        {children}
      </tbody>
    ),
    th: ({ children }) => (
      <th className="px-6 py-4 text-left text-sm font-semibold text-cyan [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 text-sm text-muted-foreground [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </td>
    ),
    tr: ({ children }) => (
      <tr className="transition-colors hover:bg-purple/10">
        {children}
      </tr>
    ),
    Image: (props: ImageProps) => <Image {...props} />,
    hr: () => <hr className="my-8 border-border" />,
    ...components,
  };
}
