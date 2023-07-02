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
const Home: Component = () => {
  const [show, setShow] = createSignal(false);
  const [timeLeft, setTimeLeft] = createSignal("");

  const [nextRace, setNextRace] = createSignal({
    season: "",
    round: "",
    country: "",
    url: "",
    raceName: "",
    circuitId: "",
    first_practice_date: "",
    race_date: "",
    date: "",
    time: "",
    countryCode: "",
    startFP1: "",
    startFP2: "",
    startQualy: "",
    startSprint: "",
    startRace: "",
  });
  const [pastRace, setPastRace] = createSignal({
    season: "",
    round: "",
    country: "",
    url: "",
    raceName: "",
    circuitId: "",
    first_practice_date: "",
    race_date: "",
    date: "",
    time: "",
    countryCode: "",
    startFP1: "",
    startFP2: "",
    startQualy: "",
    startSprint: "",
    startRace: "",
  });

 




  const fetchTimeBeforeNextRace = () => {
    fetch("http://localhost:8888/race/next")
      .then((response) => response.json())
      .then((data) => {
        setNextRace({
          ...data,
          countryCode: countryCodes[data.country] || "XX",
        });
        console.log(data);
      })
      .catch((error) => console.error(error));
  };



  const fetchPastRace = () => {
    fetch("http://localhost:8888/race/last")
      .then((response) => response.json())
      .then((data) => {
        setPastRace ({
          ...data,
          countryCode: countryCodes[data.country] || "XX",
        });
        console.log(data)

      })
    .catch((error) => console.error(error));
  }

  const getCountryCode = (country: string) => {
    const countryCode = countryCodeData[country] || '';
    return countryCode.toLowerCase();
  };

  createEffect(() => {
    fetchTimeBeforeNextRace();
    fetchPastRace();
  });



  return (
    <div class="mainDashboardBox">


      

        <div class="countDownBox">
          <h1>Next Race</h1>
          {/* <img src={`/tires/softs.svg`}   width="255" height="255" /> */}
          <Countdown/>

          {/* <h2 class="countdown-timer">{timeLeft()}</h2> */}

          {/* <h2>{timeLeft()}</h2> */}
          {/* <button  onClick={fetchTimeBeforeNextRace}>Click</button> */}
        </div>
      
{/* NAME  */}
{/* country */}
      <div class="racesInfoBox">
      <div class="singleBox" >
              {/* <!-- <h1>Until Next Race</h1> --> */}
              
              <h2>Previous Event </h2>
          <img src={`/countries/${getCountryCode(pastRace().country)}.png`}   width="50" height="25"style="border-radius: 10%;" />
              {/* <!-- <h2>{{ timeLeft }}</h2> --> */}
              {/* <img :src="'https://flagsapi.com/' + pastRace.countryCode + '/flat/48.png'"> */}
            {/* <h3>{ pastRace().country }</h3> */}
          <h3> { pastRace().raceName }</h3>

          <h3>Round { pastRace().round } / 23 </h3>
          <h3> { pastRace().race_date } </h3>
        </div>

        <div class="singleBox">
              <h2>Next Race  </h2>
              <img src={`/countries/${getCountryCode(nextRace().country)}.png`}   width="50" height="25" style="border-radius: 10%;" />
              <h3>{nextRace().raceName}</h3>
              <h3>Round {nextRace().round} / 23</h3>
              {/* <h3>{{ nextRace.first_practice_date }}  - {{ nextRace.race_date }} </h3> */}
              <h3>
                {nextRace().first_practice_date} - {nextRace().race_date}
              </h3>
              {/* <button>Pick Timezone</button>
              <p>Practice 1 FRI {nextRace().startFP1}</p>
              <p>Practice 2 FRI {nextRace().startFP2}</p>
              <p>Qualifying SAT {nextRace().startQualy}</p>
              <p>Sprint SAT {nextRace().startSprint}</p> */}
              <h3>Race Time {nextRace().startRace}</h3>
        </div>


      </div>
              <div class="donationBox">
                {/* <button class="coffe-btn">Support - Buy me a Coffe</button> */}
                <button class="button-85"> SMALL COFFE <img src={`coffe.gif`}  height="80"  /></button>
              

              </div>
 


    </div>
  );
};

export default Home;
