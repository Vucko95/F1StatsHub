from fastapi import APIRouter
from sqlalchemy import desc, func
from settings.config import *
from sqlalchemy import and_
from sqlalchemy.orm import Session
from settings.db import Session
from models.models import *
from settings.utils import *
from fastapi import Depends
from settings.db import get_database_session

router = APIRouter()


@router.get("/standings/drivers/{year}")
async def driver_standings(year: int, db: Session = Depends(get_database_session)):
    try:
        subquery_latest_race = (
            db.query(Race.raceId)
            .filter(Race.year == year, Race.date <= func.CURRENT_DATE())
            .order_by(desc(Race.date))
            .limit(1)
            .subquery()
        )
        latest_race_id = db.query(subquery_latest_race.c.raceId).scalar()
        latest_race_id = 1108
        driver_standings_query = (db.query(DriverStanding, Result, Constructor, Driver)
                                    .join(Result, and_(DriverStanding.driverId == Result.driverId,
                                                    DriverStanding.raceId == Result.raceId))
                                    .join(Constructor, Constructor.constructorId == Result.constructorId)
                                    .join(Driver, Driver.driverId == Result.driverId)

                                    .filter(DriverStanding.raceId == latest_race_id)
                                    .all())
 
        driver_standings = []
        for driver_standing_result in driver_standings_query:
            driver_standing, result,constructor,driver  = driver_standing_result
            driver_standings.append(
                {
                    "driverId": driver_standing.driverId,
                    "raceId": driver_standing.raceId,
                    "constructorId": result.constructorId,
                    "driver_name": f"{driver.forename} {driver.surname}",
                    "nationality": driver.nationality,
                    "driver_ref": driver.driverRef,
                    "total_points": driver_standing.points,
                    "constructorRef": constructor.constructorRef
                }
            )
        return driver_standings

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}
    




@router.get("/drivers/donut/{year}")
async def driver_standings(year: int, db: Session = Depends(get_database_session)):
    try:
        subquery_latest_race = (
            db.query(Race.raceId)
            .filter(Race.year == year, Race.date <= func.CURRENT_DATE())
            .order_by(desc(Race.date))
            .limit(1)
            .subquery()
        )
        latest_race_id = db.query(subquery_latest_race.c.raceId).scalar()
        latest_race_id = 1108
        driver_standings_query = (db.query(DriverStanding, Driver)
                                    .join(Driver, Driver.driverId == DriverStanding.driverId)
                                    .filter(DriverStanding.raceId == latest_race_id)
                                    .all())
             
        driver_standings = []
        for driver_standing, driver in driver_standings_query:
            driver_standings.append({
                
                    "driver_ref": driver.driverRef,
                    "total_points": driver_standing.points,
                })
        response = {
            "labels" : [],
            "datasets": [{
                "data": [],
            }]}
        sorted_driver_standings = sorted(driver_standings, key=lambda x: x["total_points"], reverse=True)

        top_10_driver_standings = sorted_driver_standings[:12]
        for entry in top_10_driver_standings:
            response["labels"].append(entry["driver_ref"])
            response["datasets"][0]["data"].append(entry["total_points"]) 
        
        response = append_colors_to_labels(response)
        return response

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}
    

@router.get("/drivers/bar/{year}")
async def driver_standings(year: int, db: Session = Depends(get_database_session)):
    try:
        subquery_latest_race = (
            db.query(Race.raceId)
            .filter(Race.year == year, Race.date <= func.CURRENT_DATE())
            .order_by(desc(Race.date))
            .limit(1)
            .subquery()
        )
        latest_race_id = db.query(subquery_latest_race.c.raceId).scalar()
        latest_race_id = 1108
        driver_standings_query = (db.query(DriverStanding, Driver)
                                    .join(Driver, Driver.driverId == DriverStanding.driverId)
                                    .filter(DriverStanding.raceId == latest_race_id)
                                    .all())
 
        races_before_count = (
        db.query(func.count(Race.raceId))
        .filter(Race.year == year, Race.date < func.CURRENT_DATE())
        .scalar()
    )
        driver_standings = []
        for driver_standing, driver in driver_standings_query:

            average_points = driver_standing.points/races_before_count
            driver_standings.append(
                {
                    "driver_ref": driver.driverRef,
                    "total_points": average_points,
                }
            )
        sorted_driver_standings = sorted(driver_standings, key=lambda x: x["total_points"], reverse=True)

        top_10_driver_standings = sorted_driver_standings[:10]

        response = {
            "labels" : [],
            "datasets": [{
                "data": [],
            }]
        }
        for entry in top_10_driver_standings:
            response["labels"].append(entry["driver_ref"])
            response["datasets"][0]["data"].append(round(entry["total_points"], 1))  # Round to 1 decimal place
        
        response = append_colors_to_labels(response)
        return response
    
    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}
    



@router.get("/drivers/graph/{year}")
async def get_driver_points_by_race(year: int, db: Session = Depends(get_database_session)) -> dict:
    try:
        subquery_latest_race = (
            db.query(Race.raceId)
            .filter(Race.year == year, Race.date <= func.CURRENT_DATE())
            .order_by(desc(Race.date))
            .limit(1)
            .subquery()
        )
        latest_race_id = db.query(subquery_latest_race.c.raceId).scalar()

        all_past_races = (
            db.query(Race.raceId)
            .filter(Race.year == year, Race.date <= func.CURRENT_DATE())
            .subquery()
        )
        all_past_races_query = db.query(all_past_races)
        all_past_races_ids = [race_id for race_id, in all_past_races_query]


        driver_results = {}
        for race_id in all_past_races_ids:
            results = db.query(Result.driverId, Result.points).filter(Result.raceId == race_id).all()

            for result in results:
                driver_id = result.driverId
                points = result.points

                driver_ref = (
                    db.query(Driver.driverRef)
                    .filter(Driver.driverId == driver_id)
                    .scalar()
                )
                
                if driver_id in driver_results:
                    driver_results[driver_id]["data"].append(driver_results[driver_id]["data"][-1] + points)
                    
                else:
                    driver_results[driver_id] = {
                        "label": driver_ref,
                        "data": [0, points],
                    }
        driver_results = dict(list(driver_results.items()))

        chart_data = {
            "labels": [str(i) for i in range(len(all_past_races_ids) +1)],
            "datasets": list(driver_results.values())
            
        }
        chart_data = append_colors_to_bar_graph(chart_data)
        return chart_data

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        raise
