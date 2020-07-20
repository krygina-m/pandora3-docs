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

Для начала создается модель Eloquent. Модели обычно располагаются в директории `app`. Но возможно поместить их в любое место, в котором работает автозагрузчик в соответствии с файлом `composer.json`. Все модели Eloquent наследуют класс `Illuminate\Database\Eloquent\Model`.

### Создание моделей Eloquent

Рассмотрим на примере модели `Employee.php`, которая используется для получения и хранения информации из таблицы базы данных о сотрудниках:

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model {
       //
}
```

### Имена таблиц

Можно явно указать имя таблицы.
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model {
       /**
        * Таблица, связанная с моделью.
        *
        * @var string
        */
       protected $table = 'employee';
}
```
Если это имя не указано явно, то в соответствии с принятым соглашением будет использовано имя класса в нижнем регистре (snake_case) и во множественном числе.

### Первичные ключи

Eloquent предполагает, что каждая таблица имеет первичный ключ с именем id. Можно определить свойство $primaryKey для указания другого имени.
Предполагается, что первичный ключ является инкрементным числом, и автоматически приведёт его к типу int. Для использования неинкрементного или нечислового первичного ключа необходимо задать открытому свойству $incrementing значение false.

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model {
       /**
        * Таблица, связанная с моделью.
        *
        * @var string
	* @var int
        */
       protected $table = 'employee';
       protected $primaryKey = 'userId';
}
```

### Отметки времени

По умолчанию в моделях Eloquent предполагается, что в таблице есть поля меток времени (timestamp) — created_at и updated_at Чтобы они не обрабатывались автоматически в Eloquent нужно установить свойство $timestamps класса модели в false. В противном случае в таблице будут присутствовать поля меток времени (timestamp) — created_at и updated_at. Так как изначально в проекте свойство $timestamps = false, то, например, в модели User.php это свойство установлено в true:

```php
<?php
namespace App\Models\Users;

use Auth\Models\BaseModel;
use Pandora3\Libs\Application\Application;

class User extends Model {
        /**
         * Таблица, связанная с моделью.
         *
         * @var string
	 * @var bool
         */
	protected $table = 'user';
	public $timestamps = true;
}
```

### Соединение с БД

По умолчанию модели Eloquent будут использовать основное соединение с БД, настроенное для приложения. Если есть необходимость указать другое соединение для модели, то надо использовать свойство $connection. Например, в модели `EduUser.php` было указано отличное от основного соединение: 

```php
<?php
namespace Auth\Models\Edu;

use Auth\Models\Employee;

class EmployeeImportService {
       /**
        * Название соединения для модели.
        *
        * @var string
        */
       protected $connection = 'edu';
}
```

### Работа с моделями

После создания модели и связанной с ней таблицы, можно начать работать с данными из базы. Каждая модель Eloquent представляет собой мощный конструктор запросов, позволяющий удобно выполнять запросы к связанной таблице. Для примера опять обратимся к модели `User.php`:

```php
<?php
use Auth\Models\Users;

protected function printUser() {
        $users = Auth\Models\Users::all();

        foreach ($users as $user) {
              echo $user->login;
}
```

Метод `all` в Eloquent возвращает все результаты из таблицы модели. Поскольку модели Eloquent работают как конструктор запросов, то возможно добавить ограничения в запрос, а затем использовать метод get для получения результатов.

Такой метод Eloquent, как `all`, получающий несколько результатов, возвращает экземпляр `Illuminate\Database\Eloquent\Collection`. Класс Collection предоставляет множество полезных методов для работы с результатами Eloquent. Например, можно перебирать такую коллекцию в цикле как массив (предыдущий пример).

### Получение одиночных моделей 

Кроме получения всех записей указанной таблицы можно также получить конкретные записи с помощью `find` или `first`. Вместо коллекции моделей эти методы возвращают один экземпляр модели:

```php
<?php

// Получение модели по её первичному ключу
$user = Auth\Models\Users::find(1);

// Получение первой модели, удовлетворяющей условиям
$user = Auth\Models\Users::where('id', 1)->first();
}
```

Также можно вызвать метод `find` с массивом первичных ключей, который вернёт коллекцию подходящих записей:

```php
<?php

$user = Auth\Models\Users::find([1, 2, 3]);
}
```

#### Исключение "Не найдено"

Иногда нужно обработать исключение, если определённая модель не была найдена. Методы `findOrFail` и `firstOrFail` получают первый результат запроса. А если результатов не найдено, выбрасывается исключение `Illuminate\Database\Eloquent\ModelNotFoundException`. Пример можно увидеть в функции обновления пользователя.

```php
<?php
namespace App\Plugins\Users\Controllers;

use Auth\Models\Users;

protected function update() {
	$id = (int) $this->request->get('id');
	$user = User::findOrFail($id);
	// Если пользователь найден, то далее следует обновление данных
}
```

### Встака и изменение моделей

Для создания новой записи в БД надо создать экземпяр модели, задать атрибуты модели и вызвать метод `save` или `saveOrFail`


```php
<?php
namespace App\Plugins\Students\Controllers;

use App\Models\Students\Student;

class StudentController extends Controller {
	/**
     	* Создание нового экземпляра студента
   	*
    	* @param  Request  $request
    	* @return Response
    	*/
	
	protected function add(): {
		\DB::beginTransaction();
		$student = new Student( array_replace($form->studentValues, ['userId' => $user->id]) );
		$student->saveOrFail();
}
```

При вызове метода save запись будет вставлена в таблицу. Отметки времени `created_at` и `updated_at` будут автоматически установлены при вызове save, поэтому их не нужно задавать вручную.

### Удаление моделей

Для удаления модели нужно вызвать метод delete на ее экземпляр.

```php
<?php
namespace Auth\Plugins\Users\Controllers;

use Auth\Models\User;

class UserController extends Controller {
        $user = App\Models\Users\User::find($id);
        $user->delete();
```

## Виджеты

<!-- В виде основного класса отнаследованного от **\Core\Widget**, дополнительные классы (если требуются) и набор шаблонов. -->

## Библиотеки


## Плагины

<!-- . В чем тогда разница между **плагином** и **библиотекой**? Библиотека привносит исключительно новые классы, тем самым добавляя возможности программисту. Плагин же добавляет готовую функциональность, доступную пользователю, например хранилище документов или систему личных сообщений (сравнимо с компонентами в CMS). Для этого он содержит контроллеры и шаблоны. -->

