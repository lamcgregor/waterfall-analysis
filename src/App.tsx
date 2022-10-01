import React, { useState } from "react";
import "./App.css";
import { ShareTable } from "./components/shareTable";
import { CalculatedShareStructure, calculateShareClass } from "./utils";

type ExitAmounts = 60 | 25 | 35 | 45;

const getCalculatedString = (table: CalculatedShareStructure) => {
  const values: number[] = [];
  table.shareClasses.forEach(({ exitAmount, shareCount, title }) => {
    let shareValue = 0;
    if (exitAmount !== 0) {
      shareValue = exitAmount / shareCount
    }
    values.push(shareValue);
  })
  return values.join(',');
}

function App() {
  const [exitAmount, setExitAmount] = useState<ExitAmounts>(60);
  const { shareClasses } = calculateShareClass(exitAmount * 1000000);
  console.log(shareClasses);
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <select
            onChange={({ currentTarget: { value } }) => {
              setExitAmount(parseInt(value) as ExitAmounts);
            }}
          >
            <option value={60}>€60m</option>
            <option value={25}>€25m</option>
            <option value={35}>€35m</option>
            <option value={45}>€45m</option>
            <option value={40}>€40m</option>
            <option value={50}>€50m</option>
            <option value={70}>€70m</option>
            <option value={39}>€39m</option>
            <option value={44}>€44m</option>
            <option value={47}>€47m</option>
          </select>
        </div>
        <ShareTable shareClasses={shareClasses} />
        <button onClick={() => {
            let csvString = "";
            const titles: string[] = []
            calculateShareClass(1000000).shareClasses.forEach(({ title }) => {
              titles.push(title);
            })
            csvString += `Exit amount,`;
            csvString += titles.join(',');
            csvString += `\n`;
            for(let i = 1; i <= 80; i++) {
              csvString += `${i},`
              csvString += getCalculatedString(calculateShareClass(i * 1000000));
              csvString += `\n`;
            }
            console.log(csvString);
          }}>Convert to CSV</button>
      </header>
    </div>
  );
}

export default App;
