# coding=utf-8

import asyncio
import aiohttp
import requests
import ssl
import logging
import pandas as pd
import json
from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import redis

load_dotenv()

REDIS_HOST = 'localhost' # default redis host
REDIS_PORT = 6379 # default redis port
CACHE_TIMEOUT = 60 * 60  # 1 hour in seconds
redis_client = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)


async def authorize(username, machineId):
    #The authorize function is an asynchronous function that takes two arguments, username and machineId.
    # Its purpose is to authenticate the user by making an HTTP GET request to the specified auth_url.
    auth_url = "https://us-central1-cognito-power-jp.cloudfunctions.net/dev-jp-dataservice-auth"
    async with aiohttp.ClientSession() as session:
        headers = {"Username": username, "MachineId": machineId}
        # Create SSL context and disable certificate verification
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE
        async with session.get(auth_url, headers=headers, ssl=ssl_ctx) as response:
            response_text = await response.text()
            try:
                return TokenResponse(**json.loads(response_text))
            except Exception as e:
                # print(response_text)
                return TokenResponse(False, "")


class Token:
    #The create_token_source function is a static method of the Token class.
    # Its purpose is to create an instance of the TokenSource class, which represents a token source
    # for a given user and machine ID. This function takes two arguments, username and machineId.
    #The purpose of this function is to create a token source based on the authentication result for a given user
    # and machine ID.The token source can then be used in the application to access resources that require authentication.
    @staticmethod ## Call the static method without creating an instance of the class
    async def create_token_source(username, machineId):
        token_response = await authorize(username, machineId)
        if token_response.success:
            return TokenSource(username, machineId, token_response.token)
        else:
            return TokenSource(username, machineId, None, message="Not authorized")

# Storing the authentication result in a class
class TokenResponse:
    def __init__(self, success, token):
        self.success = success
        self.token = token

# Storing the token source in a class
class TokenSource:
    def __init__(self, username, machineId, token, message=None):
        self.username = username
        self.machineId = machineId
        self.token = token
        self.message = message


app = Flask(__name__) # Create a Flask application
CORS(app, resources=r'/*') # Allow CORS for all routes(Regular expression means for all routes)


@app.route('/api/data', methods=['GET']) # Create a route for the API
async def get_data(): # Create an asynchronous function to reduce the response time
    username = os.environ.get("USERNAME")
    machineId = os.environ.get("MACHINEID")
    token_source = await Token.create_token_source(username, machineId)
    start_date = request.args.get('StartDate', '2022-01-01') # Default value to be used if not fetched
    end_date = request.args.get('EndDate', '2022-02-01')
    status = request.args.get('status')
    status = status.split(',')
    myarea = request.args.get('area', 'Tokyo')
    myarea = myarea.split(',')
    nda_values = request.args.get('nda_values', '0')
    nda_values = nda_values.split(',')

    cache_key = f"{start_date}-{end_date}-{status}-{myarea}-{nda_values}"
    cached_data = redis_client.get(cache_key) # Get the cached data from Redis
    if cached_data:
        return jsonify(json.loads(cached_data))

    if token_source.token is not None:
        logging.info(f"Token: {token_source.token}")

        url1 = "http://34.173.49.139:8080/api/japan/view/jepx_da_spotPrice"
        url2 = "http://34.173.49.139:8080/api/japan/view/fund_occto_demandHist"
        url3 = "http://34.173.49.139:8080/api/japan/view/fcst_loadNDA"
        headers = {
            "Username": username,
            "Authorization": f"Bearer {token_source.token}",
            "Content-Type": "application/json"
        }
        res = []
        # print(len(status), len(status) == 2, 'len(status)')

        for statusKey in range(len(status)):
            if status[statusKey] == 'price':  # Check the type of data
                for i in myarea:
                    params1 = {
                        "Area": i,
                        "Tou": "DA-24",
                        "Period": "Hourly",
                        "StartDate": start_date,
                        "EndDate": end_date,
                        "OutputFormat": "Full",
                        "DataFormat": "JSON"
                    }
                    response1 = requests.get(
                        url1, headers=headers, params=params1)
                    if response1.status_code == 200:
                        data1 = json.loads(response1.json()["result"])
                        df1 = pd.DataFrame.from_records(data1)
                        new_df1 = df1[['DateTime', 'Area', 'AvgPrice']]
                        json_data1 = new_df1.to_dict('records')
                        res.extend(json_data1)

            if status[statusKey] == 'demand':
                for i in myarea:
                    params2 = {
                        "Area": i,
                        "Tou": "7x24",
                        "Period": "Hourly",
                        "StartDate": start_date,
                        "EndDate": end_date,
                        "OutputFormat": "Full",
                        "DataFormat": "JSON"
                    }

                    response2 = requests.get(
                        url2, headers=headers, params=params2)

                    if response2.status_code == 200:
                        data2 = json.loads(response2.json()["result"])
                        df2 = pd.DataFrame.from_records(data2)
                        new_df2 = df2[['DateTime', 'Area', 'AvgDemand']]
                        json_data2 = new_df2.to_dict('records')
                        res.extend(json_data2)

            if status[statusKey] == 'load':
                models = ["RF_Hour", "RF_Total", "RF_WeekHour"]
                for model in models:
                    for area in myarea:
                        for nda in nda_values:
                            params3 = {
                                "Model": model,
                                "Area": area,
                                "N-DA": nda,
                                "StartDate": start_date,
                                "EndDate": end_date,
                                "DataFormat": "JSON"
                            }

                            response3 = requests.get(url3, headers=headers, params=params3)
                            # print(params3, 'params3')
                            if response3.status_code == 200:
                                data3 = json.loads(response3.json()["result"])
                                # print(data3, 'data3')

                                if len(data3) != 0:
                                    df3 = pd.DataFrame.from_records(data3)
                                    new_df3 = df3[['DateTime', 'Area', 'Load']]
                                    json_data3 = new_df3.to_dict('records')
                                    res.extend(json_data3)

        redis_client.setex(cache_key, CACHE_TIMEOUT, json.dumps(res))
        print(res)
        return res

    return make_response(jsonify({"error": "No token available"}), 401)


async def main():
    json_data = await get_data()
    if json_data is not None:
        print(f"JSON data: {json_data}")


if __name__ == '__main__':
    asyncio.run(main())
