import { Component, createSignal, createEffect } from "solid-js";
import { Circuit } from '../models/models' 
import { fetchCircuitsByYear, fetchCircuitWinners, fetchCircuitResults, fetchRacePaceGraph } from "../services/api";
import { getCountryCode, getNationalityCode, isDateInPast } from "../constants/CodeUtils";
import { onMount } from 'solid-js'
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import { Bar, Line } from 'solid-chartjs'
import "../styles/races.css";

const Races: Component = () => {
    const [racePaceGraphData, setRacePaceGraphData] = createSignal([]);
    const [circuits, setCircuits] = createSignal([]);
    const [circuitWinners, setCircuitWinners] = createSignal([]);
    const [circuitResults, setCircuitResults] = createSignal([]);
    const [circuitLayout, setCircuitLayout] = createSignal('');
    const [selectedCircuitName, setSelectedCircuitName] = createSignal('');
    const [selectedCircuitCountry, setSelectedCircuitCountry] = createSignal('');

    createEffect(async () => {
      try {
        const circuitData = await fetchCircuitsByYear();
        setCircuits(circuitData);
        const winners = await fetchCircuitWinners(3);
        setCircuitLayout(winners[0]?.circuit_country || '');
        setCircuitWinners(winners);
        setSelectedCircuitName(winners[0]?.circuit_name || '');
        setSelectedCircuitCountry(winners[0]?.circuit_country || '');
        showCircuitResults(winners[0]?.race_id || '');


      } catch (error) {
        console.error(error);
      }
    });

    const showCircuitDetails = async (circuitId: number) => {
      try {
        const winners = await fetchCircuitWinners(circuitId);
        setCircuitWinners(winners);
        setCircuitLayout(winners[0]?.circuit_country || '');
        setSelectedCircuitName(winners[0]?.circuit_name || '');
        setSelectedCircuitCountry(winners[0]?.circuit_country || '');
      } catch (error) {
        console.error(error);
      }
    };

    const showCircuitResults = async (raceId: number) => {
      try {
        const race_results = await fetchCircuitResults(raceId);
        setCircuitResults(race_results);
        console.log(race_results)
      } catch (error) {
        console.error(error);
      }
    };

    createEffect(async () => {
        try {
        const racePaceGraphData = await fetchRacePaceGraph();
        setRacePaceGraphData(racePaceGraphData);
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
        scales: {
            y: {
              beginAtZero: false,
              min: 72, // Set the desired starting point on the y-axis
            },
          },
    }


    // const data = {
    //     labels: ["1"],
    //     datasets: [
    //       {
    //         label: 'Dataset 1',
    //         data: [[60,65]],
    //         backgroundColor: 'red',
    //         borderRadius: 20,
    //         borderSkipped: false,
    //         borderWidth: 2,
    //         barThickness: 50
    //       },
    //       {
    //         label: 'Dataset 2',
    //         data: [[63,68]],
    //         backgroundColor: 'lime',
    //         borderRadius: 20,
    //         borderSkipped: false,
    //         borderWidth: 2,
    //         barThickness: 50
    //       },
    //       {
    //         label: 'Dataset 3',
    //         data: [[65,72]],
    //         backgroundColor: 'teal',
    //         borderRadius: 20,
    //         borderSkipped: false,
    //         borderWidth: 2,
    //         barThickness: 50
    //       },
    //       {
    //         label: 'Dataset 3',
    //         data: [[58,66]],
    //         backgroundColor: 'orange',
    //         borderRadius: 20,
    //         borderSkipped: false,
    //         borderWidth: 2,
    //         barThickness: 50
    //       },
    //       {
    //         label: 'Dataset 3',
    //         data: [[56,68]],
    //         backgroundColor: 'white',
    //         borderRadius: 20,
    //         borderSkipped: false,
    //         borderWidth: 2,
    //         barThickness: 50
    //       },
    //     ],
    //   };


    return (
        <div class="RacesMain">
        
            <div class="RaceResultsBox">
                <table>
                    <thead></thead>
                    {circuitResults().slice(0, 10).map((driver_result: any) => (
                        <tr>
                            <td>{driver_result.position} </td>
                            <td>{driver_result.driver}</td>
                            <td>{driver_result.constructor_ref} </td>
                            <td></td>
                            <td>{driver_result.time} </td>
                            <td><img src={`/teamlogos/${driver_result.constructorRef}.webp`}   width="80" height="30" /></td>

                        </tr>
                    ))}
                </table>
            </div>

            <div class="RacePaceBox">
                {/* <h1>RacePaceBox</h1> */}
                {/* <Bar data={data}  options={chartOptions} /> */}
                <Bar data={racePaceGraphData()}  options={chartOptions} />
                {/* <Bar data={data}  options={chartOptions}  /> */}

            </div>
            <div class="RaceVsQualyPlaceBox">
                <h1>RaceVsQualyPlaceBox</h1>
            </div>
            {/* NEW ROW */}
            <div class="QualyResultBox">
                <h1>QualyResultBox</h1>
            </div>
            <div class="QualyPaceLinear">
                <h1>QualyPaceLinear</h1>
            </div>
            <div class="QualyTeamateGap">
                <h1>QualyTeamateGap</h1>
            </div>

        </div>

    )
 }
export default Races;


