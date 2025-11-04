import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CharacterDetailView } from '../../components/CharacterDetailView';
import { use } from 'react';

interface CharacterDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: CharacterDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Detalhes do Personagem #${resolvedParams.id} | Rick and Morty Wiki`,
  };
}

export default function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  if (isNaN(Number(id))) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <CharacterDetailView characterId={id} />
    </main>
  );
}
