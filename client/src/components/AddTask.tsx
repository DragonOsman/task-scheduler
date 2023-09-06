import { useTaskContext } from "../context/taskContext";
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

  const navigate = useNavigate();

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const match = timeString.match(/\d+/);
    const time = match ? parseInt(match[0]) : null;
    if (time && (isFlexible && !isScheduled)) {
      console.log(`"time" in first useEffect call in AddTask.tsx: ${time}`);
      setMinutes(time);
      const end = new Date();
      end.setMinutes(end.getMinutes() + minutes);
      const startTime = new Date();

      setStartTime(startTime.toString());
      setEndTime(end.toString());
    }
  }, [timeString]);

  useEffect(() => {
    if (!isFlexible && isScheduled) {
      const [startTimeStr, endTimeStr] = timeString.split("-");

      // Create a new Date object with the current date
      const currentDate = new Date();

      // Extract hours and minutes from the start and end time strings
      const [startHours, startMinutes] = startTimeStr.split(":");
      const [endHours, endMinutes] = endTimeStr.split(":");

      // Set the hours and minutes for the start time
      const startTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        parseInt(startHours),
        parseInt(startMinutes)
      );

      // Set the hours and minutes for the end time
      const endTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        parseInt(endHours),
        parseInt(endMinutes)
      );

      setStartTime(startTime.toString());
      setEndTime(endTime.toString());
    }
  }, [timeString, isFlexible]);

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
          dispatch({ type: "ADD_TASK", payload: {
            tasks,
            task: {
              title,
              startTime: new Date(startTime),
              endTime: new Date(endTime),
              id: tasks.length + 1,
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
              disabled={isFlexible}
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
                disabled={isScheduled}
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