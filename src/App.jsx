import React from "react"
import Navbar from "./components/Navbar"
import { DemoLine } from "./components/Demoline"





export default function App () {
    return (
        <div className="wrapper bg-dark text-white">
            <Navbar />
            <div className="container pt-5">
                <DemoLine />
            </div>

        </div>
    )
}
