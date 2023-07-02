export const fetchDriverStandings = async () => {
    try {
    const response = await fetch('http://localhost:8888/standings/drivers/2022', {
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
      const response = await fetch('http://localhost:8888/year/constructorstandings', {
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