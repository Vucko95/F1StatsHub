import { Component, createSignal, createEffect } from "solid-js";
import { Circuit } from '../models/models' 
import { fetchCircuitsByYear, fetchCircuitWinners } from "../services/api";
import countryCodeData from './countryCodes';
import "../styles/right_sidebar.css";
// import bahrain from "../public/tracks/bahrain.svg";

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
                <td>{circuit.country}</td>
                <td>
                  <img src={`/countries/${getCountryCode(circuit.country)}.png`}   width="50" height="25" />

                </td>
                <td>
                  <button class="baseBtn" onClick={() => showCircuitDetails(circuit.circuitId)} >SHOW MORE INFO</button>
                </td>
              </tr>
            ))}
              </tbody>
          </table>

          <table class="winners_table">
            <tbody>
              {circuitWinners().map((winner: any) => (
                <tr>
                  <td>{winner.year}</td>
                  <td>{winner.winner}</td>
                  <td>{winner.nationality}</td>
                  <td>{winner.circuit_country}</td>

                  <td>
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