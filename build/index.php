<?php
header ('Content-type: text/html; charset=UTF-8');

// エラー出力しとく
ini_set ( 'display_errors', 1 );

// コンフィグ
define ('PROJECT_NAME', 'セカンドプラン');
define ('PROJECT_DESCRIPTION', 'TST環境です。本番でないです。');
define ('ICON_IMAGE_PATH', '');
define ('SITE_IMAGE_PATH', '');
define ('TMP_DIR', __DIR__ . '/tmp/');


$request = new RequestParam ();
if ($request->isValid ()) {
    header ("HTTP/1.0 404 Not Found");
    return;
}

$template = new TemplateController ($request);
echo $template->Render ();

class TemplateController {
    private $req;
    private $layout;
    private $body = '';
    private $ex_head = '';
    private $script = '';
    private $ex = '.tmp';
    
    function __construct ($req) {
        $this->req = $req;
        $this->layout = $this->getTemplate ('layout');
        $this->ex_head = $this->getTemplate ('config/extend_head');
    }
    public function Render () {
        if (!$this->isPrepare ()) {
            header ("HTTP/1.0 404 Not Found");
        }
        $this->body = $this->getTemplate ($this->req->get ('action'));
        return $this->replaceTag ();
    }
    private function replaceTag () {
        $page = $this->layout;
        $page = preg_replace ('/%%PROJECT_NAME%%/', PROJECT_NAME, $page);
        $page = preg_replace ('/%%PAGE%%/', __CLASS__, $page);
        $page = preg_replace ('/%%PROJECT_DESCRIPTION%%/', PROJECT_DESCRIPTION, $page);
        $page = preg_replace ('/%%EXTEND_HEAD%%/', $this->ex_head, $page);
        $page = preg_replace ('/%%ICON_IMAGE_PATH%%/', ICON_IMAGE_PATH, $page);
        $page = preg_replace ('/%%SITE_IMAGE_PATH%%/', SITE_IMAGE_PATH, $page);
        $page = preg_replace ('/%%BODY%%/', $this->body, $page);
        $page = preg_replace ('/%%SCRIPT%%/', $this->script, $page);
        return preg_replace (['/%%([A-Z_]*)%%/i'], '', $page);
    }
    private function getTemplate ($path) {
        $path = TMP_DIR . $path . $this->ex;
        if (file_exists ($path)) {
            $res = file_get_contents ($path);
            return $res;
        } 
        return '';
    }
    private function isPrepare () {
        return !empty ($this->req) && !$this->req->isValid ();
    }
}
class RequestParam {
    private $param = [];
    private $method = "";
    
    function __construct () {
        $this->method = $_SERVER['REQUEST_METHOD'];
        
        if ($this->isGet ()) {
            foreach ($_GET as $key => $value) {
                $this->param[$key] = $value;
            }
        } else if ($this->isPost ()) {
            foreach ($_POST as $key => $value) {
                $this->param[$key] = $value;
            }
        }
    }
    
    public function get ($key) {
        if (array_key_exists ($key, $this->param))
            return $this->param[$key];
        return null;
    }
    public function isGet () {
        return !empty ($this->method) && $this->method == 'GET';
    }
    public function isPost () {
        return !empty ($this->method) && $this->method == 'POST';
    }
    public function isValid () {
        return empty ($this->method) || empty ($this->param);
    }
}