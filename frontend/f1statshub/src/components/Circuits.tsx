import { Component, createSignal, createEffect } from "solid-js";
import { Circuit } from '../models/models';
import { fetchCircuitsByYear, fetchCircuitWinners, fetchCircuitResults } from "../services/api";
import { getCountryCode, getNationalityCode } from "../constants/CodeUtils";

import "../styles/circuits.css";

const Circuits: Component = () => {
  const [circuits, setCircuits] = createSignal([]);
  const [circuitWinners, setCircuitWinners] = createSignal([]);
  const [circuitResults, setCircuitResults] = createSignal([]);
  const [activeButton, setActiveButton] = createSignal<number | null>(1);

  createEffect(async () => {
    try {
      const circuitData = await fetchCircuitsByYear();
      setCircuits(circuitData);
      if (circuitData.length > 0) {
        const firstCircuitId = circuitData[0].circuitId; 
        setActiveButton(firstCircuitId); 
        const winners = await fetchCircuitWinners(firstCircuitId);
        showCircuitResults(winners[0]?.race_id || '');
        setCircuitWinners(winners);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const showCircuitDetails = async (circuitId: number) => {
    try {
      const winners = await fetchCircuitWinners(circuitId);
      setCircuitWinners(winners);
    } catch (error) {
      console.error(error);
    }
  };

  const showCircuitResults = async (raceId: number) => {
    try {
      const race_results = await fetchCircuitResults(raceId);
      setCircuitResults(race_results);
      console.log(race_results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div class="CircuitsMainBox">
      <div class="circuitsListBox">
        <table>
          <thead></thead>
          <tbody>
            {circuits().map((circuitInfo: Circuit) => (
              <tr>
                <td>
                  <img
                    src={`/countries/${getCountryCode(circuitInfo.country)}.png`}
                  />
                </td>
                <td>{circuitInfo.name}</td>
                <td>
                  <button
                    class={`baseBtn ${activeButton() === circuitInfo.circuitId ? "active" : ""}`}
                    onClick={() => {
                      setActiveButton(circuitInfo.circuitId);
                      showCircuitDetails(circuitInfo.circuitId);
                      showCircuitResults(circuitInfo.raceId);
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div class="circuit_results">
        <div class="circuit_latest_results">
          <table>
            <thead></thead>
            {circuitResults()
              .slice(0, 10)
              .map((driver_result: any) => (
                <tr>
                  <td>{driver_result.position} </td>
                  <td>
                    <img src={`/teamlogos/${driver_result.constructorRef}.webp`} />
                  </td>
                  <td>{driver_result.driver}</td>
                  <td>{driver_result.constructor_ref} </td>
                  <td></td>
                  <td>{driver_result.time} </td>
                </tr>
              ))}
          </table>
        </div>

        <br />

        <div class="circuit_history">
          <table class="winners_table">
            <tbody>
              {circuitWinners().map((circuitRaceResultForSelectedYear: any) => (
                <tr>
                  <td>{circuitRaceResultForSelectedYear.year}</td>
                  <td>
                    <img
                      src={`/countries/${getNationalityCode(
                        circuitRaceResultForSelectedYear.nationality
                      )}.png`}
                    />
                  </td>
                  <td>{circuitRaceResultForSelectedYear.driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Circuits;
