import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ROSE_MAIN, SOLD_OUT_GREY } from '../../../../constants/ColorConstants';
import { TransactionRefundReasons } from '../../../../constants/TransactionHistoryConstants';
import Button from '../Base';
// import ModalContent from './ModalContent';
import XIcon from '../../../../graphics/Icons/XIcon';

const EditPackageButton = (props) => {
    const { disabled, refunding, chargeAmount, refunded } = props;
    const [modalOpen, setModalOpen] = React.useState(false);
    const [reasonForRefund, setReasonForRefund] = React.useState(TransactionRefundReasons.REQUESTED_BY_CUSTOMER);
    const refundTransaction = async () => {
        const { refundTransaction, id } = props;
        await new Promise(() => {
            setModalOpen(false);
        });
        return refundTransaction(id, reasonForRefund);
    };
    const handleOnClick = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    // const toggleRefundReason = (reason) => setReasonForRefund(reason);

    return (
        <div className="edit-package-button">
            <Button
                disabled={disabled}
                onClick={handleOnClick}
                loading={refunding}
                text="EDIT"
                modalHeader={`Are you sure you want to refund ${chargeAmount}?`}
                modalOpen={modalOpen}
                handleModalClose={handleModalClose}
                handleModalSubmit={refundTransaction}
            >
                <span className={classNames('edit')}>...</span>
            </Button>
        </div>
    );
};

EditPackageButton.propTypes = {
    id: PropTypes.number,
    disabled: PropTypes.bool,
    refunding: PropTypes.bool,
    refundTransaction: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    chargeAmount: PropTypes.string,
    // creditsSpent: PropTypes.string,
    refunded: PropTypes.bool
};

export default EditPackageButton;
