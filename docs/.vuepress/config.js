module.exports = {
    base: '/pandora3/',
    themeConfig: {
        nav: [
            {text: 'Быстрый старт',     link: '/getting-started.html'},
            {text: 'Основы',            link: '/basics.html'},
            {text: 'API',               link: '/api/'},
            {text: 'Концепция',         link: '/concept.html'}
        ],
        sidebarDepth: 2,
        sidebar: [
            '/getting-started',
            '/basics',
            ['/api/', 'API'],
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
