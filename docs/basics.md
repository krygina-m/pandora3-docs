# Основы

## Создание приложения

### Точка входа

Точкой входа в приложение будет служить файл `public/index.php`:

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

Класс приложения позволяет управлять настройками и зависимостями а также служит точкой входа для маршрутизации. Создадим файл `app/App.php` следующего содержания:

```php
<?php
namespace app;

use Pandora3\Core\Application\Application;

class App extends Application {
	
}
```

:::
Вместо `app\App` в качестве имени класса и пространства имен можно использовать и другие идентификаторы, главное чтобы им соответствовали названия файла и каталога. Не забудьте также изменить значения в `public/index.php`
:::

### Контейнер зависимостей

При инициализации класс приложения создает контейнер зависимостей `$this->container`. Переопределив метод `dependencies` в классе приложения можно добавлять и переопределять зависимости.

```php
	protected function dependencies(Container $container): void {
		parent::dependencies($container);
		$container->setShared(DatabaseConnectionInterface::class, EloquentConnection::class);
	}
```

:::
Если требуется отключить стандартные зависимости, необходимо убрать вызов `parent::dependencies`
:::

### Стандартные зависимости

При наследовании класса приложения от `Pandora3\Core\Application\Application`, он получит следующие зависимости:
* `Request` реализующий `RequestInterface`
* `Router` реализующий `RouterInterface`
* `DatabaseConnection` реализующий `DatabaseConnectionInterface`

## Маршрутизация

В файле `app/routes.php` опишем необходимые маршруты:

```php
<?php

return [
	'/*' => \app\Controllers\HomeController::class,
	'/books/*' => \app\Controllers\BooksController::class
];
```

В качестве ключей укажем маршруты, а в качестве значений имена классов контроллеров. При указании адреса можно использовать `*` для обозначения произвольных частей адреса. В качестве значения вместо класса контроллера можно указать любой класс который поддерживает интерфейс `RouteInterface` или функцию-замыкание.

:::
Если не указывать `*` на конце маршрута, он будет срабатывать полько при строгом соответствии. Но при этом будет невозможно использовать вложенную маршрутизацию
:::


## Контроллеры

Создание контроллера `app/Controllers/BookController.php` выглядит следующим образом:

```php
<?php
namespace app\Controllers;

use Pandora3\Core\Controller\Controller;

class BookController extends Controller {
	
	public function getRoutes(): array {
		return [
			'/' => 'books',
			'/add' => 'add'
		];
	}
	
	protected function books() {
		return $this->render('Books');
	}
	
	protected function add() {
		return $this->render('Form');
	}
	
}
```

Метод `getRoutes` возвращает маршруты в виде массива, где в качестве значений указаны имена методов. Аналогичным образом создадим и другие контроллеры.

## Представления

По умолчанию представления находятся в каталоге `app/Views`. Пример представления `Home.php`:

```html
<!DOCTYPE html>
<html>
	<head></head>
	<body>
		<h1>Hello, world</h1>
	</body>
</html>
```

### Макеты

Как правило в макете есть блоки, присутствующие на всех страницах (шапка, боковые меню, подвал и т.д.). Поэтому удобнее вынести их в отдельный файл `app/Views/Layout/Main.php`:

```html
<!DOCTYPE html>
<html>
	<head></head>
	<body>
		<header>Header</header>
		<nav>Navigation</nav>
		<main><?= $content ?></main>
		<footer>Footer</footer>		
	</body>
</html>
```

В остальных представлениях теперь достаточно оставить только уникальную часть:

```html
<h1>Hello, world</h1>
<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
```

Можно создать и другие макеты (например для печати), и применить один из них перед вызовом метода `render` в контроллере.

```php
	protected function articlePrint() {
		// ...
		$this->setLayout('Print');
		return $this->render('Article');
	}
```

В результате получилось минимальное веб-приложение. Пора проверить его работоспособность в браузере!

## Модели

## Виджеты

## Плагины
