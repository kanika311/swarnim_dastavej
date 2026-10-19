import type { Metadata } from 'next';
import { getArticleByIdOrSlug, getArticleMetadata } from '@/lib/serverArticles';
import ArticleDetailClient from './ArticleDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleByIdOrSlug(id);
  return getArticleMetadata(article, id);
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticleByIdOrSlug(id);

  return (
    <ArticleDetailClient
      articleId={id}
      initialArticle={article}
    />
  );
}
