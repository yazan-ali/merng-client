import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useForm } from '../../util/hooks';
import { AuthContext } from '../context/auth';


function Login(props) {

    const [errors, setErrors] = useState({});
    const context = useContext(AuthContext);

    const { onChange, onSubmit, values } = useForm(loginUser, {
        username: "",
        password: "",
    });


    const [login, { loading }] = useMutation(Login_USER, {
        // update(_, data: {login: userData}) {
        update(_, result) {
            context.login(result.data.login);
            props.history.push("/");
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    function loginUser() {
        login();
    }


    return (
        <div className="form-container">
            <h1>Login</h1>
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
                    label='password'
                    placeholder="passwor"
                    name="password"
                    value={values.password}
                    type='password'
                    error={errors.password ? true : false}
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

const Login_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
        username: $username
        password: $password
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;