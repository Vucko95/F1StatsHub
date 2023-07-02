from datetime import datetime
from fastapi import APIRouter
from settings.config import *
import requests
from typing import Any, Dict, List

from sqlalchemy import desc
from sqlalchemy.orm import Session
from settings.db import Session
from models.models import *
from fastapi import Depends
from settings.db import get_database_session
router = APIRouter()


# @router.get("/circuits")
# def get_circuits(year: str = None):
#     if not year:
#         year = datetime.now().year
    
#     circuits_url = f'https://ergast.com/api/f1/{year}/circuits.json'

#     circuits_by_year = requests.get(url = circuits_url).json()

#     circuits_list = circuits_by_year['MRData']['CircuitTable']['Circuits']

#     circuits = []
#     for circuit in circuits_list:
#         circuits.append({
#             'circuitId': circuit['circuitId'],
#             'circuitName' : circuit['circuitName'],
#             'country' : circuit['Location']['country'],
#         })
#     print(circuits)
#     return circuits


# @router.get("/circuits/winners")
# def get_past_5_circuit_winners():


# @router.get("/circuits/{circuit_id}")
# def get_circuit_results(circuit_id: str, year: str = None):
#     if not year:
#         year = datetime.now().year
    
#     circuit_results_url = f'https://ergast.com/api/f1/{year}/circuits/{circuit_id}/results.json'

#     circuit_results = requests.get(url=circuit_results_url).json()

#     race_table = circuit_results['MRData']['RaceTable']['Races']

#     race_results = []
#     for race in race_table:
#         for result in race['Results']:
#             race_results.append({
#                 'raceName': race['raceName'],
#                 'position': result['position'],
#                 'driverName': f"{result['Driver']['givenName']} {result['Driver']['familyName']}",
#                 'points': result['points'],
#                 'constructor': result['Constructor']['name']
#             })

#     return race_results

# @router.get("/circuits/{year}")
@router.get("/circuits/{year}")
def get_circuits(year: int, db: Session = Depends(get_database_session)):
    try:
        circuits = (
            db.query(Circuit, Race.raceId)
            .join(Race, Circuit.circuitId == Race.circuitId)
            .filter(Race.year == year)
            .all()
        )
        circuits_list = []

        for circuit, race_id in circuits:
            circuits_list.append(
                {
                    'circuitId': circuit.circuitId,
                    'circuitRef': circuit.circuitRef,
                    'name': circuit.name,
                    'location': circuit.location,
                    'country': circuit.country,
                    'url': circuit.url,
                    'raceId': race_id,
                }
            )

        return circuits_list

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}


@router.get("/circuits/winners/{circuit_id}")
def get_past_winners(circuit_id: int, db: Session = Depends(get_database_session)):
    try:
        current_year = datetime.now().year
        start_year = current_year - 5

        winners = (
            db.query(Result, Race.raceId, Race.year, Driver, Result.constructorId, Constructor.constructorRef)
            .join(Race, Race.raceId == Result.raceId)
            .join(Driver, Driver.driverId == Result.driverId)
            .join(Constructor, Constructor.constructorId == Result.constructorId)
            .filter(Race.circuitId == circuit_id, Race.year >= start_year, Race.year <= current_year, Result.positionOrder == 1)
            .order_by(desc(Race.year))
            .all()
        )

        circuit = db.query(Circuit).filter(Circuit.circuitId == circuit_id).first()

        winners_list: List[Dict[str, Any]] = []
        for result, race_id, year, driver, constructor_id, constructor_ref in winners:
            winners_list.append(
                {
                    'race_id': race_id,
                    'year': year,
                    'circuit_id': circuit_id,
                    'driver': f"{driver.forename} {driver.surname}",
                    'nationality': driver.nationality,
                    'circuit_country': circuit.country.lower(),
                    'circuit_name': circuit.name,
                    'constructorId': constructor_id,
                    'constructorRef': constructor_ref,
                }
            )

        return winners_list

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
        for result, driver, constructor_ref in race_results:
            race_results_list.append(
                {
                    'race_id': race_id,
                    'driver': f"{driver.forename} {driver.surname}",
                    'constructor_ref': constructor_ref,
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