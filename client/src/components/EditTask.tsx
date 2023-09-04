import { useTaskContext, ITask } from "src/context/taskContext";
import { useState, useEffect, ChangeEvent } from "react";

interface EditTaskProps {
  task: ITask;
};

const EditTask = ({ task }: EditTaskProps) => {
  const [{ tasks }, dispatch] = useTaskContext();

  const [title, setTitle] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isFlexible, setIsFlexible] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [daysRecurring, setDaysRecurring] = useState<string[]>([]);
  const [timeString, setTimeString] = useState("");
  const [minutes, setMinutes] = useState(0);

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
    <form
      onSubmit={() => {
        dispatch({ type: "EDIT_TASK", payload: {
          tasks,
          task: {
            ...task,
            title: title !== "" ? title : task.title,
            startTime: startTime !== "" ? (
              isFlexible ?
              new Date(new Date()) :
              new Date(startTime)
            ) : task.startTime,
            endTime: endTime !== "" ? (
              isFlexible ?
            new Date(new Date().setMinutes(Number(minutes))) :
            new Date(endTime)
            ) : task.endTime,
            id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0,
            isRecurring,
            daysRecurring,
            isCompleted,
            flexible: isFlexible,
            scheduled: isScheduled
          }
        } });
      }}
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
              className={`form-check-input ${isScheduled ? "bg-dark" : "bg-light"}`}
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
            className={`form-check-input ${isScheduled ? "bg-dark" : "bg-light"}`}
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
  );
};

export default EditTask;