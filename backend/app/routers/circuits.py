from datetime import datetime
from fastapi import APIRouter
from settings.config import *
import requests
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

    circuits = db.query(Circuit).join(Race, Circuit.circuitId == Race.circuitId).filter(Race.year == year).all()
    circuits_list = []
    
    for circuit in circuits:
        circuits_list.append({
            'circuitId': circuit.circuitId,
            'circuitRef': circuit.circuitRef,
            'name': circuit.name,
            'location': circuit.location,
            'country': circuit.country,
            'url': circuit.url,
        })

    return circuits_list


@router.get("/circuits/winners/{circuit_id}")
def get_past_winners(circuit_id: int, db: Session = Depends(get_database_session)):
    try:
        current_year = datetime.now().year
        start_year = current_year - 5

        winners = (
            db.query(Result, Race.year, Driver)
            .join(Race, Race.raceId == Result.raceId)
            .join(Driver, Driver.driverId == Result.driverId)
            .filter(Race.circuitId == circuit_id, Race.year >= start_year, Race.year <= current_year, Result.positionOrder == 1)
            .order_by(desc(Race.year))
            .all()
        )

        winners_list = []
        for winner, year, driver in winners:
            winners_list.append(
                {
                    'year': year,
                    # 'driverId': driver.driverRef,
                    'winner': f" {driver.forename} {driver.surname}",
                    'nationality': driver.nationality,
                }
            )

        return winners_list

    except Exception as e:
        print(f"An error occurred while processing the request: {str(e)}")
        return {"error": "An error occurred while processing the request"}