import { Component } from "solid-js";
import "../styles/right_sidebar.css";
import "../styles/countdown.css";
import { createSignal, onCleanup, createEffect } from "solid-js";


const Countdown: Component = () => { 

      const [days, setDays] = createSignal("000");
      const [hours, setHours] = createSignal("00");
      const [minutes, setMinutes] = createSignal("00");
      const [seconds, setSeconds] = createSignal("00");
      const calculateTimeLeft = () => {
        const currentDate = new Date().getTime();
        const nextRaceDate = 1688860800000
      
        const timeDifference = nextRaceDate - currentDate;
        const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((timeDifference % (1000 * 60)) / 1000);
      
        setDays(daysLeft.toString().padStart(1, "0"));
        setHours(hoursLeft.toString().padStart(2, "0"));
        setMinutes(minutesLeft.toString().padStart(2, "0"));
        setSeconds(secondsLeft.toString().padStart(2, "0"));
    
        let dd = document.getElementById('dd') as HTMLElement;
        let hh = document.getElementById('hh') as HTMLElement;
        let mm = document.getElementById('mm') as HTMLElement;
        let ss = document.getElementById('ss') as HTMLElement;
      
        dd.style.strokeDashoffset = `${440 - (440 * daysLeft) / 365}`;
        hh.style.strokeDashoffset = `${440 - (440 * hoursLeft) / 24}`;
        mm.style.strokeDashoffset = `${440 - (440 * minutesLeft) / 60}`;
        ss.style.strokeDashoffset = `${440 - (440 * secondsLeft) / 60}`;
      };



      createEffect(() => {
        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);
        onCleanup(() => clearInterval(interval));
      });
    return  (
        <div id="countdown">
        <div class="circle" style="--clr: #ffffff;">
          <svg>
            <circle cx="70" cy="70" r="70"></circle>
            <circle cx="70" cy="70" r="70" id="dd"></circle>
          </svg>
          <div >{days()}<br /><span>Days</span></div>
        </div>
        <div class="circle" style="--clr: #60ff21;">
          <svg>
            <circle cx="70" cy="70" r="70"></circle>
            <circle cx="70" cy="70" r="70" id="hh"></circle>
          </svg>
          <div >{hours()}<br /><span>Hours</span></div>
        </div>
        <div class="circle" style="--clr: #f8ed22;">
          <svg>
            <circle cx="70" cy="70" r="70"></circle>
            <circle cx="70" cy="70" r="70" id="mm"></circle>
          </svg>
          <div >{minutes()}<br /><span>Minutes</span></div>
        </div>
        <div class="circle" style="--clr: #e71c1c;">
          <svg>
            <circle cx="70" cy="70" r="70"></circle>
            <circle cx="70" cy="70" r="70" id="ss"></circle>
          </svg>
          <div >{seconds()}<br /><span>Seconds</span></div>
        </div>
      </div>
    )
}

export default Countdown;