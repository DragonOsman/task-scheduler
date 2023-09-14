import { useFormik, FormikConfig, FormikValues, FormikHelpers } from "formik";
import { UserContext } from "src/context/userContext";
import { useContext } from "react";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const formikValues: FormikConfig<FormikValues> = {
    onSubmit: async (values: FormikValues, { setSubmitting }: FormikHelpers<FormikValues>) => {
      setSubmitting(true);

      const user = {
        email: values.email,
        username: values.email,
        password: values.password
      };

      try {
        const response = await fetch("http://localhost:3000/api/users/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        });

        if (response.ok) {
          const data = await response.json();
          dispatch({ type: "SET_CURRENT_USER", payload: data.user });
          navigate("/");
        } else {
          console.error(`Something went wrong. ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error in login request catch block: ${error}`);
      }
    },
    initialValues: {
      email: "",
      password: "",
      username: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("This is a required field"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("This is a required field")
    })
  };

  const formik = useFormik(formikValues);

  return (
    <div className="container-fluid login-form-container">
      <form
        method="post"
        className="register-form container-fluid"
        onSubmit={(event) => {
          event.preventDefault();
          formik.handleSubmit(event);
        }}
      >
        <fieldset className="mb-3">
          <legend>User login form</legend>
          <label htmlFor="email" className="form-label">Email</label>:
          <input
            type="text"
            className="form-control"
            required
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <small className="text-danger">{formik.errors.email as string}</small>
          ) : null}
          <label htmlFor="password" className="form-label">Password</label>:
          <input
            type="password"
            className="form-control"
            required
            {...formik.getFieldProps("password")}
          />
        </fieldset>
        <input type="submit" value="Login" className="btn btn-primary btn-lg" />
        <p>Don&apos;t have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;