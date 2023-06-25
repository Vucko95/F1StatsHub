import { Component, createSignal, createEffect } from "solid-js";
import { Circuit } from '../models/models' 
import { fetchCircuitsByYear, fetchCircuitWinners } from "../services/api";
import countryCode from './countryCodes';
import "../styles/right_sidebar.css";
// import bahrain from "../public/tracks/bahrain.svg";

const Circuits: Component = () => {

    const [circuits, setCircuits] = createSignal([]);
    const [circuitWinners, setCircuitWinners] = createSignal([]);
    const [circuitCountry, setsetCircuitCountry] = createSignal<Array<{ circuit_country: string }>>([]);

    const handleShowMoreInfo = async (circuitId: number) => {
      try {
        const winners = await fetchCircuitWinners(circuitId);
        setCircuitWinners(winners);
        setsetCircuitCountry(winners);

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

                  {/* <img src="/tracks/bahrain.svg" alt="BHs"  width="100" /> */}
                  {/* <img src={`/tracks/${circuit.country}.svg`} alt="BHs"  width="100" /> */}


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
                  <td>{winner.circuit_country}</td>
                  <td>
                  </td>
                  {/* <img src={`/tracks/${winner.circuit_country}.svg`} alt="BHs"  width="100" /> */}
                </tr>
              ))}
            </tbody>
          </table>
          {circuitCountry().length > 0 && (
            <img src={`/tracks/${circuitCountry()[0]?.circuit_country}.svg`} alt="BHs" width="100" />
          )}


        </div>

    )
 }
export default Circuits;