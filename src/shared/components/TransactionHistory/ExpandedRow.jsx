import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import '../../styles/transaction-history-expanded-row.scss';

/**
 * @class TransactionHistoryTableExpandedRow
 * @extends {React.PureComponent}
 */
class TransactionHistoryTableExpandedRow extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="transaction-history__expanded-row-content">
        <div className="transaction-history__expanded-row-summary">
          {this.props.passid ? (
            <div className="heading dibs-highlight-border dibs-font-heavy">
              <Link to={this.props.getPackBreakdownRoute(this.props.passid)}>
                {this.props.summary.heading}
              </Link>
            </div>
          ) : (
            <div className="heading dibs-highlight-border dibs-font-heavy">
              {this.props.summary.heading}
            </div>)}
          {this.props.summary.items.map(item => (
            <div className="item dibs-font" key={item}>
              {item}
            </div>))}
        </div>
        <div className="transaction-history__expanded-row-breakdown">
          <div className="total dibs-font-heavy">
            <div>
              Total:
            </div>
            <div>
              {this.props.breakdown.total}
            </div>
          </div>
          {this.props.breakdown.items.map(({ label, value }) => (
            <div className="item dibs-font" key={`${label}-${value}`}>
              <div>
                {label}:
              </div>
              <div>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

TransactionHistoryTableExpandedRow.propTypes = {
  passid: PropTypes.number,
  getPackBreakdownRoute: PropTypes.func,
  heading: PropTypes.string,
  summary: PropTypes.shape({
    heading: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string),
  }),
  breakdown: PropTypes.shape({
    total: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
  }),
};

export default TransactionHistoryTableExpandedRow;
