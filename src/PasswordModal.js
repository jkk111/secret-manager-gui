import React from 'react';
import Modal from './Modal'
import './PasswordModal.css'

let form_submit = (cb) => (e) => {
  e.preventDefault();
  let password = e.target.password.value;
  e.target.reset();
  if(cb) cb(password);
}

let PasswordModal = ({ file = null, submit, close, open = false }) => {
  return <Modal className='password' close={close} open={open}>
    <div>
      <div className='password-prompt'>Please Enter Password For Store: "{file}"</div>
      <form onSubmit={form_submit(submit)} autoComplete='off'>
        <input autoFocus autoComplete='off' className='password-input' type='password' name='password' />
        <button className='password-submit'>Submit</button>
      </form>
    </div>
  </Modal>
}

export default PasswordModal;
