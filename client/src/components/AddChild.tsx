import { Child, UserContext } from "src/context/userContext";
import { Modal, Button } from "react-bootstrap";
import { useContext, useState, useRef, SyntheticEvent } from "react";
import { useFormik, FormikValues } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const AddChild = () => {
  const { state, dispatch } = useContext(UserContext);
  const [show, setShow] = useState(true);
  const [modalIndex, setModalIndex] = useState(0);
  const [wakeTime, setWakeTime] = useState("00:00 AM");
  const [lunchTime, setLunchTime] = useState("00:00 PM");
  const [dinnerTime, setDinnerTime] = useState("00:00 PM");
  const [sleepTime, setSleepTime] = useState("00:00 PM");

  const firstNameRef = useRef<HTMLInputElement>(null);

  const modalTitles = [{
    placeholders: ["Enter Child's Name"],
    title: "Enter Your Child's Name",
    names: ["firstName"]
  }, {
    placeholders: ["00:00 AM", "00:00 PM"],
    title: `Enter Wake and Sleep Times for ${firstNameRef.current && firstNameRef.current.value}`,
    names: ["wakeTime", "sleepTime"]
  }, {
    placeholders: ["00:00 PM", "00:00 PM"],
    title: `Enter Meal Times for ${firstNameRef.current && firstNameRef.current.value}`,
    names: ["lunchTime", "dinnerTime"]
  }];

  const formik = useFormik({
    initialValues: {
      firstName: "",
      wakeTime: new Date(),
      dinnerTime: new Date(),
      sleepTime: new Date(),
      breakfastTime: new Date(),
      lunchTime: new Date(),
      isActive: false
    },
    onSubmit: async ({ values }: FormikValues) => {
      const newWakeTime = new Date();
      const [wakeHoursStr, wakeMinutesStr] = wakeTime.split(":");
      const wakeHours = parseInt(wakeHoursStr);
      const wakeMinutes = parseInt(wakeMinutesStr);
      newWakeTime.setHours(wakeHours);
      newWakeTime.setMinutes(wakeMinutes);

      const newLunchTime = new Date();
      const [lunchHoursStr, lunchMinutesStr] = lunchTime.split(":");
      const lunchHours = parseInt(lunchHoursStr);
      const lunchMinutes = parseInt(lunchMinutesStr);
      newLunchTime.setHours(lunchHours);
      newLunchTime.setMinutes(lunchMinutes);

      const newDinnerTime = new Date();
      const [dinnerHoursStr, dinnerMinutesStr] = dinnerTime.split(":");
      const dinnerHours = parseInt(dinnerHoursStr);
      const dinnerMinutes = parseInt(dinnerMinutesStr);
      newDinnerTime.setHours(dinnerHours);
      newDinnerTime.setMinutes(dinnerMinutes);

      const newSleepTime = new Date();
      const [sleepHoursStr, sleepMinutesStr] = sleepTime.split(":");
      const sleepHours = parseInt(sleepHoursStr);
      const sleepMinutes = parseInt(sleepMinutesStr);
      newSleepTime.setHours(sleepHours);
      newSleepTime.setMinutes(sleepMinutes);

      values.wakeTime = newWakeTime;
      values.lunchTime = newLunchTime;
      values.dinnerTime = newDinnerTime;
      values.sleepTime = newSleepTime;

      const child: Child = {
        firstName: values.firstName,
        dinnerTime: values.dinnerTime,
        wakeTime: values.wakeTime,
        sleepTime: values.sleepTime,
        breakfastTime: values.wakeTime,
        lunchTime: values.lunchTime,
        isActive: false
      };

      try {
        const response = await fetch(
          "http://localhost:3000/api/users/add-child", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(child)
          })
        ;

        if (response.ok && state.currentUser && state.currentUser.children) {
          const data = await response.json();
          dispatch({ type: "EDIT_USER_INFO", payload: {
            ...state.currentUser,
            children: [...state.currentUser.children, data.child]
          } });
          if (state.currentUser.children.length === 1) {
            state.currentUser.children[0].isActive = true;
          } else {
            state.currentUser.children[state.currentUser.children.length - 1].isActive = true;
          }
          navigate("/");
        } else if (!response.ok) {
          console.error(`${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        console.error(`Something went wrong ${err}`);
      }
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, "Must be at most 20 characters")
        .required("This is a required field"),
      wakeTime: Yup.string()
        .required("This is a required field"),
      sleepTime: Yup.string()
        .required("This is a required field"),
      lunchTime: Yup.string()
        .required("This is a required field"),
      dinnerTime: Yup.string()
        .required("This is a required field")
    })
  });

  const modalContents = [
    <fieldset key={modalTitles[0].title}>
      <label htmlFor="firstName" className="form-label">{modalTitles[0].title}</label>
      <input
        type="text"
        className="form-control"
        required
        placeholder={modalTitles[0].placeholders[0]}
        ref={firstNameRef}
        {...formik.getFieldProps("firstName")}
      />
      {formik.errors.firstName && formik.touched.firstName ? (
        <small className="text-danger">{formik.errors.firstName as string}</small>
      ) : null}
    </fieldset>,
    <fieldset key={modalTitles[1].title}>
      <label htmlFor={modalTitles[1].names[0]} className="form-label">
        Enter Wake Time for {firstNameRef.current ? firstNameRef.current.value : ""}
      </label>
      <input
        type="text"
        className="form-control"
        required
        placeholder={modalTitles[1].placeholders[0]}
        {...formik.getFieldProps("wakeTime")}
        value={wakeTime}
        onChange={(event) => setWakeTime(event.target.value)}
      />
      {formik.errors.wakeTime && formik.touched.wakeTime ? (
        <small className="text-danger">{formik.errors.wakeTime as string}</small>
      ) : null}
      <label htmlFor={modalTitles[1].names[1]} className="form-label">
        Enter Sleep Time for {firstNameRef.current ? firstNameRef.current.value : ""}
      </label>
      <input
        type="text"
        className="form-control"
        required
        placeholder={modalTitles[1].placeholders[1]}
        {...formik.getFieldProps("sleepTime")}
        value={sleepTime}
        onChange={(event) => setSleepTime(event.target.value)}
      />
      {formik.errors.sleepTime && formik.touched.sleepTime ? (
        <small className="text-danger">{formik.errors.sleepTime as string}</small>
      ) : null}
    </fieldset>,
    <>
      <fieldset key={modalTitles[2].title} className="mb-3">
        <label htmlFor={modalTitles[2].names[0]} className="form-label">
          Enter Lunch Time for {firstNameRef.current ? firstNameRef.current.value : ""}
        </label>
        <input
          type="text"
          className="form-control"
          required
          placeholder={modalTitles[2].placeholders[0]}
          {...formik.getFieldProps("lunchTime")}
          value={lunchTime}
          onChange={(event) => setLunchTime(event.target.value)}
        />
        {formik.errors.lunchTime && formik.touched.lunchTime ? (
          <small className="text-danger">{formik.errors.lunchTime as string}</small>
        ) : null}
        <label htmlFor={modalTitles[2].names[1]} className="form-label">
          Enter Dinner TIme for {firstNameRef.current ? firstNameRef.current.value : ""}
        </label>
        <input
          type="text"
          className="form-control"
          required
          placeholder={modalTitles[2].placeholders[1]}
          {...formik.getFieldProps("dinnerTime")}
          value={dinnerTime}
          onChange={(event) => setDinnerTime(event.target.value)}
        />
        {formik.errors.dinnerTime && formik.touched.dinnerTime ? (
          <small className="text-danger">{formik.errors.dinnerTime as string}</small>
        ) : null}
      </fieldset>
      <input
        type="submit"
        value="Add Child"
        title="add child"
        className="btn btn-secondary"
      />
    </>,
  ];

  const navigate = useNavigate();

  return (
    <div className="add-child-form-container container-fluid">
      <form
        method="post"
        className="container-fluid"
        onSubmit={(event: SyntheticEvent<HTMLFormElement>) => {
          event.preventDefault();
          formik.handleSubmit(event);
        }}
      >
        <div className="container-fluid row">
          <div className="col-auto">
            <i
              className="fa-solid fa-angle-left icon-button"
              onClick={() => {
                navigate("/");
              }}
            ></i>
          </div>
          <div className="col-auto">
            <h2>Set up Your Child&apos;s Profile</h2>
          </div>
        </div>
        {modalContents.map((item, index) => (
          <Modal
            key={modalTitles[index].title}
            show={modalIndex === index}
            onHide={() => setShow(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <div className="container-fluid row">
                  <div className="col-auto">
                    <button
                      title="go back"
                      type="button"
                      onClick={() => {
                        if (index > 0) {
                          setModalIndex(index - 1);
                        } else if (index === 0) {
                          const answer =
                          confirm("Are you sure you want to cancel and return to home?");
                          if (answer) {
                            navigate("/");
                          }
                        }
                      }}
                      className="icon-button"
                    >
                      <i className="fa-solid fa-angle-left"></i>
                    </button>
                  </div>
                  <div className="col-auto">
                    <h2>{modalTitles[index].title}</h2>
                  </div>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalContents[modalIndex]}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  if (index !== modalContents.length - 1) {
                    setModalIndex(index + 1);
                  }
                }}
                disabled={index === modalContents.length - 1}
              >
                Next
              </Button>
            </Modal.Footer>
          </Modal>
        ))}
      </form>
    </div>
  );
};

export default AddChild;