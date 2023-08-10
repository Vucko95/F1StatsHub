import { Component, createSignal, createEffect } from "solid-js";
import "../styles/navbar.css"

interface NavbarProps {
    activeComponent: () => string,
    switchComponent: (componentName: string) => () => void
  }
  
  const Navbar: Component<NavbarProps> = ({activeComponent, switchComponent}) => {
    const [activeItem, setActiveItem] = createSignal("");

    const [menuOpen, setMenuOpen] = createSignal(true);
    const toggleMenu = () => {
      setMenuOpen(!menuOpen());
    };
    const handleItemClick = (componentName: string) => {
      setActiveItem(componentName);
      setMenuOpen(!menuOpen()); 

      return switchComponent(componentName);
    };


    return (
      <div class="navbar">
    <button class="hamburger-menu" onClick={toggleMenu}>☰</button> 
      <ul class={`navbar-menu ${menuOpen() ? 'open' : ''}`}>
      <li class={activeItem() === "Home" ? "active" : ""} onClick={toggleMenu}>
            <button onClick={handleItemClick("Home")}>Home</button>
      </li>
          <li class={activeItem() === "Circuits" ? "active" : ""} onClick={toggleMenu} >
            <button onClick={handleItemClick("Circuits")}>Circuits</button>
          </li>
          <li class={activeItem() === "Constructors" ? "active" : ""} onClick={toggleMenu}>
            <button onClick={handleItemClick("Constructors")}>Constructors</button>
          </li>
          <li class={activeItem() === "Drivers" ? "active" : ""} onClick={toggleMenu} >
            <button onClick={handleItemClick("Drivers")} >Drivers</button>
          </li>
          <li class={activeItem() === "Races" ? "active" : ""}onClick={toggleMenu}>
            <button onClick={handleItemClick("Races")}>Races</button>
          </li>
        </ul>
      </div>
    );
  };
  
  export default Navbar;