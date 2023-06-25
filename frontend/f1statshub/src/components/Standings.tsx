import { Component, createSignal, createEffect } from "solid-js";
import { fetchDriverStandings, fetchConstructorStandings } from "../services/api";
import "../styles/right_sidebar.css";

const Standings: Component = () => {
    const [driverStandings, setDriverStandings] = createSignal([]);
    const [constructorStandings, setConstructorStandings] = createSignal([]);


    createEffect(async () => {
        try {
          const driverStandingsData = await fetchDriverStandings();
          const constructorStandingsData = await fetchConstructorStandings();
          setDriverStandings(driverStandingsData);
          setConstructorStandings(constructorStandingsData);
        } catch (error) {
          console.error(error);
        }
      });
      

      return (
        <div class="driversStandingsMainBox">
          <div class="driver_standings_box">
            <h1>Driver Standings</h1>
            <table>
              <tbody>
                {driverStandings().map((driver: any) => (
                  <tr>
                    <td>{driver.driver_name}</td>
                    <td>{driver.total_points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div class="constructors_standings_box">
            <h1>Constructors Standings</h1> 
            <table>
              <tbody>
                {constructorStandings().map((constructor: any) => (
                  <tr>
                    <td>{constructor.constructor_name}</td>
                    <td>{constructor.total_points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
 }
export default Standings;