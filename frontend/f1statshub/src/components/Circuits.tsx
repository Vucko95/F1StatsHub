import { Component, createSignal, createEffect } from "solid-js";
import { Circuit } from '../models/models' 
import { fetchCircuitsByYear, fetchCircuitWinners } from "../services/api";
import countryCodeData from './countryCodes';
import nationalityCodeData from './nationalityCodes';

import "../styles/circuits.css";

const Circuits: Component = () => {

    const [circuits, setCircuits] = createSignal([]);
    const [circuitWinners, setCircuitWinners] = createSignal([]);
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

    const getCountryCode = (country: string) => {
      const countryCode = countryCodeData[country] || '';
      return countryCode.toLowerCase();

    };
    const getNationalityCode = (nationality: string) => {
      const nationalityCode = nationalityCodeData[nationality] || '';
      return nationalityCode.toLowerCase();
    };



      
    
    return (
        <div class="circuit_info_box">
        
          <div class="circuit_list">
              <table>
                  <thead>
                  </thead>
                  <tbody>
                  {circuits().map((circuitInfo: Circuit) => (
                    <tr>
                    <td><img src={`/countries/${getCountryCode(circuitInfo.country)}.png`}   width="50" height="25" /></td>
                    <td>{circuitInfo.name}</td>
                    <td>
                      <button class="baseBtn" onClick={() => showCircuitDetails(circuitInfo.circuitId)} >Details</button>
                    </td>
                  </tr>
                  ))} 
                  </tbody>
              </table>
          </div>

          <div class="circuit_latest_results">

              <div class="circuit_info">
              <h3>{selectedCircuitName()}</h3>
              <h3>{selectedCircuitCountry()}</h3>
            {circuitLayout() && <img src={`/tracks/${circuitLayout()}.svg`}  width="100" height="200" />}
              </div>

              <div class="circuit_history">
                <table class="winners_table">
                  <thead>
                    <tr>
                    <th>Year</th>
                    <th>Team</th>
                    <th>Winner</th>
                    {/* <th>Nationality</th> */}
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

            <div class="circuit_results">
              <table>
                <thead></thead>
                <tbody></tbody>
                <tr>
                  <td></td>
                </tr>

              </table>
            </div>
        </div>

    )
 }
export default Circuits;