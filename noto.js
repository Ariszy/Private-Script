/*
noto笔记解锁Pro--Eric转载注明出处
surge
noto.js = type=http-response,pattern=https://api.revenuecat.com/v1/receipts,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Alex0510/Eric/master/surge/Script/noto.js,script-update-interval=0
hostname：api.revenuecat.com
*/

var obj = JSON.parse($response.body);
obj = {"request_date":"2020-05-19T05:23:00Z","request_date_ms":1589865780878,"subscriber":{"entitlements":{"pro":{"expires_date":"2029-05-26T05:05:04Z","product_identifier":"com.lkzhao.editor.pro.ios.yearly","purchase_date":"2020-05-19T05:05:04Z"}},"first_seen":"2020-05-19T04:59:21Z","last_seen":"2020-05-19T04:59:21Z","management_url":"itms-apps://apps.apple.com/account/subscriptions","non_subscriptions":{},"original_app_user_id":"","original_application_version":"125","original_purchase_date":"2020-05-19T04:59:05Z","other_purchases":{},"subscriptions":{"com.lkzhao.editor.pro.ios.yearly":{"billing_issues_detected_at":null,"expires_date":"2029-05-26T05:05:04Z","is_sandbox":false,"original_purchase_date":"2020-05-19T05:05:05Z","period_type":"trial","purchase_date":"2020-05-19T05:05:04Z","store":"app_store","unsubscribe_detected_at":null}}}}
$done({body: JSON.stringify(obj)});