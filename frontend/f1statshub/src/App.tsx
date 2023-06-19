import  { Component , createSignal,createEffect  } from 'solid-js';

import LeftSidebar from './components/LeftSidebar';
import Home from './components/Home';
import Standings from './components/Standings';
import DriverInfo from './components/DriverInfo';
import styles from './App.module.css';


const App: Component = () => {
  const [activeComponent, setActiveComponent] = createSignal(localStorage.getItem("activeComponent") || 'Home');

  // Whenever activeComponent changes, update localStorage
  createEffect(() => localStorage.setItem("activeComponent", activeComponent()));

  const switchComponent = (componentName: string) => () => setActiveComponent(componentName);

  return (
    <div class={styles.App}>
      <LeftSidebar 
        activeComponent={activeComponent} 
        switchComponent={switchComponent} 
      />
      {activeComponent() === 'Home' && <Home />}
      {activeComponent() === 'Standings' && <Standings />}
      {activeComponent() === 'DriverInfo' && <DriverInfo />}
    </div>
  );
};

export default App;
