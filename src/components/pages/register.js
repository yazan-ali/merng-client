import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useForm } from '../../util/hooks';
import { AuthContext } from '../context/auth';


function Register(props) {

    const [errors, setErrors] = useState({});
    const context = useContext(AuthContext);

    const initialState = {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    }

    const { onChange, onSubmit, values } = useForm(registerUser, initialState);

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, result) {
            context.login(result.data.register);
            props.history.push("/");
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    function registerUser() {
        addUser();
    }

    return (
        <div className="form-container">
            <h1>Register</h1>
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
                <Form.Input
                    onChange={onChange}
                    label='username'
                    placeholder="usrname"
                    name="username"
                    value={values.username}
                    type='text'
                    error={errors.username ? true : false}
                />
                <Form.Input
                    onChange={onChange}
                    label='email'
                    placeholder="email"
                    name="email"
                    value={values.email}
                    type='email'
                    error={errors.email ? true : false}
                />
                <Form.Input
                    onChange={onChange}
                    label='password'
                    placeholder="passwor"
                    name="password"
                    value={values.password}
                    type='password'
                    error={errors.password ? true : false}
                />
                <Form.Input
                    onChange={onChange}
                    label='confirm password'
                    placeholder="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    type='password'
                    error={errors.confirmPassword ? true : false}
                />
                <Button color='teal'>Submit</Button>
            </Form>
            {
                Object.keys(errors).length > 0 && (
                    <div className="ui error message">
                        <ul className="list">
                            {Object.values(errors).map(err => (
                                <li key={err}>{err}</li>
                            )
                            )}
                        </ul>
                    </div>
                )
            }
        </div>
    )
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;