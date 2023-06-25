import { Component, createSignal, createEffect } from "solid-js";
import { fetchDriversForSpecificYear } from "../services/api";

import "../styles/right_sidebar.css";

const DriverInfo: Component = () => {
    // const [driverStandings, setDriverStandings] = createSignal([]);
    const [drivers, setDrivers] = createSignal([]);

    createEffect(async () => {
        try {
          const driverListForTheYear = await fetchDriversForSpecificYear();
        //   const constructorStandingsData = await fetchConstructorStandings();
        setDrivers(driverListForTheYear);
        //   setConstructorStandings(constructorStandingsData);
        } catch (error) {
          console.error(error);
        }
      });


    return (
        <div class="driver_info_box">
        <h1>DriverInfo</h1>
        <table>
              <tbody>
                {drivers().map((driver: any) => (
                  <tr>
                    <td>{driver.givenName}</td>
                    <td>{driver.familyName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
    )
 }
export default DriverInfo;