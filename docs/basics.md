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

### Создание моделей Eloquent

Для начала создадим модель Eloquent. Модели обычно располагаются в директории `app`. Но возможно поместить их в любое место, в котором работает автозагрузчик. Все модели Eloquent наследуют класс `Illuminate\Database\Eloquent\Model`.

Рассмотрим на примере модели `Employee.php`, которая используется для получения и хранения информации из таблицы базы данных о сотрудниках:

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
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

use Illuminate\Database\Eloquent\Model;
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
Предполагается, что первичный ключ является инкрементным числом, и автоматически будет приведёт к типу int. Для использования неинкрементного или нечислового первичного ключа необходимо задать открытому свойству $incrementing значение false.

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model {
	 /**
	 * Таблица, связанная с моделью.
	 *
	 * @var string
	 * @var int
	 /
	 protected $table = 'employee';
	 protected $primaryKey = 'userId';
}
```

### Отметки времени

По умолчанию в моделях Eloquent предполагается, что в таблице есть поля меток времени (timestamp) — created_at и updated_at. Чтобы они не обрабатывались автоматически в Eloquent нужно установить свойство $timestamps класса модели в false. В противном случае в таблице будут присутствовать поля меток времени (timestamp) — created_at и updated_at. Так как изначально в проекте свойство $timestamps = false, то, например, в модели User.php это свойство установлено в true:

```php
<?php
namespace App\Models\Users;

use Illuminate\Database\Eloquent\Model;
use Pandora3\Libs\Application\Application;

class User extends Model {
	/**
	 * Таблица, связанная с моделью. 
	 *
	 * @var string
	 protected $table = 'user';
	 
	 * @var bool
	 public $timestamps = true;
	 */

	
}
```

### Соединение с БД

По умолчанию модели Eloquent будут использовать основное соединение с БД, настроенное для приложения. Если есть необходимость указать другое соединение для модели, то надо использовать свойство $connection. Например, в модели `EduUser.php` было указано отличное от основного соединение: 

```php
<?php
namespace Auth\Services\Employee;

use Illuminate\Database\Eloquent\Model;
use App\Models\Employee;

class EmployeeImportService extends Model {
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
use App\Models\Users;

protected function printUser() {
	 $users = App\Models\Users::all();

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
$user = App\Models\Users::find(1);

// Получение первой модели, удовлетворяющей условиям
$user = App\Models\Users::where('id', 1)->first();
}
```

Также можно вызвать метод `find` с массивом первичных ключей, который вернёт коллекцию подходящих записей:
 
```php
<?php

$user = App\Models\Users::find([1, 2, 3]);
}
```

#### Исключение "Не найдено"

Иногда нужно обработать исключение, если определённая модель не была найдена. Методы `findOrFail` и `firstOrFail` получают первый результат запроса. А если результатов не найдено, выбрасывается исключение `Illuminate\Database\Eloquent\ModelNotFoundException`. Пример можно увидеть в функции обновления пользователя.

```php
<?php
namespace App\Plugins\Users\Controllers;

use App\Models\Users;

protected function update() {
	 $id = (int) $this->request->get('id');
	 $user = User::findOrFail($id);
	 // Если пользователь найден, то далее следует обновление данных
}
```

### Встака и изменение моделей

Для создания новой записи в БД надо создать экземпяр модели, задать атрибуты модели и вызвать метод `save` или `saveOrFail`. Рассмотрим на примере создания нового экземпляра студента.

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

При вызове метода save запись будет вставлена в таблицу, содержащую информацию о студентах. Отметки времени `created_at` и `updated_at` будут автоматически установлены при вызове save, поэтому их не нужно задавать вручную.

### Удаление моделей

Для удаления модели нужно вызвать метод delete на ее экземпляр.

```php
<?php
namespace App\Plugins\Students\Controllers;

use App\Models\Student;

class StudentController extends Controller {
	$student = Student::find($id);
	$student->delete();
}
```
В итоге будет удалена информация о студенте с заданным `id`.

## Виджеты

<!-- В виде основного класса отнаследованного от **\Core\Widget**, дополнительные классы (если требуются) и набор шаблонов. -->

Использование виджетов удобно при необходимости разбивать вывод информации страницы на определенные блоки. Например меню, сайдбар, слайдер, форму подписки и тд. При этом, лучшим решением будет сделать такие блоки максимально автономными - со своим классом, шаблоном и тд. То есть сделать данные блоки отдельными виджетами, которые затем можно легко подключать в любом нужном шаблоне.
Это помогает разгрузить контроллер от дополнительного кода, сгруппировать файлы виджетов в одном месте, легко поддерживать их код и использовать одинаковый, простой синтаксис вызова нужного блока. 

### Установка

Установка пакета с помощью Composer (запустить composer).

```
composer require klisl/laravel-widgets  
```

По умолчанию пакет пытается найти виджет в пространстве имен App \ Widgets. Хотя использование пространства имен по умолчанию очень удобно, в некоторых случаях может потребоваться больше гибкости. Например, большое количество виджетов имеет смысл сгруппировать в папки с пространством имен.

### Создание виджета и работа с ним.

Создание рассмотрим на примере виджета, отвечающего за меню. Файлы виджетов нужно создавать в папке app\Widgets.
Класс виджета должен иметь соответствующее пространство имен: namespace App\Widgets. Так же класс виджета должен включать интерфейс ContractWidget и реализовывать его метод execute().
Если виджет должен, для своей работы, получить какие-то данные из контроллера и тд. (передаются в шаблоне), то необходимо предусмотреть метод конструктор для класса виджета с получением аргумента в виде массива параметров.

```php
<?php
namespace App\Widgets\Menu;

use App\Models\Directions\Direction;
use App\Models\Examination\ExaminationMark;
use App\Models\FinanceHelp\FinanceHelp;
use App\Models\Stipend\Stipend;
use App\Models\StudentGroups\StudentGroup;
use App\Models\Students\Student;
use App\Models\StudyPlans\StudyPlan;
use App\Models\Users\User;
use Pandora3\Libs\Widget\Widget;

class Menu extends Widget {

}
```

### Использование

В файле `config\widgets.php` находится массив, в котором, в качестве ключей нужно указать названия для создаваемых виджетов, а в качестве значений названия классов виджетов (с пространством имен). Например:
 
```php
'test' => 'App\Widgets\TestWidget'
```

Классы для своих виджетов нужно создавать в папке `app\Widgets`. Для размещения шаблонов виджетов предназначена папка `app\Widgets\views`.

Класс виджета должен иметь соответствующее пространство имен: `namespace App\Widgets`. Так же класс виджета должен включать интерфейс ContractWidget и реализовывать его метод execute(). 
Если виджет должен, для своей работы, получить какие-то данные из контроллера и тд. (передаются в шаблоне), то необходимо предусмотреть метод конструктор для класса виджета с получением аргумента в виде массива параметров. 

### Передача переменных в виджет

#### Через конфигурационный массив

#### Напрямую через метод run()

### Пример с передачей параметров.

```php
<?php
namespace App\Widgets\Menu;

 // В качестве примера указаны только основные модели
use App\Models\Directions\Direction;
use App\Models\Examination\ExaminationMark;
use App\Models\FinanceHelp\FinanceHelp;
use App\Models\Stipend\Stipend;
use App\Models\StudentGroups\StudentGroup;
use App\Models\Students\Student;
use App\Models\StudyPlans\StudyPlan;
use App\Models\Users\User;
use Pandora3\Libs\Widget\Widget;

class Menu extends Widget {
	public function __construct(string $uri, array $context = []) {
		$this->uri = $uri;
		parent::__construct($context);
	}
	
		protected function getItems() {
		$items = [
			[
				'uri' => '/users',
				'visible' => function(User $user) {
					return $user->can('view', User::class);
				},
				'title' => 'Пользователи', 'icon' => '<i class="mdi mdi-shield-account"></i>'
			],
			[
				'uri' => '/directions',
				'visible' => function(User $user) {
					return $user->can('view', Direction::class) && !$user->isOperatorEntrance();
				},
				'title' => 'Направления', 'icon' => '<i class="mdi mdi-folder-text"></i>'
			],
			[
				'uri' => '/study-plans',
				'visible' => function(User $user) {
					return $user->can('view', StudyPlan::class) && !$user->isOperatorEntrance();
				},
				'title' => 'Учебные планы', 'icon' => '<i class="mdi mdi-school"></i>'
			],
			// Аналогично задаются другие пункты меню: Успеваемость, Группы, Студенты, Успеваемость, Стипендии, Материальная помощь
		];

		return $items;
	}

```

## Библиотеки

Библиотеки — это классы, выполняющие действия, не привязанные к конкретному проекту. Например, это может быть библиотека для создания PDF-документов из HTML. Эта задача не специфична конкретно для какого-то проекта — такие вещи и называются «библиотеками».

## Плагины

<!-- . В чем тогда разница между **плагином** и **библиотекой**? Библиотека привносит исключительно новые классы, тем самым добавляя возможности программисту. Плагин же добавляет готовую функциональность, доступную пользователю, например хранилище документов или систему личных сообщений (сравнимо с компонентами в CMS). Для этого он содержит контроллеры и шаблоны. -->

