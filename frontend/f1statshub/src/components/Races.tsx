import { Component, createSignal, createEffect } from "solid-js";
import { fetchRacesForSelectedYear, fetchRaceResults, fetchQualyResults, fetchRacePaceGraph, fetchQualyGapGraph } from "../services/api";
import { onMount } from 'solid-js'
import { getCountryCode, getNationalityCode } from "../constants/CodeUtils";

import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { chartOptions,chartOptions4 } from "../constants/RacesCharts"
import 'chartjs-plugin-style';
import { Bar } from 'solid-chartjs'
import "../styles/races.css";
import "../styles/base.css";
import "../styles/teams.css";
const Races: Component = () => {
    const [raceButtons, setRaceButtons] = createSignal([]);
    const [raceResults, setRaceResults] = createSignal([]);
    const [qualyResults, setQualyResults] = createSignal([]);
    const [racePaceGraphData, setRacePaceGraphData] = createSignal([]);
    const [qualyGapGraphData, setQualyGapGraphData] = createSignal([]);

    onMount(() => {
      Chart.register(Title, Tooltip, Legend, Colors,ChartDataLabels)
                  })
    createEffect(async () => {
      try {
        const race_list = await fetchRacesForSelectedYear();
        setRaceButtons(race_list)
//      ADD LOGIC TO FETCH LAST RACE BASED ON DATE
        const race_results = await fetchRaceResults(1108);
        setRaceResults(race_results);
        const qualy_results = await fetchQualyResults(1108);
        setQualyResults(qualy_results);
        const racePaceGraphData = await fetchRacePaceGraph(1108);
        setRacePaceGraphData(racePaceGraphData);
        const qualyGapGraphData = await fetchQualyGapGraph(1108);
        setQualyGapGraphData(qualyGapGraphData);
      } catch (error) {
        console.error(error);
      }
    });

    const fetchSelectedRaceData = async (race_id: number) => {
      try {
        const race_results = await fetchRaceResults(race_id);
        setRaceResults(race_results);
        const qualy_results = await fetchQualyResults(race_id);
        setQualyResults(qualy_results);
        const racePaceGraphData = await fetchRacePaceGraph(race_id);
        setRacePaceGraphData(racePaceGraphData);
        const qualyGapGraphData = await fetchQualyGapGraph(race_id);
        setQualyGapGraphData(qualyGapGraphData);
      } catch (error) {
        console.log(error)
        
      }
    }

    return (
        <div class="RacesMainBox">


      <div class="RacesDropdown">
        <h3>Select Race   </h3>
          <select id="style-1"
              onInput={(e) => fetchSelectedRaceData(parseInt(e.target.value))}
          >
              {raceButtons().map((race_info: any) => (
                  <option value={race_info.raceId}>{race_info.country}</option>
              ))}
          </select>
      </div>


            <div class="RaceResultsBox">
                <table>
                    {/* <thead>
                      <tr>
                        <th></th>
                        <th colspan="4" >Race Results</th>
                      </tr>
                    </thead> */}
                    {raceResults().slice(0, 10).map((driver_result: any) => (
                      <tr>
                            <td id={`${driver_result.constructorRef}`}>{driver_result.position} </td>
                            <td id={`${driver_result.constructorRef}`}>{driver_result.driver}</td>
                            <td id={`${driver_result.constructorRef}`}><img src={`/teamlogos2/${driver_result.constructorRef}.png`}   width="80"height="30"style="border-radius: 10%;"/></td>
                            <td id={`${driver_result.constructorRef}`}>{driver_result.time} </td>

                      </tr>
                    ))}
                </table>
            </div>


            <div class="RacePaceBox">
                <Bar data={racePaceGraphData()}  options={chartOptions} />
            </div>

            <div class="RaceResultsBox">
                
                {/* <div class="baseTable"> */}
                <table>
                    {/* <thead>
                      <tr>
                        <th></th>
                        <th colspan="4" > Qualy Results </th>
                      </tr>
                    </thead> */}
                    {qualyResults().slice(0, 10).map((driver_result: any) => (
                        <tr>
                            <td id={`${driver_result.constructorRef}`}>{driver_result.position} </td>
                            <td id={`${driver_result.constructorRef}`}><img src={`/teamlogos2/${driver_result.constructorRef}.png`}   width="80" height="30" /></td>
                            <td id={`${driver_result.constructorRef}`}>{driver_result.driver}</td>
                            <td id={`${driver_result.constructorRef}`}>{driver_result.time} </td>
                        </tr>
                    ))}
                </table>
                {/* </div> */}
            </div>

            <div class="QualyQ3GapBox">
                <Bar data={qualyGapGraphData()}  options={chartOptions4} />
            </div>

        </div>

    )
 }
export default Races;


