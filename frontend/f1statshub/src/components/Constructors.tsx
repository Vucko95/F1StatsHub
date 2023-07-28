import { Component, createSignal, createEffect } from "solid-js";
import { fetchConstructorsGraph, fetchConstructorStandings } from "../services/api";
// import "../styles/right_sidebar.css";
import "../styles/constructors.css";
import { Line } from 'solid-chartjs'

import { getCountryCode, getNationalityCode } from "../constants/CodeUtils";
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import { onMount } from 'solid-js'

const Constuctors: Component = () => {
    const [constructorStandings, setConstructorStandings] = createSignal([]);
    const [driverGraphData, setDriverGraphData] = createSignal([]);



    createEffect(async () => {
        try {
          const constructorStandingsData = await fetchConstructorStandings();
          setConstructorStandings(constructorStandingsData);

          const driverStandingsData = await fetchConstructorsGraph();
          setDriverGraphData(driverStandingsData);
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

              <Line data={driverGraphData()}  options={chartOptions}  />
            </div>

        </div>
      );
 }
export default Constuctors;