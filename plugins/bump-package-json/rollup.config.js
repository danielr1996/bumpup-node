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
        clean(),
        typescript({clean: true}),
    ],
    external: ['fs','@bumpup/fp','winston','log-symbols']
};
