export interface Circuit {
    circuitId: number;
    circuitRef: string;
    name: string;
    location: string;
    country: string;
    url: string;
    raceId: number;
    date: string;
  }


  export interface LastRaceDetails {
    raceId: number;
    season: number;
    round: number;
    country: string;
    raceName: string;
    circuitId: number;
    first_practice_date: string;
    race_date: string;
    date: string;
    time: string;
    startRace: string;
    topDrivers: Driver[];
  }
  
  export interface Driver {
    driverId: number;
    driverRef: string;
    driverName: string;
    nationality: string;
    constructorId: number;
    constructorRef: string;
    position: number;
  }


  export interface NextRaceDetails {
    season: string;
    round: string;
    country: string;
    url: string;
    raceName: string;
    circuitId: string;
    first_practice_date: string;
    race_date: string;
    date: string;
    time: string;
    countryCode: string;
    startFP1: string;
    startFP2: string;
    startQualy: string;
    startSprint: string;
    startRace: string;
  }
  export interface DriverGraphData {
    driver_id: number;
    driver_ref: string;
    points: number[];
  }

export type Timezone = {
  display: string;
  value: string;
};