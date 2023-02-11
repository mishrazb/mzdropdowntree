<?PHP 
    function countCities($country){
        $cities = file_get_contents("countries_cities.json");
        $acities = json_decode($cities);
         if( isset($acities->{$country})){
           return count($acities->{$country});
        }else{
            return 0;
        }
    }
    if($_GET['label']){
        $cities = file_get_contents("countries_cities.json");
        $acities = json_decode($cities);
         if( isset($acities->{$_GET['label']})){
            $data = [];
            foreach( $acities->{$_GET['label']} as $k=>$city){
                $data[$city] = array("label"=>$city, 'value'=>$city);
            }
        }
    }else{
        $ccodes = file_get_contents("countrycodes.json");
        $accodes = json_decode($ccodes);
        $data = [];
        foreach($accodes as $k=>$country){
            $data[$country->code] = array(
                "label"=>$country->name, 
                'value'=>$country->code,
                "icon"=>array("tag"=>"img", "attributes"=>array("src"=>"https://flagcdn.com/24x18/". strtolower($country->code) .".png")),
                "children"=>countCities($country->name)
            );
        }
    }
    header('Content-Type: application/json; charset=utf-8');
    print json_encode($data, JSON_PRETTY_PRINT);
?>