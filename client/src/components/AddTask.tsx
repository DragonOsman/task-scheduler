import { useTaskContext,ITask } from "../context/taskContext";
import { useNavigate, Link } from "react-router-dom";
import { ChangeEvent, useState, useEffect } from "react";

const AddTask = () => {
  const [{ tasks }, dispatch] = useTaskContext();
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isFlexible, setIsFlexible] = useState(false);
  const [daysRecurring, setDaysRecurring] = useState<string[]>([]);
  const [timeString, setTimeString] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [id, setId] = useState(0);

  const navigate = useNavigate();

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const match = timeString.match(/\d+/);
    const time = match ? parseInt(match[0]) : null;
    if (time) {
      console.log(`"time" in first useEffect call in AddTask.tsx: ${time}`);
      setMinutes(time);
    }
  }, [timeString]);

  useEffect(() => {
    const [startTimeStr, endTimeStr] = timeString.split("-");
    console.log(`startTimeStr: ${startTimeStr}; endTimeStr: ${endTimeStr}`);
    setStartTime(new Date(`${new Date().getDate()}T${startTimeStr}`).toString());
    setEndTime(new Date(`${new Date().getDate()}T${endTimeStr}`).toString());
  }, [timeString]);

  return (
    <div className="add-task container d-flex
      container-fluid justify-content-center text-center">
      <div className="row">
        <div className="col-auto">
          <Link to="/">
            <i className="fa-solid fa-angle-left"></i>
          </Link>
        </div>
        <div className="col d-flex justify-content-center align-items-center">
          <h3 className="text-center">Add Task</h3>
        </div>
      </div>
      <form
        onSubmit={event => {
          event.preventDefault();
          if (tasks.length > 0) {
            setId(tasks[tasks.length - 1].id + 1);
          } else if (tasks.length === 0) {
            setId(0);
          }
          dispatch({ type: "ADD_TASK", payload: {
            tasks,
            task: {
              title: title,
              startTime: isFlexible ?
                new Date(new Date()) :
                new Date(startTime),
              endTime: isFlexible ?
              new Date(new Date().setMinutes(Number(minutes))) :
              new Date(endTime),
              id,
              isRecurring,
              daysRecurring,
              isCompleted: false,
              flexible: isFlexible,
              scheduled: isScheduled
            }
          } });
          navigate("/");
        }}
        method="post"
      >
        <fieldset>
          <input
            type="text"
            name="task-title"
            id="title"
            title="task title"
            className="task-title form-control title"
            value={title}
            placeholder="Title"
            onChange={event => setTitle(event.target.value)}
          />
          <div className="form-check form-switch d-flex align-items-center">
            <label htmlFor="scheduled-task" className="form-check-label
             mr-2 switch-label">Scheduled Time</label>
            <div className="flex-grow-1"></div>
            <input
              title="scheduled task setting"
              type="checkbox"
              name="scheduled-task"
              id="scheduled"
              className={`form-check-input ${isScheduled ? "bg-dark" : "bg-light"}`}
              role="switch"
              checked={isScheduled}
              data-toggle="toggle"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setIsScheduled(event.target.checked);
              }}
            />
          </div>
          {isScheduled ? (
            <div className="row">
              <div className="col-auto">
                <label htmlFor="task-timer" className="form-label timer-label">Time</label>
              </div>
              <div className="col">
                <input
                  type="text"
                  name="task-timer"
                  title="task time"
                  value={timeString}
                  onChange={event => setTimeString(event.target.value)}
                  className="form-control timer-text"
                />
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-auto">
                <label htmlFor="task-timer" className="form-label timer-label">Timer</label>
              </div>
              <div className="col">
                <input
                  type="text"
                  name="task-timer"
                  title="task time"
                  value={timeString}
                  className="form-control timer-text"
                  onChange={event => setTimeString(event.target.value)}
                />
              </div>
            </div>
          )}
          {!isRecurring && (
            <>
              <div className="form-check form-switch d-flex align-items-center">
              <label htmlFor="flexible-task" className="form-check-label switch
                switch-label mr-2">Flexible</label>
              <div className="flex-grow-1"></div>
              <input
                title="flexible task setting"
                type="checkbox"
                name="flexible-task"
                id="flexible"
                className={`form-check-input ${isFlexible ? "bg-dark" : "bg-light"}`}
                role="switch"
                checked={isFlexible}
                data-toggle="toggle"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setIsFlexible(event.target.checked);
                }}
              />
            </div>
          </>
          )}
          <div className="form-check form-switch d-flex align-items-center">
            <label htmlFor="recurring-task" className="form-check-label switch
              switch-label mr-2">Recurring</label>
            <div className="flex-grow-1"></div>
            <input
              title="recurring task setting"
              type="checkbox"
              name="recurring-task"
              id="recurring"
              className={`form-check-input ${isRecurring ? "bg-dark" : "bg-light"}`}
              role="switch"
              checked={isRecurring}
              data-toggle="toggle"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setIsRecurring(event.target.checked);
              }}
            />
          </div>
          {isRecurring && (
            days.map(day => {
              return (
                <button
                  type="button"
                  title="day recurring"
                  key={day}
                  className="btn btn-secondary day-btn"
                  onClick={() => {
                    let newDaysRecurring = [...daysRecurring];
                    if (daysRecurring.includes(day)) {
                      const result = window.confirm(
                        `Are you sure you want to remove ${day} from the list?`
                      )
                      ;
                      if (result) {
                        newDaysRecurring = newDaysRecurring.splice(
                          newDaysRecurring.indexOf(day),
                          day.length
                        );
                      }
                    }
                    newDaysRecurring.push(day);
                    setDaysRecurring(newDaysRecurring);
                  }}
                >
                  {day.charAt(0)}
                </button>
              );
            })
          )}
        </fieldset>
      <input type="submit" value="Done" className="form-control btn btn-secondary submit-btn" />
      {daysRecurring.map(dayRecurring => (
        <ul className="days-list">
          <li key={dayRecurring}>
            {dayRecurring}
          </li>
        </ul>
      ))}
      </form>
    </div>
  );
};

export default AddTask;