from fastapi import APIRouter
from settings.config import *
import requests
from datetime import datetime
from sqlalchemy.orm import Session
from models.models import *
from fastapi import Depends
from datetime import datetime
from sqlalchemy import and_, desc
from settings.db import get_database_session
from sqlalchemy.orm import joinedload

router = APIRouter()




    


@router.get("/race/next")
async def next_race(db: Session = Depends(get_database_session)):
    try:
        next_race_query = db.query(Race).filter(Race.date > datetime.now().date()).order_by(Race.date).first()

        if not next_race_query:
            return {"error": "No more races this season"}

        circuit_country = db.query(Circuit.country).filter(Circuit.circuitId == next_race_query.circuitId).scalar()

        next_race = {
            "season": next_race_query.year,
            "round": next_race_query.round,
            "country": circuit_country,
            "url": next_race_query.url,
            "raceName": next_race_query.name,
            "circuitId": next_race_query.circuitId,
            "first_practice_date": next_race_query.fp1_date,
            "race_date": next_race_query.date,
            "date": next_race_query.date,
            "time": next_race_query.time,
            "startFP1": next_race_query.fp1_time,
            "startFP2": next_race_query.fp2_time,
            "startQualy": next_race_query.quali_time,
            "startSprint": next_race_query.sprint_time,
            "startRace": next_race_query.time,
        }

        return next_race
    
    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}
    



@router.get("/race/last")
async def last_race(db: Session = Depends(get_database_session)):
    try:
        current_date = datetime.now().date()
        last_race_query = (
            db.query(Race)
            .filter(Race.date < current_date)
            .order_by(desc(Race.date))
            .first()
        )

        circuit_country = db.query(Circuit.country).filter(Circuit.circuitId == last_race_query.circuitId).scalar()

        top_drivers = (
            db.query(Result, Driver, Constructor.constructorRef)
            .join(Driver, Result.driverId == Driver.driverId)
            .join(Constructor, Result.constructorId == Constructor.constructorId)
            .filter(Result.raceId == last_race_query.raceId)
            .order_by(Result.positionOrder)
            .limit(3)
            .all()
        )

        top_drivers_list = [
            {
                "driverId": driver.driverId,
                "driverRef": driver.driverRef,
                "driverName": f"{driver.forename} {driver.surname}",
                'nationality': driver.nationality,
                "constructorId": result.constructorId,
                "constructorRef": constructor_ref,
                "position": result.position,
            }
            for result, driver, constructor_ref in top_drivers
        ]

        last_race = {
            "raceId": last_race_query.raceId,
            "season": last_race_query.year,
            "round": last_race_query.round,
            "country": circuit_country,
            "raceName": last_race_query.name,
            "circuitId": last_race_query.circuitId,
            "first_practice_date": last_race_query.fp1_date,
            "race_date": last_race_query.date,
            "date": last_race_query.date,
            "time": last_race_query.time,
            "startRace": last_race_query.time,
            "topDrivers": top_drivers_list,
        }

        return last_race
    except Exception as e:
        print(f"An error occurred while fetching the last race: {str(e)}")
        return {"error": "Failed to fetch last race data"}


@router.get("/race/date")
async def next_race(db: Session = Depends(get_database_session)):
    try:
        next_race_query = db.query(Race).filter(Race.date > datetime.now().date()).order_by(Race.date).all()
        all__next_races = []
        for race in next_race_query:
            all__next_races.append(
                {
                "date" : race.date,
                }
            )
        print(all__next_races)
        for race in all__next_races:
            race["timestamp"] = date_to_timestamp(race["date"])
        timestamps_list = [race["timestamp"] for race in all__next_races]

        return timestamps_list
    
    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}
    
def date_to_timestamp(date_object):
    timestamp = int(datetime(date_object.year, date_object.month, date_object.day).timestamp())

    timestamp_ms = timestamp * 1000

    return timestamp_ms