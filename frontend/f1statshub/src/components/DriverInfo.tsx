import { Component, createSignal, createEffect } from "solid-js";
import { fetchDriverStandings, fetchConstructorStandings, fetchDriversPointsForGraph } from "../services/api";
import "../styles/driverinfo.css";
import { onMount } from 'solid-js'
import { Line } from 'solid-chartjs'
import { Bar } from 'solid-chartjs'
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
  const DATA_COUNT = 7;
const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

const labels = Utils.months({count: 7});
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: Utils.numbers(NUMBER_CFG),
        borderColor: Utils.CHART_COLORS.red,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
      },
      {
        label: 'Dataset 2',
        data: Utils.numbers(NUMBER_CFG),
        borderColor: Utils.CHART_COLORS.blue,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
      }
    ]
  };
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

              <Line data={data}  options={chartOptions} width={900} height={500} />
            </div>

        </div>
    )
 }
export default DriverInfo;

