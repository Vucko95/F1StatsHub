import { Component } from "solid-js";
import "../styles/right_sidebar.css";
import { createSignal, onCleanup, createEffect } from "solid-js";
import countryCodes from "./countryCodes";
import { createEventBus } from "@solid-primitives/event-bus";
// import dash_logo from "../public/f1MovingLogo.gif";
import logo from "../../public/logo.svg";
const Home: Component = () => {
  const [show, setShow] = createSignal(false);
  const [timeLeft, setTimeLeft] = createSignal("");
  const EventBus = createEventBus();

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

  const btn_test = () => {
    fetchTimeBeforeNextRace();
  };




  const fetchTimeBeforeNextRace = () => {
    fetch("http://localhost:8888/race/next")
      .then((response) => response.json())
      .then((data) => {
        setNextRace({
          ...data,
          countryCode: countryCodes[data.country] || "XX",
        });
        console.log(data);
        calculateTimeLeft();
      })
      .catch((error) => console.error(error));
  };

  const calculateTimeLeft = () => {
    // const currentDate = new Date();
    // const nextRaceDate = new Date(nextRace().date);
    const currentDate = new Date().getTime();
    const nextRaceDate = new Date(nextRace().date).getTime();
    const timeDifference = nextRaceDate - currentDate;
    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutesLeft = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const secondsLeft = Math.floor((timeDifference % (1000 * 60)) / 1000);

    setTimeLeft(
      `${daysLeft} days ${hoursLeft} hours ${minutesLeft} minutes ${secondsLeft} seconds`
    );
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


  createEffect(() => {
    fetchTimeBeforeNextRace();
    fetchPastRace();
  });


  return (
    <div class="mainDashboardBox">
      {/* Your left sidebar content */}
      {/* <div class="homeBox">
        <h1></h1>
        <img src={logo} alt="logo" />
        <h1>Dashboard</h1>
      </div> */}

      <div class="three-dashboard-boxes">
        <div class="singleBox">
          <h2>Next Race</h2>
          {/* <h3>{{ timeLeft }}</h3> */}
          <h2>{timeLeft()}</h2>
          <button  onClick={fetchTimeBeforeNextRace}>Click</button>
        </div>
      

      <div class="singleBox">
            <h1>Until Next Race</h1>
            <h2>Next Race at </h2>

            {/* <img :src="'https://flagsapi.com/' + nextRace.countryCode + '/flat/48.png'"> */}
            {/* {{ nextRace.country }} {{ nextRace.raceName }}</h3>     */}
            <h3>
              {nextRace().country} {nextRace().raceName}
            </h3>

            <h3>Round {nextRace().round} / 23</h3>

            {/* <h3>{{ nextRace.first_practice_date }}  - {{ nextRace.race_date }} </h3> */}
            <h3>
              {nextRace().first_practice_date} - {nextRace().race_date}
            </h3>
            <button>Pick Timezone</button>
            <p>Practice 2 FRI {nextRace().startFP1}</p>
            <p>Practice 2 FRI {nextRace().startFP2}</p>
            <p>Qualifying SAT {nextRace().startQualy}</p>
            <p>Sprint SAT {nextRace().startSprint}</p>
            <p>Race SUN {nextRace().startRace}</p>
      </div>


      <div class="singleBox" >
            {/* <!-- <h1>Until Next Race</h1> --> */}
            
            <h2>Previous Event </h2>
            {/* <!-- <h2>{{ timeLeft }}</h2> --> */}
            {/* <img :src="'https://flagsapi.com/' + pastRace.countryCode + '/flat/48.png'"> */}
        <h3> 
          { pastRace().country } { pastRace().raceName }</h3>
        <h3>Round { pastRace().round } / 23 </h3>
        <h3> { pastRace().race_date } </h3>
      </div>
    </div>


    </div>
  );
};

export default Home;
