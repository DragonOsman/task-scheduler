import "./App.css";
import data from "./data.json";
import { useState, FunctionComponent, MouseEvent, TouchEvent } from "react";
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments,
  Toolbar,
  AppointmentForm,
  AppointmentsProps
} from "@devexpress/dx-react-scheduler-material-ui";
import {
  EditingState,
  ViewState,
  ChangeSet,
  ViewSwitcher,
  IntegratedEditing
} from "@devexpress/dx-react-scheduler";

interface IAppointment {
  AppointmentsProps?: AppointmentsProps,
  id: number;
  text: string;
  startDate: Date;
  endDate: Date;
  recurrenceRule?: string;
};

const stringDataAmira = data["Amira"]["Chores"];
const stringDataNoora = data["Noora"]["Chores"];

const appointmentDataAmira: IAppointment[] = [];
for (const [key, value] of Object.entries(stringDataAmira)) {
  for (const innerValue of Object.keys(value)) {
    const appointment: IAppointment = {
      id: 0,
      text: "",
      startDate: new Date(),
      endDate: new Date()
    };
    key === "text" ? appointment.text = innerValue : appointment.text = "";
    if (key === "startDate" || key === "endDate") {
      const newValue = new Date(innerValue);
      if (key === "startDate") {
        appointment.startDate = newValue;
      } else if (key === "endDate") {
        appointment.endDate = newValue;
      }
    }
    appointment.id = appointmentDataAmira.length > 0 ?
      appointmentDataAmira[appointmentDataAmira.length - 1].id + 1 : 0;
    appointmentDataAmira.push(appointment);
  }
}

const appointmentDataNoora: IAppointment[] = [];
for (const [key, value] of Object.entries(stringDataNoora)) {
  for (const innerValue of Object.keys(value)) {
    const appointment: IAppointment = {
      id: 0,
      text: "",
      startDate: new Date(),
      endDate: new Date()
    };
    key === "text" ? appointment.text = innerValue : appointment.text = "";
    if (key === "startDate" || key === "endDate") {
      const newValue = new Date(innerValue);
      if (key === "startDate") {
        appointment.startDate = newValue;
      } else if (key === "endDate") {
        appointment.endDate = newValue;
      }
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

function App() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [currentChild, setCurrentChild] = useState("Amira");
  const [currentView, setCurrentView] = useState("Week");

  const toggleCurrentChild = () => {
    currentChild === "Amira" ? setCurrentChild("Noora") : setCurrentChild("Amira");
  };

  if (currentChild === "Amira") {
    setAppointments(appointmentDataAmira);
  } else if (currentChild === "Noora") {
    setAppointments(appointmentDataNoora);
  }

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
      >
        Toggle Child
      </button>
      <Scheduler
        data={appointments}
        height={660}
      >
        <ViewState
          currentViewName={currentView}
          onCurrentViewNameChange={(nextViewName) => setCurrentView(nextViewName)}
        />
        <DayView startDayHour={9} endDayHour={19} />
        <WeekView startDayHour={9} endDayHour={19} />
        <MonthView />
        <Toolbar />
        <ViewSwitcher
          switcherComponent={CustomViewSwitcher}
        />
        <EditingState onCommitChanges={changeHandler} />
        <IntegratedEditing />
        <Appointments />
        <AppointmentForm />
      </Scheduler>
    </div>
  );
}

export default App;
