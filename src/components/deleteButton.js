import React, { useState } from 'react';
import { Icon, Button, Confirm } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function DeleteButton({ postId, commentId, callback }) {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false);
            if (!commentId) {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: data.getPosts.filter(post => post.id !== postId),
                    },
                });
            }
            if (callback) {
                callback();
            }
        },
        variables: { postId, commentId }
    })

    return (
        <>
            <Button as="div" color="red" onClick={() => setConfirmOpen(true)} floated="right">
                <Icon name="trash" style={{ margin: 0 }} />
            </Button>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => deletePostOrComment()}
            />
        </>
    );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!){
      deleteComment(postId: $postId, commentId: $commentId){
          id
          comments{
              id
              username
              createdAt
              body
          }
          commentsCount

      }
  }
`

export default DeleteButton;