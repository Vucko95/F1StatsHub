import { Component, createSignal, createEffect } from "solid-js";
import { Circuit } from '../models/models' 
import { fetchRacesForSelectedYear, fetchCircuitsByYear, fetchCircuitWinners, fetchRaceResults, fetchQualyResults, fetchRacePaceGraph, fetchQualyGapGraph } from "../services/api";
import { getCountryCode, getNationalityCode, isDateInPast } from "../constants/CodeUtils";
import { onMount } from 'solid-js'
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { chartOptions,chartOptions4 } from "../constants/RacesCharts"


import 'chartjs-plugin-style';

import { Bar, Line } from 'solid-chartjs'
import "../styles/races.css";
import "../styles/base.css";

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
        <div class="RacesMain">
            <div class="RacesList">
            {raceButtons().map((race_info: any) => (

              <ul>
                <li><button onClick={() => fetchSelectedRaceData(race_info.raceId)}>{race_info.country}  </button></li>
              </ul>
            ))}
            </div>

            <div class="RaceResultsBox">
                <div class="baseTable">
                <table>
                    <thead>
                      <tr>
                      <th></th>
                        <th colspan="4" >
                  Race Results
                        </th>
                        {/* <th></th> */}
                        </tr>
                    </thead>
                    {raceResults().slice(0, 10).map((driver_result: any) => (
                      <tr>
                            <td>{driver_result.position} </td>
                            <td><img src={`/teamlogos/${driver_result.constructorRef}.webp`}   width="80" height="30" /></td>
                            <td>{driver_result.driver}</td>
                            {/* <td>{driver_result.constructor_ref} </td> */}
                            {/* <td></td> */}
                            <td>{driver_result.time} </td>

                        </tr>
                    ))}
                </table>
                </div>
            </div>


            <div class="RacePaceBox">
                {/* <h1>RacePaceBox</h1> */}
                {/* <Bar data={data}  options={chartOptions} /> */}
                <Bar data={racePaceGraphData()}  options={chartOptions} />
                {/* <Bar data={data}  options={chartOptions}  /> */}

            </div>

            <div class="RaceResultsBox">
                
                <div class="baseTable">
                <table>
                    <thead>
                      <tr>
                      <th></th>
                        <th colspan="4" >
                  Qualy Results
                        </th>
                        {/* <th></th> */}
                        </tr>
                    </thead>
                    {qualyResults().slice(0, 10).map((driver_result: any) => (
                        <tr>
                            <td>{driver_result.position} </td>
                            <td><img src={`/teamlogos/${driver_result.constructorRef}.webp`}   width="80" height="30" /></td>
                            <td>{driver_result.driver}</td>
                            {/* <td>{driver_result.constructor_ref} </td> */}
                            {/* <td></td> */}
                            <td>{driver_result.time} </td>
                            {/* <td>{driver_result.gap} </td> */}

                        </tr>
                    ))}
                </table>
                </div>
            </div>


            <div class="QualyQ3GapBox">
                {/* <h1>RaceVsQualyPlaceBox</h1> */}
                {/* <Bar data={data4}  options={chartOptions4} /> */}
                <Bar data={qualyGapGraphData()}  options={chartOptions4} />

            </div>

            {/* <div class="AverageRaceLapGapToFastest">
                <Bar data={data5}  options={chartOptions5}  />
            </div>
            <div class="RaceTeamateGapBasedOnAverageLap">
                <Bar data={data6}  options={chartOptions6} />
            </div> */}


        </div>

    )
 }
export default Races;


