import React from 'react';
import AddQuestionModal from '../modals/add-question-modal';

class LeagueContent extends React.Component{

  constructor(props){
    super(props);
    this.state = { modalIsOpen: false };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderModal = this.renderModal.bind(this);
  }

  openModal(){
    this.setState({ modalIsOpen: true });
  }

  closeModal(){
    this.setState({ modalIsOpen: false });
  }

  renderModal(){
    return (
      <AddQuestionModal
        closeFn={ this.closeModal }
        isOpen={ this.state.modalIsOpen }
      />
    );
  }

  render(){
    return (
      <div className='league-content'>
        { this.renderModal() }
        <button onClick={ this.openModal } className='plus-button'>+</button>
      </div>
    );
  }

}

export default LeagueContent;