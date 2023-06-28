import { Component, createSignal, createEffect } from "solid-js";
import "../styles/left_sidebar.css"

interface LeftSidebarProps {
    activeComponent: () => string,
    switchComponent: (componentName: string) => () => void
  }
  
  const LeftSidebar: Component<LeftSidebarProps> = ({activeComponent, switchComponent}) => {
    return (
      <div class="navbar">
        <ul class="navbar-menu">
        <li class={activeComponent() === "Home" ? "active" : ""}>
          <button onClick={switchComponent("Home")}>
            {activeComponent() === "Home" ? "Hide Home" : "Show Home"}
          </button>
        </li>
        <li class={activeComponent() === "Standings" ? "active" : ""}>
          <button onClick={switchComponent("Standings")}>
            {activeComponent() === "Standings" ? "Hide Standings" : "Show Standings"}
          </button>
        </li>
        <li class={activeComponent() === "DriverInfo" ? "active" : ""}>
          <button onClick={switchComponent("DriverInfo")}>
            {activeComponent() === "DriverInfo" ? "Hide DriverInfo" : "Show DriverInfo"}
          </button>
        </li>
        <li class={activeComponent() === "Circuits" ? "active" : ""}>
          <button onClick={switchComponent("Circuits")}>
            {activeComponent() === "Circuits" ? "Hide Circuits" : "Show Circuits"}
          </button>
        </li>
        </ul>
      </div>
    );
  };
  
  export default LeftSidebar;