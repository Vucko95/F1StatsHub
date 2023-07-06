import  { Component , createSignal,createEffect  } from 'solid-js';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Standings from './components/Standings';
import DriverInfo from './components/DriverInfo';
import Circuits from './components/Circuits';
import styles from './App.module.css';


const App: Component = () => {
  const [activeComponent, setActiveComponent] = createSignal(localStorage.getItem("activeComponent") || 'Home');

  createEffect(() => localStorage.setItem("activeComponent", activeComponent()));

  const switchComponent = (componentName: string) => () => setActiveComponent(componentName);

  return (
    <div class={styles.App}>
      <Navbar 
        activeComponent={activeComponent} 
        switchComponent={switchComponent} 
      />
      {activeComponent() === 'Home' && <Home />}
      {activeComponent() === 'Standings' && <Standings />}
      {activeComponent() === 'DriverInfo' && <DriverInfo />}
      {activeComponent() === 'Circuits' && <Circuits />}
    </div>
  );
};

export default App;
