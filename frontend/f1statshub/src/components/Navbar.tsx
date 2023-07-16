import { Component, createSignal, createEffect } from "solid-js";
import "../styles/navbar.css"

interface NavbarProps {
    activeComponent: () => string,
    switchComponent: (componentName: string) => () => void
  }
  
  const Navbar: Component<NavbarProps> = ({activeComponent, switchComponent}) => {
    const [activeItem, setActiveItem] = createSignal("");

    
    const handleItemClick = (componentName: string) => {
      setActiveItem(componentName);
      return switchComponent(componentName);
    };


    return (
      <div class="navbar">
        <ul class="navbar-menu">
          <li class={activeItem() === "Home" ? "active" : ""}>
            <button onClick={handleItemClick("Home")}>Home</button>
          </li>
          <li class={activeItem() === "Standings" ? "active" : ""}>
            <button onClick={handleItemClick("Standings")}>Standings</button>
          </li>
          {/* <li class={activeItem() === "DriverInfo" ? "active" : ""}>
            <button onClick={handleItemClick("DriverInfo")}>DriverInfo</button>
          </li> */}
          <li class={activeItem() === "Circuits" ? "active" : ""}>
            <button onClick={handleItemClick("Circuits")}>Circuits</button>
          </li>
          <li class={activeItem() === "Constructors" ? "active" : ""}>
            <button onClick={handleItemClick("Constructors")}>Constructors</button>
          </li>
          <li class={activeItem() === "Drivers" ? "active" : ""}>
            <button onClick={handleItemClick("Drivers")}>Drivers</button>
          </li>
          <li class={activeItem() === "Races" ? "active" : ""}>
            <button onClick={handleItemClick("Races")}>Races</button>
          </li>
        </ul>
      </div>
    );
  };
  
  export default Navbar;