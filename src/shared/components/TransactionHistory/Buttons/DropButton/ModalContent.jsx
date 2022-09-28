import React from 'react';
import PropTypes from 'prop-types';

import ModalCheckboxOption from '../../../Modal/CheckboxOption';

/**
 * @class TransactionHistoryDropButtonModalContent
 * @extends {React.PureComponent}
 */
class ModalContent extends React.PureComponent {
    /**
     * render
     * @returns {JSX.Element} HTML
     */
    render() {
        return (
            <div className="transaction-history__button-modal-content">
                <ModalCheckboxOption
                    text={
                        this.props.usedPass
                            ? `Early cancel, return use to ${this.props.packageName}`
                            : `Early cancel, return ${this.props.creditAmount} in credit`
                    }
                    onClick={this.props.toggleEarlyDrop}
                    checked={this.props.earlyDrop}
                />
                {this.props.showLateCancelOption && (
                    <ModalCheckboxOption
                        text={
                            this.props.usedPass
                                ? `Late cancel, do not return use to ${this.props.packageName}`
                                : 'Late cancel, do not return credit'
                        }
                        onClick={this.props.toggleEarlyDrop}
                        checked={!this.props.earlyDrop}
                    />
                )}
                <p>Please note that this will drop the client from all spots in the class.</p>
                <p>
                    Once a class is early dropped, it cannot be refunded. If you’d prefer to refund the booking, simply search
                    &quot;Purchases&quot; for transaction {this.props.transactionId} and click &quot;Refund&quot;.
                </p>
            </div>
        );
    }
}

ModalContent.propTypes = {
    earlyDrop: PropTypes.bool,
    toggleEarlyDrop: PropTypes.func,
    usedPass: PropTypes.bool,
    packageName: PropTypes.string,
    creditAmount: PropTypes.string,
    transactionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    showLateCancelOption: PropTypes.bool
};

export default ModalContent;
