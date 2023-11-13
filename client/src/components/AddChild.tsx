import { Child, UserContext } from "src/context/userContext";
import { Modal, Button } from "react-bootstrap";
import { useContext, useState, useRef, useEffect, SyntheticEvent } from "react";
import { useFormik, FormikValues } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import moment from "moment";

const AddChild = () => {
  const { state, dispatch } = useContext(UserContext);
  const [show, setShow] = useState(true);
  const [modalIndex, setModalIndex] = useState(0);

  const navigate = useNavigate();

  const firstNameRef = useRef<HTMLInputElement>();

  const initialValues = {
    firstName: "",
    wakeTime: new Date(),
    dinnerTime: new Date(),
    sleepTime: new Date(),
    breakfastTime: new Date(),
    lunchTime: new Date(),
    isActive: false
  };

  const handleSubmit = async ({ values }: FormikValues) => {
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
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, "Must be at most 20 characters")
        .required("This is a required field"),
      wakeTime: Yup.date()
        .transform((value, originalValue) => {
          const date = moment(originalValue, "MM/DD/YYYY, HH:mm:ss a", true);
          return date.isValid() ? date.toDate() : null;
        })
        .required("This is a required field"),
      sleepTime: Yup.date()
        .transform((value, originalValue) => {
          const date = moment(originalValue, "MM/DD/YYYY, HH:mm:ss a", true);
          return date.isValid() ? date.toDate() : null;
        })
        .required("This is a required field"),
      lunchTime: Yup.date()
        .transform((value, originalValue) => {
          const date = moment(originalValue, "MM/DD/YYYY, HH:mm:ss a", true);
          return date.isValid() ? date.toDate() : null;
        })
        .required("This is a required field"),
      dinnerTime: Yup.date()
        .transform((value, originalValue) => {
          const date = moment(originalValue, "MM/DD/YYYY, HH:mm:ss a", true);
          return date.isValid() ? date.toDate() : null;
        })
        .required("This is a required field")
    })
  });

  const modalTitles = useRef<{
    placeholders: string[];
    title: string;
    names: string[];
  }[]>([]);
  const modalContentsRef = useRef<JSX.Element[]>([]);
  useEffect(() => {
    if (firstNameRef.current) {
      modalTitles.current = [{
        placeholders: ["Enter Child's Name"],
        title: "Enter Your Child's Name",
        names: ["firstName"]
      }, {
        placeholders: ["Enter Wake Time", "Enter Sleep Time"],
        title: `Enter Wake and Sleep Times for ${firstNameRef.current.value}`,
        names: ["wakeTime", "sleepTime"]
      }, {
        placeholders: ["Enter Lunch Time", "Enter Dinner Time"],
        title: `Enter Meal Times for ${firstNameRef.current.value}`,
        names: ["lunchTime", "dinnerTime"]
      }, {
        placeholders: ["Add Child"],
        title: "Add Child",
        names: ["submit"]
      }];
    }

    if (modalTitles.current && modalTitles.current.length > 0) {
      modalContentsRef.current = [
        <fieldset key={modalTitles.current[0].title}>
          <label htmlFor="firstName" className="form-label">{modalTitles.current[0].title}</label>
          <input
            type="text"
            className="form-control"
            required
            placeholder={modalTitles.current[0].placeholders[0]}
            {...formik.getFieldProps("firstName")}
          />
          {formik.errors.firstName && formik.touched.firstName ? (
            <small className="text-danger">{formik.errors.firstName}</small>
          ) : null}
        </fieldset>,
        <fieldset key={modalTitles.current[1].title}>
          <label htmlFor={modalTitles.current[1].names[0]} className="form-label">
            Enter Wake Time for {firstNameRef.current ? firstNameRef.current.value : ""}
          </label>
          <input
            type="time"
            className="form-control"
            required
            placeholder={modalTitles.current[1].placeholders[0]}
            {...formik.getFieldProps("wakeTime")}
          />
          <label htmlFor={modalTitles.current[1].names[1]} className="form-label">
            Enter Sleep Time for {firstNameRef.current ? firstNameRef.current.value : ""}
          </label>
          <input
            type="time"
            className="form-control"
            required
            placeholder={modalTitles.current[1].placeholders[1]}
            {...formik.getFieldProps("sleepTime")}
          />
        </fieldset>,
        <fieldset key={modalTitles.current[2].title} className="mb-3">
          <label htmlFor={modalTitles.current[2].names[0]} className="form-label">
            Enter Lunch Time for {firstNameRef.current ? firstNameRef.current.value : ""}
          </label>
          <input
            type="time"
            className="form-control"
            required
            placeholder={modalTitles.current[2].placeholders[0]}
            {...formik.getFieldProps("lunchTime")}
          />
          <label htmlFor={modalTitles.current[2].names[1]} className="form-label">
            Enter Dinner TIme for {firstNameRef.current ? firstNameRef.current.value : ""}
          </label>
          <input
            type="time"
            className="form-control"
            required
            placeholder={modalTitles.current[2].placeholders[1]}
            {...formik.getFieldProps("dinnerTime")}
          />
        </fieldset>,
        <input
          key={modalTitles.current[3].names[0]}
          type="submit"
          value="Add Child"
          className="btn-secondary"
        />
      ];
    }
  }, [formik]);

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
        {modalContentsRef.current.map((outerItem, outerIndex) => {
          return modalTitles.current.map(innerItem => (
            <Modal
              key={innerItem.title}
              show={show}
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
                          if (outerIndex > 0) {
                            setModalIndex(outerIndex - 1);
                          } else if (outerIndex === 0) {
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
                      <h2>{innerItem.title}</h2>
                    </div>
                  </div>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {modalContentsRef.current[modalIndex]}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (outerIndex !== modalContentsRef.current.length - 1) {
                      setModalIndex(outerIndex + 1);
                    }
                  }}
                >
                  Next
                </Button>
              </Modal.Footer>
            </Modal>
          ));
        })}
      </form>
    </div>
  );
};

export default AddChild;