/*
墨墨背单词3.5.4版本

重写：^https\:\/\/api\.maimemo\.com\/api\/v1/users/info
手动阻止掉：https://api.maimemo.com/api/v1/system/check

hostname=api.maimemo.com

*/
let obj = JSON.parse($response.body);


obj.data["user"]["inf_level"] = 15;
obj.data["user"]["level"] = 15;
obj.data["user"]["inf_words_limit"] = 999999;

$done({body: JSON.stringify(obj)});