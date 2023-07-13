from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import desc, func
from settings.config import *
# import aiohttp
import asyncio
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


# def get_drivers_from_db(year: int, db: Session):
#     return db.query(Driver).filter(Driver.year == year).all()

def get_driver_standings_from_db(year: int, db: Session):
    return db.query(DriverStanding, Driver).filter(DriverStanding.year == year).join(Driver, Driver.driverId == DriverStanding.driverId).all()

# def get_driver_standings_from_db(year: int, db: Session):
#     return db.query(DriverStanding, Driver, Constructor).filter(DriverStanding.year == year).join(Driver, Driver.driverId == DriverStanding.driverId).join(Constructor, Constructor.constructorId == DriverStanding.constructorId).all()



# class DriverStandingsRequest(BaseModel):
#     year: int




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
        driver_points_query = (
            db.query(
                DriverStanding.driverId,
                func.sum(DriverStanding.points).label("total_points")
            )
            .filter(DriverStanding.raceId == latest_race_id)
            .group_by(DriverStanding.driverId)
            .subquery()
        )

        results_query = (
            db.query(
                Driver,
                driver_points_query.c.total_points,
                Constructor.constructorId,
                Constructor.constructorRef
            )
            .join(driver_points_query, Driver.driverId == driver_points_query.c.driverId)
            .join(Result, Result.driverId == Driver.driverId)
            .join(Constructor, Constructor.constructorId == Result.constructorId)
            .filter(Result.raceId == latest_race_id)
            .order_by(desc(driver_points_query.c.total_points))
            .all()
        )
        if not results_query:
            latest_race_id = latest_race_id - 1
            driver_points_query = (
                db.query(
                    DriverStanding.driverId,
                    func.sum(DriverStanding.points).label("total_points")
                )
                .filter(DriverStanding.raceId == latest_race_id)
                .group_by(DriverStanding.driverId)
                .subquery()
            )
        
            results_query = (
                db.query(
                    Driver,
                    driver_points_query.c.total_points,
                    Constructor.constructorId,
                    Constructor.constructorRef
                )
                .join(driver_points_query, Driver.driverId == driver_points_query.c.driverId)
                .join(Result, Result.driverId == Driver.driverId)
                .join(Constructor, Constructor.constructorId == Result.constructorId)
                .filter(Result.raceId == latest_race_id)
                .order_by(desc(driver_points_query.c.total_points))
                .all()
            )
             
        driver_standings = []
        for driver, total_points, constructor_id, constructor_ref in results_query:
            driver_standings.append(
                {
                    "driver_id": driver.driverId,
                    "driver_ref": driver.driverRef,
                    "driver_name": f"{driver.forename} {driver.surname}",
                    "nationality": driver.nationality,
                    "total_points": total_points,
                    "constructorId": constructor_id,
                    "constructorRef": constructor_ref
                }
            )

        return driver_standings

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}





@router.get("/year/constructorstandings")
async def constructor_standings(db: Session = Depends(get_database_session)):
    try:
        year = datetime.now().year

        results_query = (
            db.query(Constructor, func.sum(ConstructorStanding.points).label("total_points"))
            .join(ConstructorStanding, Constructor.constructorId == ConstructorStanding.constructorId)
            .join(Race, ConstructorStanding.raceId == Race.raceId)
            .filter(Race.year == year)
            .group_by(Constructor.constructorId)
            .order_by(desc("total_points"))
            .all()
        )
        constructor_standings = []
        for constructor, total_points in results_query:
            constructor_standings.append(
                {
                    "constructorId": constructor.constructorId,
                    "constructorRef": constructor.constructorRef,
                    "constructor_name": constructor.name,
                    "total_points": total_points,
                }
            )

        return constructor_standings
    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}

class DriverResult(BaseModel):
    driver_id: int
    driver_ref: str
    points: List[int]


# @router.get("/drivers/graph/{year}")
# async def get_driver_points_by_race(year: int, db: Session = Depends(get_database_session)) -> List[DriverResult]:
#     try:
#         all_past_races = (
#             db.query(Race.raceId)
#             .filter(Race.year == year, Race.date <= func.CURRENT_DATE())
#             .subquery()
#         )
#         all_past_races_query = db.query(all_past_races)
#         all_past_races_ids = [race_id for race_id, in all_past_races_query]

#         driver_results = []
#         for race_id in all_past_races_ids:
#             results = db.query(Result.driverId, Result.points).filter(Result.raceId == race_id).all()

#             for result in results:
#                 driver_id = result.driverId
#                 points = result.points

#                 existing_driver = next((driver for driver in driver_results if driver["driver_id"] == driver_id), None)

#                 if existing_driver:
#                     existing_driver["points"].append(points)
#                 else:
#                     driver_ref = (
#                         db.query(Driver.driverRef)
#                         .filter(Driver.driverId == driver_id)
#                         .scalar()
#                     )
#                     driver_results.append({
#                         "driver_id": driver_id,
#                         "driver_ref": driver_ref,
#                         "points": [points]
#                     })

#         validated_results = [DriverResult(**item) for item in driver_results]

#         return validated_results

#     except Exception as e:
#         print(f"An error occurred while processing the request: {str(e)}")
#         raise

@router.get("/drivers/graph/{year}")
async def get_driver_points_by_race(year: int, db: Session = Depends(get_database_session)) -> dict:
    try:
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
                        "data": [0, points]
                    }
        # SHOW ONLY 1st TEN RESULTS
        driver_results = dict(list(driver_results.items())[:10])

        chart_data = {
            "labels": [str(i) for i in range(len(all_past_races_ids))],
            "datasets": list(driver_results.values())
        }

        return chart_data

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        raise





@router.get("/drivers/{year}")
def get_drivers(year: int,db: Session = Depends(get_database_session)):
    try:
        url = f"https://ergast.com/api/f1/{year}/drivers.json"
        response = requests.get(url)
        data = response.json()
        drivers_list = []
        for driver in data['MRData']['DriverTable']['Drivers']:
            driver_id = driver['driverId']
            driver_data = {
                'driverId': driver_id,
                'permanentNumber': driver['permanentNumber'],
                'code': driver['code'],
                'givenName': driver['givenName'],
                'familyName': driver['familyName'],
                'nationality': driver['nationality']
            }
            driver_data['driverId']
            driver_points = db.query(Result.points).join(Race).\
                filter(Result.driverId == driver_id, Race.year == year).\
                options(joinedload(Result.race)).all()
            driver_data['points'] = sum([points[0] for points in driver_points])
            drivers_list.append(driver_data)

        return drivers_list
    
    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request" }


# @router.post("/year/driverstandings")
# def get_base_player_info(data: dict):
#     year = data['year']
#     f1_base_url  = 'https://ergast.com/api/f1/'
#     f1_drivers_by_year = f'{f1_base_url}{year}/drivers.json'
#     response = requests.get(url = f1_drivers_by_year)
#     f1_drivers_by_year_json = response.json()
#     list_of_drivers = f1_drivers_by_year_json['MRData']['DriverTable']['Drivers']
#     drivers = []
#     for driver in list_of_drivers:
#         drivers.append({'driverId' : driver['driverId'],'givenName' : driver['givenName'],'familyName' : driver['familyName'],'permanentNumber' : driver['permanentNumber'], })
#     return drivers

# @router.get("/drivers")
# def get_best_players(year: str = None):
#     if not year:
#         year = datetime.now().year

#     drivers_url = f"https://ergast.com/api/f1/{year}/drivers.json"
#     response = requests.get(url = drivers_url).json()

#     list_of_drivers = response['MRData']['DriverTable']['Drivers']

#     drivers = []
#     for driver in list_of_drivers:
#         drivers.append({
#             'driverId' : driver['driverId'],
#             'givenName' : driver['givenName'],
#             'familyName' : driver['familyName'],
#             'permanentNumber' : driver['permanentNumber'] 
#         })

#     return drivers


@router.get("/drivers/{driver_id}")
def get_drivers_results(driver_id: str, year: str = None):
    if not year:
        year = datetime.now().year
    
    driver_url  = f'http://ergast.com/api/f1/{year}/drivers/{driver_id}/results.json'

    races_in_year = requests.get(url = driver_url).json()

    racesList = races_in_year['MRData']['RaceTable']['Races']

    races = []
    for race in racesList:
        races.append({
            'circuitId': race['Circuit']['circuitId'],
            'position' : race['Results'][0]['position'],
            'raceName' : race['raceName'],
            'country' : race['Circuit']['Location']['country'],
        })

    return races


@router.get("/driver-standings")
def get_base_player_info(year: str = None):
    if not year:
        year = datetime.now().year

    driver_standing_url = f'https://ergast.com/api/f1/{year}/driverStandings.json'

    driver_standings = requests.get(url = driver_standing_url).json()

    list_of_drivers = driver_standings['MRData']["StandingsTable"]["StandingsLists"][0]["DriverStandings"]

    drivers = []
    for driver_standing in list_of_drivers:
        driver = driver_standing['Driver']
        constructor_info = driver_standing['Constructors'][0]

        drivers.append({
            'driverId': driver['driverId'],
            'constructor_id' : constructor_info['constructorId'],
            'constructor' : constructor_info['name'],
            'points' : driver_standing['points'],
            'givenName': driver['givenName'],
            'familyName': driver['familyName'],
            'permanentNumber': driver['permanentNumber']
        })

    return drivers





# @router.post("/year/constructorstandings")
# def get_base_player_info(data: dict):
#     year = data['year']
#     f1_drivers_by_year = f'{f1_base_url}{year}/constructorStandings.json'
#     response = requests.get(url = f1_drivers_by_year)
#     constructor_standings  = response.json()
#     constructor_standings = constructor_standings ['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings']
#     results = []

#     for constructor_standing in constructor_standings:
#         position = constructor_standing['position']
#         name = constructor_standing['Constructor']['name']
#         points = constructor_standing['points']
#         constructorId = constructor_standing['Constructor']['constructorId']

#         results.append({'position': position, 'constructor_id': constructorId, 'name': name, 'points': points})

#     return results

        # constructor_info = driver['Constructors'][0]
        # constructor_info = driver_standing['Constructors']

    #     drivers.append({'driverId': driver['driverId'],
    #                     'constructor_id' : constructor_info['constructorId'],
    #                     'constructor' : constructor_info['name'],
    #                     'points' : driverstats['points'],
    #                     'givenName': driver['givenName'],
    #                     'familyName': driver['familyName'],
    #                     'permanentNumber': driver['permanentNumber']})
    # # print(drivers)
    # return drivers


# @router.get("/driver_points")
# def get_driver_points():
#     return {
#         "drivers": [
#             {
#                 "name": "Max Verstappen",
#                 "points": [0, 12, 25, 38, 54, 64],
#             },
#             {
#                 "name": "Sergio Perez",
#                 "points": [0, 20, 29, 33, 42, 84],
#             },
#         ],
#     }



# @router.post("/driver_points")
# def get_base_player_info(data: dict):
#     year = data['year']
#     drivers_url = f"http://ergast.com/api/f1/{year}/drivers.json"
#     drivers_response = requests.get(drivers_url)
#     drivers_data = drivers_response.json()
#     drivers_list = drivers_data["MRData"]["DriverTable"]["Drivers"]

#     drivers = []
#     for driver in drivers_list:
#         driver_id = driver["driverId"]
#         driver_name = f"{driver['givenName']} {driver['familyName']}"
#         results_url = f"http://ergast.com/api/f1/{year}/drivers/{driver_id}/results.json"
#         results_response = requests.get(results_url)
#         results_data = results_response.json()
#         results_list = results_data["MRData"]["RaceTable"]["Races"]

#         race_points = {"race0": 0}
#         race_number = 1
#         accumulated_points = 0
#         for race in results_list:
#             points = float(race["Results"][0]["points"])
#             accumulated_points += points
#             race_points[f"race{race_number}"] = accumulated_points
#             race_number += 1

#         drivers.append({
#             "driver_name": driver_name,
#             "race_points": race_points
#         })

#     race_labels = ['Season Start'] + [f'Race {i}' for i in range(1, race_number)]
#     return {"year": year, "drivers": drivers, "race_labels": race_labels}
cache = {}

class Year(BaseModel):
    year: int


async def fetch_data(session, url):
    async with session.get(url) as response:
        return await response.json()


async def get_driver_points_async(driver, year):
    driver_id = driver["driverId"]
    driver_name = f"{driver['givenName']} {driver['familyName']}"
    async with aiohttp.ClientSession() as session:
        results_url = f"http://ergast.com/api/f1/{year}/drivers/{driver_id}/results.json"
        results_data = await fetch_data(session, results_url)
        results_list = results_data["MRData"]["RaceTable"]["Races"]

        race_points = {"race0": 0}
        race_number = 1
        accumulated_points = 0
        for race in results_list:
            points = float(race["Results"][0]["points"])
            accumulated_points += points
            race_points[f"race{race_number}"] = accumulated_points
            race_number += 1

        return {
            "driver_name": driver_name,
            "race_points": race_points
        }


@router.post("/driver_points")
async def driver_points(year: Year):
   # CACHE
    if year.year in cache:
        return cache[year.year]

    drivers_url = f"http://ergast.com/api/f1/{year.year}/drivers.json"
    drivers_response = requests.get(drivers_url)
    drivers_data = drivers_response.json()
    drivers_list = drivers_data["MRData"]["DriverTable"]["Drivers"]

    drivers = await asyncio.gather(*[get_driver_points_async(driver, year.year) for driver in drivers_list])


    max_races = max([len(driver["race_points"]) for driver in drivers])


    race_labels = ['Season Start'] + [f'Race {i}' for i in range(1, max_races + 1)]
    result = {"year": year.year, "drivers": drivers, "race_labels": race_labels}

    # CACHE
    cache[year.year] = result
    return result
    
    
    
    
    

# http://ergast.com/api/f1/drivers
@router.get("/test")
def get_best_players():
    test_url = 'http://ergast.com/api/f1/drivers/results.json'
    response = requests.get(url = test_url)
    response_json = response.json()
    print(response_json)
    # list_of_drivers = f1_base_url_plus_drivers_2023_json['MRData']['DriverTable']['Drivers']
    # print(f1_base_url_plus_drivers_2023_json)
    # drivers = []
    # for driver in list_of_drivers:
    #     drivers.append({'driverId' : driver['driverId'],'givenName' : driver['givenName'],'familyName' : driver['familyName'],'permanentNumber' : driver['permanentNumber'], })
    # print(drivers)
    # return drivers

# https://ergast.com/api/f1/2018/driverStandings
