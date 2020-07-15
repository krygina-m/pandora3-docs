# Основы

## Создание приложения

### Загрузчик

Точка входа в приложение располагается в файле `public/index.php`. На него будут перенапрвляться все запросы (кроме запросов к статичным ресурсам). Это позволяет повысить безопасность и обеспечить работу [маршрутизации](#маршрутизация). Содержимое загрузчика:

```php
<?php

$loader = require __DIR__ .'/../vendor/autoload.php';
$loader->setPsr4('App\\', __DIR__.'/../app');

$mode = 'dev';
(new App\App())->run($mode);
```

::: tip Примечание
В стандартной комплектации уже содержатся файлы настроек веб-сервера. Но их нужно будет исправить, если вы хотите разместить загрузчик и в другом месте или использовать несколько загрузчиков.
:::

### Режим запуска

Переменная `$mode` отвечает за режим запуска приложения. В режиме `dev` включена отладка и отображаются подробные сообщения об ошибках. Не забудьте изменить режим на `prod` при развертывании на рабочем (production) сервере.

::: tip Примечание
В файлах конфигурации `config/configDev.php` и `config/configProd.php` можно указывать настройки специфичные для определенного режима запуска. Подробнее о [конфигурации](#).
:::

### Класс приложения

Класс приложения позволяет управлять настройками и зависимостями, а также служит точкой входа для маршрутизации. Создадим файл `App/App.php` следующего содержания:

```php
<?php
namespace App;

use Pandora3\Core\Application\Application;

class App extends Application {
	
}
```

::: tip Примечание
Вместо `app\App` в качестве имени класса и пространства имен можно использовать и другие идентификаторы, главное чтобы им соответствовали названия файла и каталога. Не забудьте также изменить значения в `public/index.php`.
:::

### Контейнер зависимостей

При инициализации класс приложения создает контейнер зависимостей `$this->container`. Переопределив метод `dependencies` в классе приложения можно добавлять и переопределять зависимости.

```php
protected function dependencies(Container $container): void {
	parent::dependencies($container);
	$container->setShared(DatabaseConnectionInterface::class, EloquentConnection::class);
}
```

::: tip Примечание
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
	'/*' => \App\Controllers\HomeController::class,
	'/books/*' => \App\Controllers\BooksController::class
];
```

В качестве ключей укажем маршруты, а в качестве значений имена классов контроллеров. При указании адреса можно использовать `*` для обозначения произвольных частей адреса. В качестве значения вместо класса контроллера можно указать любой класс который поддерживает интерфейс `RouteInterface` или функцию-замыкание.

::: tip Примечание
Если не указывать `*` на конце маршрута, он будет срабатывать полько при строгом соответствии. Но при этом будет невозможно использовать вложенную маршрутизацию.
:::


## Контроллеры

Создание контроллера `App/Controllers/BookController.php` выглядит следующим образом:

```php
<?php
namespace App\Controllers;

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

Модели предоставляют объектный способ работы с базой данных, реализуя подход ORM. На данный момент доступна работа с БД с помощью [Eloquent](https://laravel.com/docs/5.8/eloquent) (библиотека входящая в состав фреймворка [Laravel](https://laravel.com/)). Каждая таблица имеет соответствующий класс-модель, который используется для работы с этой таблицей. Модели позволяют запрашивать данные из таблиц, а также вставлять в них новые записи.
В будущем будут добавлены адаптер для Doctrine (из Symfony) и проработанное нативное решение.

### Определение моделей

Для начала создается модель Eloquent. Модели обычно располагаются в директории app. Все модели Eloquent наследуют класс Illuminate\Database\Eloquent\Model.

### Условия для моделей Eloquent

Рассмотрим на примере модели Employee, которая используется для получения и хранения информации из таблицы базы данных о сотрудниках:
```php
<?php
namespace Auth\Models;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Employee extends BaseModel {
       //
}
```
### Имена таблиц

Можно явно указать имя таблицы.
```php
<?php
namespace Auth\Models;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Employee extends BaseModel {
       protected $table = 'employee';
}
```
Если это имя не указано явно, то в соответствии с принятым соглашением будет использовано имя класса в нижнем регистре (snake case) и во множественном числе.

### Первичные ключи

Eloquent предполагает, что каждая таблица имеет первичный ключ с именем id. Можно определить свойство $primaryKey для указания другого имени.
Предполагается, что первичный ключ является инкрементным числом, и автоматически приведёт его к типу int. Для использования неинкрементного или нечислового первичного ключа необходимо задать открытому свойству $incrementing значение false.
```php
<?php
namespace Auth\Models;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Employee extends BaseModel {
       protected $table = 'employee';
       protected $primaryKey = 'userId';
}
```
## Виджеты

<!-- В виде основного класса отнаследованного от **\Core\Widget**, дополнительные классы (если требуются) и набор шаблонов. -->

## Библиотеки


## Плагины

<!-- . В чем тогда разница между **плагином** и **библиотекой**? Библиотека привносит исключительно новые классы, тем самым добавляя возможности программисту. Плагин же добавляет готовую функциональность, доступную пользователю, например хранилище документов или систему личных сообщений (сравнимо с компонентами в CMS). Для этого он содержит контроллеры и шаблоны. -->

