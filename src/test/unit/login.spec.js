import { mount } from '@vue/test-utils';
import Login from '../../components/Login.vue';
import Vue from 'vue';

describe("login.spec.js", () => {
  let cmp, vm;
  cmp = Vue.extend(Login);
  vm = new cmp({
    data: {
      unsuccessfulLogin: true,
      errorMessage: 'unable to login',
      loginData: {
        phoneNumber: '0244111111',
        password: 'Empyre1!',
      }
    }
  }).$mount();

  it('equals loginData.phoneNumber to "0244111111"', () => {
    expect(vm.loginData.phoneNumber).toEqual('0244111111');
  });

  it('equals loginData.password to "Empyre1!"', () => {
    expect(vm.loginData.password).toEqual('Empyre1!');
  });

  it('equals unsuccessfulLogin to true', () => {
    expect(vm.unsuccessfulLogin).toEqual(true);
  })

  it('equals errorMessage to "unable to login"', () => {
    expect(vm.errorMessage).toEqual("unable to login");
  });


})
