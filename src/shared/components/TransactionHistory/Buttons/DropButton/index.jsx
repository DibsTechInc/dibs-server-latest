import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ROSE_MAIN, SOLD_OUT_GREY } from '../../../../constants/ColorConstants';
import Button from '../Base';
import XIcon from '../../../../graphics/Icons/XIcon';
// import ModalContent from './ModalContent';
// search for TransactionHistoryDropButton if you need to see original code

const TransactionHistoryDropButton = (props) => {
    const { disabled, refunding, chargeAmount, refunded } = props;
    const [modalOpen, setModalOpen] = React.useState(false);
    const dropClass = async () => {
        await new Promise(() => {
            setModalOpen(false);
        });
        return 0;
    };
    const handleOnClick = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    // const toggleRefundReason = (reason) => setReasonForRefund(reason);

    return (
        <Button
            disabled={disabled}
            onClick={handleOnClick}
            loading={refunding}
            text="DROP"
            modalHeader={`Are you sure you want to drop class ${chargeAmount}?`}
            modalOpen={modalOpen}
            handleModalClose={handleModalClose}
            handleModalSubmit={dropClass}
        >
            {!refunded && <XIcon size={9} strokeWidth={1.25} stroke={ROSE_MAIN} />}
            <span className={classNames('drop-option')}>DROP</span>
        </Button>
    );
};

TransactionHistoryDropButton.propTypes = {
    disabled: PropTypes.bool,
    refunding: PropTypes.bool,
    refundTransaction: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    chargeAmount: PropTypes.string,
    // creditsSpent: PropTypes.string,
    refunded: PropTypes.bool
};

export default TransactionHistoryDropButton;
