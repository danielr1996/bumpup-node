import typescript from 'rollup-plugin-typescript2'
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
        clean(),
    ]
};
