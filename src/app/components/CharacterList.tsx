'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useGetCharactersQuery,
  GetCharactersQuery,
} from '../graphql/generated/types';
import Image from 'next/image';

type CharacterResult = NonNullable<GetCharactersQuery['characters']>;
type Character = NonNullable<CharacterResult['results']>[number];

export function CharacterList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;

  const { data, loading, error } = useGetCharactersQuery({
    variables: { page },
  });

  if (loading && !data)
    return <p className="p-8 text-center">Carregando personagens...</p>;
  if (error)
    return (
      <p className="p-8 text-center text-red-600">
        Erro ao carregar os dados: {error.message}
      </p>
    );

  const charactersData = data!.characters;

  if (!charactersData?.results?.length)
    return <p className="p-8 text-center">Nenhum personagem encontrado.</p>;

  const characters = charactersData.results.filter(
    (char): char is Character => char !== null,
  );

  const info = charactersData.info;

  const handlePageChange = (newPage: number) => {
    router.push(`/?page=${newPage}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">
        Rick and Morty Wiki ({info!.count} total)
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {characters.map((char: Character) => (
          <Link href={`/character/${char.id}`} key={char.id}>
            <div className="cursor-pointer overflow-hidden rounded-lg bg-gray-800 shadow-lg transition duration-300 hover:shadow-xl">
              <Image
                src={char.image!}
                alt={char.name!}
                className="h-48 w-full object-cover"
                width={300}
                height={300}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{char.name}</h2>
                <p className="text-sm text-gray-400">Status: {char.status}</p>
                <p className="text-sm text-gray-400">Espécie: {char.species}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-gray-500"
        >
          Anterior
        </button>
        <span className="py-2">
          Página {page} de {info!.pages}
        </span>
        <button
          onClick={() => handlePageChange(Math.min(info!.pages!, page + 1))}
          disabled={page === info!.pages}
          className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-gray-500"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
