<?php

class Router
{
    private $routes = [];

    public function get($uri, $action)
    {
        $this->routes['GET'][$uri] = $action;
    }

    public function post($uri, $action)
    {
        $this->routes['POST'][$uri] = $action;
    }

    public function dispatch($requestUri, $requestMethod)
    {
        $path = parse_url($requestUri, PHP_URL_PATH);

        if (isset($this->routes[$requestMethod][$path])) {
            $action = $this->routes[$requestMethod][$path];

            [$controllerName, $methodName] = explode('@', $action);

            $controller = new $controllerName();
            $controller->$methodName();
        } else {
            http_response_code(404);
            echo "404 - Page not found";
        }
    }
}