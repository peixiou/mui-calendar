import React, { useState, useEffect, use } from "react";
import Select from "./components/Select";
import "./App.css";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTaskContent, setNewTaskContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tasks, setTasks] = useState([]);




  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    // console.log('本地加载tasks:', tasks);

    setTasks(tasks)
  }, [])


  const handleYearChange = (year) => {
    setYear(year.value);
  }

  const handleMonthChange = (month) => {
    setMonth(month.value);
  }

  const handleOpenModal = (currentDay) => {
    setIsModalOpen(true);

    setStartDate(new Date(year, month, currentDay+1));
    setEndDate(new Date(year, month, currentDay+1))
  }


  const parseDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  }

  const getTasksByDate = (date) => {

    return tasks.filter(task => {
      return parseDate(date) >= parseDate(new Date(task.startDate)) && parseDate(date) <= parseDate(new Date(task.endDate))
    })
  }


  const renderCalendar = () => {
    const daysOfMonth = getDaysInMouth(year, month);
    // 1 2 3 .....31
    const firstDayInWeek = ZellerWeekDay(year, month, 1);
    const preMouthDays = getDaysInMouth(year, month - 1);
    const preMouthLastDays = preMouthDays.slice(-firstDayInWeek)
    // 下个月的开头几天
    const nextMouthDays = getDaysInMouth(year, month + 1);
    const arr = []

    const tasksByDate = new Map();

    //  key1:[task1,task2]
    // key2:[task3,task4]

    const groupTasksByDate = () => {
      tasks.forEach(task => {

        const taskStartDate = new Date(task.startDate)
        const taskEndDate = new Date(task.endDate)
        for (let date= taskStartDate; date <= taskEndDate; date.setDate(date.getDate() + 1)) {
          // console.log('task', task.content)
          const dateKey=date.toISOString().split('T')[0];
          if (!tasksByDate.has(dateKey)) {
            tasksByDate.set(dateKey, [])
          }
          tasksByDate.get(dateKey).push(task)
        }
      })
    }


    groupTasksByDate()
    console.log('tasksByDate', tasksByDate)

// 算任务的位置


    const taskPositions = new Map();
    const getTaskPosition = (task) => {
      tasks.forEach(task => {

        const taskStartDate = new Date(task.startDate)
        const taskEndDate = new Date(task.endDate)
        // 既可能是单任务，也可能是多天任务
        for (let date= taskStartDate; date <= taskEndDate; date.setDate(date.getDate() + 1)) {
          const dateKey=date.toISOString().split('T')[0];
          const tasksInDay=tasksByDate.get(dateKey)





          const usedPositions=new Set()
          tasksInDay.forEach(taskItem => {
             if( taskPositions.has(taskItem.id)){
               usedPositions.add(taskPositions.get(taskItem.id))//0 1 4 5
             }
          })
          let postion=0

          // 找到空位
          while(usedPositions.has(postion)){
            postion++
          }








          taskPositions.set(task.id,postion)
        }
      })
    }


    getTaskPosition()



    // 遍历日期
    for (let i = 0; i < 42; i++) {
      if (i < firstDayInWeek) {
        arr.push(<div className="calendar-cell disabled">{preMouthLastDays[i]}</div>)
      } else if (i >= firstDayInWeek && i < (firstDayInWeek + daysOfMonth.length)) {

        const day = daysOfMonth[i - firstDayInWeek]
        // 
        const tasksInDay = getTasksByDate(new Date(year, month, day+1))


        arr.push(
          <div className="calendar-cell">
            <div className="date-header">
              <span>{day}</span>

              <div
                className="add-task-btn material-btn"

              >
                <span className="material-icon" onClick={() => { handleOpenModal(day) }}></span>
              </div>
            </div>
            <div className="tasks-container">
              {
                tasksInDay.map((task, i) => {

                  let taskClass = `task-item`


                  const taskSart = parseDate(new Date(task.startDate))

                  const taskEnd = parseDate(new Date(task.endDate))
                  const currentDate = parseDate(new Date(year, month, day+1))
                  // console.log('任务', task.content)
                  // console.log(taskSart, taskEnd, currentDate)
                  if (taskSart === currentDate) {
                    taskClass += ' task-start'
                  }
                  if (currentDate > taskSart && currentDate < taskEnd) {
                    taskClass += ' task-middle'
                  }

                  if (taskEnd === currentDate) {
                    taskClass += ' task-end'
                  }

                  return (
                    <div

                      className={taskClass}
                      style={{
                        position: 'absolute',
                        marginTop: `${taskPositions.get(task.id) * 24}px`,
                        left: 0,
                        right: 0,
                        height: '22px',
                        backgroundColor: `var(--task-color-${task.id % 5})`
                      
                      }}
                      title={new Date(currentDate).toISOString().split('T')[0]+'：'+new Date(taskSart).toISOString().split('T')[0]+'/'+new Date(taskEnd).toISOString().split('T')[0]}
                    >
                      {taskSart === currentDate && task.content}
                    </div>
                  )
                })
              }
            </div>
          </div>
        )
      } else {
        arr.push(<div className="calendar-cell disabled">{nextMouthDays[i - (firstDayInWeek + daysOfMonth.length)]}</div>)
      }
    }


    return arr

  }


  // useEffect(() => {
  //   console.log(year, month);
  //   renderCalendar();
  // }, [year, month])

  // console.log(year, month);




  const handleSubmit = () => {
    if (newTaskContent.trim()) {
      const newTask = {
        id: Date.now().toString(),
        content: newTaskContent,
        startDate: startDate,
        endDate: endDate
      }
      // 同步
      const newTasks = [...tasks, newTask]
      // 异步
      setTasks(newTasks)
      // 存起来
      localStorage.setItem('tasks', JSON.stringify(newTasks))
      // 取
      setNewTaskContent('')
      setIsModalOpen(false)
    }
  }


  const handleEndDateChange = (e) => {
    setEndDate(new Date(e.target.value))
  }


  return (
    <div className="calendar-container">
      <div className="select-date">
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


      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>添加任务</h3>
            <input
              type="text"
              onChange={(e) => setNewTaskContent(e.target.value)}
              placeholder="输入任务内容"
            />
            <div className="date-inputs">
              <div>
                <label>开始日期：</label>
                <input
                  type="date"
                  value={startDate.toISOString().split('T')[0]}//yyyy-mm-dd
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                />
              </div>
              <div>
                <label>结束日期：</label>
                <input
                  type="date"
                  value={endDate.toISOString().split('T')[0]}//yyyy-mm-dd
                  onChange={handleEndDateChange}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleSubmit}>确定</button>
              <button onClick={() => setIsModalOpen(false)}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}