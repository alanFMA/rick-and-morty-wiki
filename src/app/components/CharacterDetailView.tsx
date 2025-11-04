'use client'; // Componente de Cliente para usar hooks
import { useRouter } from 'next/navigation';
import {
  useGetCharacterDetailsQuery,
  GetCharacterDetailsQuery,
} from '../graphql/generated/types';
import Image from 'next/image';

interface CharacterDetailViewProps {
  characterId: string;
}

type Character = NonNullable<GetCharacterDetailsQuery['character']>;

export function CharacterDetailView({ characterId }: CharacterDetailViewProps) {
  const router = useRouter();

  const { data, loading, error } = useGetCharacterDetailsQuery({
    variables: { id: characterId },
  });

  if (loading)
    return <p className="p-8 text-center text-lg">Carregando detalhes...</p>;
  if (error)
    return (
      <p className="p-8 text-center text-lg text-red-500">
        Erro: {error.message}
      </p>
    );
  if (!data?.character)
    return (
      <p className="p-8 text-center text-lg">Personagem não encontrado.</p>
    );

  const char = data.character as Character;

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-gray-800 shadow-2xl">
      <div className="md:flex">
        <div className="md:w-1/3">
          <Image
            src={char.image!}
            alt={char.name!}
            className="h-full w-full object-cover"
            width={500}
            height={500}
          />
        </div>
        <div className="p-6 md:w-2/3 md:p-8">
          <h1 className="mb-2 text-4xl font-bold">{char.name}</h1>
          <p className="mb-4 text-xl text-gray-400">
            {char.species} - {char.gender}
          </p>
          <h3 className="mt-6 mb-3 text-2xl font-semibold">Episódios</h3>
          <ul className="h-40 list-inside list-disc overflow-y-auto rounded bg-gray-900 p-3">
            {char.episode?.map((ep) => (
              <li key={ep!.name}>
                {ep!.name} ({ep!.air_date})
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gray-900 p-6 text-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-blue-400 transition-colors hover:text-blue-300"
        >
          &larr; Voltar para a lista
        </button>
      </div>
    </div>
  );
}
