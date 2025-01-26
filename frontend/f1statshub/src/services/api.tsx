



const fetchData = async (url: string, method: string = 'GET', body: any = null) => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};



  export const fetchTimeBeforeNextRace = async () => {
    return await fetchData('http://localhost:8888/race/nex');
  };

  export const fetchLastRaceDetails = async () => {
    return await fetchData('http://localhost:8888/race/last');
  };

  export const fetchDriverStandings = async (year: number, raceNumber: number) => {
    return await fetchData(`http://localhost:8888/standings/drivers/${year}/${raceNumber}`);
  };

  

  export const fetchNumberOfRaces = async (year: number) => {
    return await fetchData(`http://localhost:8888/race/list/${year}`);
  };

  export const fetchConstructorStandings = async () => {
    return await fetchData('http://localhost:8888/standings/constructors/2023');
  };
  
  export const fetchCircuitsByYear = async () => {
    return await fetchData('http://localhost:8888/circuits/2023');
  };
  
  export const fetchDriversForSpecificYear = async () => {
    return await fetchData('http://localhost:8888/drivers/2023');
  };
  
  export const fetchDriversPointsForGraph = async (year: number) => {
    return await fetchData(`http://localhost:8888/drivers/graph/${year}`);
  };
  
  export const fetchConstructorsGraph = async () => {
    return await fetchData('http://localhost:8888/constructors/graph/2024');
  };
  

  export const fetchRacesForSelectedYear = async () => {
    return await fetchData('http://localhost:8888/race/list/2023');
  };
  
  export const fetchDriverStandingsForDonuts = async (year: number) => {
    return await fetchData(`http://localhost:8888/drivers/donut/${year}`);
  };
  
  export const fetchConstructorStandingsBarGraph = async () => {
    return await fetchData('http://localhost:8888/constructors/bar/2023');
  };
  
  export const fetchConstructorStandingsForDonuts = async () => {
    return await fetchData('http://localhost:8888/constructors/donut/2023');
  };
  
  export const fetchDriverStandignsBarGraph = async () => {
    return await fetchData('http://localhost:8888/drivers/bar/2023');
  };




  export const fetchCircuitWinners =async (circuitId: number) => {

    try {
      const response = await fetch(`http://localhost:8888/circuits/winners/${circuitId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  export const fetchCircuitResults =async (raceId: number) => {

    try {
      const response = await fetch(`http://localhost:8888/race/results/${raceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  export const fetchRaceResults =async (raceId: number) => {

    try {
      const response = await fetch(`http://localhost:8888/race/results/${raceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  export const fetchQualyResults =async (raceId: number) => {

    try {
      const response = await fetch(`http://localhost:8888/qualy/results/${raceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  export const fetchRacePaceGraph = async (raceId: number) => {
    try {
      const response = await fetch(`http://localhost:8888/race/average/${raceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  export const fetchQualyGapGraph = async (raceId: number) => {
    try {
      const response = await fetch(`http://localhost:8888/qualy/gap/${raceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  export const fetchLastRaceDetailsErgast = async () => {
    try {
      const response = await fetch(`http://localhost:8888/race/last/api`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  export const fetchTimezone = async (timezone: string) => {
    try {
      const response = await fetch(`http://localhost:8888/race/next/${timezone}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };