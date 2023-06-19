import { Component, createSignal, createEffect } from "solid-js";
import "../styles/left_sidebar.css"

interface LeftSidebarProps {
    activeComponent: () => string,
    switchComponent: (componentName: string) => () => void
  }
  
  const LeftSidebar: Component<LeftSidebarProps> = ({activeComponent, switchComponent}) => {
    return (
      <div class="sidebar">
        <p>This is the left sidebar.</p>
        <button onClick={switchComponent('Home')}>
          {activeComponent() === 'Home' ? "Hide Home" : "Show Home"}
        </button>
        <button onClick={switchComponent('Standings')}>
          {activeComponent() === 'Standings' ? "Hide Standings" : "Show Standings"}
        </button>
        <button onClick={switchComponent('DriverInfo')}>
          {activeComponent() === 'DriverInfo' ? "Hide DriverInfo" : "Show DriverInfo"}
        </button>
        <button onClick={switchComponent('Circuits')}>
          {activeComponent() === 'Circuits' ? "Hide Circuits" : "Show Circuits"}
        </button>
      </div>
    );
  };
  
  export default LeftSidebar;