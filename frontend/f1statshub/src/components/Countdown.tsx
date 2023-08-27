import { Component } from "solid-js";
import "../styles/home.css";
import "../styles/countdown.css";
import { createSignal, onCleanup, createEffect } from "solid-js";

const racesLeft = [
  1693087200000,
  1693692000000,
  1694901600000,
  1695506400000,
  1696716000000,
  1697925600000,
  1698530400000,
  1699138800000,
  1700348400000,
  1700953200000
]

const Countdown: Component = () => { 

      const [days, setDays] = createSignal("000");
      const [hours, setHours] = createSignal("00");
      const [minutes, setMinutes] = createSignal("00");
      const [seconds, setSeconds] = createSignal("00");

      const calculateTimeLeft = () => {
        const currentDate = new Date().getTime();
    
        const nextRaceDate = racesLeft.find(date => date > currentDate);
        if (nextRaceDate) {
          const timeDifference = nextRaceDate - currentDate;
          const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const hoursLeft = Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutesLeft = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const secondsLeft = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
          setDays(daysLeft.toString().padStart(1, "0"));
          setHours(hoursLeft.toString().padStart(2, "0"));
          setMinutes(minutesLeft.toString().padStart(2, "0"));
          setSeconds(secondsLeft.toString().padStart(2, "0"));
    
          const progressContainer = document.getElementById(
            "defaultCountdown"
          ) as HTMLElement;
          const dd = progressContainer.querySelector(".days-progress") as HTMLElement;
          const hh = progressContainer.querySelector(".hours-progress") as HTMLElement;
          const mm = progressContainer.querySelector(".minutes-progress") as HTMLElement;
          const ss = progressContainer.querySelector(".seconds-progress") as HTMLElement;
    
          dd.style.strokeDashoffset = `${440 - (440 * daysLeft) / 365}`;
          hh.style.strokeDashoffset = `${440 - (440 * hoursLeft) / 24}`;
          mm.style.strokeDashoffset = `${440 - (440 * minutesLeft) / 60}`;
          ss.style.strokeDashoffset = `${440 - (440 * secondsLeft) / 60}`;
        }
      };


      createEffect(() => {
        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);
        onCleanup(() => clearInterval(interval));
      });
    return  (
    <div id="countdown">
        <div id="defaultCountdown" class="countdown">
            <ul>
            <li>
{/* <div class="progress-wrapper"> */}

  <div class="days-progress">

{/* </div> */}
  </div>
  <div class="days"> {days()}<span>Days</span></div>
</li>






            <li>
                <div class="hours-progress"><svg viewBox="0 0 100 100" style="display: block; width: 100%;"><path d="M 50,50 m 0,-47.5 a 47.5,47.5 0 1 1 0,95 a 47.5,47.5 0 1 1 0,-95" stroke="#ffff00" stroke-width="5" fill-opacity="0" style="stroke-dasharray: 298.493, 298.493; stroke-dashoffset: 298.493;"></path></svg></div>
                <div class="hours">{hours()}<span>Hours</span></div>
            </li>
            <li>
                <div class="minutes-progress"><svg viewBox="0 0 100 100" style="display: block; width: 100%;"><path d="M 50,50 m 0,-47.5 a 47.5,47.5 0 1 1 0,95 a 47.5,47.5 0 1 1 0,-95" stroke="#ff0000" stroke-width="5" fill-opacity="0" style="stroke-dasharray: 298.493, 298.493; stroke-dashoffset: 298.493;"></path></svg></div>
                <div class="minutes">{minutes()}<span>Minutes</span></div>
            </li>
            <li>
                <div class="seconds-progress"><svg viewBox="0 0 100 100" style="display: block; width: 100%;"><path d="M 50,50 m 0,-47.5 a 47.5,47.5 0 1 1 0,95 a 47.5,47.5 0 1 1 0,-95" stroke="#0070c8" stroke-width="5" fill-opacity="0" style="stroke-dasharray: 298.493, 298.493; stroke-dashoffset: 298.493;"></path></svg></div>
                <div class="seconds">{seconds()}<span>Seconds</span></div>
            </li>
            </ul>
        </div>
    </div>
    )
}

export default Countdown;