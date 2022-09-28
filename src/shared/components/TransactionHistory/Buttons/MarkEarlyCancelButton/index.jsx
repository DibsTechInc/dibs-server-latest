import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Base';
import CheckBoxIcon from '../../../../graphics/Icons/CheckBoxIcon';

/**
 * @class MarkEarlyCancelButton
 * @extends {React.PureComponent}
 */
class MarkEarlyCancelButton extends React.PureComponent {
  /**
   * @constructor
   * @constructs MarkEarlyCancelButton
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.markEarlyCancel = this.markEarlyCancel.bind(this);
    this.renderModalComponent = this.renderModalComponent.bind(this);
  }
  /**
   * @returns {undefined}
   */
  handleOnClick() {
    this.setState({ modalOpen: true });
  }
  /**
   * @returns {undefined}
   */
  handleModalClose() {
    this.setState({ modalOpen: false });
  }
  /**
   * @returns {undefined}
   */
  async markEarlyCancel() {
    await new Promise(r => this.setState({ modalOpen: false }, r));
    return this.props.markEarlyCancel(this.props.id);
  }
  /**
   * @returns {JSX} modal content component
   */
  renderModalComponent() {
    return (
      <div className="transaction-history__button-modal-content">
        <p>
          {this.props.usedPass ? `This will return use to ${this.props.packageName}.`
            : `This will return ${this.props.creditAmount} in credit`}
        </p>
      </div>
    );
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <Button
        disabled={this.props.disabled}
        onClick={this.handleOnClick}
        loading={this.props.markingEarlyCancel}
        modalHeader="Mark as Early Cancel"
        modalOpen={this.state.modalOpen}
        handleModalClose={this.handleModalClose}
        handleModalSubmit={this.markEarlyCancel}
        renderModalComponent={this.renderModalComponent}
      >
        <CheckBoxIcon checked={this.props.disabled} />
      </Button>
    );
  }
}

MarkEarlyCancelButton.propTypes = {
  id: PropTypes.number,
  disabled: PropTypes.bool,
  markingEarlyCancel: PropTypes.bool,
  markEarlyCancel: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  usedPass: PropTypes.bool,
  packageName: PropTypes.string,
  creditAmount: PropTypes.string,
};

export default MarkEarlyCancelButton;
