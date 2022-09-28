import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import classNames from 'classnames';

import '../../../styles/transaction-history-checkboxes.scss';

/**
 * @class CheckBox
 * @extends {React.PureComponent}
 */
class CheckBox extends React.PureComponent {
  /**
   * @constructor
   * @constructs CheckBox
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.replaceRoute = this.replaceRoute.bind(this);
  }
  /**
   * @returns {undefined}
   */
  replaceRoute() {
    this.props.router.replace(this.props.route);
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="checkbox__container">
        <button // eslint-disable-line
          onClick={this.replaceRoute}
          className={classNames(
            'checkbox dibs-highlight-border',
            this.props.router.location.pathname.includes(this.props.route)
              && 'dibs-highlight-background'
          )}
        />
        <p className="dibs-font">
          {this.props.name}
        </p>
      </div>
    );
  }
}

CheckBox.propTypes = {
  router: PropTypes.shape(),
  name: PropTypes.string,
  route: PropTypes.string,
};

export default withRouter(CheckBox);
