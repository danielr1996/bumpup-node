import typescript from '@rollup/plugin-typescript';
import shebang from 'rollup-plugin-add-shebang';
import del from 'rollup-plugin-delete'

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/index.js',
        format: 'es'
    },
    plugins: [
        typescript(),
        shebang({include:'dist/index.js'}),
        del({ targets: 'dist/*' })
    ]
};
