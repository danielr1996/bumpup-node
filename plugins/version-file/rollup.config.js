import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.cjs',
            format: 'cjs'
        },
        {
            file: 'dist/index.mjs',
            format: 'es'
        },
    ],
    plugins: [
        resolve(),
        typescript({
            clean: true,
        })
    ],
    external: ['fs']
};
