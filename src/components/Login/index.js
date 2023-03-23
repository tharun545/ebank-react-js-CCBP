import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    userIdInput: '',
    passwordInput: '',
    errorMsg: '',
    showErrorMsg: false,
    userInputError: false,
    passwordInputError: false,
  }

  getUserErrorMsg = e => {
    if (e.target.value === '') {
      this.setState({userInputError: true})
    } else {
      this.setState({userInputError: false})
    }
  }

  getPassWordErrorMsg = e => {
    if (e.target.value === '') {
      this.setState({passwordInputError: true})
    } else {
      this.setState({passwordInputError: false})
    }
  }

  getUserInput = e => {
    this.setState({userIdInput: e.target.value})
  }

  getPinInput = e => {
    this.setState({passwordInput: e.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onClickSubmit = async event => {
    event.preventDefault()
    const {userIdInput, passwordInput} = this.state
    const userDetails = {userIdInput, passwordInput}
    const options = {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://apis.ccbp.in/ebank/login', options)
    const data = await response.json()
    console.log(data.jwt_token)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.errorMsg)
    }
  }

  render() {
    const {
      userIdInput,
      userInputError,
      passwordInputError,
      passwordInput,
      showErrorMsg,
      errorMsg,
    } = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-main-container">
        <div className="login-card">
          <div className="login-image-card">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="login-image"
            />
          </div>
          <div className="login-credential-card">
            <h1 className="login-credential-heading">Welcome Back!</h1>
            <form className="form-control" onSubmit={this.onClickSubmit}>
              <label htmlFor="userid">User ID</label>
              <input
                type="text"
                id="userid"
                placeholder="Enter User ID"
                value={userIdInput}
                onChange={this.getUserInput}
                onBlur={this.getUserErrorMsg}
              />
              <label htmlFor="password">PIN</label>
              <input
                type="password"
                id="password"
                placeholder="Enter PIN"
                value={passwordInput}
                onChange={this.getPinInput}
                onBlur={this.getPassWordErrorMsg}
              />
              <button type="submit" className="login-btn">
                Login
              </button>
              {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
              {userInputError ? (
                <p className="error-msg">Invalid User ID</p>
              ) : null}
              {passwordInputError ? (
                <p className="error-msg">Invalid PIN</p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
