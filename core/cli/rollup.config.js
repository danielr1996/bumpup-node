import typescript from 'rollup-plugin-typescript2';
import shebang from 'rollup-plugin-add-shebang';
import clean from 'rollup-plugin-clean';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.ts',
    inlineDynamicImports: true,
    output: [
        {
            file: 'dist/index.js',
            format: 'es'
        },
    ],
    plugins: [
        clean(),
        json({
            compact: true
        }),
        typescript({clean: true}),
        shebang({include: 'dist/index.js'}),
        nodeResolve(),
    ],
    external: ['fs', 'process', 'path','winston','log-symbols','find-up','commander']
};

