<?php Class DatabaseConnection {

  private $conn;

  public function __construct($opts) {
        $this->max_requests_per_hour = $opts['max_requests_per_hour'];
        $this->max_requests_per_minute = $opts['max_requests_per_minute'];

        try {
         $this->conn = new PDO('mysql:host='.$opts['host'].';dbname='.$opts['dbname'].';charset=utf8', $opts['username'], $opts['password']);
        } catch(Exception $e) {
          //failed to connect
        }
  }

  public function IsOverLimit($ip) {
    $requests = $this->GetRequests($ip);

    if (gettype($requests) == 'object') {
      if (property_exists($requests, 'requests_this_hour') && property_exists($requests, 'requests_this_minute')) {
        
        if ($requests->requests_this_hour < $this->max_requests_per_hour && $requests->requests_this_minute < $this->max_requests_per_minute) {
          //success
          $this->SetRequests($ip,$requests->requests_this_hour+1,$requests->requests_this_minute+1);
          return false;
        } else {
          //limit reached
          return true;
        }
      } else {
        //ip didn't exist in db
        $this->SetRequests($ip,1,1);
        return false;
      }
    } else {
      //if the db query somehow fails, let them send
      return false;
    }
  }

  public function SetRequests($ip,$reqh,$reqm) {
    if ($this->conn) {
      $stmt = $this->conn->prepare("INSERT INTO users (ip,requests_this_hour,requests_this_minute) VALUES(:ip,:requests_this_hour,:requests_this_minute) ON DUPLICATE KEY UPDATE requests_this_hour=:requests_this_hour, requests_this_minute=:requests_this_minute");
      $data = array('ip'=>strval($ip),'requests_this_hour'=>$reqh,'requests_this_minute'=>$reqm);
      $stmt->execute($data);
    } else {
      return false;
    }
  }

  public function GetRequests($ip) {
    if ($this->conn) {
      $stmt = $this->conn->prepare("SELECT requests_this_hour,requests_this_minute FROM users WHERE ip=:ip");
      $stmt->setFetchMode(PDO::FETCH_OBJ);
      $stmt->execute(array(':ip'=>$ip));
      $ret = false;

      while($row = $stmt->fetch()) {
        $ret = $row;
        break;
      }
      if (!$ret) {
        $ret = new stdClass();
      }
      return $ret;
    } else {
      return false;
    }
  }

}
?>