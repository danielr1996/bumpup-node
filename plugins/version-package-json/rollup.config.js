import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import clean from 'rollup-plugin-clean';

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
        resolve(),
        clean(),
    ],
    external: "fs"
};
