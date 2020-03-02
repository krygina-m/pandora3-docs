module.exports = {
	base: '/pandora3/',
	title: 'Pandora 3',
	description: 'Lightweight PHP framework',
	head: [
		['link', { rel: 'icon', href: '/logo.png' }]
	],
	themeConfig: {
		repo: 'PandoraTeam/pandora3-Core',
		docsRepo: 'PandoraTeam/pandora3-docs',
		docsDir: 'docs',
		editLinks: true,
		lastUpdated: true,
		
		nav: [
			{text: 'Быстрый старт',	link: '/getting-started.html'},
			{text: 'Основы',		link: '/basics.html'},
			{text: 'API',			link: '/api/'},
			{text: 'Концепция',		link: '/concept.html'}
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
				{text: 'Chinese',	link: '/language/chinese/'},
				{text: 'Japanese',	link: '/language/japanese/'}
			]
		}] */
	}
};
