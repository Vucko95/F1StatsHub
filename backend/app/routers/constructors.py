from fastapi import APIRouter
from sqlalchemy import desc, func
from settings.config import *
from sqlalchemy.orm import Session
from settings.db import Session
from models.models import *
from settings.utils import *
from fastapi import Depends
from settings.db import get_database_session

router = APIRouter()

@router.get("/standings/constructors/{year}")
async def constructor_standings(year: int, db: Session = Depends(get_database_session)):
    try:
        subquery_latest_race = (
            db.query(Race.raceId)
            .filter(Race.year == year, Race.date <= func.CURRENT_DATE())
            .order_by(desc(Race.date))
            .limit(1)
            .subquery()
        )
        # latest_race_id = db.query(subquery_latest_race.c.raceId).scalar()
        latest_race_id = 1110
        constructor_standings_query = (db.query(ConstructorStanding,Constructor)
                                    .join(Constructor, Constructor.constructorId == ConstructorStanding.constructorId)
                                    .filter(ConstructorStanding.raceId == latest_race_id)
                                    .all()       ) 
 
        constructor_standings = []
        for constructor_standings_result in constructor_standings_query:
            constructor_standing, constructor = constructor_standings_result
            constructor_standings.append(
                {
                    "constructorId" : constructor.constructorId,
                    "raceid" : constructor_standing.raceId,
                    "constructorRef" : constructor.constructorRef,
                    "constructor_name": constructor.name,
                    "total_points" : constructor_standing.points
                }
            )
        sorted_standings = sorted(constructor_standings, key=lambda x: x["total_points"], reverse=True)

        return sorted_standings

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}
    

@router.get("/constructors/donut/{year}")
async def driver_standings(year: int, db: Session = Depends(get_database_session)):
    try:
        subquery_latest_race = (
            db.query(Race.raceId)
            .filter(Race.year == year, Race.date <= func.CURRENT_DATE())
            .order_by(desc(Race.date))
            .limit(1)
            .subquery()
        )
        # latest_race_id = db.query(subquery_latest_race.c.raceId).scalar()
        latest_race_id = 1110
        constructor_standings_query = (db.query(ConstructorStanding,Constructor)
                                    .join(Constructor, Constructor.constructorId == ConstructorStanding.constructorId)
                                    .filter(ConstructorStanding.raceId == latest_race_id)
                                    .all()       ) 
             
        constructor_standings = []
        for constructor_standing, constructor in constructor_standings_query:
            constructor_standings.append({
                
                    "driver_ref": constructor.constructorRef,
                    "total_points": constructor_standing.points,
                })
        response = {
            "labels" : [],
            "datasets": [{
                "data": [],
            }]}
        sorted_constructor_standings = sorted(constructor_standings, key=lambda x: x["total_points"], reverse=True)

        top_10_constructor_standings = sorted_constructor_standings[:10]
        for entry in top_10_constructor_standings:
            response["labels"].append(entry["driver_ref"])
            response["datasets"][0]["data"].append(entry["total_points"]) 

        response = append_colors_to_labels_constructor(response)
        return response

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}
    
@router.get("/constructors/bar/{year}")
async def driver_standings(year: int, db: Session = Depends(get_database_session)):
    try:
        subquery_latest_race = (
            db.query(Race.raceId)
            .filter(Race.year == year, Race.date <= func.CURRENT_DATE())
            .order_by(desc(Race.date))
            .limit(1)
            .subquery()
        )
        latest_race_id = 1110
        # latest_race_id = db.query(subquery_latest_race.c.raceId).scalar()
        constructor_standings_query = (db.query(ConstructorStanding,Constructor)
                                    .join(Constructor, Constructor.constructorId == ConstructorStanding.constructorId)
                                    .filter(ConstructorStanding.raceId == latest_race_id)
                                    .all()       ) 
 
        races_before_count = (
        db.query(func.count(Race.raceId))
        .filter(Race.year == year, Race.date < func.CURRENT_DATE())
        .scalar()
    )
        constructor_standings = []
        for constructor_standing, constructor in constructor_standings_query:

            average_points = constructor_standing.points/races_before_count
            constructor_standings.append(
                {
                    "driver_ref": constructor.constructorRef,
                    "total_points": average_points,
                }
            )
        sorted_constructor_standings = sorted(constructor_standings, key=lambda x: x["total_points"], reverse=True)

        top_10_constructor_standings = sorted_constructor_standings[:10]

        response = {
            "labels" : [],
            "datasets": [{
                "data": [],

            }]
        }
        for entry in top_10_constructor_standings:
            response["labels"].append(entry["driver_ref"])
            response["datasets"][0]["data"].append(round(entry["total_points"], 1))  # Round to 1 decimal place

        response = append_colors_to_labels_constructor(response)
        return response
    
    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}

@router.get("/constructors/graph/{year}")
async def get_constructor_points_by_race(year: int, db: Session = Depends(get_database_session)):
    try:
        subquery_latest_race = (
            db.query(Race.raceId)
            .filter(Race.year == year, Race.date <= func.CURRENT_DATE())
            .order_by(desc(Race.date))
            .limit(1)
            .subquery()
        )
        latest_race_id = 1110
        # latest_race_id = db.query(subquery_latest_race.c.raceId).scalar()

        all_past_races = (
            db.query(Race.raceId)
            .filter(Race.year == year, Race.date <= func.CURRENT_DATE())
            .subquery()
        )
        all_past_races_query = db.query(all_past_races)
        all_past_races_ids = [race_id for race_id, in all_past_races_query]

        constructor_results = {}
        for race_id in all_past_races_ids:
            results = (
                db.query(ConstructorStanding.constructorId, ConstructorStanding.points)
                .filter(ConstructorStanding.raceId == race_id)
                .all()
            )

            for constructor_id, points in results:
                constructor_ref = (
                    db.query(Constructor.constructorRef)
                    .filter(Constructor.constructorId == constructor_id)
                    .scalar()
                )

                if constructor_id in constructor_results:
                    constructor_results[constructor_id]["data"].append(points)
                else:
                    constructor_results[constructor_id] = {
                        "label": constructor_ref,
                        "data": [0, points],
                    }

        constructor_results = dict(list(constructor_results.items()))

        chart_data = {
            "labels": [str(i) for i in range(len(all_past_races_ids) + 1)],
            "datasets": list(constructor_results.values())
        }
        chart_data = append_colors_to_bar_graph_constructors(chart_data)
        return chart_data

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        raise
