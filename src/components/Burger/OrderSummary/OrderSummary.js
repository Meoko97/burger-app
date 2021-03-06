import React, { Component, Fragment } from 'react';

import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
    UNSAFE_componentWillUpdate() {
        console.log('[OrderSummary.js] WillUpdate');
    }

    render () {

        const ingredientSummary = Object.keys(this.props.ingredients)
        .map((igKey) => {
            return (
                <li key={igKey}>
                    <span stye={{ textTransform: 'capitalize' }}>
                        {igKey}
                    </span>
                    : {this.props.ingredients[igKey]}
                </li>
            );
        })

        return(
            <Fragment>
                <h3>Your order</h3>
                <p>A delicious burger with the following ingrediets:</p>
                <ul>
                    {ingredientSummary}
                </ul>
                <p>
                    <strong>
                        Total Price: {this.props.price.toFixed(2)}
                    </strong>
                </p>
                <p>
                    Continue to Checkout?
                </p>
                <Button btnType='Danger' clicked={this.props.purchaseCanceled}>CANCEL</Button>
                <Button btnType='Success' clicked={this.props.purchaseContinued}>CONTINUE</Button>
            </Fragment>
        );
    }
    
};

export default OrderSummary;
