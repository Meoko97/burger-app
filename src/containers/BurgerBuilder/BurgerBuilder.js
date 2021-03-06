import React, { Component, Fragment } from "react";

import Burger from "../../components/Burger/Burger";
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7,
};

class BurgerBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredients: null,
            totalPrice: 4,
            purchaseable: false,
            purchasing: false,
            loading: false,
            error: false, 
        }
    }  

    componentDidMount () {
        axios.get('https://react-my-burger-ff67c-default-rtdb.europe-west1.firebasedatabase.app/Ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            }).catch(error => {
                this.setState({ error: true});
            });
    }

    updatePurchaseState() {
        const ingredients = {
            ...this.state.ingredients
        };
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]>0?true:false;
            })
            .reduce((sum, el) => {
                return (sum||el)?true:false;
            }, 0);

        return sum;
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updateCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updateCount;
        
        const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice
        });
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        
        if(oldCount <=0) return;

        const updateCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updateCount;
        
        const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice
        });
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        // alert('You continue!');
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Daniel Garcia',
                address: {
                    street: 'Calle Bilbao',
                    zipCode: '04007',
                    country: 'Spain'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }

        axios.post('/orders.json', order)
            .then(response => {
                this.setState( {loading:false, purchasing: false} );
            })
            .catch(error => {
                this.setState( {loading:false, purchasing: false} );
            });

    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        }

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? 
                        <p>Ingredients can't be loaded!</p>
                        :
                        <Spinner/>;

        if (this.state.ingredients) {
            burger = (
                <Fragment>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls 
                        price={this.state.totalPrice}
                        ingredientAdded={this.addIngredientHandler} 
                        ingredientRemove={this.removeIngredientHandler}
                        disable={disabledInfo}
                        purchasable={this.updatePurchaseState()}
                        ordered={this.purchaseHandler}
                        />
                </Fragment>
            );
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
            />;
        }

        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        return (
            <Fragment>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
            {burger}
            </Fragment>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);