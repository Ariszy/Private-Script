/* 
#圈x
^https:\/\/www\.xmind\.cn\/_res\/devices url script-response-body https://raw.githubusercontent.com/ZhiYi-N/Private-Script/Scripts/xmind.js
#Loon
http-response https:\/\/www\.xmind\.cn\/_res\/devices script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/Scripts/xmind.js, requires-body=true, timeout=10, tag=xmind
#[mitm]
www.xmind.cn
*/
var obj = JSON.parse($response.body);
obj = {"raw_data": "S0MY6Wu5wpkW52RE5XmMkSMfTBvnytTwIJODrtVDjnA0axrORbnv9gh1RC4W3/ejTfQhNBb7CVxxpbYnBBk2tHc4gAODhsuGpHkltYNL/P5dfORSpdbiNkAZr5aBBbHS/dNlaYjLYyBkq9Ohfe0QS9PeXOWLbDdNA6kqidLJysw=", "license":{"status":"sub","expireTime":9999999999999}, "_code": 200}
$done({body: JSON.stringify(obj)});
