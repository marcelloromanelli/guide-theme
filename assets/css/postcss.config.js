const path = require('path');
const themeDir = path.resolve(__dirname, '../../') + '/';
// Site root is one level above the theme dir; node_modules/tailwindcss lives there.
const siteDir = path.resolve(themeDir, '../../') + '/';

const purgecss = require('@fullhuman/postcss-purgecss')({

    // Specify the paths to all of the template files in your project
    content: [
        themeDir + 'layouts/**/*.html',
        'layouts/**/*.html',
        'content/**/*.html',
    ],

    whitelist: ['content-wrapper', 'blockquote'],

    // This is the function used to extract class names from your templates
    defaultExtractor: content => {
        // Capture as liberally as possible, including things like `h-(screen-1.5)`
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []

        // Capture classes within other delimiters like .block(class="w-1/2") in Pug
        const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []

        return broadMatches.concat(innerMatches)
    }
})

module.exports = {    
    plugins: [        
        require('postcss-import')({
            // Absolute roots so imports resolve regardless of Hugo's PostCSS temp dir:
            //   node_modules/tailwindcss/* -> siteDir, assets/css/* -> themeDir
            path: [siteDir, themeDir]
            }), 
        require('tailwindcss')(themeDir + 'assets/css/tailwind.config.js'),
        require('autoprefixer')({
            path: [themeDir]
        }),
        ...(process.env.HUGO_ENVIRONMENT === 'production' ? [purgecss] : [])
    ]
}
