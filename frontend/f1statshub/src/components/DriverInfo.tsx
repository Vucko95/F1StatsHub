import { Component, createSignal, createEffect } from "solid-js";
import { fetchDriverStandings, fetchConstructorStandings, fetchDriversPointsForGraph } from "../services/api";
import "../styles/driverinfo.css";
import { onMount } from 'solid-js'
import { Line } from 'solid-chartjs'
import { getCountryCode, getNationalityCode } from "../constants/CodeUtils";
import { DriverGraphData } from '../models/models' 
import "../styles/right_sidebar.css";
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'


const DriverInfo: Component = () => {
    const [driverStandings, setDriverStandings] = createSignal([]);
    const [driverGraphData, setDriverGraphData] = createSignal<DriverGraphData[]>([]);

    onMount(() => {
      Chart.register(Title, Tooltip, Legend, Colors)
  })
    createEffect(async () => {
      try {
        
        const driverStandingsData = await fetchDriverStandings();
        setDriverStandings(driverStandingsData);
        const driversPointsForGraph = await fetchDriversPointsForGraph();
        setDriverGraphData(driversPointsForGraph);

      } catch (error) {
        console.error(error);
      }
    });


  const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
  }

    return (
        <div class="driver_info_box">


            <div class="driverListBox" id="style-1">
                <table class="scrollable-table">
                      <tbody>
                      {driverStandings().map((driver: any) => (
                    <tr>
                      <td><img src={`/drivers/${driver.driver_ref}.avif`}  width="70" height="80" style="border-radius: 50%;"  /></td>
                      <td>{driver.driver_name}</td>
                      <td><img src={`/countries/${getNationalityCode(driver.nationality)}.png`}width="50"height="25"/></td>

                    </tr>
                  ))}   
                      </tbody>
                    </table>
            </div>

            <div class="chartBox">

              <Line data={driverGraphData()}  options={chartOptions} width={900} height={500} />
            </div>

        </div>
    )
 }
export default DriverInfo;