import React, { useContext, useState, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Form, Grid } from 'semantic-ui-react';
import { Card, Icon, Label, Button, Image } from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from '../likeButton';
import { AuthContext } from '../context/auth';
import { Link } from 'react-router-dom';
import DeleteButton from '../deleteButton';


function SinglePost(props) {

    const { user } = useContext(AuthContext);
    const [comment, setComment] = useState("");

    const commentInputRef = useRef(null);

    const postId = props.match.params.id;

    const { loading, data } = useQuery(FETCH_POST_QUERY, {
        variables: { postId }
    });

    const [createComment] = useMutation(CREATE_COMMENT_MUTAION, {
        update() {
            setComment("");
            commentInputRef.current.blur();
        },
        variables: { postId, body: comment }
    });

    const deleteCallback = () => {
        props.history.push("/");
    }

    let postMarkup;

    if (loading) {
        postMarkup = <p>Loading post...</p>
    } else {
        const { id, body, createdAt, username, likeCount, likes, commentsCount, comments } = data.getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            floate='right'
                            size='small'
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{user.username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <LikeButton user={user} post={{ likes, likeCount, id }} />
                                <Button labelPosition="right" as={Link} to={`/post/${id}`}>
                                    <Button onClick={() => console.log("Commented")} as='div' labelPosition='right'>
                                        <Button color='blue' basic>
                                            <Icon name='comments' />
                                        </Button>
                                        <Label basic color='blue' pointing='left'>{commentsCount}</Label>
                                    </Button>
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deleteCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment.."
                                                name="comment"
                                                value={comment}
                                                onChange={(evt) => { setComment(evt.target.value) }}
                                                ref={commentInputRef}
                                            />
                                            <button
                                                type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ""}
                                                onClick={createComment}
                                            >
                                                Submit
                                        </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {
                            comments.map(comment => (
                                <Card fluid key={comment.id}>
                                    <Card.Content>
                                        {user && user.username === comment.username && (
                                            <DeleteButton postId={id} commentId={comment.id} />
                                        )}
                                        <Card.Header>{comment.username}</Card.Header>
                                        <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                        <Card.Description>{comment.body}</Card.Description>
                                    </Card.Content>
                                </Card>
                            ))
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup
}

const CREATE_COMMENT_MUTAION = gql`
  mutation createComment($postId: ID!, $body: String!){
      createComment(postId: $postId, body: $body){
          id
          comments{
              id body username createdAt
          }
          commentsCount
      }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentsCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;


// import React, { useContext } from 'react';
// import { useQuery } from '@apollo/client';
// import { gql } from '@apollo/client';
// import { Grid } from 'semantic-ui-react';
// import { Card, Icon, Label, Button, Image } from 'semantic-ui-react';
// import moment from 'moment';
// import LikeButton from '../likeButton';
// import { AuthContext } from '../context/auth';
// import { Link } from 'react-router-dom';
// import DeleteButton from '../deleteButton';


// function SinglePost(props) {

//     const { user } = useContext(AuthContext);

//     const postId = props.match.params.id;
//     // <LikeButton user={user} post={{ likes, likeCount, id }} />

//     const { loading, data } = useQuery(FETCH_POST_QUERY, {
//         variables: { postId }
//     });

//     const deleteCallback = () => {
//         props.history.push("/");
//     }


//     return (
//         !data.getPost ?
//             <p>Loading post...</p>
//             : (
//                 <Grid>
//                     <Grid.Row>
//                         <Grid.Column width={2}>
//                             <Image
//                                 floate='right'
//                                 size='small'
//                                 src='https://react.semantic-ui.com/images/avatar/large/molly.png'
//                             />
//                         </Grid.Column>
//                         <Grid.Column width={10}>
//                             <Card fluid>
//                                 <Card.Content>
//                                     <Card.Header>{user.username}</Card.Header>
//                                     <Card.Meta>{moment(data.getPost.createdAt).fromNow()}</Card.Meta>
//                                     <Card.Description>{data.getPost.body}</Card.Description>
//                                 </Card.Content>
//                                 <Card.Content extra>
//                                     <Button labelPosition="right" as={Link} to={`/post/${data.getPost.id}`}>
//                                         <Button onClick={() => console.log("Commented")} as='div' labelPosition='right'>
//                                             <Button color='blue' basic>
//                                                 <Icon name='comments' />
//                                             </Button>
//                                             <Label basic color='blue' pointing='left'>{data.getPost.commentsCount}</Label>
//                                         </Button>
//                                     </Button>
//                                     {user && user.username === data.getPost.username && (
//                                         <DeleteButton postId={data.getPost.id} callback={deleteCallback} />
//                                     )}
//                                 </Card.Content>
//                             </Card>
//                         </Grid.Column>
//                     </Grid.Row>
//                 </Grid>
//                 // <>
//                 //     {console.log(data.getPost)}
//                 // </>
//             )
//     )
// }

// const FETCH_POST_QUERY = gql`
//   query($postId: ID!) {
//     getPost(postId: $postId) {
//       id
//       body
//       createdAt
//       username
//       likeCount
//       likes {
//         username
//       }
//       commentsCount
//       comments {
//         id
//         username
//         createdAt
//         body
//       }
//     }
//   }
// `;

// export default SinglePost;