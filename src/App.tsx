import "./App.css";
import data from "./data.json";
import { useTimer, useStopwatch } from "react-timer-hook";
import {
  useState,
  useEffect,
  FunctionComponent,
  MouseEvent,
  TouchEvent
} from "react";
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments,
  Toolbar,
  DateNavigator,
  TodayButton,
  AppointmentForm,
  AppointmentTooltip,
  CurrentTimeIndicator
} from "@devexpress/dx-react-scheduler-material-ui";
import {
  EditingState,
  ViewState,
  ChangeSet,
  ViewSwitcher,
  IntegratedEditing
} from "@devexpress/dx-react-scheduler";

interface IAppointment {
  id: number;
  title: string;
  startDate: Date;
  endDate?: Date;
  recurrenceRule?: string;
};

const stringDataAmira = data["Amira"]["Chores"];
const stringDataNoora = data["Noora"]["Chores"];

const appointmentDataAmira: IAppointment[] = [];
for (const outerValue of Object.values(stringDataAmira)) {
  for (const [innerKey, innerValue] of Object.entries(outerValue)) {
    const appointment: IAppointment = {
      id: 0,
      title: "",
      startDate: new Date(),
      endDate: new Date()
    };

    if (innerKey === "title" && typeof innerValue === "string") {
      appointment.title = innerValue;
      console.log(`appointment.title: ${appointment.title}`);
    }

    if (innerKey === "startDate" && typeof innerValue === "string") {
      const newValue = new Date(innerValue);
      appointment.startDate = newValue;
    }

    if (innerKey === "recurrenceRule" && (innerValue !== "" || innerValue)) {
      appointment.endDate = undefined;
    }

    appointment.id = appointmentDataAmira.length > 0 ?
      appointmentDataAmira[appointmentDataAmira.length - 1].id + 1 : 0;
    appointmentDataAmira.push(appointment);
  }
}

const appointmentDataNoora: IAppointment[] = [];
for (const outerValue of Object.values(stringDataNoora)) {
  for (const [innerKey, innerValue] of Object.entries(outerValue)) {
    const appointment: IAppointment = {
      id: 0,
      title: "",
      startDate: new Date(),
      endDate: new Date()
    };

    if (innerKey === "title" && typeof innerValue === "string") {
      appointment.title = innerValue;
      console.log(`appointment.title: ${appointment.title}`);
    }

    if (innerKey === "startDate" && typeof innerValue === "string") {
      const newValue = new Date(innerValue);
      appointment.startDate = newValue;
    }

    if (innerKey === "recurrenceRule" && (innerValue !== "" || innerValue)) {
      appointment.endDate = undefined;
    }

    appointment.id = appointmentDataNoora.length > 0 ?
      appointmentDataNoora[appointmentDataNoora.length - 1].id + 1 : 0;
    appointmentDataNoora.push(appointment);
  }
}

interface CustomSwitcherProps {
  onChange: (view: string) => void;
}

const CustomViewSwitcher: FunctionComponent<CustomSwitcherProps> =
  ({ onChange }: CustomSwitcherProps) => {
  return (
    <div className="view-swither-buttons">
      <button
        type="button"
        title="switch to week view"
        onClick={(e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
          const element = e.currentTarget;
          element.classList.add("active");
          onChange("Week");
        }}
      >
        Week
      </button>
      <button
        type="button"
        title="switch to day view"
        onClick={(e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
          const element = e.currentTarget;
          element.classList.add("active");
          onChange("Day");
        }}
      >
        Day
      </button>
      <button
        type="button"
        title="switch to month view"
        onClick={(e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
          const element = e.currentTarget;
          element.classList.add("active");
          onChange("Month");
        }}
      >
        Month
      </button>
    </div>
  );
};

const TimeIndicator = () => {
  return (
    <div className="time-indicator">
      <div className="nowIndicator circle" />
      <div className="nowIndicator line" />
    </div>
  );
};

const TaskTimer = ({ expiryTimestamp }: { expiryTimestamp: Date}) => {
  const [newEndTime, setNewEndTime] = useState("00:00:00");
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart
  } = useTimer({ expiryTimestamp, onExpire: () => <p>Time is up!</p> });

  if (isRunning) {
    return (
      <div>
        <button type="button" title="pause" onClick={() => pause()}>
          Pause
        </button>
        <input
          type="number"
          title="new ending time"
          value={newEndTime}
          onChange={(event) => setNewEndTime(event.target.value)}
        />
        <button type="button" title="restart" onClick={() => {
          const newExpiryTime = new Date(newEndTime);
          restart(newExpiryTime);
        }}>
          Restart
        </button>
        <div className="timer-container">
          <p className="timer">
            <span>{days}</span> days:
            <span>{hours}</span> hours:
            <span>{minutes}</span> minutes:
            <span>{seconds}</span> seconds
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <button type="button" title="start" onClick={() => start()}>
          Start
        </button>
        <button type="button" title="resume" onClick={() => resume()}>
          Resume
        </button>
        <div className="timer-container">
          <p className="timer">
            <span>{days}</span> days:
            <span>{hours}</span> hours:
            <span>{minutes}</span> minutes:
            <span>{seconds}</span> seconds
          </p>
        </div>
      </div>
    );
  }
};

const TaskStopwatch = () => {
  const [newEndTime, setNewEndTime] = useState("00:00:00");
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset
  } = useStopwatch({ autoStart: true });

  return (
    <div className="stop-watch-container">
      <p>{isRunning ? "Running" : "Not running"}</p>
      <div className="stopwatch">
        <span>{days} days </span>:
        <span>{hours} hours: </span>
        <span>{minutes}: </span>
        <span>{seconds} seconds</span>
      </div>
      <button
        type="button"
        title="start stopwatch"
        onClick={start}
      >
        Start
      </button>
      <button
        type="button"
        title="pause stopwatch"
        onClick={pause}
      >
        Pause
      </button>
      <button
        type="button"
        title="reset stopwatch"
        onClick={() => reset(new Date(newEndTime))}
      >
        Reset
      </button>
      <input
          type="number"
          title="new ending time"
          value={newEndTime}
          onChange={(event) => setNewEndTime(event.target.value)}
        />
    </div>
  );
};

function App() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [currentChild, setCurrentChild] = useState("Amira");
  const [currentView, setCurrentView] = useState("Week");
  const [shadePreviousCells, setShadePreviousCells] = useState(true);
  const [shadePreviousAppointments, setShadePreviousAppointments] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(10000);
  const [showTaskList, setShowTaskList] = useState(false);

  const toggleCurrentChild = () => {
    currentChild === "Amira" ? setCurrentChild("Noora") : setCurrentChild("Amira");
  };

  const toggleTaskList = () => {
    setShowTaskList(!showTaskList);
  };

  const createTasksList = (data: {
    id: number,
    title: string,
    startDate: string,
    endDate?: string,
    recurrenceRule?: string
  }[]) => (
    data.map(dataItem => (
      <div className="tasks" key={dataItem.id}>
        <p className="task-text">{dataItem.title}</p>
        <p>
          Start Time: {
            new Date(dataItem.startDate).toTimeString()
          }
          {dataItem.endDate && `End Time: ${new Date(dataItem.endDate).toTimeString()}`}
        </p>
        {!dataItem.recurrenceRule && dataItem.endDate ?
          <TaskTimer expiryTimestamp={new Date(dataItem.endDate)} />
          : <TaskStopwatch />}
      </div>
    ))
  );

  useEffect(() => {
    if (currentChild === "Amira") {
      setAppointments(appointmentDataAmira);
    } else if (currentChild === "Noora") {
      setAppointments(appointmentDataNoora);
    }
  }, [currentChild]);

  const changeHandler = ({ added, changed, deleted }: ChangeSet) => {
    if (added) {
      const newTaskId = appointments.length > 0 ? appointments[appointments.length - 1].id + 1 : 0;
      setAppointments([...appointments, { ...added as IAppointment, id: newTaskId }]);
    } else if (changed) {
      setAppointments(appointments => (
        appointments.map((appointment: IAppointment): IAppointment => {
          return changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment;
        })
      ));
    } else if (deleted !== undefined) {
      setAppointments(appointments => appointments.filter(appointment => appointment.id !== deleted));
    }
    return { appointments };
  };

  return (
    <div className="scheduler-container">
      <button
        type="button"
        title="Switch Child"
        onClick={toggleCurrentChild}
        className="child-switch-button"
      >
        Toggle Child
      </button>
      <br />

      Shade Previous Cells
      <input
        type="checkbox"
        title="shade previous cells?"
        checked={shadePreviousCells}
        onChange={() => setShadePreviousCells(!shadePreviousCells)}
      />

      Shade Previous Appointments
      <input
        type="checkbox"
        title="shade previous appointments?"
        checked={shadePreviousAppointments}
        onChange={() => setShadePreviousAppointments(!shadePreviousAppointments)}
      />

      Update every:
      <input
        type="number"
        title="time interval"
        onChange={(event) => setUpdateInterval(Number(event.target.value))}
        value={`${updateInterval / 1000}`}
      /> seconds

      <h3 className="task-list-heading">{currentChild}'s Chores</h3>
      <button
        type="button"
        title="toggle task list"
        onClick={toggleTaskList}
        className="task-list-toggle"
      >
        {showTaskList ? "Hide" : "Show"} Task List
      </button>
      <div className={`${showTaskList ? "visible" : "hidden"}`}>
        {currentChild === "Amira" && createTasksList(stringDataAmira)}
        {currentChild === "Noora" && createTasksList(stringDataNoora)}
      </div>
      <Scheduler
        data={appointments}
        height={660}
      >
        <ViewState
          currentViewName={currentView}
          onCurrentViewNameChange={nextViewName => setCurrentView(nextViewName)}
          currentDate={new Date().toDateString()}
        />
        <DayView startDayHour={9} endDayHour={19} />
        <WeekView startDayHour={9} endDayHour={19} />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher
          switcherComponent={CustomViewSwitcher}
        />
        <EditingState onCommitChanges={changeHandler} />
        <IntegratedEditing />
        <Appointments />
        <AppointmentTooltip />
        <AppointmentForm />
        <CurrentTimeIndicator
          shadePreviousCells={shadePreviousCells}
          shadePreviousAppointments={shadePreviousAppointments}
          updateInterval={updateInterval}
          indicatorComponent={TimeIndicator}
        />
      </Scheduler>
    </div>
  );
}

export default App;
