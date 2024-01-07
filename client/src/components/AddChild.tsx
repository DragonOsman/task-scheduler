import { Child, UserContext } from "src/context/userContext";
import { Modal, Button } from "react-bootstrap";
import { useContext, useState, ChangeEvent } from "react";
import { useFormik, FormikValues } from "formik";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import * as Yup from "yup";

const AddChild = () => {
  const { state, dispatch } = useContext(UserContext);
  const [show, setShow] = useState(true);
  const [modalIndex, setModalIndex] = useState(0);
  const [firstName, setFirstName] = useState("");

  const modalTitles = [{
    placeholders: ["Enter Child's Name"],
    title: "Enter Your Child's Name",
    names: ["firstName"]
  }, {
    placeholders: ["00:00", "12:00"],
    title: `Enter Wake and Sleep Times for ${firstName}`,
    names: ["wakeTime", "sleepTime"]
  }, {
    placeholders: ["00:00", "12:00"],
    title: `Enter Meal Times for ${firstName}`,
    names: ["lunchTime", "dinnerTime"]
  }];

  const formik = useFormik({
    initialValues: {
      firstName: "",
      wakeTime: "",
      dinnerTime: "",
      sleepTime: "",
      breakfastTime: "",
      lunchTime: "",
      isActive: false
    },
    onSubmit: async ({ values }: FormikValues) => {

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
        console.log("Hello from add child submit handler");

        if (response.ok && state.currentUser && state.currentUser.children) {
          const data = await response.json();
          console.log(`data looks like this: ${data}`);

          for (const [key, value] of Object.entries(data)) {
            console.log(`${key}:${value}`);
          }
          dispatch({ type: "EDIT_USER_INFO", payload: {
            ...state.currentUser,
            children: [...state.currentUser.children, data.child]
          } });
          if (state.currentUser.children.length === 1) {
            state.currentUser.children[0].isActive = true;
          } else {
            state.currentUser.children[state.currentUser.children.length - 1].isActive = true;
          }
          navigate("/", { replace: true });
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

  const customHandleChange = (event: ChangeEvent) => {
    const { nodeValue, id } = event.currentTarget;

    if (nodeValue) {
      formik.setFieldValue(id, moment(nodeValue, "HH:mm").toISOString().substring(
        moment(nodeValue, "HH:mm").toISOString().indexOf("T")
      ));
    }
  };

  const modalContents = [
    <fieldset key={modalTitles[0].title}>
      <label htmlFor="firstName" className="form-label">{modalTitles[0].title}</label>
      <input
        type="text"
        className="form-control"
        required
        placeholder={modalTitles[0].placeholders[0]}
        value={firstName}
        onChange={event => setFirstName(event.target.value)}
      />
      {formik.errors.firstName && formik.touched.firstName ? (
        <small className="text-danger">{formik.errors.firstName as string}</small>
      ) : null}
    </fieldset>,
    <fieldset key={modalTitles[1].title}>
      <label htmlFor={modalTitles[1].names[0]} className="form-label">
        Enter Wake Time for Your Child
      </label>
      <input
        type="time"
        aria-label="Time"
        id="wakeTime"
        className="form-control"
        required
        placeholder={modalTitles[1].placeholders[0]}
        {...formik.getFieldProps("wakeTime")}
        onChange={customHandleChange}
      />
      {formik.errors.wakeTime && formik.touched.wakeTime ? (
        <small className="text-danger">{formik.errors.wakeTime as string}</small>
      ) : null}
      <label htmlFor={modalTitles[1].names[1]} className="form-label">
        Enter Sleep Time for Your Child
      </label>
      <input
        type="time"
        aria-label="Time"
        id="sleepTime"
        className="form-control"
        required
        placeholder={modalTitles[1].placeholders[1]}
        {...formik.getFieldProps("sleepTime")}
        onChange={customHandleChange}
      />
      {formik.errors.sleepTime && formik.touched.sleepTime ? (
        <small className="text-danger">{formik.errors.sleepTime as string}</small>
      ) : null}
    </fieldset>,
    <fieldset key={modalTitles[2].title} className="mb-3">
      <label htmlFor={modalTitles[2].names[0]} className="form-label">
          Enter Lunch Time for Your Child
      </label>
      <input
        type="time"
        aria-label="Time"
        id="lunchTime"
        className="form-control"
        required
        placeholder={modalTitles[2].placeholders[0]}
        {...formik.getFieldProps("lunchTime")}
        onChange={customHandleChange}
      />
      {formik.errors.lunchTime && formik.touched.lunchTime ? (
        <small className="text-danger">{formik.errors.lunchTime as string}</small>
      ) : null}
      <label htmlFor={modalTitles[2].names[1]} className="form-label">
          Enter Dinner TIme for Your Child
      </label>
      <input
        type="time"
        aria-label="Time"
        id="dinnerTime"
        className="form-control"
        required
        placeholder={modalTitles[2].placeholders[1]}
        {...formik.getFieldProps("dinnerTime")}
        onChange={customHandleChange}
      />
      {formik.errors.dinnerTime && formik.touched.dinnerTime ? (
        <small className="text-danger">{formik.errors.dinnerTime as string}</small>
      ) : null}
    </fieldset>
  ];

  const navigate = useNavigate();

  return (
    <div className="add-child-form-container container-fluid">
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
      {modalContents.map((_, index) => (
        <Modal
          key={modalTitles[index].title}
          show={modalIndex === index && show}
          onHide={() => setShow(false)}
        >
          <form className="container-fluid" onSubmit={formik.handleSubmit}>
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
                          const answer = confirm(
                            "Are you sure you want to cancel and return to home?",
                          );
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
              {index === modalContents.length - 1 ? (
                <Button
                  type="submit"
                  variant="primary"
                >
                  Add Child
                </Button>
              ) : (
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
              )}
            </Modal.Footer>
          </form>
        </Modal>
      ))}
    </div>
  );
};

export default AddChild;