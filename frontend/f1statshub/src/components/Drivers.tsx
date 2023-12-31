import { Component, createSignal, createEffect } from "solid-js";
import { fetchDriverStandignsBarGraph,fetchDriversPointsForGraph, fetchDriverStandings, fetchDriverStandignsForDonuts } from "../services/api";
import "../styles/drivers.css";
import "../styles/teams.css";
import { Line } from 'solid-chartjs'
import { Doughnut } from 'solid-chartjs'
import { Bar } from 'solid-chartjs'
// import "../styles/home.css";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { chartOptions,chartOptions5, chartOptions2 } from "../constants/DriversCharts"

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
            } 
        catch (error) {
          console.error(error);
        }
      });

      onMount(() => {
        Chart.register(Title, Tooltip, Legend, Colors,ChartDataLabels)
    })


      return (
        <div class="DriversMainBox" id="style-1" >
            <div class="driversStandingsBox" id="style-1" >
                <table>
                  {/* <thead>
                    <tr>
                    <th colspan="4"> Driver Points</th>
                    </tr>
                  </thead> */}
                  <tbody>
                    {driverStandings().map((driver: any, index: number) => (
                      <tr>
                        <td id={`${driver.constructorRef}`}>
                          {index + 1}
                        </td>
                        {/* <td><img src={`/teamlogos/${driver.driverRef}.webp`}  width="80" height="30" /></td> */}
                        <td id={`${driver.constructorRef}`} ><img src={`/countries/${getNationalityCode(driver.nationality)}.png`}width="35"height="25"style="border-radius: 50%;"/></td>
                        <td id={`${driver.constructorRef}`}>{driver.driver_name}</td>
                        {/* <td id={`${driver.constructorRef}`} ><img src={`/teamlogos/${driver.constructorRef}.webp`}   width="50"height="25"style="border-radius: 10%;" /></td> */}
                        <td id={`${driver.constructorRef}`} class="td-with-image" >
                          <img src={`/teamlogos2/${driver.constructorRef}.png`}   width="70"height="30"style="border-radius: 10%;" />
                          </td>
                        {/* <td id="red_bull">{driver.driver_name}</td> */}
                        <td id={`${driver.constructorRef}`}>{driver.total_points}</td>
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