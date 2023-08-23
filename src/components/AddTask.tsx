import { useTask } from "../context/taskContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddTask = () => {
  const [state, dispatch] = useTask();
  const [title, setTitle] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [startTime, setStartTime] = useState("00:00:00");
  const [endingTime, setEndingTime] = useState("00:00:00");
  const [daysRecurring, setDaysRecurring] = useState<string[]>([]);
  const navigate = useNavigate();

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="task-add-form-container container-fluid">
      <form
        className="add-task-form"
        onSubmit={() => {
          navigate("/");
        }}
      >
        <label htmlFor="task-title" className="form-label">Task name</label>:
        <input
          type="text"
          name="task-title"
          title="task title"
          onChange={(event) => setTitle(event.target.value)}
          value={title}
          placeholder="Enter name of task"
          className="form-control"
          required
        />
        <div className="form-check form-switch">
          <input
            type="checkbox"
            name="is-recurring"
            title="choose if recurring"
            className="form-check-input form-switch"
            id={isRecurring ? "flexSwitchCheckChecked" : "flexSwitchCheckDefault"}
            role="switch"
            onChange={() => setIsRecurring(!isRecurring)}
            checked={isRecurring}
          />
          <label htmlFor="is-recurring" className="form-label">Recurring</label>
        </div>
        <label htmlFor="start-time" className="form-label">Starting time</label>:
        <input
          type="datetime"
          name="starting time"
          title="start-time"
          className="form-control"
          onChange={event => setStartTime(event.target.value)}
          value={startTime}
          placeholder="Enter a starting time for task"
        />
        <label htmlFor="ending-time" className="form-label">Ending time</label>:
        <input
          type="datetime"
          name="ending-time"
          title="ending time"
          disabled={isRecurring}
          placeholder="Enter an ending time for task"
          onChange={event => setEndingTime(event.target.value)}
          value={endingTime}
        />
        {isRecurring && (
          <div className="button-group">
            {days.map(day => {
              return (
                <button
                  key={day}
                  type="button"
                  title={`${day.toLowerCase()}`}
                  onClick={() => {
                    setDaysRecurring(existingItems => {
                      return [...existingItems, day];
                    });
                  }}
                  className="btn btn-dark rounded-circle"
                >
                  {day.charAt(0)}
                </button>
              );
            })}
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          title="add task"
          onClick={() => {
            dispatch({ type: "ADD_TASK", tasks: [...state.tasks, {
              isRecurring: isRecurring,
              daysRecurring: daysRecurring,
              title: title,
              startTime: new Date(startTime),
              isCompleted: false,
              id: state.tasks.length > 0 ? state.tasks[state.tasks.length - 1].id : 0,
              endTime: new Date(endingTime)
            }] });
          }}
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;