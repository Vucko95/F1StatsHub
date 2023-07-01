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

    const showCircuitDetails = async (circuitId: number) => {
      try {
        const winners = await fetchCircuitWinners(circuitId);
        setCircuitWinners(winners);
        setCircuitLayout(winners[0]?.circuit_country || '');
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

    createEffect(async () => {
        try {
          const circuitData = await fetchCircuitsByYear();
          setCircuits(circuitData);
          // BY DEFAULT DISPLAYS FIRST RACE OF CALENDAR FOR 2022 FOR NOW 
          // DEFAULT FETCH OF WINNERS AND CIRCUITLAYOUT
          const winners = await fetchCircuitWinners(3);
          setCircuitLayout(winners[0]?.circuit_country || '');
          setCircuitWinners(winners);
        } catch (error) {
          console.error(error);
        }
      });

      
    
    return (
        <div class="circuit_info_box">
        
          <table>
              <thead>
              </thead>
              <tbody>
              {circuits().map((circuit: Circuit) => (
              <tr>
                <td>{circuit.name}</td>
                <td><img src={`/countries/${getCountryCode(circuit.country)}.png`}   width="50" height="25" /></td>
                <td>{circuit.country}</td>
                <td>
                  <button class="baseBtn" onClick={() => showCircuitDetails(circuit.circuitId)} >Details</button>
                </td>
              </tr>
            ))}
              </tbody>
          </table>

          <table class="winners_table">
            <thead>
              <tr>
              <th>Year</th>
              <th>Winner</th>
              <th>Nationality</th>
              <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {circuitWinners().map((winner: any) => (
                <tr>
                  <td>{winner.year}</td>
                  <td>{winner.winner}</td>
                  {/* <td>{winner.nationality}</td> */}
                  <td>
                  <img src={`/countries/${getNationalityCode(winner.nationality)}.png`}width="50"height="20"/>
                  </td>
                  {/* <td>{winner.constructorRef}</td> */}
                  {/* <td>{winner.circuit_country}</td> */}
                <td>
                <img src={`/teamlogos/${winner.constructorRef}.webp`}   width="50" height="20" />
                </td>
           
                </tr>
            ))}
            </tbody>
          </table>
          {circuitLayout() && <img src={`/tracks/${circuitLayout()}.svg`}  width="100" />}

        </div>

    )
 }
export default Circuits;