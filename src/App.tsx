import "./App.css";
import { useState, ComponentType } from "react";
import { Routes, Route } from "react-router-dom";
import { Scheduler, DayView, Appointments } from "@devexpress/dx-react-scheduler-material-ui";
import {
  EditRecurrenceMenu,
  EditingState,
  ChangeSet
} from "@devexpress/dx-react-scheduler";
import AddTask from "./components/AddTask";

interface ITask {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
}

function App() {
  const [tasks, setTasks] = useState<ITask[]>([])

  const changeHandler = ({ added, changed, deleted }: ChangeSet) => {
    if (added) {
      setTasks([...tasks, added as ITask])
    } else if (changed) {
      setTasks(tasks.map(task => {
        return changed[task.id] ? { ...task, ...changed[task.id] } : task
      }));
    } else if (deleted !== undefined) {
      setTasks(tasks.filter(task => task.id !== deleted));
    }
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
      <Routes>
        <Route path="/add-task" element={<AddTask />} />
      </Routes>
    </div>
  );
}

export default App;
