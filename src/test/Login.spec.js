// use vue-test-utils boilerplate to do some of the setting ups
import { shallowMount } from '@vue/test-utils'
import Login from '../components/Login.vue';
import Vue from 'vue';

describe('Login.vue', () => {
  // check if Component renders
  test("will render 'Login' component successfully", () => {
    const wrapper = shallowMount(Login)
    // debugger
    const loginHeader = wrapper.find('.login-header')
    expect(loginHeader.text()).toContain('MyPasel')
  })
  // check if sign up button is rendered successfully
  test("will render register button successfully", () => {
    const wrapper = shallowMount(Login)
    const registerBtn = wrapper.find('#btn-signup')
    expect(registerBtn.text()).toBe('Register')
  })
  // check if error message renders if unsuccessfulLogin is true
  test('will render error message if login is not successful', () => {
    const errorMessage = 'some error here'
    const unsuccessfulLogin = true
    const wrapper = shallowMount(Login, {
      data(){
        return {
          errorMessage: errorMessage,
          unsuccessfulLogin: unsuccessfulLogin,
        }
       }
    })
    // check if the span tag appears on unsuccessfulLogin using its span html tag
    const span = wrapper.find('span')
    // check the error message display
    expect(span.text()).toBe(errorMessage)
  })
  // test if error message gets lost on successful login using its span html tag
  test('will dismiss error message on successful login', () => {
    const unsuccessfulLogin = false
    const wrapper = shallowMount(Login, {
      data(){
        return {unsuccessfulLogin : unsuccessfulLogin}
      }
    })
    expect(wrapper.find('span').exists()).toBe(false)
  })
  // test that register button will trigger the createNewAccount method if clicked
  test('will trigger "createNewAccount" method', () => {
    const $registerMethod = {
      createNewAccount: jest.fn()
    }
     const wrapper = shallowMount(Login, {
       mocks: {
         $registerMethod
       }
     })
     const registerBtn = wrapper.find('#btn-signup')
     wrapper.setMethods({createNewAccount: $registerMethod.createNewAccount})
     registerBtn.trigger('click')
     expect($registerMethod.createNewAccount).toHaveBeenCalled()
  })
  // test that login button will trigger the login method if clicked
  test('will trigger "login" method', () => {
    const $loginMethod = {
      login: jest.fn()
    }
    const wrapper = shallowMount(Login, {
      mocks: {
        $loginMethod
      }
    })
    const loginBtn = wrapper.find("#login")
    wrapper.setMethods({login: $loginMethod.login})
    wrapper.find("form").trigger("submit.prevent")
    expect($loginMethod.login).toHaveBeenCalled()
  })
  // test phone number input field
  test('will expect phone number to be "0244111111"', () => {
    const wrapper = shallowMount(Login)
    const phoneNumber = '0244111111'
    wrapper.setData({
      loginData: {
        phoneNumber: phoneNumber
      }
    })
    expect(wrapper.vm.loginData.phoneNumber).toBe('0244111111')
  })
  // test password input field
  test('will expect password to be "12345"', () => {
    const wrapper = shallowMount(Login)
    const password = '12345'
    wrapper.setData({
      loginData: {
        password: password
      }
    })
    expect(wrapper.vm.loginData.password).toBe('12345')
  })
  // // test successful login routing to request delivery
  // test('will make api call to login api', async () => {
  //
  //
  // })
})
