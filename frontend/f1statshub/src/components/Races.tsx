import { Component, createSignal, createEffect } from "solid-js";
import { Circuit } from '../models/models' 
import { fetchCircuitsByYear, fetchCircuitWinners, fetchCircuitResults, fetchRacePaceGraph } from "../services/api";
import { getCountryCode, getNationalityCode, isDateInPast } from "../constants/CodeUtils";
import { onMount } from 'solid-js'
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-plugin-style';

import { Bar, Line } from 'solid-chartjs'
import "../styles/races.css";

const Races: Component = () => {
    const [racePaceGraphData, setRacePaceGraphData] = createSignal([]);
    const [raceResults, setRaceResults] = createSignal([]);

    onMount(() => {
      Chart.register(Title, Tooltip, Legend, Colors,ChartDataLabels)
                  })
    createEffect(async () => {
      try {
        const winners = await fetchCircuitWinners(3);
        showCircuitResults(winners[0]?.race_id || '');

      } catch (error) {
        console.error(error);
      }
    });

    const showCircuitResults = async (raceId: number) => {
      try {
        const race_results = await fetchCircuitResults(raceId);
        setRaceResults(race_results);
        console.log(race_results)
      } catch (error) {
        console.error(error);
      }
    };

    createEffect(async () => {
        try {
        const racePaceGraphData = await fetchRacePaceGraph();
        setRacePaceGraphData(racePaceGraphData);
        } catch (error) {
          console.error(error);
        }
      });



    const chartOptions = {
       responsive: true,
        maintainAspectRatio: false,

   
        scales: {
            y: {
              beginAtZero: false,
              // borderRadius: 0,
              // min: 72,
              ticks: {
                color: 'white',
                stepSize: 0.5,
              },
            },
          },
          plugins: {
            datalabels: {
              display: false
              
            },
            title: {
              display: true,
              text: 'Lap Pace of a Driver in seconds',
              color: 'white',
              font: {
                size: 24,
              },
          },
            legend: {
              position: 'right',
              labels: {
                color: 'white', 
                padding: 10,
    
              },
            },
          },
    }
    const chartOptions2 = {
      plugins: {

        legend: {
          position: 'right',
          labels: {
            color: 'white', 
            padding: 10

          },
        },
        
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: false,
        },
        y: {
          position: 'left',
          reverse: true,
          min: 1,
          max: 20,
          ticks: {
            color: 'white',
            stepSize: 1,
          },
          
        },
        right: {
          position: 'right',
          reverse: true,
          min: 1,
          max: 20,
          ticks: {
            color: 'white',
            stepSize: 1,
          },
        },
      },
    };
    



    const data5 = {
      labels: [
        'REDBULL',
        'FERARRI',
        'ASTON',
        'MERCEDES',
        'MCLAREN',
        'ALPINE',
        'A-ROMEO',
        'A-TAURI',
        'WILLIAMS',
        'HAAS',

      ],
      datasets: [
        {
          label: 'ToHide',
          data: [
            0.000, // Verstappen
            0.355, // Hamilton
            0.805, // Norris
            1.205, // Leclerc
            1.710, // Ricciardo
            2.135, // Sainz
            2.755, // Perez
            3.150, // Gasly
            3.600, // Ocon
            4.005, // Vettel
          ],
          
          backgroundColor: [
            'white',
            'teal',
            'grey',
            'lime',
            'red',
            'yellow',
            'purple',
            'yellow',
            'blue',
            'teal',
          ],
  

        },
      ],
    };

     
    const chartOptions5 = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: 
        {
          display:false
        },
        title: {
          display: true,
          text: 'RACE - Average Lap Gap Time Per Team',
          color: 'white',
          font: {
            size: 24,
          },
      },
        datalabels: {
          font: {
            size: 20,
          },
          color: '#FFFFFF'
        },
      },
      scales: {
        x: {
          display: true,
          ticks : {
            color: 'white', 
            font: {
              size: 13,
            },
          }
          
        },
        y: {
          display: true,
          ticks: {
            color: 'white', 
            reverse: true,
            font: {
              size: 18,
            },
          },
        },
      },
      elements: {
        bar: {
          borderRadius: 10, 
          // borderWidth: 5, 
        }}
    };
  
      
      
      
    const chartOptions6 = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y', 
      plugins: {
        legend: 
        {
          display:false
        },
        title: {
          display: true,
          text: 'RACE - Average Lap Pace Gap to Teamamte',
          color: 'white',
          font: {
            size: 24,
          },
      },
        datalabels: {
          font: {
            size: 24,
          },
          color: '#FFFFFF'
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: false,
            text: 'Lap Time (seconds)',
          },
          ticks: {
            beginAtZero: true,
            autoSkip: false,
            color: 'white', 
            // callback: function (value: number) {
            //   const seconds = Math.floor(value);
            //   return seconds.toString();
            // },
          },
        },
        y: {
          display: true,

          ticks: {
            reverse: true,
            color: 'white', 

          },
        },
        
      },
      elements: {
        bar: {
          borderRadius: 10, 
        }}
    };
  
    const data6 = {
      labels: [
        'VER-PER',
        'HAM-RUS',
        'NOR-PIA',
        'ZOU-BOT',
        'RIC-TSU',
        'GAS-OCO',
        'SAR-ALB',
        'LEC-SAN',
        'ALO-STR',
        'HUL-MAG',

      ],
      datasets: [
        {
          label: 'Lap Times',
          data: [
            0.230, // Verstappen
            0.255, // Hamilton
            0.405, // Norris
            0.505, // Leclerc
            0.610, // Ricciardo
            0.735, // Sainz
            1.255, // Perez
            1.277, // Gasly
            1.900, // Ocon
            2.105, // Vettel
          ],
          
      backgroundColor: [
        'red',
        'lime',
        'teal',
        'blue',
        'purple',
        'orange',
        'pink',
        'green',
        'yellow',
        'brown',
      ]
        },
      ],
      
    };  
    const chartOptions4 = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y', 
      plugins: {
        legend: 
        {
          display:false
        },
        title: {
          display: true,
          text: 'Qualiy Q3 GAP',
          color: 'white',
          font: {
            size: 24,
          },
      },
        datalabels: {
          font: {
            size: 24,
          },
          color: '#FFFFFF'
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: false,
            text: 'Lap Time (seconds)',
          },
          ticks: {
            beginAtZero: true,
            autoSkip: false,
            color: 'white', 
            // callback: function (value: number) {
            //   const seconds = Math.floor(value);
            //   return seconds.toString();
            // },
          },
        },
        y: {
          display: true,

          ticks: {
            reverse: true,
            color: 'white', 

          },
        },
        
      },
      elements: {
        bar: {
          borderRadius: 10, 
        }}
    };
  
    const data4 = {
      labels: ['VER', 'PER', 'HAM', 'RUS', 'NOR', 'PIA', 'ZOU', 'BOT', 'RIC', 'TSU'],
      datasets: [
        {
          label: 'Lap Times',
          data: [
            0.00, 
            0.1,
            0.23,
            0.255,
            0.405,
            0.425,
            0.505, 
            0.600, 
            0.640, 
            0.710, 
          ],
          
      backgroundColor: [
        'red',
        'lime',
        'teal',
        'blue',
        'purple',
        'orange',
        'pink',
        'green',
        'yellow',
        'brown',
      ]
        },
      ],
      
    };  

        const data = {
        labels: [1,2],
        datasets:  [
          {
            label: 'Verstappen',
            data: [15, 14],
          },
          {
            label: 'Perez',
            data: [5, 3],
          },
          {
            label: 'Hamilton',
            data: [8, 10],
          },
          {
            label: 'Norris',
            data: [11, 9],
          },
          {
            label: 'Ricciardo',
            data: [1, 6],
          },
          {
            label: 'Leclerc',
            data: [17, 15],
          },
          {
            label: 'Sainz',
            data: [3, 5],
          },
          {
            label: 'Vettel',
            data: [9, 11],
          },
          {
            label: 'Stroll',
            data: [10, 8],
          },
          {
            label: 'Ocon',
            data: [16, 20],
          },
          {
            label: 'Alonso',
            data: [12, 7],
          },
          {
            label: 'Gasly',
            data: [6, 1],
          },
          {
            label: 'Tsunoda',
            data: [4, 12],
          },
          {
            label: 'Raikkonen',
            data: [19, 13],
          },
          {
            label: 'Giovinazzi',
            data: [13, 2],
          },
          {
            label: 'Latifi',
            data: [14, 19],
          },
          {
            label: 'Russell',
            data: [20, 16],
          },
          {
            label: 'Schumacher',
            data: [7, 18],
          },
          {
            label: 'Mazepin',
            data: [18, 17],
          },
          {
            label: 'Bottas',
            data: [2, 4],
          },
        ]
      };

    return (
        <div class="RacesMain">
            <div class="RacesList">
              <ul>
                <li><button>race1 </button></li>
                <li><button>race2 </button></li>
                <li><button>race 3</button></li>
                <li><button>race4 </button></li>
                <li><button>race 5</button></li>
                <li><button>race 6</button></li>
                <li><button>race 7</button></li>
                <li><button>race 8</button></li>
                <li><button>race 9</button></li>
                <li><button>race 10</button></li>
                <li><button>race 11</button></li>
                <li><button>race 12</button></li>
              </ul>
            </div>

            <div class="RaceResultsBox">
                <table>
                    <thead>
                      <tr>
                      <th></th>
                        <th colspan="4" >
                  Race Results
                        </th>
                        {/* <th></th> */}
                        </tr>
                    </thead>
                    {raceResults().slice(0, 10).map((driver_result: any) => (
                        <tr>
                            <td>{driver_result.position} </td>
                            <td><img src={`/teamlogos/${driver_result.constructorRef}.webp`}   width="80" height="30" /></td>
                            <td>{driver_result.driver}</td>
                            {/* <td>{driver_result.constructor_ref} </td> */}
                            {/* <td></td> */}
                            <td>{driver_result.time} </td>

                        </tr>
                    ))}
                </table>
            </div>


            <div class="RacePaceBox">
                {/* <h1>RacePaceBox</h1> */}
                {/* <Bar data={data}  options={chartOptions} /> */}
                <Bar data={racePaceGraphData()}  options={chartOptions} />
                {/* <Bar data={data}  options={chartOptions}  /> */}

            </div>

            <div class="RaceResultsBox">
                <table>
                    <thead>
                      <tr>
                      <th></th>
                        <th colspan="4" >
                  Race Results
                        </th>
                        {/* <th></th> */}
                        </tr>
                    </thead>
                    {raceResults().slice(0, 10).map((driver_result: any) => (
                        <tr>
                            <td>{driver_result.position} </td>
                            <td><img src={`/teamlogos/${driver_result.constructorRef}.webp`}   width="80" height="30" /></td>
                            <td>{driver_result.driver}</td>
                            {/* <td>{driver_result.constructor_ref} </td> */}
                            {/* <td></td> */}
                            <td>{driver_result.time} </td>

                        </tr>
                    ))}
                </table>
            </div>


            <div class="QualyQ3GapBox">
                {/* <h1>RaceVsQualyPlaceBox</h1> */}
                {/* <Line data={data}  options={chartOptions2} /> */}
                <Bar data={data4}  options={chartOptions4} />

            </div>
            {/* NEW ROW */}
            <div class="AverageRaceLapGapToFastest">
                <Bar data={data5}  options={chartOptions5}  />
                {/* <h1>QualyResultBox</h1> */}
            </div>
            <div class="RaceTeamateGapBasedOnAverageLap">
                <Bar data={data6}  options={chartOptions6} />
                {/* <h1>QualyPaceLinear</h1> */}
            </div>
            {/* <div class="QualyTeamateGap">
                <h1>QualyTeamateGap</h1>
            </div> */}

        </div>

    )
 }
export default Races;


