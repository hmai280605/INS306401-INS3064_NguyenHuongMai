<?php

class ProductController extends Controller
{
    public function index()
    {
        $productModel = new Product();
        $products = $productModel->all();

        $this->view('products/index', ['products' => $products]);
    }

    public function create()
    {
        $this->view('products/create');
    }

    public function store()
    {
        $name = $_POST['name'] ?? '';
        $price = $_POST['price'] ?? '';

        if (empty($name) || empty($price)) {
            echo "Vui lòng nhập đầy đủ tên và giá sản phẩm.";
            return;
        }

        $productModel = new Product();
        $productModel->create([
            'name' => $name,
            'price' => $price
        ]);

        echo "Tạo sản phẩm thành công! <a href='/products'>Xem danh sách</a>";
    }
}