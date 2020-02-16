import React from 'react';
import { connect } from 'react-redux';
import { getGuestOrderDetails } from '../../actions';
import { queryToObject } from '../../helpers';
import OrderDetails from './order_details';

class GuestOrderDetails extends React.Component {
    componentDidMount() {
        const { location, match: { params } } = this.props
        const orderId = params.order_id;
        const query = queryToObject(location.search);
        const { email } = query;
        this.props.getGuestOrderDetails(orderId, email);
    }

    render() {
        if (this.props.orderDetails) {
            return (
                <OrderDetails orderDetails={this.props.orderDetails} orderType={"Guest"} />
            )
        }

        return (
            <div className="center">
                <h1>Guest Order Details Loading...</h1>
            </div >
        )
    }
}

function mapStateToProps(state) {
    return ({
        orderDetails: state.orders.details
    })
}

export default connect(mapStateToProps, {
    getGuestOrderDetails: getGuestOrderDetails
})(GuestOrderDetails);