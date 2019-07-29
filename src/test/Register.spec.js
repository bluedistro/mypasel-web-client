import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import Register from '../pages/Register.vue';
import VeeValidate from 'vee-validate';
import VueRouter from "vue-router";
import Login from '../pages/Login.vue';
import Vue from 'vue';

const localVue = createLocalVue();

describe('Register.vue', () => {
  // test that register component renders successfully
  it('will render "Register"', () => {
    localVue.use(VeeValidate);
    localVue.use(VueRouter);
    const wrapper = shallowMount(Register, {
        localVue,
        sync: false
    })
    const registerWelcomeNote = wrapper.find('.register-heading')
    expect(registerWelcomeNote.text()).toContain('Welcome onboard to MyPasel')
  })
  // test that login button redrects to login
  it('will route to login page', () => {
    localVue.use(VueRouter);
    Vue.use(VueRouter);
    const loginRoute = {name: 'Login', path: '/', component: Login}
    const router = new VueRouter({ loginRoute })
    const wrapper= shallowMount(Register, {
      localVue,
      router,
      sync: false
    })
    const loginBtn = wrapper.find(".loginBtn")
    loginBtn.trigger('click')
    router.push("/")
    expect(wrapper.find(Register).exists()).toBe(false)
  })
})
