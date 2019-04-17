module.exports = {
    base: '/pandora3/',
    themeConfig: {
        nav: [
            {text: 'Быстрый старт',     link: '/getting-started.html'},
            {text: 'Основы',            link: '/basics.html'},
            {text: 'API',               link: '/api/classes.html'},
            {text: 'Концепция',         link: '/concept.html'}
        ],
        sidebar: [
            '/getting-started',
            '/basics',
            {
                title: 'API',
                children: [
                    '/api/classes.html',
                    '/api/interfaces.html',
                    '/api/constants.html',
                    '/api/functions.html',
                    '/api/traits.html'
                ]
            },
            '/concept'
        ]
        /* nav: [{
            text: 'Быстрый старт',
            items: [
                {text: 'Chinese', link: '/language/chinese/'},
                {text: 'Japanese', link: '/language/japanese/'}
            ]
        }] */
    }
};
