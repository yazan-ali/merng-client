import React, { useEffect, useState } from 'react';
import { Icon, Label, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

function LikeButton({ post: { likeCount, likes, id }, user }) {

    const [like, setLike] = useState(false);

    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLike(true);
        } else {
            setLike(false);
        }
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST, {
        variables: { postId: id },
    });

    const likeButton = user ? (
        like ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
        <Button as={Link} to="/login" color='teal' basic>
            <Icon name='heart' />
        </Button>
    )

    return (
        <Button as='div' labelPosition='right' onClick={likePost}>
            {likeButton}
            <Label basic color='teal' pointing='left'>{likeCount}</Label>
        </Button>
    );
}

const LIKE_POST = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id username
            }
            likeCount
        }
    }
`;

export default LikeButton;