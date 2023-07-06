import { Component, createSignal, createEffect } from "solid-js";
import { fetchDriversForSpecificYear } from "../services/api";
import { fetchDriverStandings, fetchConstructorStandings, fetchDriversPointsForGraph } from "../services/api";
import "../styles/driverinfo.css";
import { onMount } from 'solid-js'
import { Line } from 'solid-chartjs'
import nationalityCodeData from './nationalityCodes';

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

    onMount(() => {
      Chart.register(Title, Tooltip, Legend, Colors)
  })
    createEffect(async () => {
      try {
        
        const driverStandingsData = await fetchDriverStandings();
        // Chart.register(Title, Tooltip, Legend, Colors);
        setDriverStandings(driverStandingsData);
        const driversPointsForGraph = await fetchDriversPointsForGraph();
        setDriverGraphData(driversPointsForGraph);
        // setIsLoading(false);
        // const chartData = updateChartData();
        const chartData = driversPointsForGraph
        console.log(chartData)

        // console.log(driversPointsForGraph)
      } catch (error) {
        console.error(error);
      }
    });
  //   onMount(() => {
  //     Chart.register(Title, Tooltip, Legend, Colors)
  // })
  const chartData = {
    labels: driverGraphData().length > 0 ? driverGraphData()[0].points.map((_, index) => `Race${index + 1}`) : [],
    datasets: driverGraphData().map((driver) => ({
      label: driver.driver_ref,
      data: driver.points,
    })),
  };
  const chartData2 = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
          {
              label: 'Sales',
              data: [50, 60, 70, 80, 90],
          },
          {
              label: 'IT',
              data: [20, 40, 90, 100, 120],
          },
      ],
  }
  // const updateChartData = () => {
  //   const graphData = driverGraphData();
  //   if (graphData && graphData.length > 0) {
  //     const updatedChartData = {
  //       labels: graphData[0].points.map((_, index) => `Race${index + 1}`),
  //       datasets: graphData.map((driver) => ({
  //         label: driver.driver_ref,
  //         data: driver.points,
  //       })),
  //     };
  //     return updatedChartData;
  //   } else {
  //     console.log('EMPTYYY');
  //     return null;
  //   }
  // };
  // const chartData = updateChartData();
  // console.log('yoyo' + chartData)
  // let chartData = null;
  // if (!isLoading()) {
  //   chartData = updateChartData();
  // }
  const getNationalityCode = (nationality: string) => {
    const nationalityCode = nationalityCodeData[nationality] || '';
    return nationalityCode.toLowerCase();
  };

  const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
  }

    return (
        <div class="driver_info_box">
        {/* <h1>DriverInfo</h1> */}


            <div class="driverListBox" id="style-1">
                <table class="scrollable-table">
                      <tbody>
                      {driverStandings().map((driver: any) => (
                    <tr>
                      <td><img src={`/drivers/${driver.driver_ref}.avif`}  width="70" height="80" style="border-radius: 50%;"  /></td>
                      <td>{driver.driver_name}</td>
                      <td><img src={`/countries/${getNationalityCode(driver.nationality)}.png`}width="50"height="25"/></td>
                      {/* <td><img src={`/teamlogos/${driver.constructorRef}.webp`}  width="80" height="30" /></td>
                      <td>{driver.total_points}</td> */}
                    </tr>
                  ))}   
                      </tbody>
                    </table>
            </div>



            <div class="chartBox">

                         {/* <Line data={chartData} options={chartOptions} width={500} height={500} /> */}
                         {/* <Line data={chartData2} options={chartOptions} width={500} height={500} /> */}
                {/* {isLoading() ? (
          <div>Loading...</div>
        ) : chartData ? ( */}
          {/* <Line data={chartData} options={chartOptions} width={500} height={500} /> */}
          {/* {isLoading() ? (
                    <div>Loading...</div>
                ) : driverGraphData() ? ( */}
          <Line data={driverGraphData()} options={chartOptions} width={900} height={500} />
                {/* ) : null} */}
        {/* ) : null} */}
            </div>
        </div>
    )
 }
export default DriverInfo;