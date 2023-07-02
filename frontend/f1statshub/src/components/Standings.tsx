import { Component, createSignal, createEffect } from "solid-js";
import { fetchDriverStandings, fetchConstructorStandings } from "../services/api";
import "../styles/right_sidebar.css";
import "../styles/standings.css";
import countryCodeData from './countryCodes';
import nationalityCodeData from './nationalityCodes';
const Standings: Component = () => {
    const [driverStandings, setDriverStandings] = createSignal([]);
    const [constructorStandings, setConstructorStandings] = createSignal([]);


    createEffect(async () => {
        try {
          const driverStandingsData = await fetchDriverStandings();
          const constructorStandingsData = await fetchConstructorStandings();
          setDriverStandings(driverStandingsData);
          console.log(driverStandingsData)
          setConstructorStandings(constructorStandingsData);
        } catch (error) {
          console.error(error);
        }
      });
      const getCountryCode = (country: string) => {
        const countryCode = countryCodeData[country] || '';
        return countryCode.toLowerCase();
  
      };
      const getNationalityCode = (nationality: string) => {
        const nationalityCode = nationalityCodeData[nationality] || '';
        return nationalityCode.toLowerCase();
      };
  

      return (
        <div class="driversStandingsMainBox" >
            <div class="driver_standings_box" id="style-1">
              {/* <h1>Driver Standings</h1> */}
              <table class="driver_standings_table">
                <tbody>
                  {driverStandings().map((driver: any) => (
                    <tr>
                      <td><img src={`/drivers/${driver.driver_ref}.avif`}  width="80" height="80" style="border-radius: 50%;"  /></td>
                      <td>{driver.driver_name}</td>
                      <td>{driver.total_points}</td>
                      <td><img src={`/teamlogos/${driver.constructorRef}.webp`}  width="80" height="30" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div class="constructors_standings_box">
              <table>
                <tbody>
                  {constructorStandings().map((constructor: any) => (
                    <tr>
                      <td><img src={`/teamlogos/${constructor.constructorRef}.webp`}  width="80" height="30" /></td>

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