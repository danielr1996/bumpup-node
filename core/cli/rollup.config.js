import typescript from 'rollup-plugin-typescript2';
import shebang from 'rollup-plugin-add-shebang';
import clean from 'rollup-plugin-clean';
import json from '@rollup/plugin-json';

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
    ],
    external: ['fs', 'process', 'path', 'commander','@bumpup/lib', 'log-symbols','winston']
};

