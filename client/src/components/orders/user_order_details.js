import React from 'react';
import { connect } from 'react-redux';
import { getUserOrderDetails } from '../../actions';
import OrderDetails from './order_details';

class UserOrderDetails extends React.Component {
    componentDidMount() {
        const { orderId } = this.props;
        this.props.getUserOrderDetails(orderId);
    }

    render() {
        if (this.props.orderDetails) {

            return (
                <OrderDetails orderDetails={this.props.orderDetails} orderType="User" />
            )
        }

        return (
            <div className="center" >
                <h1>Order Details Loading...</h1>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return ({
        orderId: state.orders.orderId,
        orderDetails: state.orders.details
    })
}

export default connect(mapStateToProps, {
    getUserOrderDetails: getUserOrderDetails
})(UserOrderDetails);