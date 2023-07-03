import { Component } from "solid-js";
import "../styles/right_sidebar.css";
import "../styles/countdown.css";
import { createSignal, onCleanup, createEffect } from "solid-js";
import countryCodes from "./countryCodes";
import countryCodeData from './countryCodes';
import Countdown from "./Countdown";
import { createEventBus } from "@solid-primitives/event-bus";
// import dash_logo from "../public/f1MovingLogo.gif";
import logo from "../../public/logo.svg";
import nationalityCodeData from './nationalityCodes';
import { LastRaceDetails, Driver, NextRaceDetails  } from '../models/models' 

const Home: Component = () => {
  const [show, setShow] = createSignal(false);
  const [timeLeft, setTimeLeft] = createSignal("");
  // const [lastRaceDetails, setLastRaceDetails] = createSignal<LastRaceDetails | null>(null);
  const [lastRaceDetails, setLastRaceDetails] = createSignal<LastRaceDetails | null>(null);
  const [nextRace, setNextRace] = createSignal<NextRaceDetails | null>(null);
  // const [nextRace, setNextRace] = createSignal({
  //   season: "",
  //   round: "",
  //   country: "",
  //   url: "",
  //   raceName: "",
  //   circuitId: "",
  //   first_practice_date: "",
  //   race_date: "",
  //   date: "",
  //   time: "",
  //   countryCode: "",
  //   startFP1: "",
  //   startFP2: "",
  //   startQualy: "",
  //   startSprint: "",
  //   startRace: "",
  // });

  
  


  const fetchTimeBeforeNextRace = () => {
    fetch("http://localhost:8888/race/next")
      .then((response) => response.json())
      .then((data) => {
        setNextRace(data);
        // console.log(data);
      })
      .catch((error) => console.error(error));
  };



  const fetchLastRaceDetails = () => {
    fetch("http://localhost:8888/race/last")
      .then((response) => response.json())
      .then((data) => {
        setLastRaceDetails(data);
      })
      .catch((error) => console.error(error));
  };

  const getCountryCode = (country?: string) => {
    const countryCode = countryCodeData[country ?? ''] || '';
    return countryCode.toLowerCase();
  };
  createEffect(() => {
    fetchTimeBeforeNextRace();
    fetchLastRaceDetails();
  });
  const getNationalityCode = (nationality: string) => {
    const nationalityCode = nationalityCodeData[nationality] || '';
    return nationalityCode.toLowerCase();
  };


  return (
    <div class="mainDashboardBox">


      

        <div class="countDownBox">
        {nextRace() && (<h1>{nextRace()?.raceName}</h1> )}
          <Countdown/>
        </div>
      
{/* NAME  */}
{/* country */}
    <div class="racesInfoBox">
      <div class="past_nextRaceBox" >              
           
          {lastRaceDetails() && (
              <div>
                    <h2>Previous Event  <img src={`/countries/${getCountryCode(lastRaceDetails()?.country)}.png`} width="50" height="25" style="border-radius: 10%;" />
          </h2>
              <h3>{lastRaceDetails()?.raceName}  {lastRaceDetails()?.date}</h3>
              <h3>Results</h3>

              </div>
          )}
          <div class="lastRace_top3_box">
              <table>
                <thead>
                </thead>
                <tbody>
              {lastRaceDetails()?.topDrivers?.map((driver: Driver) => (
            <tr>
                  <td>{driver.position}</td>
                  <td>
              <img src={`/countries/${getNationalityCode(driver.nationality)}.png`}width="30"height="25" style="border-radius: 40%;"/>
                  </td>
              <td>{driver.driverName}</td>
              {/* <td>{driver.constructorRef}</td> */}
              <td>
              <img src={`/teamlogos/${driver.constructorRef}.webp`}width="50"height="25" style="border-radius: 20%;"/>
              </td>
                  </tr>
              ))}
                </tbody>
              </table>
        </div>{/*  close top drivers */}
      </div>{/*  close left box */}

      <div class="past_nextRaceBox">
  {nextRace() && (
    <div>
      <h2>Next Race      
      <img src={`/countries/${getCountryCode(nextRace()?.country)}.png`}width="50"height="25"style="border-radius: 10%;"/>

      </h2>
      <h3>{nextRace()?.raceName}</h3>
      {/* <h3>Round {nextRace()?.round} / 23</h3> */}
      {/* <h3>{{ nextRace.first_practice_date }}  - {{ nextRace.race_date }} </h3> */}
      <h3>
        {nextRace()?.first_practice_date} - {nextRace()?.race_date}
      </h3>
      {/* <button>Pick Timezone</button> */}
      {/* <p>Practice 1 FRI {nextRace()?.startFP1}</p> */}
      {/* <p>Practice 2 FRI {nextRace()?.startFP2}</p> */}
      <h3>Qualifying SAT {nextRace()?.startQualy}</h3>
      {/* <p>Sprint SAT {nextRace()?.startSprint}</p> */}
      <h3>Race Time {nextRace()?.startRace}</h3>
    </div>
      )}
    </div>


      </div>
              <div class="donationBox">
                <button class="button-85"> SMALL COFFE <img src={`coffe.gif`}  height="80"  /></button>
              </div>
 
    </div>
  );
};

export default Home;
