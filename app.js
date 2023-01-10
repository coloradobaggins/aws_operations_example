import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

/**
 * (ScanCommand)
 * ** Get more records than first page limit from DynamoDb AWS.
 */

const ddbClient = new DynamoDBClient({region: 'us-east-1'});

const dynamoParams = {
    TableName: 'Music'
}

const getAllRecords = async()=>{

    let response = {
        statusCode: 200
    };

    let data;
    let acc = [];

    try{

        do{

            data = await ddbClient.send(new ScanCommand(dynamoParams));
            dynamoParams.ExclusiveStartKey = data.LastEvaluatedKey;
            acc = [...acc, ...data.Items];

        }while(data.Items.length && data.LastEvaluatedKey);

        //console.log(acc);

        response.msg = 'success';
        response.items = acc;

        return response;

    }catch(err){
        //response.statusCode = 500;
        response.statusCode = err.$metadata.httpStatusCode;
        response.msg = 'error';
        console.log(err);
    }

    return response;

}

const init = async()=>{

    let results = await getAllRecords();
    console.log(results);
}

init();