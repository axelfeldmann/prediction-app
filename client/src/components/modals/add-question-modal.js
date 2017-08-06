import React from 'react';
import Modal from 'react-modal';

class AddQuestionModal extends React.Component{

  render(){
    const { isOpen, closeFn } = this.props;
    return(
      <Modal isOpen={ isOpen } contentLabel='add question'>
        <div className='add-question-modal'>
          <h1>modal</h1>
          <button onClick={ closeFn }>x</button>
        </div>
      </Modal>
    );
  }

}

export default AddQuestionModal;