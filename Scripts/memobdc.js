/*
墨墨背单词3.5.4版本
#圈x
［rewrite］
^https\:\/\/api\.maimemo\.com\/api\/v1/users/info url script-response-body https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/memobdc.js
https://api.maimemo.com/api/v1/system/check url reject
#Loon
http-response ^https\:\/\/api\.maimemo\.com\/api\/v1/users/info script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/memobdc.js, requires-body=true, timeout=10, enabled=false, tag=默默背单词
[ulr rewrite]
https://api.maimemo.com/api/v1/system/check _ reject
［mitm］
hostname=api.maimemo.com
*/
let obj = JSON.parse($response.body);
obj.data["user"]["inf_level"] = 99;
obj.data["user"]["level"] = 99;
obj.data["user"]["inf_words_limit"] = 999999;
$done({body: JSON.stringify(obj)});
