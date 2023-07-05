import { Component, createSignal, createEffect } from "solid-js";
import { fetchDriversForSpecificYear } from "../services/api";
import { fetchDriverStandings, fetchConstructorStandings, fetchDriversPointsForGraph } from "../services/api";
import "../styles/driverinfo.css";
import { onMount } from 'solid-js'
import { Line } from 'solid-chartjs'

import "../styles/right_sidebar.css";
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'

interface DriverGraphData {
  driver_id: number;
  driver_ref: string;
  points: number[];
}
const DriverInfo: Component = () => {
    // const [driverStandings, setDriverStandings] = createSignal([]);
    const [driverStandings, setDriverStandings] = createSignal([]);
    const [driverGraphData, setDriverGraphData] = createSignal<DriverGraphData[]>([]);
    const [isLoading, setIsLoading] = createSignal(true);

    createEffect(async () => {
      try {
        
        const driverStandingsData = await fetchDriverStandings();
        Chart.register(Title, Tooltip, Legend, Colors);
        setDriverStandings(driverStandingsData);
        const driversPointsForGraph = await fetchDriversPointsForGraph();
        setDriverGraphData(driversPointsForGraph);
        console.log(driversPointsForGraph)
      } catch (error) {
        console.error(error);
      }
    });
  //   onMount(() => {
  //     Chart.register(Title, Tooltip, Legend, Colors)
  // })
  // const chartData = {
  //   labels: driverGraphData().length > 0 ? driverGraphData()[0].points.map((_, index) => `Race${index + 1}`) : [],
  //   datasets: driverGraphData().map((driver) => ({
  //     label: driver.driver_ref,
  //     data: driver.points,
  //   })),
  // };
  // const chartData = {
  //     labels: ['January', 'February', 'March', 'April', 'May'],
  //     datasets: [
  //         {
  //             label: 'Sales',
  //             data: [50, 60, 70, 80, 90],
  //         },
  //         {
  //             label: 'IT',
  //             data: [20, 40, 90, 100, 120],
  //         },
  //     ],
  // }
  const updateChartData = () => {
    if (driverGraphData().length > 0) {
      const updatedChartData = {
        labels: driverGraphData()[0].points.map((_, index) => `Race${index + 1}`),
        datasets: driverGraphData().map((driver) => ({
          label: driver.driver_ref,
          data: driver.points,
        })),
      };
      return updatedChartData;
    } else {
      return null;
    }
  };
  const chartData = updateChartData();

  const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
  }

    return (
        <div class="driver_info_box">
        {/* <h1>DriverInfo</h1> */}
            <div class="driverListBox">
          {/* <h1>driverplace</h1> */}

                <table>
                      <tbody>
                      {driverStandings().map((driver: any) => (
              <tr>
                <td>{driver.driver_name}</td>
                <td>{driver.nationality}</td>
              </tr>
            ))}
                        
                      </tbody>
                    </table>
            </div>
            <div class="chartBox">

                         <Line data={chartData} options={chartOptions} width={500} height={500} />

            </div>
        </div>
    )
 }
export default DriverInfo;