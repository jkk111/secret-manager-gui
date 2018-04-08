import React from 'react';
import './Modal.css'

let prefix = (prefix, base) => `${prefix}-${base} ${base}`

let Modal = ({ children, close, className = '', open = true }) => {
  let modal_class = prefix(className, 'modal');

  if(open) {
    modal_class += ' modal-opened'
  } else {
    modal_class += ' modal-closed'
  }

  let modal_background_class = prefix(className, 'modal-background');
  let modal_content_class = prefix(className, 'modal-content');
  return <div className={modal_class}>
    <div className={modal_background_class} onClick={close}></div>
    <div className={modal_content_class}>{children}</div>
  </div>
}

export default Modal;
