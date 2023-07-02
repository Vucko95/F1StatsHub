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
        last_race_query = db.query(Race).filter(Race.date < current_date).order_by(desc(Race.date)).first()

        if not last_race_query:
            return {"error": "No more races this season"}

        circuit_country = db.query(Circuit.country).filter(Circuit.circuitId == last_race_query.circuitId).scalar()

        last_race = {
            "season": last_race_query.year,
            "round": last_race_query.round,
            "country": circuit_country,
            "url": last_race_query.url,
            "raceName": last_race_query.name,
            "circuitId": last_race_query.circuitId,
            "first_practice_date": last_race_query.fp1_date,
            "race_date": last_race_query.date,
            "date": last_race_query.date,
            "time": last_race_query.time,
            "startFP1": last_race_query.fp1_time,
            "startFP2": last_race_query.fp2_time,
            "startQualy": last_race_query.quali_time,
            "startSprint": last_race_query.sprint_time,
            "startRace": last_race_query.time,
        }

        return last_race
    except Exception as e:
        print(f"An error occurred while fetching the last race: {str(e)}")
        return {"error": "Failed to fetch last race data"}

@router.get("/race/last/top3")
async def get_top_drivers(db: Session = Depends(get_database_session)):
    try:
        year = datetime.now().year
        current_date = datetime.now().date()
        last_race_query = db.query(Race).filter(and_(Race.year==year, Race.date < current_date)).order_by(desc(Race.date)).first()
        results_query = db.query(Result).filter(and_(Result.raceId==last_race_query.raceId, Result.statusId==1)).order_by(Result.points.desc()).limit(3)
        
        top_three_drivers = []
        for result in results_query:
            driver_query = db.query(Driver).filter_by(driverId=result.driverId).first()
            top_three_drivers.append({
                'driver_name' : driver_query.forename,
                'driver_surname' : driver_query.surname,
                'driver_time': result.time,
                'driver_points' : result.points,
            })
        return top_three_drivers
    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}

