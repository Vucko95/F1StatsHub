from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import desc, func
from settings.config import *
# import aiohttp
import asyncio
from heapq import nlargest
from sqlalchemy.orm import joinedload
from pydantic import ValidationError
from datetime import date
from pydantic import BaseModel
from typing import List, Dict
import requests
from sqlalchemy.orm import Session
from settings.db import Session
from models.models import *
from fastapi import Depends
from settings.db import get_database_session
router = APIRouter()
def get_driver_standings_from_db(year: int, db: Session):
    return db.query(DriverStanding, Driver).filter(DriverStanding.year == year).join(Driver, Driver.driverId == DriverStanding.driverId).all()
def prepare_chart_data(data):
    labels = data['labels']
    datasets = data['datasets']
    color_mapping = {
        'lec': '#FF0000',
        'sai': '#FF0000',
        'hul': '#9f9e9e',
        'haas': '#9f9e9e',
        'tsu': '#334396',
        'de_': '#334396',
        'alb': '#2a98ed',
        'sar': '#2a98ed',
        'gas': '#2263e6',
        'oco': '#2263e6',
        'kev': '#9f9e9e',
        'mag': '#9f9e9e',
        'bot': '#760909',
        'zho': '#760909',
        'ham': '#0af1e6',
        'rus': '#0af1e6',
        'nor': '#FF8000',
        'pia': '#FF8000',
        'alo': '#066945',
        'str': '#066945',
        'max': '#0a208d',
        'per': '#0a208d',
    }

    for dataset in datasets:
        label = dataset['label']
        if label in color_mapping:
            color = color_mapping[label]
            dataset['backgroundColor'] = color
            dataset['borderColor'] = color
    return data

# def prepare_chart_data(data):
#     labels = data['labels']
#     datasets = data['datasets']
#     color_mapping = {
#         'ferrari': '#FF0000',
#         'haas': '#9f9e9e',
#         'alphatauri': '#007e94',
#         'williams': '#2a98ed',
#         'alpine': '#334396',
#         'alfa': '#760909',
#         'mercedes': '#0af1e6',
#         'mclaren': '#FF8000',
#         'aston_martin': '#066945',
#         'red_bull': '#0a208d',
#     }

#     for dataset in datasets:
#         label = dataset['label']
#         if label in color_mapping:
#             color = color_mapping[label]
#             dataset['backgroundColor'] = color
#             dataset['borderColor'] = color

#     return data
def append_colors_to_labels(response_data):
    color_mapping = {
        'max_verstappen': '#0a208d',
        'perez': '#0a208d',
        'norris': '#FF8000',
        'piastri': '#FF8000',
        'leclerc': '#FF0000',
        'sainz': '#FF0000',
        'russell': '#0af1e6',
        'hamilton': '#0af1e6',
        'albon': '#2a98ed',
        'hulkenberg': '#9f9e9e',
        'alonso': '#066945',
        'stroll': '#066945',
        'ocon': '#2263e6',
        'tsunoda': '#334396',
        'gasly': '#2263e6',
    }

    labels = response_data['labels']
    background_colors = [color_mapping.get(label, '#000000') for label in labels]
    response_data['datasets'][0]['backgroundColor'] = background_colors

    return response_data

@router.get("/race/average/{raceId}")
async def get_driver_laptimes(raceId: int, db: Session = Depends(get_database_session)):
    try:
        lap_times_query = (
            db.query(LapTime, Driver.driverRef)
            .join(Driver, LapTime.driverId == Driver.driverId)
            .filter(LapTime.raceId == raceId)
            .all()
        )

        driver_laptimes = {
            "labels": ["1"],
            "datasets": []
        }

        for lap_time, driver_ref in lap_times_query:
            driver_id = lap_time.driverId
            lap_time_parts = lap_time.time.split(":")
            minutes = int(lap_time_parts[0])
            seconds = float(lap_time_parts[1])
            lap_time_seconds = round((minutes * 60) + seconds, 3)

            driver_index = None
            for index, dataset in enumerate(driver_laptimes["datasets"]):
                if dataset["label"] == driver_ref:
                    driver_index = index
                    break

            if driver_index is None:
                driver_laptimes["datasets"].append({
                    "label": driver_ref,
                    "data": [[lap_time_seconds]],
                    "borderRadius": 0,
                    "borderWidth": 2,
                    "barPercentage": 1.05,

                    # "borderSkipped": False,
                })
            else:
                driver_laptimes["datasets"][driver_index]["data"][0].append(lap_time_seconds)

        driver_laptimes["datasets"] = [
            dataset for dataset in driver_laptimes["datasets"] if len(dataset["data"][0]) >= 40
        ]

        for dataset in driver_laptimes["datasets"]:
            if dataset["data"][0]:
                average_lap_time = sum(dataset["data"][0]) / len(dataset["data"][0])
                dataset["data"][0] = [round(average_lap_time, 3), round(average_lap_time + 0.5, 3)]
            else:
                dataset["data"][0] = []

        driver_laptimes["datasets"].sort(key=lambda x: x["data"][0][0] if x["data"][0] else float("inf"))
        # Shorten the driver_ref  before the return
        for dataset in driver_laptimes["datasets"]:
            dataset["label"] = dataset["label"][:3]
        driver_laptimes = prepare_chart_data(driver_laptimes)

        return driver_laptimes

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}

@router.get("/race/list/{year}")
async def get_driver_laptimes(year: int, db: Session = Depends(get_database_session)):
    try:
        current_date = datetime.now().date()
        latest_race = (
            db.query(Race.date)
            .filter(Race.year == year, Race.date <= current_date)
            .order_by(Race.date.desc())
            .first()
        )

        latest_race_date = latest_race[0]

        # Query circuits that have a race date earlier than the latest race date
        circuits = (
            db.query(Circuit, Race.raceId, Race.date)
            .join(Race, Circuit.circuitId == Race.circuitId)
            # .filter(Race.year == year, Race.date <= latest_race_date)
            .filter(Race.year == year)
            .all()
        )

        circuits_list = []

        for circuit, race_id, race_date in circuits:
            circuits_list.append(
                {
                    'circuitId': circuit.circuitId,
                    'circuitRef': circuit.circuitRef,
                    'name': circuit.name,
                    'location': circuit.location,
                    'country': circuit.country,
                    'url': circuit.url,
                    'raceId': race_id,
                    'date': race_date,
                }
            )

        return circuits_list

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}

@router.get("/race/results/{race_id}")
def get_race_results(race_id: int, db: Session = Depends(get_database_session)):
    try:
        race_results = (
            db.query(Result, Driver, Constructor.constructorRef)
            .join(Driver, Driver.driverId == Result.driverId)
            .join(Constructor, Constructor.constructorId == Result.constructorId)
            .filter(Result.raceId == race_id)
            .all()
        )

        race_results_list = []
        for result, driver, constructorRef in race_results:
            race_results_list.append(
                {
                    'race_id': race_id,
                    'driver': f"{driver.forename} {driver.surname}",
                    'constructorRef': constructorRef,
                    'position': result.position,
                    'points': result.points,
                    'laps': result.laps,
                    'time': result.time
                }
            )

        return race_results_list

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}
    

@router.get("/qualy/results/{race_id}")
def get_qualy_results(race_id: int, db: Session = Depends(get_database_session)):
    try:
        qualy_results = (
            db.query(Qualifying, Driver, Constructor.constructorRef)
            .join(Driver, Driver.driverId == Qualifying.driverId)
            .join(Constructor, Constructor.constructorId == Qualifying.constructorId)
            .filter(Qualifying.raceId == race_id)
            .all()
        )
        first_driver_q3_time = None
        if qualy_results:
            first_driver_q3_time = qualy_results[0][0].q3
        qualy_results_list = []
        for qualy, driver, constructorRef in qualy_results:
            q3_time = qualy.q3
            gap = None
            if first_driver_q3_time and q3_time:
                first_driver_time = datetime.strptime(first_driver_q3_time, "%M:%S.%f")
                driver_time = datetime.strptime(q3_time, "%M:%S.%f")
                time_difference = driver_time - first_driver_time
                gap = time_difference.total_seconds()
            qualy_results_list.append(
                {
                    'race_id': race_id,
                    'driver': f"{driver.forename} {driver.surname}",
                    'constructorRef': constructorRef,
                    'q3': qualy.q3,
                    'gap': gap,
                    'position': qualy.position,
                    'time': qualy.q3
                }
            )

        return qualy_results_list[:10]

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}
    
@router.get("/qualy/gap/{race_id}")
def get_qualy_results(race_id: int, db: Session = Depends(get_database_session)):
    try:
        qualy_results = (
            db.query(Qualifying, Driver, Constructor.constructorRef)
            .join(Driver, Driver.driverId == Qualifying.driverId)
            .join(Constructor, Constructor.constructorId == Qualifying.constructorId)
            .filter(Qualifying.raceId == race_id)
            .limit(10)
            .all()
        )
        first_driver_q3_time = None
        if qualy_results:
            first_driver_q3_time = qualy_results[0][0].q3
        qualy_results_list = []
        gaps_data = []
        labels = []
        for qualy, driver, constructorRef in qualy_results:
            q3_time = qualy.q3
            gap = None
            if first_driver_q3_time and q3_time:
                first_driver_time = datetime.strptime(first_driver_q3_time, "%M:%S.%f")
                driver_time = datetime.strptime(q3_time, "%M:%S.%f")
                time_difference = driver_time - first_driver_time
                gap = time_difference.total_seconds()
            qualy_results_list.append(
                {
                    'race_id': race_id,
                    'driver': f"{driver.forename} {driver.surname}",
                    'constructorRef': constructorRef,
                    'q3': qualy.q3,
                    'gap': gap,
                    'position': qualy.position,
                }
            )

            gaps_data.append(gap)
            labels.append(f"{driver.driverRef}")
        response = {
                "labels": labels,
                "datasets": [
                    {
                        "label": "Gaps to First",
                        "data": gaps_data,
                        # "backgroundColor" : "#COLOR BASED ON DRIVER",
                    }
                ],

            }
        # return qualy_results_list[:10]
        response = append_colors_to_labels(response)

        return response

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}
    


    # SLOWER QUERRY 
@router.get("/race/average/{raceId}")
async def get_driver_laptimes(raceId: int, db: Session = Depends(get_database_session)):
    try:
        lap_times_query = (
            db.query(LapTime, Driver.driverRef,Result,Constructor)
            .join(Driver, LapTime.driverId == Driver.driverId)
            .join(Result, Result.driverId == Driver.driverId)
            .join(Constructor, Constructor.constructorId == Result.constructorId)
            .filter(LapTime.raceId == raceId)
            .all()
        )

        driver_laptimes = {
            "labels": ["1"],
            "datasets": []
        }

        for lap_time, driver_ref,result, constructor in lap_times_query:
            driver_id = lap_time.driverId
            constructor_ref = constructor.constructorRef
            lap_time_parts = lap_time.time.split(":")
            minutes = int(lap_time_parts[0])
            seconds = float(lap_time_parts[1])
            lap_time_seconds = round((minutes * 60) + seconds, 3)

            driver_index = None
            for index, dataset in enumerate(driver_laptimes["datasets"]):
                if dataset["label"] == driver_ref:
                    driver_index = index
                    break

            if driver_index is None:
                driver_laptimes["datasets"].append({
                    "label": driver_ref,
                    "data": [[lap_time_seconds]],
                    "backgroundColor" : "blue",
                    "borderRadius": 0,
                    "borderWidth": 2,
                    "barPercentage": 1.05
                    # "borderSkipped": False,
                })
            else:
                driver_laptimes["datasets"][driver_index]["data"][0].append(lap_time_seconds)

        driver_laptimes["datasets"] = [
            dataset for dataset in driver_laptimes["datasets"] if len(dataset["data"][0]) >= 40
        ]

        for dataset in driver_laptimes["datasets"]:
            if dataset["data"][0]:
                average_lap_time = sum(dataset["data"][0]) / len(dataset["data"][0])
                dataset["data"][0] = [round(average_lap_time, 3), round(average_lap_time + 0.5, 3)]
            else:
                dataset["data"][0] = []

        driver_laptimes["datasets"].sort(key=lambda x: x["data"][0][0] if x["data"][0] else float("inf"))
        # Shorten the driver_ref  before the return
        for dataset in driver_laptimes["datasets"]:
            dataset["label"] = dataset["label"][:3]
        return driver_laptimes

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}