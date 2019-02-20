# Основы

## Создание приложения
Точкой входа для приложения будет служить файл `public/index.php`
```php
<?php

/* register_shutdown_function(function() {
	$fatalErrors = E_ERROR | E_USER_ERROR | E_PARSE | E_CORE_ERROR | E_COMPILE_ERROR | E_RECOVERABLE_ERROR;
	$error = error_get_last();
	if ($error && ($error['type'] & $fatalErrors)) {
		echo '<pre>';
			var_dump($error);
		echo '</pre>';
	}
}); */

ini_set('display_errors', 1);

$loader = require __DIR__ .'/../vendor/autoload.php';
$loader->setPsr4('app\\', __DIR__.'/../app');

// $loader->setPsr4('SleepingOwl\\', __DIR__.'/../src/sleeping-owl-x');

require __DIR__.'/../app/helpers.php';

$mode = 'Dev';
// $mode = 'Prod';

(new app\App())->run($mode);
```

## Маршрутизация

## Контроллеры

## Модели

## Представления

## Виджеты

## Плагины
