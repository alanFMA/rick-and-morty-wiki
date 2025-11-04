import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://rickandmortyapi.com/graphql',

  // 1. CAMINHO CORRETO (com 'src/')
  documents: 'src/app/graphql/**/*.graphql',

  generates: {
    // 2. CAMINHO CORRETO (com 'src/')
    'src/app/graphql/generated/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        '@graphql-codegen/typescript-react-apollo',
      ],
      config: {
        skipTypename: true,
        preResolveTypes: true,
        useTypeImports: true,
        gqlImport: 'graphql-tag',
        withHOC: false,
        withComponent: false,
        withHooks: true,
      },
    },
  },
};

export default config;
