import React, { useState, useEffect } from "react";
import Select from "./components/Select";
import "./App.css";




const daysOfWeek = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六',];
export default function App() {


  return (
    <div className="calendar-container">
      <div className="date-inputs">
        <Select
          options={[{ name: 2021, value: 2021 }, { name: 2022, value: 2022 }, { name: 2023, value: 2023 }, { name: 2024, value: 2024 }, { name: 2025, value: 2025 }, { name: 2026, value: 2026 }, { name: 2027, value: 2027 }, { name: 2028, value: 2028 }, { name: 2029, value: 2029 }, { name: 2030, value: 2030 }, { name: 2031, value: 2031 }, { name: 2032, value: 2032 }, { name: 2033, value: 2033 }, { name: 2034, value: 2034 }, { name: 2035, value: 2035 }]} />
        <Select
          options={[{ name: '1月', value: 1 }, { name: '2月', value: 2 }, { name: '3月', value: 3 }, { name: '4月', value: 4 }, { name: '5月', value: 5 }, { name: '6月', value: 6 }, { name: '7月', value: 7 }, { name: '8月', value: 8 }, { name: '9月', value: 9 }, { name: '10月', value: 10 }, { name: '11月', value: 11 }, { name: '12月', value: 12 }]} />
      </div>
      <div className="calendar">
        <div class="calendar-header">
          {
            daysOfWeek.map((day, index) => {
              return (
                <div class="calendar-header-cell">{day}</div>
              )
            })
          }
        </div>
        <div class="calendar-body">
          {new Array(42).fill(null).map((_, index) => {
            return (<div className="calendar-cell"></div>)
          })}
        </div>
      </div>
    </div>
  );
}