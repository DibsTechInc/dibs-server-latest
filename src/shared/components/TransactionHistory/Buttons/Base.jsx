import React from 'react';
import PropTypes from 'prop-types';

// import Modal from '../../Modal';
// import DibsLoader from '../../DibsLoader';

import '../../../styles/transaction-history-button.scss';

/**
 * @class TransactionHistoryButton
 * @extends {React.PureComponent}
 */
class TransactionHistoryButton extends React.PureComponent {
    /**
     * render
     * @returns {JSX.Element} HTML
     */
    render() {
        const { loading, disabled, onClick, children } = this.props;
        const loadingtext = 'Loading...';
        return (
            <div className="transaction-history__button">
                {loading ? (
                    { loadingtext }
                ) : (
                    <button type="button" disabled={disabled} onClick={onClick}>
                        {children}
                    </button>
                )}
            </div>
        );
    }
}

TransactionHistoryButton.propTypes = {
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element), PropTypes.any]),
    disabled: PropTypes.bool
    // renderModalComponent: PropTypes.func,
    // modalOpen: PropTypes.bool,
    // handleModalClose: PropTypes.func,
    // handleModalSubmit: PropTypes.func,
    // modalHeader: PropTypes.string
};

export default TransactionHistoryButton;
