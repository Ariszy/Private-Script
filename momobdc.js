/*
墨墨背单词3.5.4版本

［rewrite］
^https\:\/\/api\.maimemo\.com\/api\/v1/users/info url script-response-body https://raw.githubusercontent.com/ZhiYi-N/Loon/master/momobdc.js
https://api.maimemo.com/api/v1/system/check url reject
［mitm］
hostname=api.maimemo.com

*/
let obj = JSON.parse($response.body);


obj.data["user"]["inf_level"] = 99;
obj.data["user"]["level"] = 99;
obj.data["user"]["inf_words_limit"] = 999999;

$done({body: JSON.stringify(obj)});
