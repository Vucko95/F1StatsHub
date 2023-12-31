













export const fetchTimeBeforeNextRace = async () => {
    try {
    const response = await fetch('http://localhost:8888/race/next', {
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
export const fetchLastRaceDetails = async () => {
    try {
    const response = await fetch('http://localhost:8888/race/last', {
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


export const fetchDriverStandings = async () => {
    try {
    const response = await fetch('http://localhost:8888/standings/drivers/2023', {
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


  export const fetchConstructorStandings = async () => {
    try {
      const response = await fetch('http://localhost:8888/standings/constructors/2023', {
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
  export const fetchCircuitsByYear = async () => {
    try {
      const response = await fetch('http://localhost:8888/circuits/2023', {
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
  export const fetchDriversForSpecificYear = async () => {
    try {
      const response = await fetch('http://localhost:8888/drivers/2023', {
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
  export const fetchDriversPointsForGraph = async () => {
    try {
      const response = await fetch('http://localhost:8888/drivers/graph/2023', {
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
  export const fetchConstructorsGraph = async () => {
    try {
      const response = await fetch('http://localhost:8888/constructors/graph/2023', {
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

  export const fetchRacesForSelectedYear = async () => {
    try {
      const response = await fetch('http://localhost:8888/race/list/2023', {
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
  export const fetchDriverStandignsForDonuts = async () => {
    try {
      const response = await fetch('http://localhost:8888/drivers/donut/2023', {
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
  export const fetchConstructorStandignsBarGraph = async () => {
    try {
      const response = await fetch('http://localhost:8888/constructors/bar/2023', {
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
  export const fetchConstructorStandignsForDonuts = async () => {
    try {
      const response = await fetch('http://localhost:8888/constructors/donut/2023', {
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
  export const fetchDriverStandignsBarGraph = async () => {
    try {
      const response = await fetch('http://localhost:8888/drivers/bar/2023', {
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