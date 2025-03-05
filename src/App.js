import React, { useState, useEffect } from "react";
import Select from "./components/Select";
import "./App.css";
import { render } from "@testing-library/react";

const getDaysInMouth = (year, month) => {
  const days = [];

  // 上个月的最后一天,1月，传0。2月传1.
  const lastDayOfMonth = new Date(year, month, 0).getDate();

  for (let i = 1; i <= lastDayOfMonth; i++) {
    days.push(i);
  }
  return days;
}

// mouth 1 1月 2月
const ZellerWeekDay = (year, month, day) => {
  let m = month;
  const d = day;
  if (month < 3) {
    year--;
    m += 12;
  }
  const y = year % 100;
  const c = Math.floor(year / 100);

  // 对除法结果取整
  let w = (y + Math.floor(y / 4) + Math.floor(c / 4) - 2 * c + Math.floor((13 * (m + 1)) / 5) + d - 1) % 7;
  if (w < 0) {
    w += 7;
  }
  return w;
}



const daysOfWeek = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六',];
export default function App() {

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const handleYearChange = (year) => {
    setYear(year.value);
  }

  const handleMonthChange = (month) => {

    setMonth(month.value);
  }




  const renderCalendar = () => {
    const daysOfMonth= getDaysInMouth(year, month);
    // 1 2 3 .....31
    const firstDayInWeek= ZellerWeekDay(year, month, 1);
    const preMouthDays=getDaysInMouth(year,month-1);
    const preMouthLastDays=preMouthDays.slice(-firstDayInWeek)
// 下个月的开头几天
    const nextMouthDays=getDaysInMouth(year,month+1);
    const arr=[]
    for (let i=0;i<42;i++){
      if(i<firstDayInWeek){
        arr.push(<div className="calendar-cell disabled">{preMouthLastDays[i]}</div>)
      }else if(i>=firstDayInWeek&&i<(firstDayInWeek+daysOfMonth.length)){
        arr.push(<div className="calendar-cell">{daysOfMonth[i-firstDayInWeek]}</div>)
      }else{
        arr.push(<div className="calendar-cell disabled">{nextMouthDays[i-(firstDayInWeek+daysOfMonth.length)]}</div>)
      }
    }


    return arr

  }


  // useEffect(() => {
  //   console.log(year, month);
  //   renderCalendar();
  // }, [year, month])

  console.log(year, month);
  

  return (
    <div className="calendar-container">
      <div className="date-inputs">
        <Select
          defaultValue={{ name: year, value: year }}
          onChange={handleYearChange}
          options={[{ name: 2021, value: 2021 }, { name: 2022, value: 2022 }, { name: 2023, value: 2023 }, { name: 2024, value: 2024 }, { name: 2025, value: 2025 }, { name: 2026, value: 2026 }, { name: 2027, value: 2027 }, { name: 2028, value: 2028 }, { name: 2029, value: 2029 }, { name: 2030, value: 2030 }, { name: 2031, value: 2031 }, { name: 2032, value: 2032 }, { name: 2033, value: 2033 }, { name: 2034, value: 2034 }, { name: 2035, value: 2035 }]} />
        <Select
          defaultValue={{ name: month, value: month }}
          onChange={handleMonthChange}
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
         {renderCalendar()}
        </div>
      </div>
    </div>
  );
}