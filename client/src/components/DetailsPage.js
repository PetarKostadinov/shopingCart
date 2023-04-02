import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

import getError from '../util';
import LoadingComponent from './LoadingComponent';
import MessageComponent from './MessageComponent';
import Rating from './Rating';
import { Store } from './Store';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

function ProductScreen() {
    const navigate = useNavigate();

    const params = useParams();
    const { id } = params;

    const [{ loading, error, product }, dispatch] = useReducer(reducer, {

        product: [],
        loading: true,
        error: ''
    });
////
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`/api/products/_id/${id}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
                ctxDispatch({ type: 'FETCH_SUCCESS_DETAILS', payload: result.data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
            }
        };

        fetchData();

    }, [id]);

    const addToCartHandler = async () => {
        const exists = cart.cartItems.find((x) => x._id === product._id);
        const quantity = exists ? exists.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);

        if (data.countMany < quantity) {
            window.alert('Sorry. Product is out of stock')
        }

        ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

        navigate('/cart');
    };

    /////  DELETE

    const deleteHandler = async () => {

        try {
            await axios.delete(`/api/products/${product._id}`)
            ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: product });
            toast.success('The Item has been deleted successfully')
            navigate('/');
        } catch (error) {
            toast.error('Item Not Found!')
        }
    }

    return loading ? (<LoadingComponent />)
        : error ? (<MessageComponent variant="danger">{error}</MessageComponent>)
            : (<div>
                    <Row>
                        <Col md={6}><img className="img-large" src={product.image} alt={product.name} /></Col>
                        <Col md={3}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Helmet>
                                        <title>{product.name}</title>
                                    </Helmet>
                                    <h1>{product.name}</h1></ListGroup.Item>
                                <ListGroup.Item><Rating rating={product.rating} numReviews={product.numReviews}></Rating></ListGroup.Item>
                                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                                <ListGroup.Item>Description: <p>{product.description}</p></ListGroup.Item>
                                {userInfo && userInfo.isAdmin && (
                                    <ListGroup.Item className="align-center">
                                        <Link to={`/${product._id}/editItem/${product.slug}`}>Edit</Link>{' '} 

                                        <Button className="button-delete" onClick={deleteHandler}>Delete</Button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>

                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:</Col>
                                                <Col>${product.price}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status:</Col>
                                                <Col>
                                                    {product.countMany > 0 ?
                                                        (<Badge bg="success">In Stock</Badge>)
                                                        : (<Badge bg="danger">Unavailable</Badge>)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {product.countMany > 0
                                            && (<ListGroup.Item>
                                                <div className="d-grid">
                                                    <Button onClick={addToCartHandler} variant="primary">
                                                        AddTo Cart
                                                    </Button>
                                                </div>
                                            </ListGroup.Item>)}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
               
            </div >);


}

export default ProductScreen;
