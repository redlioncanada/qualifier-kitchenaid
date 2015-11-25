<?php
    $sends_per_minute = 10;
    $sends_per_hour = 50;

    if (!checkPostParams()) {
        echo json_encode(array(
            "status"=>"error",
            "message"=>"post params malformed"
        ));
    } else {
        require __DIR__ . '/vendor/autoload.php';
        require __DIR__ . '/auth.php';
        require __DIR__ . '/database.php';

        $db = new DatabaseConnection(array(
            'username'=>$db_user,
            'password'=>$db_pass,
            'host'=>$db_host,
            'dbname'=>$db_name,
            'max_requests_per_minute'=>$sends_per_minute,
            'max_requests_per_hour'=>$sends_per_hour
        ));
    	
        if (!$db->IsOverLimit(getRequestIP())) {
            try {
                $mandrill = new Mandrill($api_key);
                $message = array(
                    'html' => $_POST["message"],
                    'text' => null,
                    'subject' => $_POST["subject"],
                    'from_email' => 'qualifier@kitchenaid.ca',
                    'from_name' => $_POST["name"],
                    'to' => array(
                        array(
                            'email' => $_POST["address"],
                            'name' => null,
                            'type' => 'to'
                        )
                    ),
                    'tags' => array(
                        'kitchenaid_qualifier'
                    ),
                    'important' => false,
                    'track_opens' => true,
                    'track_clicks' => true,
                );
                $result = $mandrill->messages->send($message);
                echo json_encode($result[0]);
            } catch(Mandrill_Error $e) {
                echo json_encode(array(
                    "status"=>"error",
                    "message"=>$e->getMessage()
                ));
            }
        } else {
            echo json_encode(array(
                "status"=>"error",
                "message"=>"ip reached limit"
            ));
        }
    }

    function checkPostParams() {
        if (!isset($_POST)) return false;
        if (!(isset($_POST["address"]) && isset($_POST["name"]) && isset($_POST["message"]) && isset($_POST["subject"]))) return false;
        return true;
    }

    function getRequestIP() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            return $_SERVER['REMOTE_ADDR'];
        }
    }
?>