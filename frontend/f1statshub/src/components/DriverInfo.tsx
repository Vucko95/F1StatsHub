import { Component, createSignal, createEffect } from "solid-js";
import "../styles/right_sidebar.css";

const DriverInfo: Component = () => {
    const [show, setShow] = createSignal(false);


    return (
        <div class="driver_info_box">
        <h1>DriverInfo</h1>
        </div>
    )
 }
export default DriverInfo;