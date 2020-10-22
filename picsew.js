/*
#圈x
https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/ZhiYi-N/Loon/master/picsew.js
#Loon
http-response https:\/\/buy\.itunes\.apple\.com\/verifyReceipt script-path=https://raw.githubusercontent.com/ZhiYi-N/Loon/master/picsew.js, requires-body=true, timeout=10, tag=picsew专业版
#[mitm]
hostname=buy.itunes.apple.com
*/
var obj = JSON.parse($response.body);
obj = {"receipt": {
    "receipt_type": "Production",
    "adam_id": 14789638028,
    "app_item_id": 14789638028,
    "bundle_id": "com.sugarmo.ScrollClip",
    "application_version": "3082",
    "download_id": 9999999,
    "version_external_identifier": 77777777,
    "receipt_creation_date": "2020-10-21 06:58:34 Etc/GMT",
    "receipt_creation_date_ms": "1603263514000",
    "receipt_creation_date_pst": "2020-10-21 23:58:34 America/Los_Angeles",
    "request_date": "2020-10-21 06:59:15 Etc/GMT",
    "request_date_ms": "1603263514000",
    "request_date_pst": "2020-10-21 23:59:15 America/Los_Angeles",
    "original_purchase_date": "2020-10-21 06:50:28 Etc/GMT",
    "original_purchase_date_ms": "1603263514000",
    "original_purchase_date_pst": "2020-10-21 23:50:28 America/Los_Angeles",
    "original_application_version": "3082",
    "in_app": [{
      "quantity": "1",
      "product_id": "com.sugarmo.ScrollClip.pro",
      "transaction_id": "999999999999",
      "original_transaction_id": "999999999999",
      "purchase_date": "2020-02-01 00:00:00 Etc/GMT",
      "purchase_date_ms": "1580540314000",
      "purchase_date_pst": "2020-02-21 00:00:00 America/Los_Angeles",
      "original_purchase_date": "2020-02-01 00:00:00 Etc/GMT",
      "original_purchase_date_ms": "1580540314000",
      "original_purchase_date_pst": "2020-02-01 00:00:00 America/Los_Angeles",
      "is_trial_period": "false"
    }]
  },
  "status": 0,
  "environment": "Production"
  }
$done({body: JSON.stringify(obj)});
