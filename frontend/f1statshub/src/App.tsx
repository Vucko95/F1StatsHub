import { Component, createSignal, createEffect, Switch, Match } from 'solid-js';
import { Navbar, Home, Circuits, Constructors, Drivers, Races } from './components';
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
      <Switch fallback={<div>Not found</div>}>
        <Match when={activeComponent() === 'Home'}><Home /></Match>
        <Match when={activeComponent() === 'Circuits'}><Circuits /></Match>
        <Match when={activeComponent() === 'Constructors'}><Constructors /></Match>
        <Match when={activeComponent() === 'Drivers'}><Drivers /></Match>
        <Match when={activeComponent() === 'Races'}><Races /></Match>
      </Switch>
    </div>
  );
};

export default App;