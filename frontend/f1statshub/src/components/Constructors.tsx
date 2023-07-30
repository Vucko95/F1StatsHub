import { Component, createSignal, createEffect } from "solid-js";
import { fetchConstructorsGraph, fetchConstructorStandings, fetchConstructorStandignsBarGraph,fetchConstructorStandignsForDonuts  } from "../services/api";
// import "../styles/right_sidebar.css";
import "../styles/constructors.css";
import { Line } from 'solid-chartjs'
import { Doughnut } from 'solid-chartjs'
import { Bar } from 'solid-chartjs'
import { getCountryCode, getNationalityCode } from "../constants/CodeUtils";
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import { onMount } from 'solid-js'
import ChartDataLabels from 'chartjs-plugin-datalabels';

const Constuctors: Component = () => {
    const [constructorStandings, setConstructorStandings] = createSignal([]);
    const [constructorGraphData, setConstructorGraphData] = createSignal([]);

    const [donutconstructorStandings, setDonutConstructorStandings] = createSignal([]);
    const [barconstructorStandings, setBarConstructorStandings] = createSignal([]);


    createEffect(async () => {
        try {
          const constructorStandingsData = await fetchConstructorStandings();
          setConstructorStandings(constructorStandingsData);

          const constructorStandingsGraphData = await fetchConstructorsGraph();
          setConstructorGraphData(constructorStandingsGraphData);

          const donutPointsGraph = await fetchConstructorStandignsForDonuts();
          setDonutConstructorStandings(donutPointsGraph);
          const barPointsGraph = await fetchConstructorStandignsBarGraph();
          setBarConstructorStandings(barPointsGraph);

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

          tooltip: {
            bodyFont: {
              size: 14,
              color: '#FFFFFF', // Set the tooltip text color to white
            },
          },
        },
        scales: {
        
        },
      }
  

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
                text: 'Constructor Points',
                color: 'white',
                font: {
                  size: 24,
                }},
  
            tooltip: {
              bodyFont: {
                size: 14,
                color: '#FFFFFF', // Set the tooltip text color to white
              },
            },
          },
          scales: {
          
          },
        }
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
              text: 'Average Team Points Per Race',
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
        <div class="constructorsMain" id="style-1" >

            <div class="constructorsTable" id="style-1" >
              <table>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th></th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {constructorStandings().map((constructor: any) => (
                    <tr>
                      <td><img src={`/teamlogos/${constructor.constructorRef}.webp`}  width="80" height="30" /></td>

                      <td>{constructor.constructor_name}</td>
                      <td>{constructor.total_points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            <div class="Constructors-ChartBox">

              <Line data={constructorGraphData()}  options={chartOptions}  />
            </div>
            <div class="DonutChartBox">

              <Doughnut data={donutconstructorStandings()}  options={chartOptions2}  />
            </div>
            <div class="AveragePointsPerRaceForDriver">

              <Bar data={barconstructorStandings()}  options={chartOptions5}  />
            </div>
        </div>
      );
 }
export default Constuctors;