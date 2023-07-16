import { Component, createSignal, createEffect } from "solid-js";
import { fetchDriversPointsForGraph, fetchDriverStandings } from "../services/api";
// import "../styles/right_sidebar.css";
import "../styles/drivers.css";
import { Line } from 'solid-chartjs'
import "../styles/right_sidebar.css";

import { getCountryCode, getNationalityCode } from "../constants/CodeUtils";
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import { onMount } from 'solid-js'

const Drivers: Component = () => {
    const [driverGraphData, setDriverGraphData] = createSignal([]);
    const [driverStandings, setDriverStandings] = createSignal([]);



    createEffect(async () => {
        try {
        const driverStandingsData = await fetchDriverStandings();
        setDriverStandings(driverStandingsData);
        const driversPointsForGraph = await fetchDriversPointsForGraph();
        setDriverGraphData(driversPointsForGraph);
          console.log(driverStandingsData)
        } catch (error) {
          console.error(error);
        }
      });

      onMount(() => {
        Chart.register(Title, Tooltip, Legend, Colors)
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
  

      return (
        <div class="constructorsMain" id="style-1" >

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
                      <td><img src={`/countries/${getNationalityCode(driver.nationality)}.png`}width="50"height="25"/></td>

                      <td>{driver.driver_name}</td>
                      <td>{driver.total_points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            <div class="Constructors-ChartBox">

              <Line data={driverGraphData()}  options={chartOptions}  />
            </div>

        </div>
      );
 }
export default Drivers;