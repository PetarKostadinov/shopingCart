import { createContext, useReducer } from 'react'

export const Store = createContext();

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    productsOnList: localStorage.getItem('productsOnList') ? JSON.parse(localStorage.getItem('productsOnList')) : [],

    cart: {
        shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {},
        paymentMethod: localStorage.getItem('paymentName') ? JSON.parse(localStorage.getItem('paymentName')) : '',
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
    }
};

function reducer(state, action) {
    switch (action.type) {
        case 'CART_ADD_ITEM':
            //add to cart
            const newItem = action.payload;
            const exists = state.cart.cartItems.find((x) => x._id === newItem._id);

            const cartItems = exists ?
                state.cart.cartItems.map((x) => x._id === exists._id ?
                    newItem : x)
                : [...state.cart.cartItems, newItem];

            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            return { ...state, cart: { ...state.cart, cartItems } };

        case 'CART_REMOVE_ITEM': {
            const cartItems = state.cart.cartItems.filter((item) => item._id !== action.payload._id);

            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            return { ...state, cart: { ...state.cart, cartItems } };
        };
        case 'CART_CLEAR':
            return { ...state, cart: { ...state.cart, cartItems: [] } };
        case 'USER_LOGIN':
            return { ...state, userInfo: action.payload };
        case 'USER_REGISTER':
            return { ...state, userInfo: action.payload };
        case 'USER_LOGOUT':
            return { ...state, userInfo: null, cart: { cartItems: [], shippingInfo: {}, paymentMethod: '', productsOnList: {} }, localStorage: {} };
        case 'SAVE_SHIPPING_INFO':
            return {
                ...state, cart: { ...state.cart, shippingInfo: action.payload }
            };
        case 'SAVE_PAYMENT_METHOD':
            return {
                ...state, cart: { ...state.cart, paymentMethod: action.payload }
            };
        case 'PRODUCT_CREATE':
            
            const newProduct = action.payload;
            const productsOnList = [...state.productsOnList, newProduct]
            localStorage.setItem('productsOnList', JSON.stringify(productsOnList))
        
            return { ...state, productsOnList };
        default:
            return state;
    }
}

function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children} </Store.Provider>
}

export default StoreProvider;
