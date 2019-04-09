module.exports = {
    base: '/pandora3/',
    themeConfig: {
        nav: [
            {text: 'Быстрый старт',     link: '/getting-started.html'},
            {text: 'Основы',            link: '/basics.html'},
            {text: 'Концепция',         link: '/concept.html'}
        ],
        sidebar: [
            '/getting-started',
            '/basics',
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
