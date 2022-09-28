import React from 'react';
import PropTypes from 'prop-types';

import CheckBox from './CheckBox';
import '../../../styles/transaction-history-checkboxes.scss';

/**
 * @class TransactionHistoryCheckBoxes
 * @param {string} value the type in state
 * @param {string} path - name of path route
 * @extends {React.PureComponent}
 */
class TransactionHistoryCheckBoxes extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    const firstColumnRoutes = [
      { name: 'Purchases', route: this.props.routes.purchases },
      { name: 'Available Packs', route: this.props.routes.availablePacks },
      { name: 'Unavailable Packs', route: this.props.routes.unavailablePacks },
      { name: 'Studio Credit', route: this.props.routes.credit },
    ];
    const secondColumnRoutes = [
      { name: 'Upcoming Classes', route: this.props.routes.upcoming },
      { name: 'Past Classes', route: this.props.routes.past },
      { name: 'Dropped Classes', route: this.props.routes.dropped },
      { name: 'Flash Credits', route: this.props.routes.flashCredits },
    ];
    return (
      <div className="checkbox-group__container">
        <div>
          {firstColumnRoutes.map(props =>
            <CheckBox key={props.name} {...props} />)}
        </div>
        <div>
          {secondColumnRoutes.map(props =>
            <CheckBox key={props.name} {...props} />)}
        </div>
      </div>
    );
  }
}

TransactionHistoryCheckBoxes.propTypes = {
  routes: PropTypes.shape({
    purchases: PropTypes.string,
    availablePacks: PropTypes.string,
    unavailablePacks: PropTypes.string,
    credit: PropTypes.string,
    upcoming: PropTypes.string,
    past: PropTypes.string,
    dropped: PropTypes.string,
    flashCredits: PropTypes.string,
  }),
};

export default TransactionHistoryCheckBoxes;
