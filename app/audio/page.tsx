import AudioPageClient from './AudioPageClient';

interface PageProps {
  searchParams: Promise<{ url?: string }>;
}

export default async function AudioPage({ searchParams }: PageProps) {
  const { url } = await searchParams;
  return <AudioPageClient initialUrl={url} />;
}
