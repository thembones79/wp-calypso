/** @format */

/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import Dropdown from 'woocommerce/woocommerce-services/components/dropdown';
import { getPaperSizes } from 'woocommerce/woocommerce-services/lib/pdf-label-utils';
import FormSectionHeading from 'components/forms/form-section-heading';
import {
	closeReturnDialog,
	updatePaperSize,
} from 'woocommerce/woocommerce-services/state/shipping-label/actions';
import {
	isLoaded,
	getShippingLabel,
} from 'woocommerce/woocommerce-services/state/shipping-label/selectors';
import RateSelector from './label-purchase-modal/rates-step/rate-selector';

const ReturnDialog = props => {
	const { orderId, siteId, returnDialog, paperSize, storeOptions, labelId, translate } = props;

	const onClose = () => props.closeReturnDialog( orderId, siteId );
	const onConfirm = () => {};
	const onPaperSizeChange = value => props.updatePaperSize( orderId, siteId, value );

	const buttons = [
		{ action: 'cancel', label: translate( 'Cancel' ), onClick: onClose },
		{
			action: 'confirm',
			onClick: onConfirm,
			isPrimary: true,
			disabled: returnDialog && returnDialog.isFetching,
			additionalClassNames: returnDialog && returnDialog.isFetching ? 'is-busy' : '',
			label: translate( 'Print' ),
		},
	];

	return (
		<Dialog
			isVisible={ Boolean( returnDialog && returnDialog.labelId === labelId ) }
			onClose={ onClose }
			buttons={ buttons }
			additionalClassNames="label-return-modal woocommerce wcc-root"
		>
			<FormSectionHeading>{ translate( 'Create return shipping label' ) }</FormSectionHeading>
			<RateSelector
				id={ 'return_rates' }
				siteId={ siteId }
				orderId={ orderId }
				packageId={ 'return' }
			/>
			<Dropdown
				id={ 'paper_size' }
				valuesMap={ getPaperSizes( storeOptions.origin_country ) }
				title={ translate( 'Paper size' ) }
				value={ paperSize }
				updateValue={ onPaperSizeChange }
			/>
		</Dialog>
	);
};

ReturnDialog.propTypes = {
	siteId: PropTypes.number.isRequired,
	orderId: PropTypes.number.isRequired,
	returnDialog: PropTypes.object,
	paperSize: PropTypes.string.isRequired,
	storeOptions: PropTypes.object.isRequired,
	labelId: PropTypes.number,
	closeReturnDialog: PropTypes.func.isRequired,
	updatePaperSize: PropTypes.func.isRequired,
};

const mapStateToProps = ( state, { orderId, siteId } ) => {
	const loaded = isLoaded( state, orderId, siteId );
	const shippingLabel = getShippingLabel( state, orderId, siteId );
	return {
		returnDialog: loaded ? shippingLabel.returnDialog : {},
		paperSize: shippingLabel.paperSize,
		storeOptions: loaded ? shippingLabel.storeOptions : {},
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators( { closeReturnDialog, updatePaperSize }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( localize( ReturnDialog ) );