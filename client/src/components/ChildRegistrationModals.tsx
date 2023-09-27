import { useContext, useState, useEffect, useRef } from "react";
import { UserContext, User } from "src/context/userContext";
import { useTaskContext } from "../context/taskContext";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  Button,
  Modal,
  ModalHeader,
  ModalTitle,
  CarouselItem,
  ModalBody,
  ModalFooter
} from "react-bootstrap";
import { useFormik, FormikValues, getIn } from "formik";
import * as Yup from "yup";

const ChildRegistrationModals = () => {
  const { state, dispatch } = useContext(UserContext);
  const { addTask } = useTaskContext();
  const [showModal, setShowModal] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  const navigate = useNavigate();

  const firstNameRef = useRef<HTMLInputElement>(null);

  const handleSlideToggle = () => {
    if (currentSlide === modalArray.length - 1) {
      setShowDialog(true);
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleModalToggle = () => setShowModal(!showModal);

  const modalArray = [
    {
      label: "Name",
      textInputTitle: "Enter your child's name",
      textInputNames: ["firstName"]
    },
    {
      label: "Username and Password",
      textInputTitle: `Choose a username and password for ${firstNameRef.current?.value}`,
      textInputNames: ["username", "password"]
    },
    {
      label: "Wake and Sleep Times",
      textInputTitle: `Enter wake and sleep times for ${firstNameRef.current?.value}`,
      textInputNames: ["wakeupTime", "sleepTime"]
    },
    {
      label: ``,
      textInputTitle: `Enter meal times for ${firstNameRef.current?.value}`,
      textInputNames: ["breakfastTime", "lunchTime", "dinnerTime"]
    }
  ];

  const initialValues: User = {
    firstName: "",
    lastName: state.currentUser ? state.currentUser.lastName : undefined,
    username: "",
    password: "",
    confirmPassword: "",
    parents: state.currentUser ? [state.currentUser] : undefined,
    dateRegistered: new Date(),
    wakeTime: new Date(),
    breakfastTime: new Date(),
    lunchTime: new Date(),
    dinnerTime: new Date(),
    sleepTime: new Date(),
    role: "child"
  };

  const handleSubmit = async (values: FormikValues) => {
    const child: User = {
      firstName: values.firstName,
      lastName: state.currentUser ? state.currentUser.lastName : values.lastName,
      username: values.username,
      password: values.password,
      confirmPassword: values.confirmPassword,
      parents: state.currentUser ? [state.currentUser] : values.parents,
      dateRegistered: values.dateRegistered,
      wakeTime: values.wakeTime,
      breakfastTime: values.breakfastTime,
      lunchTime: values.lunchTime,
      dinnerTime: values.dinnerTime,
      sleepTime: values.sleepTime,
      role: "child",
    };

    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(child)
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: "ADD_USER",
          payload: data.user
        });
        if (state.currentUser && state.currentUser.children) {
          state.currentUser.children.push(data.user);
        }
        navigate("/");

        setCurrentSlide(0);
        setShowDialog(false);
      } else {
        console.error(`${response.status}:${response.statusText}`);
      }
    } catch (err) {
      console.error(`Couldn't register your child: ${err}`);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, "Must be at most 20 characters")
        .required("This is a required field"),
      username: Yup.string()
        .matches(/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$|^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)
        .required("This is a required field"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("This is a requried field"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("This is a required field")
    })
  });

  interface CreateItemProps {
    label: string;
    textInputTitle: string;
    textInputNames: string[];
  }

  const CreateItem = ({ label, textInputTitle, textInputNames }: CreateItemProps) => {
    return (
      <Modal
        show={showModal}
        onHide={handleModalToggle}
        onShow={handleModalToggle}
        animation={false}
      >
        <ModalHeader closeButton>
          <i className="fa-solid fa-angle-left" onClick={() => {
            if (currentSlide !== 0) {
              setCurrentSlide(currentSlide - 1);
            }
          }}></i>
          <ModalTitle>
            <h2>
              {textInputTitle}:
            </h2>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {textInputNames.map(textInputName => (
            <div className="mb-3 container-fluid" key={textInputName}>
              <label htmlFor={textInputName} className="form-label">{label}</label>
              <input
                type="text"
                title={textInputTitle}
                className="form-control"
                required
                ref={textInputName === "firstName" ? firstNameRef : null}
                {...formik.getFieldProps(`${textInputName}`)}
              />
              {getIn(formik.errors, textInputName) && getIn(formik.touched, textInputName) ? (
                <small className="text-danger">{getIn(formik.errors, textInputName)}</small>
              ) : null}
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            title="next slide"
            className="btn btn-secondary"
            onClick={handleSlideToggle}
          >
            Next
          </button>
        </ModalFooter>
      </Modal>
    );
  };

  useEffect(() => {
    const addToTasksArray = async () => {
      if (state.currentUser && state.currentUser.children) {
        for (const child of state.currentUser.children) {
          for (const [key, value] of Object.entries(child)) {
            if (key === "wakeTime" || key === "breakfastTime"
            || key === "lunchTime" || key === "dinnerTime"
            || key === "sleepTime") {
              const startDate = new Date();
              const [hourStr, minuteStr] = value.split(":");
              startDate.setHours(parseInt(hourStr));
              startDate.setMinutes(parseInt(minuteStr));

              let endDate;
              if (key === "wakeTime") {
                endDate = new Date();
                endDate.setHours(startDate.getHours());
                endDate.setMinutes(startDate.getMinutes() + 10);
              } else if (key === "lunchTime" || key === "dinnerTime") {
                endDate = new Date();
                endDate.setHours(startDate.getHours() + 1);
                endDate.setMinutes(0);
              }

              if (key === "breakfastTime") {
                endDate = undefined;
              }

              try {
                const response = await fetch("http://localhost:3000/api/tasks/add-task", {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    title: key.substring(0, key.indexOf("T"))
                      .charAt(0)
                      .toUpperCase() + key
                      .substring(0, key.indexOf("T"))
                      .slice(1)
                    ,
                    startDate: new Date(value),
                    endDate: new Date(value),
                    text: key.substring(0, key.indexOf("T")),
                    start: new Date(value),
                    end: new Date(value),
                    startTime: value,
                    endTime: value,
                    timer: "",
                    time: value,
                    scheduled: true,
                    flexible: false,
                    isCompleted: false,
                    isRecurring: true,
                    daysRecurring: ["Sunday", "Monday", "Tuesday", "Wednesday",
                      "Thursday", "Friday", "Saturday"],
                    rRule: "FREQ=DAILY,INTERVAL=1,BYDAY=SU,MO,TU,WE,TU,FR,SA"
                  })
                });

                if (response.ok) {
                  const data = await response.json();
                  addTask(data.task);
                } else {
                  console.error(`${response.status}: ${response.statusText}`);
                }
              } catch (err) {
                console.error(`Something went wrong: ${err}`);
              }
            }
          }
        }
      }
    };
    addToTasksArray();
  }, [state.currentUser, addTask]);

  return (
    <Carousel>
      <form
        method="post"
        className="child-registration-form container-fluid"
        onSubmit={event => {
          event.preventDefault();
          formik.handleSubmit(event);
        }}
      >
        <fieldset className="mb-3">
          <legend>Setup your child&apos;s profile</legend>
          {modalArray.map(modal => (
            <CarouselItem key={modal.textInputNames.reduce(name => name)}>
              key={modal.textInputNames}
              <CreateItem
                key={modal.textInputNames.reduce(name => name)}
                label={modal.label}
                textInputTitle={modal.textInputTitle}
                textInputNames={modal.textInputNames}
              />
            </CarouselItem>
          ))}
        </fieldset>
        <input type="submit" value="Register Child" className="btn btn-primary" />
      </form>
      {showDialog && (
        <Modal show={showDialog} onHide={() => setShowDialog(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Submit Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to submit the form now or go back and make changes?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Go Back
            </Button>
            <Button variant="primary" onClick={formik.submitForm}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Carousel>
  );
};

export default ChildRegistrationModals;