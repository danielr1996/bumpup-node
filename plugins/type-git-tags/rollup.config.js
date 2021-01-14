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
        typescript({clean: true}),
        clean(),
        nodeResolve(),
    ],
    external: ['fs', 'child_process','log-symbols', 'winston']
};
