'use client';

import AppShell from '@/components/AppShell';

interface AudioPageClientProps {
  initialUrl?: string;
}

export default function AudioPageClient({ initialUrl }: AudioPageClientProps) {
  return <AppShell defaultActiveApp="audio" initialAudioUrl={initialUrl} />;
}
