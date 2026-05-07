import React from 'react';
import ReactDOM from 'react-dom';
import { FiX } from 'react-icons/fi';

const Modal = ({ open, onClose, title, children, width = '560px' }) => {
  if (!open) return null;

  const modal = (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: width }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="btn btn-g btn-ic" onClick={onClose}><FiX size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default Modal;