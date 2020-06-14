import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete'

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/index.js',
        format: 'es'
    },
    plugins: [
        typescript(),
        del({ targets: 'dist/*' })
    ]
};
