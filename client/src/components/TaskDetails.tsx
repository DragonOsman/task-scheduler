import { ITask } from "../context/taskContext";

interface TaskDetailsProps {
  task: ITask;
}

const TaskDetails = ({ task }: TaskDetailsProps) => {
  return (
    <div className="container text-align-center">
      <h3>Task Details</h3>
      <div className="container-fluid d-flex justify-content-center align-items-center flex-direction-column">
        <table className="task-details-table">
          <tbody>
            {Object.entries(task).map(([key, value]) => {
              if ((key === "scheduled" || key === "flexible") && !value) {
                return null;
              }
              return (
                <tr key={key}>
                  <td>
                    <strong>{key}</strong>
                  </td>
                  <td>
                    {key === "scheduled" && value ? <span>Yes</span> : null}
                    {key === "flexible" && value ? <span>Yes</span> : null}
                    {key !== "scheduled" && key !== "flexible" && String(value)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskDetails;