/**
 * This config depends on creation of the "build" directory by running scripts/generateEmbedCss.js
 */

export default [
    {
        input: 'src/index.js',
        output:
            [
                {
                    file: 'dist/igv-ui.js',
                    format: 'es'
                },
            ]
    }
]
