import { Component, createSignal, createEffect } from "solid-js";
import { fetchDriverStandignsBarGraph,fetchDriversPointsForGraph, fetchDriverStandings, fetchDriverStandignsForDonuts } from "../services/api";
// import "../styles/right_sidebar.css";
import "../styles/drivers.css";
import { Line } from 'solid-chartjs'
import { Doughnut } from 'solid-chartjs'
import { Bar } from 'solid-chartjs'
import "../styles/right_sidebar.css";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { getCountryCode, getNationalityCode } from "../constants/CodeUtils";
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import { onMount } from 'solid-js'

const Drivers: Component = () => {
    const [driverGraphData, setDriverGraphData] = createSignal([]);
    const [driverStandings, setDriverStandings] = createSignal([]);
    const [donutdriverStandings, setDonutDriverStandings] = createSignal([]);
    const [bardriverStandings, setBarDriverStandings] = createSignal([]);



    createEffect(async () => {
        try {
        const driverStandingsData = await fetchDriverStandings();
        setDriverStandings(driverStandingsData);
        const driversPointsForGraph = await fetchDriversPointsForGraph();
        setDriverGraphData(driversPointsForGraph);
        const donutPointsGraph = await fetchDriverStandignsForDonuts();
        setDonutDriverStandings(donutPointsGraph);
        const barPointsGraph = await fetchDriverStandignsBarGraph();
        setBarDriverStandings(barPointsGraph);
          console.log(driverStandingsData)
        } catch (error) {
          console.error(error);
        }
      });

      onMount(() => {
        Chart.register(Title, Tooltip, Legend, Colors,ChartDataLabels)
    })

    const chartOptions = {
      responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            display: false
            
          },
          legend: {
            position: 'right',
            labels: {
              color: 'white', 
              padding: 10,
  
            }},
          tooltip: {
            bodyFont: {
              size: 14, 
            },
          },
        },
        scales: {
        
        },
      }
      const data2 = {
        labels: [
          'Max',
          'Hamilton',
          'Lando',
          'Ruseel'
        ],
        datasets: [{
          data: [300, 50, 100,150],
          // label: 'My First Dataset',
          // backgroundColor: [
          //   'blue',
          //   'teal',
          //   'red',
          //   'orange',
          // ],
          // hoverOffset: 4
        }]
      };

      const chartOptions2 = {
        responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: 'white', 
                // padding: 10,
    
              }},
              datalabels: {
                font: {
                  size: 24,
                },
                color: '#FFFFFF'
              },
              title: {
                display: true,
                text: 'Driver Points',
                color: 'white',
                font: {
                  size: 24,
                }},
  
            tooltip: {
              bodyFont: {
                size: 14,
                color: '#FFFFFF', 
              },
            },
          },
          scales: {
          
          },
        }



        const data5 = {
          labels: ['VER', 'PER', 'HAM', 'RUS', 'NOR', 'PIA', 'ZOU', 'BOT', 'RIC', 'TSU'],

          datasets: [
            {
              label: 'ToHide',
              data: [
                  23, 18, 14, 13, 12, 11, 11, 4, 4, 2
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
              text: 'Average Points Per Race Top 10 Drivers',
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
                // reverse: true,
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

      return (
        <div class="DriversMainBox" id="style-1" >

            <div class="driversTable" id="style-1" >
              <table>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th></th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {driverStandings().map((driver: any) => (
                    <tr>
                      {/* <td><img src={`/teamlogos/${driver.driverRef}.webp`}  width="80" height="30" /></td> */}
                      <td><img src={`/teamlogos/${driver.constructorRef}.webp`}   width="50"height="25" /></td>

                      <td>{driver.driver_name}</td>
                      <td><img src={`/countries/${getNationalityCode(driver.nationality)}.png`}width="50"height="25"/></td>
                      <td>{driver.total_points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            <div class="DriversChartBox">

              <Line data={driverGraphData()}  options={chartOptions}  />
            </div>
            <div class="DonutChartBox">

              <Doughnut data={donutdriverStandings()}  options={chartOptions2}  />
            </div>
            <div class="AveragePointsPerRaceForDriver">

              <Bar data={bardriverStandings()}  options={chartOptions5}  />
            </div>

        </div>
      );
 }
export default Drivers;