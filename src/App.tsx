import React, { useState } from "react";
import "./App.css";
import { ShareTable } from "./components/shareTable";
import { calculateShareClass } from "./utils";

type ExitAmounts = 60 | 25 | 35 | 45;

function App() {
  const [exitAmount, setExitAmount] = useState<ExitAmounts>(60);
  const { shareClasses } = calculateShareClass(exitAmount * 1000000);
  console.log(shareClasses);
  return (
    <div className="App">
      <header className="App-header">
        <select
          onChange={({ currentTarget: { value } }) => {
            setExitAmount(parseInt(value) as ExitAmounts);
          }}
        >
          <option value={60}>€60m</option>
          <option value={25}>€25m</option>
          <option value={35}>€35m</option>
          <option value={45}>€45m</option>
        </select>
        <ShareTable shareClasses={shareClasses} />
      </header>
    </div>
  );
}

export default App;
