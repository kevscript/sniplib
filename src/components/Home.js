import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { handleUser, getData } from '../actions'

import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

import { userExistsInDatabase } from '../config/fire'

import ListsBar from './ListsBar'
import Modal from './Modal'
import SnipsBar from './SnipsBar'
import Main from './Main'
import ConfirmModal from './ConfirmModal'
import Login from './Login'

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
`

const Home = ({ lists, user, snippets, handleUser, getData }) => {
  const { modalOpen } = lists
  const { userInfo } = user

  const authListener = () => {
    firebase.auth().onAuthStateChanged(async user => {
      // 
      localStorage.setItem('authUser', JSON.stringify(user));
      handleUser(user)
      console.log('handling user')
      if (user) {
        const userExists = await userExistsInDatabase(user.uid)
        console.log('user uid: ', user.uid || 'no user uid')
        if (userExists) {
          getData()
          console.log('user exists in the database, get data')
        } else {
          firebase.database().ref('users/' + user.uid).set({
            lists: [{ name: 'sandbox', createdAt: Date.now(), selected: true }], 
            snippets: []
          }, (err) => console.log(err))

          console.log('no user loged, added new user')
        }
      }
    }, () => {
      localStorage.removeItem('authUser');
      handleUser(null)
    })
  }

  useEffect(() => { authListener() }, [])

  if (userInfo) {
    return (
      <Container>
        <ListsBar />
        <SnipsBar />
        <Main />
        {modalOpen && <Modal />}
        {lists.confirmModalOpen && <ConfirmModal type="list"/>}
        {snippets.confirmModalOpen && <ConfirmModal type="snippet"/>}
      </Container>
    )
  } else {
    return (
      <Login />
    )
  }
}

const mapStateToProps = state => ({
  lists: state.lists,
  user: state.user,
  snippets: state.snippets
})

const mapDispatchToProps = {
  handleUser,
  getData
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
