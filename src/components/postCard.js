import React, { useContext } from 'react';
import { Card, Icon, Label, Button, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { AuthContext } from './context/auth';
import LikeButton from './likeButton';
import DeleteButton from './deleteButton';

function PostCard({ post: { body, createdAt, username, id, comments, commentsCount, likes, likeCount } }) {

    const { user } = useContext(AuthContext);

    return (
        <div>
            <Card fluid>
                <Card.Content>
                    <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                    />
                    <Card.Header>{username}</Card.Header>
                    <Card.Meta as={Link} to={`/post/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{body}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <LikeButton user={user} post={{ likes, likeCount, id }} />
                    <Button labelPosition="right" as={Link} to={`/post/${id}`}>
                        <Button as='div' labelPosition='right'>
                            <Button color='blue' basic>
                                <Icon name='comments' />
                            </Button>
                            <Label basic color='blue' pointing='left'>{commentsCount}</Label>
                        </Button>
                    </Button>
                    {user && user.username === username && (
                        <DeleteButton postId={id} />
                    )}
                </Card.Content>
            </Card>
        </div>
    );
}

export default PostCard;