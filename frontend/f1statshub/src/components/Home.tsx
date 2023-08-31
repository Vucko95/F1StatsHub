import { Component } from "solid-js";
import "../styles/home.css";
import "../styles/countdown.css";
import { createSignal, onCleanup, createEffect } from "solid-js";
import Countdown from "./Countdown";

import {  LastRaceDetails, Driver, NextRaceDetails, Timezone  } from '../models/models' 
import { fetchTimezone, fetchLastRaceDetailsErgast,fetchTimeBeforeNextRace, fetchLastRaceDetails } from "../services/api";
import { getCountryCode, getNationalityCode } from "../constants/CodeUtils";
import { timezones } from "../constants/timezones";
const Home: Component = () => {
  const [lastRaceDetails, setLastRaceDetails] = createSignal<LastRaceDetails | null>(null);
  const [nextRace, setNextRace] = createSignal<NextRaceDetails | null>(null);
  const [lastRaceData, setLastRaceData] = createSignal([]);
  const [selectedTimezone, setSelectedTimezone] = createSignal<string>('GMT'); // default value
  const [originalNextRace, setOriginalNextRace] = createSignal<NextRaceDetails | null>(null);


function adjustTimeForTimezone(time: string, hourOffset: number, minuteOffset: number = 0): { hours: string, minutes: string } {
  const [hours, minutes] = time.split(":").map(Number);
  let adjustedHours = hours + hourOffset;
  let adjustedMinutes = minutes + minuteOffset;

  if (adjustedMinutes >= 60) {
    adjustedMinutes -= 60;
    adjustedHours += 1;
  } else if (adjustedMinutes < 0) {
    adjustedMinutes += 60;
    adjustedHours -= 1;
  }

  if (adjustedHours >= 24) adjustedHours -= 24;
  if (adjustedHours < 0) adjustedHours += 24;

  const adjustedHoursStr = adjustedHours.toString().padStart(2, '0');
  const adjustedMinutesStr = adjustedMinutes.toString().padStart(2, '0');

  return { hours: adjustedHoursStr, minutes: adjustedMinutesStr };
}
const handleTimezoneChange = (event: Event) => {
  const selected = (event.target as HTMLSelectElement).value;
  setSelectedTimezone(selected);

  const timezoneOffsetString = timezones.find(tz => tz.value === selected)?.display;
  const offsetMatch = timezoneOffsetString?.match(/[+-]\d+/);
  const offsetHours = offsetMatch ? parseInt(offsetMatch[0], 10) : 0;
  const offsetMinutes = (timezoneOffsetString?.includes("30") ? 30 : 0) * (offsetHours >= 0 ? 1 : -1);  // adjust for :30 offset, keeping the sign

  const currentOriginalNextRace = originalNextRace();

  if (currentOriginalNextRace) {
    const adjustedQualyTime = adjustTimeForTimezone(currentOriginalNextRace.startQualy, offsetHours, offsetMinutes);
    const adjustedRaceTime = adjustTimeForTimezone(currentOriginalNextRace.startRace, offsetHours, offsetMinutes);

    setNextRace({
      ...currentOriginalNextRace,
      startQualy: `${adjustedQualyTime.hours}:${adjustedQualyTime.minutes}`,
      startRace: `${adjustedRaceTime.hours}:${adjustedRaceTime.minutes}`
    });
  }
};



  createEffect(async () => {
    try {
      const lastRaceData = await fetchLastRaceDetailsErgast();
      setLastRaceData(lastRaceData);
      const nextRaceDetailsData = await fetchTimeBeforeNextRace();
      setNextRace(nextRaceDetailsData);
      const lastRaceDetailsData = await fetchLastRaceDetails();
      setOriginalNextRace(nextRaceDetailsData);
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
      
    <div class="RaceBoxesParent">
      <div class="PrevAndNextRaceBox" >              
            {lastRaceData().map((last_race_details: any) => (
        <div class="lastRaceInsideBox">
            <h2> Previous Race Stats{last_race_details.position}<img src={`/countries/${getCountryCode(last_race_details.country)}.png`} class="country-flag-img"  /></h2>
            <h3>{last_race_details.circuit_name}</h3>  
          <table>
            <thead>
              <tr><th colspan="4" >Race Results</th></tr>
            </thead>
                    <tbody>
                        <tr>
                          <td></td>
                              <td class="poduimDrivers"> 1. {last_race_details.first_place} </td>
                          <td><img src={`/countries/${getNationalityCode(last_race_details.first_place_nat)}.png`}class="country-flag-img"/></td>
                          </tr>
                          <tr>
                          <td></td>
                              <td class="poduimDrivers">2. {last_race_details.second_place}</td>
                          <td><img src={`/countries/${getNationalityCode(last_race_details.second_place_nat)}.png`}class="country-flag-img"/></td>
                          </tr>
                          <tr>
                          <td></td>
                              <td class="poduimDrivers">3. {last_race_details.third_place} </td>
                          <td><img src={`/countries/${getNationalityCode(last_race_details.third_place_nat)}.png`}class="country-flag-img"/></td>
                          </tr>
                    </tbody>
            </table>
        </div> // LAST RACES DETAILS 
                    ))}
    </div> {/*  close left box */}

      <div class="PrevAndNextRaceBox">
        {nextRace() && (
        <div class="nextRaceBoxInside">
          <h2>{nextRace()?.raceName}     
          <img  src={`/countries/${getCountryCode(nextRace()?.country)}.png`}class="country-flag-img"/>
          </h2>
          {/* <h3>{nextRace()?.raceName}</h3> */}
          <h3 class="racedate">
            {nextRace()?.first_practice_date} - {nextRace()?.race_date}
          </h3>
          <div class="dropdown">
            <select id="style-1" value={selectedTimezone()} onInput={handleTimezoneChange}>
              {timezones.map(tz => ( <option value={tz.value}>{tz.display}</option> ))}
            </select>
          </div>

          <h3 class="racetime">Qualy time {nextRace()?.startQualy}</h3>
          <h3 class="racetime">Race time {nextRace()?.startQualy}</h3>
      </div>)}  {/*  close right box */}

    </div> {/*  close RaceBoxesParent box */}

      </div>
            <div class="donationBox">
              
              <button onClick={coffeOpen} class="button-85"> Buy me a Coffe
               <img src={`coffe.gif`}  height="60"  />
               </button>
            </div> 
    </div>
  );
};

export default Home;
