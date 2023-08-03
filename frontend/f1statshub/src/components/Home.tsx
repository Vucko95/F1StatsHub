import { Component } from "solid-js";
import "../styles/right_sidebar.css";
import "../styles/countdown.css";
import { createSignal, onCleanup, createEffect } from "solid-js";
import Countdown from "./Countdown";
import { LastRaceDetails, Driver, NextRaceDetails  } from '../models/models' 
import { fetchLastRaceDetailsErgast,fetchTimeBeforeNextRace, fetchLastRaceDetails } from "../services/api";
import { getCountryCode, getNationalityCode } from "../constants/CodeUtils";

const Home: Component = () => {
  const [lastRaceDetails, setLastRaceDetails] = createSignal<LastRaceDetails | null>(null);
  const [nextRace, setNextRace] = createSignal<NextRaceDetails | null>(null);
  const [lastRaceData, setLastRaceData] = createSignal([]);


  



  createEffect(async () => {
    try {
      const lastRaceData = await fetchLastRaceDetailsErgast();
      setLastRaceData(lastRaceData);
      const nextRaceDetailsData = await fetchTimeBeforeNextRace();
      setNextRace(nextRaceDetailsData);
      const lastRaceDetailsData = await fetchLastRaceDetails();
      setLastRaceDetails(lastRaceDetailsData);
    } catch (error) {
      console.error(error);
    }
  });



  const coffeOpen = () => {
    window.open("https://www.buymeacoffee.com/f1StatsHub", "_blank");
  };

  return (
    <div class="mainDashboardBox">


      

        <div class="countDownBox">
        {/* {nextRace() && (<h2>{nextRace()?.raceName}</h2> )} */}
          <Countdown/>
        </div>
      
    <div class="racesInfoBox">
      <div class="past_nextRaceBox" >              
            {lastRaceData().map((last_race_details: any) => (
                      <div class="lastRaceDetailsBox">
                        <h2> Last Race  {last_race_details.position}
                        <img src={`/countries/${getCountryCode(last_race_details.country)}.png`}width="50"height="25"style="border-radius: 10%;"/>
                        </h2>
                        <h3>{last_race_details.circuit_name}</h3>
                        
          <table>
                    <thead>
                      <tr><th colspan="4" >Race Results</th></tr>
                    </thead>
                    <tbody>

                      <tr>
                        <td></td>
                            <td> 1. {last_race_details.first_place} </td>
                        <td><img src={`/countries/${getNationalityCode(last_race_details.first_place_nat)}.png`}width="35"height="25" style="border-radius: 10%;"/></td>
     
                        </tr>
                        <tr>
                        <td></td>
                            <td>2. {last_race_details.second_place}</td>
                        <td><img src={`/countries/${getNationalityCode(last_race_details.second_place_nat)}.png`}width="35"height="25" style="border-radius: 10%;"/></td>
                        </tr>
                        <tr>
                        <td></td>
                            <td>3. {last_race_details.third_place} </td>
                        <td><img src={`/countries/${getNationalityCode(last_race_details.third_place_nat)}.png`}width="35"height="25" style="border-radius: 10%;"/></td>

                        </tr>
                    </tbody>
            </table>
                    </div>
                    ))}
                    </div>
          {/* {lastRaceDetails() && (
              <div>
                    <h2>Previous Event  <img src={`/countries/${getCountryCode(lastRaceDetails()?.country)}.png`} width="50" height="25" style="border-radius: 10%;" />
          </h2>
              <h3>{lastRaceDetails()?.raceName}  {lastRaceDetails()?.date}</h3>
              <h3>Last Race Results</h3>

              </div>
          )}

          <div class="lastRace_top3_box">
              <table>
                <thead>
                </thead>
                <tbody>
              {lastRaceDetails()?.topDrivers?.map((driver: any) => (
            <tr>
                  <td>{driver.position}</td>
                  <td>
              <img src={`/countries/${getNationalityCode(driver.nationality)}.png`}width="30"height="25" style="border-radius: 40%;"/>
                  </td>
              <td>{driver.driverName}</td>
              <td>
              <img src={`/teamlogos/${driver.constructorRef}.webp`}width="50"height="25" style="border-radius: 20%;"/>
              </td>
                  </tr>
              ))}
                </tbody>
              </table>
        </div> */}
        
      {/*  close left box */}

      <div class="past_nextRaceBox">
  {nextRace() && (
    <div>
      <h2>Next Race      
      <img src={`/countries/${getCountryCode(nextRace()?.country)}.png`}width="50"height="25"style="border-radius: 10%;"/>

      </h2>
      <h3>{nextRace()?.raceName}</h3>
      <h3>
        {nextRace()?.first_practice_date} - {nextRace()?.race_date}
      </h3>
      <h3>Qualifying SAT {nextRace()?.startQualy}</h3>
      <h3>Race Time {nextRace()?.startRace}</h3>
    </div>
      )}
    </div>

      </div>
            <div class="donationBox">
              
              <button onClick={coffeOpen} class="button-85"> SMALL COFFE <img src={`coffe.gif`}  height="80"  /></button>
            </div>
    </div>
  );
};

export default Home;
