import { Component, createSignal, createEffect } from "solid-js";
import { Circuit } from '../models/models' 
import { fetchCircuitsByYear } from "../services/api";
import countryCode from './countryCodes';
import "../styles/right_sidebar.css";

const Circuits: Component = () => {

    const [circuits, setCircuits] = createSignal([]);

    
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
        <h1>Circuits</h1>
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
            </tr>
          ))}
            </tbody>
        </table>
        </div>

    )
 }
export default Circuits;