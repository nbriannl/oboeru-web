import React from "react";
import {
  Row,
  Col,
  Container,
  Alert,
  Badge,
  Navbar,
  Card,
  Button,
  ButtonGroup
} from "react-bootstrap";

import "./App.css";

const App = () => (
  <div>
    <Navbar bg="danger" variant="dark" expand="lg">
      <Navbar.Brand href="#home">Oboeru</Navbar.Brand>
    </Navbar>
    <Container>
      <Card className="text-center">
        <Card.Header>
          Question <Badge variant="secondary">2</Badge> out of{" "}
          <Badge variant="secondary">50</Badge>
        </Card.Header>
        <Card.Body>
          <Card.Title>See you later</Card.Title>
          <Card.Text>( ? )[。]</Card.Text>
          <ButtonGroup vertical>
            <Button variant="outline-danger">おさがしですか</Button>
            <Button variant="outline-danger">しつれいします</Button>
            <Button variant="outline-danger">行ってきます</Button>
            <Button variant="outline-danger">つかれました</Button>
          </ButtonGroup>
        </Card.Body>
        <Card.Footer>
          <Container>
            <Row>
              <Col>
                <Alert variant="success">
                  <i className="fa fa-check"></i>{" "}
                  <Badge variant="success">2</Badge>
                </Alert>
              </Col>
              <Col>
                <Alert variant="danger">
                  <i className="fa fa-times"></i>{" "}
                  <Badge variant="danger">0</Badge>
                </Alert>
              </Col>
              <Col>
                <Button variant="outline-danger">Quit</Button>
              </Col>
            </Row>
          </Container>
        </Card.Footer>
      </Card>
    </Container>
  </div>
);

export default App;

/**
export default App;
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Hi
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
**/
