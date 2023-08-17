import "./App.css";
import { useState, FunctionComponent } from "react";
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
  AppointmentsProps: AppointmentsProps,
  id: number;
  text: string;
  startDate: Date;
  endDate: Date;
  recurrenceRule?: string;
}

interface CustomSwitcherProps {
  onChange: (view: string) => void;
}

const CustomViewSwitcher: FunctionComponent<CustomSwitcherProps> =
  ({ onChange }: CustomSwitcherProps) => {
  return (
    <>
      <button
        type="button"
        title="switch to week view"
        onClick={() => onChange("Week")}
      >
        Week
      </button>
      <button
        type="button"
        title="switch to day view"
        onClick={() => onChange("Day")}
      >
        Day
      </button>
      <button
        type="button"
        title="switch to month view"
        onClick={() => onChange("Month")}
      >
        Month
      </button>
    </>
  );
};

function App() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [currentView, setCurrentView] = useState("Week");

  const changeHandler = ({ added, changed, deleted }: ChangeSet) => {
    if (added) {
      const newTaskId = appointments.length > 0 ? appointments[appointments.length - 1].id + 1 : 0;
      setAppointments([...appointments, { ...added as IAppointment, id: newTaskId }]);
    } else if (changed) {
      setAppointments(appointments.map((appointment: IAppointment): IAppointment => {
        return changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment;
      }));
    } else if (deleted !== undefined) {
      setAppointments(appointments.filter(appointment => appointment.id !== deleted));
    }
    return { appointments };
  };

  return (
    <div>
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
