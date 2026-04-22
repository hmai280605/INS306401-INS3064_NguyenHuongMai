<?php

class Product extends Model
{
    private static $products = [
        ['name' => 'Laptop', 'price' => 1500],
        ['name' => 'Mouse', 'price' => 20],
        ['name' => 'Keyboard', 'price' => 45],
    ];

    public function all()
    {
        return self::$products;
    }

    public function create($data)
    {
        self::$products[] = $data;
    }
}
