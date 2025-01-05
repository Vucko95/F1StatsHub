import { Component, createSignal, createEffect } from "solid-js";
import { fetchDriverStandignsBarGraph, fetchNumberOfRaces, fetchDriversPointsForGraph, fetchDriverStandings, fetchDriverStandignsForDonuts } from "../services/api";
import "../styles/drivers.css";
// import "../styles/teams.css";
import { Line, Doughnut, Bar } from 'solid-chartjs'
import "../styles/slider.css";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { chartOptions, chartOptions5, chartOptions2 } from "../constants/DriversCharts"
import noUiSlider from 'nouislider';

import { getCountryCode, getNationalityCode } from "../constants/CodeUtils";
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import { onMount } from 'solid-js'

const Drivers: Component = () => {
  const [driverGraphData, setDriverGraphData] = createSignal([]);
  const [driverStandings, setDriverStandings] = createSignal([]);
  const [donutdriverStandings, setDonutDriverStandings] = createSignal([]);
  const [bardriverStandings, setBarDriverStandings] = createSignal([]);
  const [racenumber, setracenumber] = createSignal([]);

  const [numberOfRaces, setNumberOfRaces] = createSignal(0);
  const [isSliderReady, setIsSliderReady] = createSignal(false);

  const [selectedYear, setSelectedYear] = createSignal(2023);
  
  createEffect(async () => {
    try {
      const racesArray = await fetchNumberOfRaces();
      console.log(racesArray)
      const numberOfRaces = racesArray.length;
      console.log(numberOfRaces)


      const driversPointsForGraph = await fetchDriversPointsForGraph();
      setDriverGraphData(driversPointsForGraph);
      const donutPointsGraph = await fetchDriverStandignsForDonuts();
      setDonutDriverStandings(donutPointsGraph);
      const barPointsGraph = await fetchDriverStandignsBarGraph();
      setBarDriverStandings(barPointsGraph);
    }
    catch (error) {
      console.error(error);
    }
  });

  createEffect(async () => {
    try {
      const racesArray = await fetchNumberOfRaces();
      setNumberOfRaces(racesArray.length);
      setIsSliderReady(true);
    } catch (error) {
      console.error(error);
    }
  });

  onMount(() => {
    createEffect(() => {
      if (isSliderReady()) {
        const slider = document.getElementById("slider");
        if (slider) {
          const sliderInstance = noUiSlider.create(slider, {
            start: numberOfRaces(),
            step: 1,
            connect: false,
            range: {
              min: 0,
              max: numberOfRaces(),
            },
          });
          
          sliderInstance.on("update", async (values) => {
            const selectedRace = parseInt(String(values[0]), 10);

            console.log("Slider value:", selectedRace);
  
            try {
              const driverStandingsData = await fetchDriverStandings(selectedYear(), selectedRace);
              setDriverStandings(driverStandingsData);
            } catch (error) {
              console.error("Error fetching driver standings:", error);
            }
          });
        }
      }
    });
  });


  return (
    <div class="DriversMainBoxOutside"  >
      <h1>Select Races</h1>
      <div class="RacesDropdown">
        <div class="slider" id="slider"></div>
      </div>
      <div class="DriversMainBox"  >
        <div class="driversStandingsBox"  >
          <table>

            <tbody>
              {driverStandings().map((driver: any, index: number) => (
                <tr>
                  <td id={`${driver.constructorRef}`}>
                    {index + 1}
                  </td>
                  <td id={`${driver.constructorRef}`} ><img src={`/countries/${getNationalityCode(driver.nationality)}.png`} /></td>
                  <td id={`${driver.constructorRef}`}>{driver.driver_name}</td>
                  <td id={`${driver.constructorRef}`} class="td-with-image" >
                    <img src={`/teamlogos2/${driver.constructorRef}.png`}  />
                  </td>
                  <td id={`${driver.constructorRef}`}>{driver.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div class="DriversChartBox">
          <Line data={driverGraphData()} options={chartOptions} />
        </div>

        <div class="DonutChartBox">
          <Doughnut data={donutdriverStandings()} options={chartOptions2} />
        </div>

        <div class="AveragePointsPerRaceForDriver">
          <Bar data={bardriverStandings()} options={chartOptions5} />
        </div>

      </div>
    </div>
  );
}
export default Drivers;