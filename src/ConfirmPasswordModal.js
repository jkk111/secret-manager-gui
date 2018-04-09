import React from 'react';
import Modal from './Modal'
import './PasswordModal.css'

let form_submit = (cb) => (e) => {
  e.preventDefault();
  let password = e.target.password.value;
  let confirm = e.target.confirm.value;
  e.target.reset();
  if(cb) cb({ password, confirm });
}

let PasswordModal = ({ file = null, submit, close, open = false, invalid }) => {
  let invalid_warning = null;
  if(invalid) {
    invalid = <div className='warn'>
      Passwords Did Not Match, Try Again
    </div>
  }
  return <Modal className='password' close={close} open={open}>
    <div>
      <div className='password-prompt'>Please Enter Password For Store: "{file}"</div>
      <form onSubmit={form_submit(submit)}>
        {invalid}
        <input className='password-input' type='password' name='password' placeholder='Password' />
        <input className='password-input' type='password' name='confirm' placeholder='Confirm Password'/>
        <button className='password-submit'>Submit</button>
      </form>
    </div>
  </Modal>
}

export default PasswordModal;
