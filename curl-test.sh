#!/bin/bash
SERVER_KEY='AAAAHrJQ_Pg:APA91bFw_ScCVZq7_wVYonkRlRFqrFsXKnmGfRnFh6xw3LhzmSu2-NCKfa-XjsV3ek49g_7b2L2f1p76wkTj3uWhChPb03g-WJK1fBltRHM2_g1ENBC6zVa0OUqQrPo-zaeQX8D--bwO'
DEVICE_REG_TOKEN='cnSJM7nTAZSeEOkCn6qE79:APA91bEDozPDopfZmPD-DqCFBRO-sZ03ZY6bVf1PWNvYkrKoXiyhs8fsSDve2BpdGHmWG_6XMlfOHHeq904slPrJFEaEuydZKgPjJBqAuNsmh_oYU1FRN53HN5YPV4jPX9ua60-Be6-J'

CMD=$(cat <<END
curl -X POST -H "Authorization: key=$SERVER_KEY" -H "Content-Type: application/json"
   -d '{
  "data": {
    "notification": {
        "title": "FCM Message",
        "body": "This is an FCM Message",
    }
  },
  "to": "$DEVICE_REG_TOKEN"
}' https://fcm.googleapis.com/fcm/send
END
)

echo $CMD && eval $CMD
