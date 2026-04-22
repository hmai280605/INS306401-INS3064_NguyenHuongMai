<?php

require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Model.php';
require_once __DIR__ . '/../core/Router.php';

require_once __DIR__ . '/../app/models/Product.php';
require_once __DIR__ . '/../app/controllers/ProductController.php';

$config = require_once __DIR__ . '/../config/app.php';

$router = new Router();

// Đăng ký routes
$router->get('/products', 'ProductController@index');
$router->get('/products/create', 'ProductController@create');
$router->post('/products/create', 'ProductController@store');

// Chạy router
$router->dispatch($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);