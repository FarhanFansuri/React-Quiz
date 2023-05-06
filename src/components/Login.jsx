import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useNavigate} from 'react-router-dom'
import { useEffect } from 'react';


function Login(){
    let navigate = useNavigate();

    
    useEffect(() => {
        if(localStorage.getItem('login') === 'true'){
            navigate('/')
        }
       
    })

    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');

    let changeHandlerUsername =  (event) =>{
        setUsername(event.target.value);
    }

    let changeHandlerPassword =  (event) =>{
        setPassword(event.target.value);
    }

    let submitHandler = (event) =>{
        event.preventDefault();
        if(username === 'admin' && password === 'admin'){
            localStorage.setItem('login',true)
            navigate('/')
        }else{
            alert('Please enter right password and username');
        }
    }


        return (
            <Container className='login-main pt-5' >
                <Row >
                    <Col sm={6} className='my-auto'>
                       <img src="images/login.jpg" width={'100%'} alt="" />
                    </Col>
                    <Col sm={6} style={{ 
                            border: '3px solid black',
                            borderRadius: '20px'
                        }}>
                            <h1 className='text-center mt-5'>Login</h1>
                        <Form className='p-5' onSubmit={submitHandler} >
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" onChange={changeHandlerUsername} />
                            <Form.Text className="text-muted">
                                Pastikan username yang anda inputkan sudah benar
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={changeHandlerPassword}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Check me out" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                        </Form>        
                    </Col>
                </Row>
            </Container>
        )
    }


export default Login