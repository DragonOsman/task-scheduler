import { User } from "../context/userContext";
import { useTaskContext } from "../context/taskContext";
import {
  Scheduler,
  DayView,
  ViewState,
  Appointments,
  AllDayPanel
} from "@devexpress/dx-react-scheduler";

interface ChildScheduleProps {
  child: User;
}

const ChildSchedule = ({ child }: ChildScheduleProps) => {
  const { tasks } = useTaskContext();

  const ChildScheduleRoot = () => {
    return <ChildSchedule child={child} />;
  };

  const DayViewLayout = () => {
    return (
      <div className="container-fluid">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Appointment</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.startTime} - {task.endTime}</td>
                <td>{task.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const TimeScaleLabel = () => {
    return (
      <span className="time-scale-label">Time Scale</span>
    );
  };

  const TimeScaleLayout = () => {
    const startTime = new Date();
    startTime.setHours(7, 0, 0);

    const endTime = new Date();
    endTime.setHours(21, 0, 0);

    const timeIntervals: Date[] = [];

    while (startTime <= endTime) {
      timeIntervals.push(new Date(startTime));
      startTime.setTime(startTime.getTime() + 60 * 60 * 1000);
    }

    return (
      <tbody>
        {timeIntervals.map((interval, index) => (
          <tr key={tasks[index].text}>
            {interval.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </tr>
        ))}
      </tbody>
    );
  };

  const TimeScaleTickCell = () => {
    return (
      <div className="time-scale-ticks container">
        {tasks.map(task => <span key={task.text}>{task.text}</span>)}
      </div>
    );
  };

  const DayScaleLayout = () => {
    const currentDayAppointments = tasks.filter(task => {
      return (
        task.startDate <= new Date() && task.endDate >= new Date()
      );
    });

    return (
      <div className="day-scale-layout container-fluid">
        {currentDayAppointments.map(appointment => (
          <div
            key={appointment.text}
            className={`appointment ${appointment.flexible ? "flexible" : ""}`}
          >
            {appointment.text}
          </div>
        ))}
      </div>
    );
  };

  const DayScaleEmptyCell = () => {
    return (
      <div className="empty-cell"></div>
    );
  };

  const TimeTableLayout = () => {
    return (
      <div className="container-fluid">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Appointment</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.text}>
                <td>{task.startTime} - {task.endTime}</td>
                <td>{task.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  interface DayScaleCellProps {
    startDate: Date;
  }

  const DayScaleCell = ({ startDate }: DayScaleCellProps) => {
    const formattedDate = startDate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric"
    });

    return (
      <div className="day-scale-cell">
        {formattedDate}
      </div>
    );
  };

  const DayScaleRow = () => {
    const formattedDate = tasks.map(task => {
      return task.startDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
      });
    });

    return (
      <div className="day-scale-row">
        {formattedDate.map(date => (
          <span key={date} className="time">{date}</span>
        ))}
      </div>
    );
  };

  const TimeTableCell = () => {
    return (
      tasks.map(task => (
        <tr key={task.text} className="time-table-cell">
          <td>{task.scheduled && " Scheduled"}</td>
          <td>{task.flexible && " Flexible"}</td>
          <td>{task.isRecurring && " Recurring"}</td>
          <td>{task.isRecurring && task.daysRecurring?.map(day => (
            <span key={day}>{day}</span>
          ))}</td>
        </tr>
      ))
    );
  };

  const TimeTableRow = () => {
    return (
      tasks.map(task => (
        <tr className="time-table-row" key={task.text}>
          <td>Day of Week: {task.startDate.getDay()}</td>
        </tr>
      ))
    );
  };

  const AppointmentLayer = () => {
    return (
      <div className="appointment-layer">
        {tasks.map(task => {
          for (const [key, value] of Object.entries(task)) {
            return <p key={key}>{value.toString()}</p>;
          }
        }
        )}
      </div>
    );
  };

  const AppointmentContent = () => {
    return (
      <div className="container-fluid">
        {tasks.map(task => (
          <p className="appointment-info" key={task._id}>
            {task.text}
            {`${task.startTime} - ${task.endTime}`}
          </p>
        ))}
      </div>
    );
  };

  const AppointmentComponent = () => {
    return (
      <>
        <AppointmentContent />
      </>
    );
  };

  const AppointmentContainer = () => {
    return (
      <div className="container-fluid">
        <AppointmentComponent />
      </div>
    );
  };

  const SplitIndicator = () => {
    return (
      <div className="split-indicator">
        <i className="fa-solid fa-arrows-split-up-and-left"></i>
      </div>
    );
  };

  const RepeatIcon = () => {
    return (
      <div className="repeat-icon">
        <i className="fa-solid fa-repeat"></i>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      <h2>{child.firstName}&apos;s Schedule</h2>
      <Scheduler
        rootComponent={ChildScheduleRoot}
        data={tasks}
        locale="en-US"
        height={500}
        firstDayOfWeek={0}
      >
        <ViewState currentDate={new Date()} />
        <DayView
          layoutComponent={DayViewLayout}
          timeScaleLabelComponent={TimeScaleLabel}
          timeScaleLayoutComponent={TimeScaleLayout}
          timeScaleTickCellComponent={TimeScaleTickCell}
          dayScaleLayoutComponent={DayScaleLayout}
          dayScaleEmptyCellComponent={DayScaleEmptyCell}
          timeTableLayoutComponent={TimeTableLayout}
          dayScaleCellComponent={DayScaleCell}
          dayScaleRowComponent={DayScaleRow}
          timeTableCellComponent={TimeTableCell}
          timeTableRowComponent={TimeTableRow}
          appointmentLayerComponent={AppointmentLayer}
        />
        <Appointments
          appointmentComponent={AppointmentComponent}
          appointmentContentComponent={AppointmentContent}
          splitIndicatorComponent={SplitIndicator}
          recurringIconComponent={RepeatIcon}
          containerComponent={AppointmentContainer}
        />
      </Scheduler>
    </div>
  );
};

export default ChildSchedule;