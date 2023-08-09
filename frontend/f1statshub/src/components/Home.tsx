import { Component } from "solid-js";
import "../styles/right_sidebar.css";
import "../styles/countdown.css";
import { createSignal, onCleanup, createEffect } from "solid-js";
import Countdown from "./Countdown";
import {  LastRaceDetails, Driver, NextRaceDetails  } from '../models/models' 
import { fetchTimezone, fetchLastRaceDetailsErgast,fetchTimeBeforeNextRace, fetchLastRaceDetails } from "../services/api";
import { getCountryCode, getNationalityCode } from "../constants/CodeUtils";

const Home: Component = () => {
  const [lastRaceDetails, setLastRaceDetails] = createSignal<LastRaceDetails | null>(null);
  const [nextRace, setNextRace] = createSignal<NextRaceDetails | null>(null);
  const [lastRaceData, setLastRaceData] = createSignal([]);
  const [selectedTimezone, setSelectedTimezone] = createSignal<string>('GMT'); // default value
  const [nextRaceTz, setNextRaceTz] = createSignal([]); 
  const [originalNextRace, setOriginalNextRace] = createSignal<NextRaceDetails | null>(null);

  const timezones: Timezone[] = [
    // { display: "GMT -12:00 IDLW (Baker Island)", value: "IDLW" },
    // { display: "GMT -11:00 NT (Pago Pago)", value: "NT" },
    // { display: "GMT -10:00 AHST (Honolulu)", value: "AHST" },
    // { display: "GMT -09:00 YST (Anchorage)", value: "YST" },
    { display: "GMT -08:00 PST (Los Angeles)", value: "PST" },
    { display: "GMT -07:00 MST (Phoenix)", value: "MST" },
    { display: "GMT -06:00 CST (Chicago)", value: "CST" },
    { display: "GMT -05:00 EST (New York)", value: "EST" },
    // { display: "GMT -04:00 AST (Halifax)", value: "AST" },
    // { display: "GMT -03:30 NST (St. John's)", value: "NST" },
    { display: "GMT -03:00 BRT (São Paulo)", value: "BRT" },
    // { display: "GMT -02:00 AT (South Georgia)", value: "AT" },
    // { display: "GMT -01:00 WAT (Azores)", value: "WAT" },
    { display: "GMT +00:00 GMT (London)", value: "GMT" },
    { display: "GMT +01:00 CET (Paris)", value: "CET" },
    { display: "GMT +02:00 EET (Athens)", value: "EET" },
    { display: "GMT +03:00 BT (Moscow)", value: "BT" },
    { display: "GMT +03:30 IT (Tehran)", value: "IT" },
    { display: "GMT +04:00 ZP4 (Dubai)", value: "ZP4" },
    { display: "GMT +05:00 ZP5 (Tashkent)", value: "ZP5" },
    { display: "GMT +05:30 IST (Mumbai)", value: "IST" },
    { display: "GMT +06:00 ZP6 (Almaty)", value: "ZP6" },
    { display: "GMT +07:00 WAST (Bangkok)", value: "WAST" },
    { display: "GMT +08:00 CHST (Beijing)", value: "CHST" },
    { display: "GMT +09:00 JST (Tokyo)", value: "JST" },
    { display: "GMT +10:00 EAST (Sydney)", value: "EAST" },
    // { display: "GMT +11:00 MET (Solomon Islands)", value: "MET" },
    // { display: "GMT +12:00 NZST (Wellington)", value: "NZST" }
];
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


type Timezone = {
  display: string;
  value: string;
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
      
    <div class="racesInfoBox">
      <div class="past_nextRaceBox" >              
            {lastRaceData().map((last_race_details: any) => (
                      <div class="lastRaceDetailsBox">
                        <h2> Previous Race Stats  {last_race_details.position}
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

      {/*  close left box */}

      <div class="past_nextRaceBox">
  {nextRace() && (
    <div>
      <h2>{nextRace()?.raceName}     
      <img src={`/countries/${getCountryCode(nextRace()?.country)}.png`}width="50"height="25"style="border-radius: 10%;"/>

      </h2>
      {/* <h3>{nextRace()?.raceName}</h3> */}
      <h3>
        {nextRace()?.first_practice_date} - {nextRace()?.race_date}
      </h3>
      <div class="dropdown">
  <select id="style-1"
    value={selectedTimezone()}
    onInput={handleTimezoneChange}
  >
    {timezones.map(tz => (
      <option value={tz.value}>{tz.display}</option>
    ))}
  </select>
</div>

<h3>Qualy time {nextRace()?.startQualy}</h3>
<h3>Race time {nextRace()?.startQualy}</h3>


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
