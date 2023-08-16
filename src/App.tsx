import "./App.css";
import { ComponentType, useState } from "react";
import { Scheduler, DayView, Appointments } from "@devexpress/dx-react-scheduler-material-ui";
import {
  EditRecurrenceMenu,
  EditingState,
  ChangeSet
} from "@devexpress/dx-react-scheduler";

interface ITask {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date
}

function App() {
  const [tasks, setTasks] = useState<ITask[]>([]);

  const changeHandler = ({ added, changed, deleted }: ChangeSet) => {
    if (added) {
      const newTaskId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0;
      setTasks([...tasks, { ...added as ITask, id: newTaskId }]);
    } else if (changed) {
      setTasks(tasks.map((task: ITask): ITask => {
        return changed[task.id] ? { ...task, ...changed[task.id] } : task;
      }));
    } else if (deleted !== undefined) {
      setTasks(tasks.filter(task => task.id !== deleted));
    }
    return { tasks };
  };

  return (
    <div>
      <Scheduler data={tasks}>
        <DayView startDayHour={9} endDayHour={19} />
        <EditingState onCommitChanges={changeHandler} />
        <Appointments />
        <EditRecurrenceMenu
          layoutComponent={
            EditRecurrenceMenu.defaultProps?.layoutComponent as ComponentType<EditRecurrenceMenu.LayoutProps>
          }
          overlayComponent={
            EditRecurrenceMenu.defaultProps?.overlayComponent as ComponentType<EditRecurrenceMenu.OverlayProps>
          }
          buttonComponent={
            EditRecurrenceMenu.defaultProps?.buttonComponent as ComponentType<EditRecurrenceMenu.ButtonProps>
          }
        />
      </Scheduler>
    </div>
  );
}

export default App;
