import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.mjs',
            format: 'es'
        },
        plugins: [
            typescript(),
        ],
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.cjs',
            format: 'cjs'
        },
        plugins: [
            typescript(),
        ],
    },
];
