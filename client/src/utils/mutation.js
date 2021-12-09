import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation addUser(username:String!,email:String!,password:String!) {
    createUser(username: $username, email: $email, password: $password) {
      _id
      username
      email
      password
    }
  }
`;

export const LOGIN = gql`
  mutation createVote($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      _id
      email
      username
      password
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($bookId: ID!) {
    login(bookId: $bookId) {
      _id
      authors
      description
      bookId
      image
      link
      title
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    login(bookId: $bookId) {
      _id
      authors
      description
      bookId
      image
      link
      title
    }
  }
`;