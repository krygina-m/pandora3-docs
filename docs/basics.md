# Основы

## Создание приложения

### Точка входа

Точкой входа для приложения будет служить файл `public/index.php`:

```php
<?php

$loader = require __DIR__ .'/../vendor/autoload.php';
$loader->setPsr4('app\\', __DIR__.'/../app');

$mode = 'Dev';
(new app\App())->run($mode);
```

### Режим запуска
 
Переменная `$mode` отвечает за режим запуска приложения. В режиме `Dev` включена отладка и отображаются подробные сообщения об ошибках. Не забудьте изменить режим на `Prod` при развертывании на production сервере.

### Класс приложения

Создадим файл `app/App.php` следующего содержания:

```php
<?php
namespace app;

use Pandora3\Core\Application\Application;

class App extends Application {

	protected function getRoutes(): array {
		return include("{$this->path}/routes.php");
	}
	
}
```

Класс `App` позволяет настроить общие свойства приложения и его поведение. Вместо `app` в качестве пространства имен и `App` в качестве имени класса можно выбрать другие названия. Также при создании класса приложения для него создается контейнер зависимостей, которые будут доступны другим классам. [Подробнее о контейнере].

## Маршрутизация

В файле `app/routes.php` опишем маршруты:

```php
<?php

return [
	'/*' => \app\Controllers\HomeController::class,
	'/books/*' => \app\Controllers\BooksController::class
];
```

Как видно в качестве ключей указываем url адреса, а значениями могут быть имена классов или функции-замыкания. При указании адреса можно использовать * для обозначения вложенных адресов.

## Контроллеры

Создание контроллера `app/Controllers/HomeController.php` выглядит следующим образом:

```php
<?php
namespace app\Controllers;

use Pandora3\Core\Controller\Controller;

class HomeController extends Controller {
	
	public function getRoutes(): array {
		return [
			'/' => 'home'
		];
	}
	
	protected function home() {
		return $this->render('Home');
	}
	
}
```

Остальные контроллеры можно создать точно так же.

## Представления

По умолчанию представления находятся в каталоге `app/Views`. Пример представления `Home.php`:

```
<!DOCTYPE html>
<html lang="ru">
	<head>
	</head>
	<body>
		<h1>Hello, world</h1>
	</body>
</html>
```

### Макеты

Очень часто в макетах есть общая часть, присутствующая на всех страницах (шапка, боковые меню, подвал и т.д.). Поэтому удобнее вынести их в отдельный файл `app/Views/Layout/Main.php`

```
<!DOCTYPE html>
<html lang="ru">
	<head>
	</head>
	<body>
		<header>Header</header>
		<nav>Navigation</nav>
		<main>
			<?= $content ?>
		</main>
		<footer>Footer</footer>		
	</body>
</html>
```

А в обычных представлениях останется только уникальная часть.

```
<h1>Hello, world</h1>
<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
```

Поздравляем вы написали свое первое приложение. 

## Модели

## Виджеты

## Плагины
