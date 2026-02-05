import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlogHeader } from '@/components/blog/blog-header';
import { Section } from '@/components/section';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '@/mdx-components';
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const components = useMDXComponents({});

  return (
    <Section className="max-w-4xl mx-auto">
      <Link href="/blog" className="inline-block mb-8">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>
      </Link>

      <article>
        <BlogHeader
          title={post.title}
          description={post.description}
          date={post.date}
          author={post.author}
          readingTime={post.readingTime}
          tags={post.tags}
        />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote
            source={post.content}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </div>
      </article>
    </Section>
  );
}
