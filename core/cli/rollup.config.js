import typescript from 'rollup-plugin-typescript2';
import shebang from 'rollup-plugin-add-shebang';
import resolve from '@rollup/plugin-node-resolve';
import clean from 'rollup-plugin-clean';

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
        resolve(),
        clean(),
        typescript({clean: true}),
        shebang({include: 'dist/index.js'}),
    ],
    external: ['fs','process','path']
};

