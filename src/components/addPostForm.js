import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useForm } from '../util/hooks';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function AddPostForm() {

    const { values, onSubmit, onChange } = useForm(createPostCallback, {
        body: ""
    });

    const [createPost, { error }] = useMutation(CREATE_POST, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: [result.data.createPost, ...data.getPosts],
                },
            });
            values.body = ""
        }
    })

    function createPostCallback() {
        createPost();
    }

    return (
        <div>
            <Form onSubmit={onSubmit}>
                <h2>Create a Post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi World"
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                    />
                    <Button type="submit" color="teal">Add Post</Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message">
                    <ul>
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

const CREATE_POST = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id body createdAt username 
            likes{
                id username createdAt
            }
            likeCount
            comments{
                id body username createdAt
            }
            commentsCount
        }
    }
`

export default AddPostForm;