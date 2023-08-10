import { Component, createSignal, createEffect } from "solid-js";
import { Circuit } from '../models/models' 
import { fetchCircuitsByYear, fetchCircuitWinners, fetchCircuitResults } from "../services/api";
import { getCountryCode, getNationalityCode, isDateInPast } from "../constants/CodeUtils";

import "../styles/circuits.css";

const Circuits: Component = () => {

    const [circuits, setCircuits] = createSignal([]);
    const [circuitWinners, setCircuitWinners] = createSignal([]);
    const [circuitResults, setCircuitResults] = createSignal([]);
    // const [circuitLayout, setCircuitLayout] = createSignal('');
    // const [selectedCircuitName, setSelectedCircuitName] = createSignal('');
    // const [selectedCircuitCountry, setSelectedCircuitCountry] = createSignal('');

    createEffect(async () => {
      try {
        const circuitData = await fetchCircuitsByYear();
        setCircuits(circuitData);
        const winners = await fetchCircuitWinners(3);
        // setCircuitLayout(winners[0]?.circuit_country || '');
        setCircuitWinners(winners);
        // setSelectedCircuitName(winners[0]?.circuit_name || '');
        // setSelectedCircuitCountry(winners[0]?.circuit_country || '');
        showCircuitResults(winners[0]?.race_id || '');


      } catch (error) {
        console.error(error);
      }
    });

    const showCircuitDetails = async (circuitId: number) => {
      try {
        const winners = await fetchCircuitWinners(circuitId);
        setCircuitWinners(winners);
        // setCircuitLayout(winners[0]?.circuit_country || '');
        // setSelectedCircuitName(winners[0]?.circuit_name || '');
        // setSelectedCircuitCountry(winners[0]?.circuit_country || '');
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

    



      
    
    return (
        <div class="circuit_info_box">
        
          <div class="circuitsListBox">
              <table>
                  <thead>
                  </thead>
                  <tbody>
                  {circuits().map((circuitInfo: Circuit) => (
                    <tr>
                    <td><img src={`/countries/${getCountryCode(circuitInfo.country)}.png`}   width="50" height="25" /></td>
                    <td class={isDateInPast(circuitInfo.date) ? 'past-date' : ''}>{circuitInfo.date}</td>
                    <td>{circuitInfo.name}</td>
                    <td>
                      <button class="baseBtn" onClick={() => { showCircuitDetails(circuitInfo.circuitId); showCircuitResults(circuitInfo.raceId); }}>Details</button>
                    </td>

                  </tr>
                  ))} 
                  </tbody>
              </table>
          </div>




          <div class="circuit_results">
            

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


              <br />
              <div class="circuit_latest_results">


              <div class="circuit_history">
                <table class="winners_table">
                  <thead>
                    <tr>
                    <th>Year</th>
                    <th>Team</th>
                    <th>Winner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {circuitWinners().map((circuitRaceResultForSelectedYear: any) => (
                      <tr>
                        <td>{circuitRaceResultForSelectedYear.year}</td>
                      <td><img src={`/teamlogos/${circuitRaceResultForSelectedYear.constructorRef}.webp`}   width="80" height="30" /></td>
                        <td>{circuitRaceResultForSelectedYear.driver}
                        </td>
                        <td>
                        <img src={`/countries/${getNationalityCode(circuitRaceResultForSelectedYear.nationality)}.png`}width="50"height="25"/>               
                        </td>

                      </tr>
                  ))}
                  </tbody>
                </table>
              </div> {/* circuit_history */}
              </div> {/* circuit_latest_results */}

            </div>










        </div>

    )
 }
export default Circuits;