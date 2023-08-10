import { Component, createSignal, createEffect } from "solid-js";
import { fetchConstructorsGraph, fetchConstructorStandings, fetchConstructorStandignsBarGraph,fetchConstructorStandignsForDonuts  } from "../services/api";
import "../styles/constructors.css";
import { Line } from 'solid-chartjs'
import { Doughnut } from 'solid-chartjs'
import { Bar } from 'solid-chartjs'
import { chartOptions,chartOptions5, chartOptions2 } from "../constants/ConstructorCharts"
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

      return (
        <div class="constructorsMainBox" id="style-1" >

            <div class="constructorsStandignsBox" id="style-1" >
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