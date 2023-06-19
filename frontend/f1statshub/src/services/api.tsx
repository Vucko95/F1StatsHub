export const fetchDriverStandings = () => {
    return fetch('http://localhost:8888/year/driverstandings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .catch(error => {
        console.error(error);
        throw error; 
      });
  };


  export const fetchConstructorStandings = () => {
    return fetch('http://localhost:8888/year/constructorstandings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .catch(error => {
        console.error(error);
        throw error;
      });
  };
  export const fetchCircuitsByYear = () => {
    return fetch('http://localhost:8888/circuits/2023', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .catch(error => {
        console.error(error);
        throw error;
      });
  };