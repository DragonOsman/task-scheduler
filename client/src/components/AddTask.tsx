import { useTaskContext } from "../context/taskContext";
import { useNavigate } from "react-router-dom";
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
    if (time) {
      setMinutes(time);
    }
  }, [timeString]);

  useEffect(() => {
    const [startTimeStr, endTimeStr] = timeString.split("-");
    setStartTime(new Date(`${new Date().getDate()}T${startTimeStr}`).toString());
    setEndTime(new Date(`${new Date().getDate()}T${endTimeStr}`).toString());
  }, [timeString]);

  return (
    <div className="container container-fluid">
      <h3>Add Task</h3>
      <form
        onSubmit={() => {
          dispatch({ type: "ADD_TASK", payload: {
            tasks: tasks,
            task: {
              title: title,
              startTime: isFlexible ?
                new Date(new Date()) :
                new Date(startTime),
              endTime: isFlexible ?
              new Date(new Date().setMinutes(Number(minutes))) :
              new Date(endTime),
              id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0,
              isRecurring,
              daysRecurring,
              isCompleted: false
            }
          } });
          navigate("/");
        }}
      >
        <fieldset>
          <legend className="form-label">Add Task Info</legend>
          <input
            type="text"
            name="task-title"
            id="title"
            title="task title"
            className="task-title form-control"
            value={title}
            placeholder="Task title"
            onChange={event => setTitle(event.target.value)}
          />
          <div className="form-check form-switch">
            <label htmlFor="scheduled-task" className="form-check-label">Scheduled Time</label>
            <input
              title="scheduled task setting"
              type="checkbox"
              name="scheduled-task"
              id="scheduled"
              className="form-check-input"
              checked={isScheduled}
              data-toggle="toggle"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setIsScheduled(event.target.checked);
              }}
            />
          </div>
          {isScheduled ? (
            <>
              <label htmlFor="task-timer" className="form-label">Time</label>
              <input
                type="text"
                name="task-timer"
                title="task time"
                value={timeString}
                onChange={event => setTimeString(event.target.value)}
              />
            </>
          ) : (
            <>
              <label htmlFor="task-timer" className="form-label">Timer</label>
              <input
                type="text"
                name="task-timer"
                title="task time"
                value={timeString}
                onChange={event => setTimeString(event.target.value)}
              />
            </>
          )}
          {!isRecurring && (
            <>
              <div className="form-check form-switch">
              <label htmlFor="flexible-task" className="form-check-label">Flexible</label>
              <input
                title="flexible task setting"
                type="checkbox"
                name="flexible-task"
                id="flexible"
                className="form-check-input"
                checked={isFlexible}
                data-toggle="toggle"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setIsFlexible(event.target.checked);
                }}
              />
            </div>
          </>
          )}
          <div className="form-check form-switch">
            <label htmlFor="recurring-task" className="form-check-label">Recurring</label>
            <input
              title="recurring task setting"
              type="checkbox"
              name="recurring-task"
              id="recurring"
              className="form-check-input"
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
                  onClick={() => {
                    let newDaysRecurring = [...daysRecurring];
                    if (daysRecurring.includes(day)) {
                      const result = window.confirm(`Are you sure you want to
                        remove ${day} from the list?`)
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
      <input type="submit" value="Done" className="form-control btn btn-secondary" />
      </form>
    </div>
  );
};

export default AddTask;