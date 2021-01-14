import typescript from 'rollup-plugin-typescript2'
import clean from 'rollup-plugin-clean';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'es'
        },
    ],
    plugins: [
        clean(),
        typescript({clean: true}),
        nodeResolve()
    ],
    external: ['ramda','winston','log-symbols','semver']
};
