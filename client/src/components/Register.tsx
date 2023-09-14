import { useFormik, FormikConfig, FormikValues, FormikHelpers } from "formik";
import { UserContext, User } from "src/context/userContext";
import { useContext } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const formikValues: FormikConfig<FormikValues> = {
    onSubmit: async (values: FormikValues, { setSubmitting }: FormikHelpers<FormikValues>) => {
      setSubmitting(true);

      const user: User = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role
      };

      try {
        const response = await fetch("http://localhost:3000/api/users/register", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
          mode: "cors"
        });

        setSubmitting(false);
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: "ADD_USER", payload: data.user });
          navigate("/");
        } else {
          console.error(`Something went wrong: ${response.statusText}; ${response.status}`);
        }
      } catch (error) {
        console.error(`Error registering user: ${error}`);
      }
    },
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, "Must be at most 20 characters")
        .required("This is a required field"),
      lastName: Yup.string()
        .max(20, "Must be at most 20 characters")
        .required("This is a required field"),
      email: Yup.string()
        .email("Invalid email address")
        .required("This is a required field"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("This is a required field"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("This is a required field"),
      role: Yup.string()
        .oneOf(["parent", "child"], "Please select a role")
        .required("This is a required field")
    })
  };

  const formik = useFormik(formikValues);

  return (
    <div className="container-fluid register-form-container">
      <form
        method="post"
        className="register-form container-fluid"
        onSubmit={(event) => {
          event.preventDefault();
          formik.handleSubmit(event);
        }}
      >
        <fieldset className="mb-3">
          <legend>Parent registration form</legend>
          <label className="form-label" htmlFor="firstName">First name:</label>
          <input
            type="text"
            className="first-name form-control form-control-lg"
            placeholder="Please your first name"
            required
            {...formik.getFieldProps("firstName")}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <small className="text-danger">{formik.errors.firstName as string}</small>
          ) : null}
          <label className="form-label" htmlFor="lastName">Last name:</label>
          <input
            type="text"
            className="last-name form-control form-control-lg"
            placeholder="Please enter your last name"
            required
            {...formik.getFieldProps("lastName")}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <small className="text-danger">{formik.errors.lastName as string}</small>
          ) : null}
          <label className="form-label" htmlFor="email">Email:</label>
          <input
            type="email"
            className="email form-control form-control-lg"
            placeholder="Please enter your email address"
            required
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <small className="text-danger">{formik.errors.email as string}</small>
          ) : null}
          <label className="form-label" htmlFor="password">Password:</label>
          <input
            type="password"
            className="password form-control form-control-lg"
            placeholder="Please choose a (strong) password"
            required
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <small className="text-danger">{formik.errors.password as string}</small>
          ) : null}
          <label className="form-label" htmlFor="confirmPassword">Confirm password:</label>
          <input
            type="password"
            className="confirm-password form-control form-control-lg"
            placeholder="Please re-enter the password"
            required
            {...formik.getFieldProps("confirmPassword")}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <small className="text-danger">{formik.errors.confirmPassword as string}</small>
          ) : null}
          <div className="form-check">
            <input
              type="radio"
              title="role parent option"
              className="form-check-input"
              {...formik.getFieldProps("role")}
              value="parent"
            />
            <label htmlFor="parent-role" className="form-label">Parent</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              title="role child option"
              className="form-check-input"
              {...formik.getFieldProps("role")}
              value="child"
            />
            <label htmlFor="child-role" className="form-label">Child</label>
            {formik.touched.role && formik.errors.role ? (
              <small className="text-danger">{formik.errors.role as string}</small>
            ) : null}
          </div>
        </fieldset>
        <input type="submit" value="Register" className="btn btn-primary btn-lg" />
      </form>
    </div>
  );
};

export default Register;