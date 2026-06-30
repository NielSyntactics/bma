<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Libphpexcel {
    public function __construct()
    {
        require_once APPPATH.'third_party/phpexcel/PHPExcel.php';
        require_once APPPATH.'third_party/phpexcel/PHPExcel/Writer/Excel2007.php';
    }
}