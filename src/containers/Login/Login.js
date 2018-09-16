import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import LoginForm from 'components/LoginForm/LoginForm'
import * as authActions from 'redux/modules/auth'
import * as notifActions from 'redux/modules/notifs'

@connect(state => ({ user: state.auth.user }), { ...notifActions, ...authActions })
@withRouter
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string
    }),
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired
  }

  static defaultProps = {
    user: null
  }

  onLocalLogin = async data => {
    const result = await this.props.login('local', data)
    this.successLogin()
    return result
  }

  successLogin = () => {
    this.props.notifSend({
      message: "You're logged in now !",
      kind: 'success',
      dismissAfter: 2000
    })
  }

  render() {
    const { user, logout } = this.props
    return (
      <div className="container">
        <Helmet title="Login" />
        <h1>Login</h1>
        {!user && (
          <div>
            <LoginForm onSubmit={this.onLocalLogin} />
            <p>This will "log you in" as this user, storing the username in the session of the API server.</p>
          </div>
        )}
        {user && (
          <div>
            <p>You are currently logged in as {user.email}.</p>

            <div>
              <button className="btn btn-danger" onClick={logout}>
                <i className="fa fa-sign-out" /> Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}
