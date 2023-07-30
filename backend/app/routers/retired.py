from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import desc, func
from settings.config import *
from sqlalchemy import and_
import asyncio
from datetime import date
from pydantic import BaseModel
import requests
from sqlalchemy.orm import Session
from settings.db import Session
from models.models import *
from settings.utils import *
from fastapi import Depends
from settings.db import get_database_session

router = APIRouter()

# @router.get("/year/constructorstandings")
# async def constructor_standings(db: Session = Depends(get_database_session)):
#     try:
#         year = datetime.now().year

#         results_query = (
#             db.query(Constructor, func.sum(ConstructorStanding.points).label("total_points"))
#             .join(ConstructorStanding, Constructor.constructorId == ConstructorStanding.constructorId)
#             .join(Race, ConstructorStanding.raceId == Race.raceId)
#             .filter(Race.year == year)
#             .group_by(Constructor.constructorId)
#             .order_by(desc("total_points"))
#             .all()
#         )
#         constructor_standings = []
#         for constructor, total_points in results_query:
#             constructor_standings.append(
#                 {
#                     "constructorId": constructor.constructorId,
#                     "constructorRef": constructor.constructorRef,
#                     "constructor_name": constructor.name,
#                     "total_points": total_points,
#                 }
#             )

#         return constructor_standings
#     except Exception as e:
#         print(f"An error occurred while processing the request: {str(e)}")
#         return {"error": "An error occurred while processing the request"}



# @router.get("/drivers/{year}")
# def get_drivers(year: int,db: Session = Depends(get_database_session)):
#     try:
#         url = f"https://ergast.com/api/f1/{year}/drivers.json"
#         response = requests.get(url)
#         data = response.json()
#         drivers_list = []
#         for driver in data['MRData']['DriverTable']['Drivers']:
#             driver_id = driver['driverId']
#             driver_data = {
#                 'driverId': driver_id,
#                 'permanentNumber': driver['permanentNumber'],
#                 'code': driver['code'],
#                 'givenName': driver['givenName'],
#                 'familyName': driver['familyName'],
#                 'nationality': driver['nationality']
#             }
#             driver_data['driverId']
#             driver_points = db.query(Result.points).join(Race).\
#                 filter(Result.driverId == driver_id, Race.year == year).\
#                 options(joinedload(Result.race)).all()
#             driver_data['points'] = sum([points[0] for points in driver_points])
#             drivers_list.append(driver_data)

#         return drivers_list
    
#     except Exception as e:
#         print(f"An error occurred while processing the request: {str(e)}")
#         return {"error": "An error occurred while processing the request" }


# @router.get("/drivers/{driver_id}")
# def get_drivers_results(driver_id: str, year: str = None):
#     if not year:
#         year = datetime.now().year
    
#     driver_url  = f'http://ergast.com/api/f1/{year}/drivers/{driver_id}/results.json'

#     races_in_year = requests.get(url = driver_url).json()

#     racesList = races_in_year['MRData']['RaceTable']['Races']

#     races = []
#     for race in racesList:
#         races.append({
#             'circuitId': race['Circuit']['circuitId'],
#             'position' : race['Results'][0]['position'],
#             'raceName' : race['raceName'],
#             'country' : race['Circuit']['Location']['country'],
#         })
#     return races

# @router.get("/driver-standings")
# def get_base_player_info(year: str = None):
#     if not year:
#         year = datetime.now().year

#     driver_standing_url = f'https://ergast.com/api/f1/{year}/driverStandings.json'

#     driver_standings = requests.get(url = driver_standing_url).json()

#     list_of_drivers = driver_standings['MRData']["StandingsTable"]["StandingsLists"][0]["DriverStandings"]

#     drivers = []
#     for driver_standing in list_of_drivers:
#         driver = driver_standing['Driver']
#         constructor_info = driver_standing['Constructors'][0]

#         drivers.append({
#             'driverId': driver['driverId'],
#             'constructor_id' : constructor_info['constructorId'],
#             'constructor' : constructor_info['name'],
#             'points' : driver_standing['points'],
#             'givenName': driver['givenName'],
#             'familyName': driver['familyName'],
#             'permanentNumber': driver['permanentNumber']
#         })

#     return drivers





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


# @router.get("/year/constructorstandings")
# async def constructor_standings(db: Session = Depends(get_database_session)):
#     try:
#         year = datetime.now().year
#         subquery_latest_race = (
#             db.query(Race.raceId)
#             .filter(Race.year == year, Race.date <= func.CURRENT_DATE())
#             .order_by(desc(Race.date))
#             .limit(1)
#             .subquery()
#         )
#         latest_race_id = db.query(subquery_latest_race.c.raceId).scalar()
        
#         constructor_points_query = (
#             db.query(
#                 ConstructorStanding.constructorId,
#                 func.sum(ConstructorStanding.points).label("total_points")
#             )
#             .filter(ConstructorStanding.raceId == latest_race_id)
#             .group_by(ConstructorStanding.constructorId)
#             .subquery()
#         )

#         results_query = (
#             db.query(
#                 Constructor,
#                 constructor_points_query.c.total_points
#             )
#             .join(constructor_points_query, Constructor.constructorId == constructor_points_query.c.constructorId)
#             .filter(ConstructorStanding.raceId == latest_race_id)
#             .order_by(desc(constructor_points_query.c.total_points))
#             .all()
#         )

#         constructor_standings = []
#         for constructor, total_points in results_query:
#             constructor_standings.append(
#                 {
#                     "constructorId": constructor.constructorId,
#                     "constructorRef": constructor.constructorRef,
#                     "constructor_name": constructor.name,
#                     "total_points": total_points,
#                 }
#             )

#         return constructor_standings

#     except Exception as e:
#         print(f"An error occurred while processing the request: {str(e)}")
#         return {"error": "An error occurred while processing the request"}