import { Component, createSignal, createEffect } from "solid-js";
import { Circuit } from '../models/models' 
import { fetchCircuitsByYear, fetchCircuitWinners } from "../services/api";
import countryCode from './countryCodes';
import "../styles/right_sidebar.css";

const Circuits: Component = () => {

    const [circuits, setCircuits] = createSignal([]);
    const [circuitWinners, setCircuitWinners] = createSignal([]);

    const handleShowMoreInfo = async (circuitId: number) => {
      try {
        const winners = await fetchCircuitWinners(circuitId);
        setCircuitWinners(winners);
      } catch (error) {
        console.error(error);
      }
    };


    createEffect(async () => {
        try {
          const circuitData = await fetchCircuitsByYear();
          setCircuits(circuitData);
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
                  <img src={`https://flagsapi.com/${countryCode[circuit.country]}/flat/48.png`} alt={circuit.country} />
                </td>
                <td>
                  <button onClick={() => handleShowMoreInfo(circuit.circuitId)} >SHOW MORE INFO</button>
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
                </tr>
              ))}
            </tbody>
          </table>

        </div>

    )
 }
export default Circuits;