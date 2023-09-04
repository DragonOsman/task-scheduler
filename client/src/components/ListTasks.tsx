import { useTaskContext, ITask } from "src/context/taskContext";
import { Howl } from "howler";
import { useState } from "react";
import EditTask from "./EditTask";
import { SlowBuffer } from "buffer";

interface ListTasksProps {
  alarmSound: Howl;
};

const ListTasks = ({ alarmSound }: ListTasksProps) => {
  const [{ tasks }, dispatch] = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  const taskListElems = tasks.map(task => {
    return (
      <li
        key={task.id}
        className="task"
      >
        <button
          type="button"
          title="mark as completed"
          className="btn btn-success"
          onClick={() => {
            dispatch({ type: "EDIT_TASK", payload: {
              tasks: tasks,
              task: {
                ...task,
                isCompleted: true
              }
            } });
          }}
        >
          Done
        </button>
        {task.title}
        {" "}
        {task.startTime.toTimeString()}-{task.endTime.toTimeString()}
        {" "}
        {task.id === 0 && (
        <button
          type="button"
          title="set alarm"
          onClick={() => {
            setTimeout(() => {
              alarmSound.play();
            }, task.startTime.getTime());
          }}
          className="btn btn-secondary"
        >
          Set Alarm
        </button>)}
        <button
          type="button"
          title="delete task"
          className="btn btn-danger"
          onClick={() => {
            dispatch({ type: "DELETE_TASK", payload: {
              task,
              tasks
            } });
          }}
        >
          Delete
        </button>
        <button
          type="button"
          title="edit task"
          onClick={() => {
            setSelectedTask(task);
          }}
          className="btn btn-warning"
        >
          Edit
        </button>
      </li>
    );
  });

  return (
    <div className="task-list">
      <div className="container container-fluid">
        <h3>Amira's Chores</h3>
        <ul className="list">
          {taskListElems}
        </ul>
      </div>

      {selectedTask && (
        <EditTask task={selectedTask} />
      )}
    </div>
  );
};

export default ListTasks;