/* https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/ZhiYi-N/Loon/master/picsew.js

hostname=buy.itunes.apple.com
*/
var obj = JSON.parse($response.body);
obj = {"receipt": {
    "receipt_type": "Production",
    "adam_id": 1208145167,
    "app_item_id": 1208145167,
    "bundle_id": "com.sugarmo.ScrollClip",
    "application_version": "3082",
    "download_id": 9999,
    "version_external_identifier": 837747342,
    "receipt_creation_date": "2020-09-13 06:58:34 Etc/GMT",
    "receipt_creation_date_ms": "1599980314000",
    "receipt_creation_date_pst": "2020-09-12 23:58:34 America/Los_Angeles",
    "request_date": "2020-09-13 06:59:15 Etc/GMT",
    "request_date_ms": "1599980355799",
    "request_date_pst": "2020-09-12 23:59:15 America/Los_Angeles",
    "original_purchase_date": "2020-09-13 06:50:28 Etc/GMT",
    "original_purchase_date_ms": "1599979828000",
    "original_purchase_date_pst": "2020-09-12 23:50:28 America/Los_Angeles",
    "original_application_version": "3082",
    "in_app": [{
      "quantity": "1",
      "product_id": "com.sugarmo.ScrollClip.pro",
      "transaction_id": "1000000000000000",
      "original_transaction_id": "1000000000000000",
      "purchase_date": "2020-01-01 00:00:00 Etc/GMT",
      "purchase_date_ms": "1587700000000",
      "purchase_date_pst": "2020-01-21 00:00:00 America/Los_Angeles",
      "original_purchase_date": "2020-01-01 00:00:00 Etc/GMT",
      "original_purchase_date_ms": "1587700000000",
      "original_purchase_date_pst": "2020-01-01 00:00:00 America/Los_Angeles",
      "is_trial_period": "false"
    }]
  },
  "status": 0,
  "environment": "Production"
  }
$done({body: JSON.stringify(obj)});
