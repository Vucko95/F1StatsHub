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
        'ferrari': '#FF0000',
        'haas': '#FFFFFF',
        'alphatauri': '#0000FF',
        'williams': '#08298A',
        'alpine': '#0489B1',
        'alfa': '#8A0808',
        'mercedes': '#00FFFF',
        'mclaren': '#FF8000',
        'aston_martin': '#088A08',
        'red_bull': '#0080FF',
    }

    for dataset in datasets:
        label = dataset['label']
        if label in color_mapping:
            color = color_mapping[label]
            dataset['backgroundColor'] = color
            dataset['borderColor'] = color

    return data



@router.get("/race/{raceId}")
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
                    "borderRadius": 20,
                    "borderSkipped": False,
                    "borderWidth": 5
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

        return driver_laptimes

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}





        # raceId
        # subquery_latest_race = (
        #     db.query(Race.raceId)
        #     .filter(Race.year == year, Race.date <= func.CURRENT_DATE())
        #     .order_by(desc(Race.date))
        #     .limit(1)
        #     .subquery()
        # )
        # latest_race_id = db.query(subquery_latest_race.c.raceId).scalar()
        # driver_points_query = (
        #     db.query(
        #         DriverStanding.driverId,
        #         func.sum(DriverStanding.points).label("total_points")
        #     )
        #     .filter(DriverStanding.raceId == latest_race_id)
        #     .group_by(DriverStanding.driverId)
        #     .subquery()
        # )

        # results_query = (
        #     db.query(
        #         Driver,
        #         driver_points_query.c.total_points,
        #         Constructor.constructorId,
        #         Constructor.constructorRef
        #     )
        #     .join(driver_points_query, Driver.driverId == driver_points_query.c.driverId)
        #     .join(Result, Result.driverId == Driver.driverId)
        #     .join(Constructor, Constructor.constructorId == Result.constructorId)
        #     .filter(Result.raceId == latest_race_id)
        #     .order_by(desc(driver_points_query.c.total_points))
        #     .all()
        # )
        # if not results_query:
        #     latest_race_id = latest_race_id - 1
        #     driver_points_query = (
        #         db.query(
        #             DriverStanding.driverId,
        #             func.sum(DriverStanding.points).label("total_points")
        #         )
        #         .filter(DriverStanding.raceId == latest_race_id)
        #         .group_by(DriverStanding.driverId)
        #         .subquery()
        #     )
        
        #     results_query = (
        #         db.query(
        #             Driver,
        #             driver_points_query.c.total_points,
        #             Constructor.constructorId,
        #             Constructor.constructorRef
        #         )
        #         .join(driver_points_query, Driver.driverId == driver_points_query.c.driverId)
        #         .join(Result, Result.driverId == Driver.driverId)
        #         .join(Constructor, Constructor.constructorId == Result.constructorId)
        #         .filter(Result.raceId == latest_race_id)
        #         .order_by(desc(driver_points_query.c.total_points))
        #         .all()
        #     )
             
        # driver_standings = []
        # for driver, total_points, constructor_id, constructor_ref in results_query:
        #     driver_standings.append(
        #         {
        #             "driver_id": driver.driverId,
        #             "driver_ref": driver.driverRef,
        #             "driver_name": f"{driver.forename} {driver.surname}",
        #             "nationality": driver.nationality,
        #             "total_points": total_points,
        #             "constructorId": constructor_id,
        #             "constructorRef": constructor_ref
        #         }
        #     )

        # return driver_standings
        return 'Joke'

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}

