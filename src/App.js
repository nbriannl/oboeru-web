import React from "react";
import {
  Row,
  Col,
  Container,
  Badge,
  Navbar,
  Card,
  Button,
  ButtonGroup
} from "react-bootstrap";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isInQuiz: false };
  }

  handleStartQuiz = () => {
    this.setState({ isInQuiz: true });
  };

  handleEndQuiz = () => {
    this.setState({ isInQuiz: false });
  };

  render() {
    const isInQuiz = this.state.isInQuiz;
    let content;
    if (isInQuiz) {
      content = (
        <>
          <Row className="quit-button" onClick={this.handleEndQuiz}>
            <Col>
              <Button block variant="outline-danger">
                Quit
              </Button>
            </Col>
          </Row>
          <Row className="previous-question-card">
            <Col>
              <Card bg="success" text="white" className="text-center">
                <Card.Header>Previous Question</Card.Header>
                <Card.Body>
                  <Card.Title>Free of Charge</Card.Title>
                  <Card.Text>無料</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="question-card">
            <Col>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>See you later</Card.Title>
                  <Card.Text>( ? )[。]</Card.Text>
                </Card.Body>
                <Card.Footer>
                  Q <Badge variant="secondary">2</Badge> out of{" "}
                  <Badge variant="secondary">50</Badge>{" "}
                  <i className="fa fa-check"></i>{" "}
                  <Badge variant="success">2</Badge>{" "}
                  <i className="fa fa-times"></i>{" "}
                  <Badge variant="danger">0</Badge>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
          <Row className="answer-buttons">
            <Col>
              <ButtonGroup vertical className="special">
                <Button variant="outline-danger">
                  おさがしですか　[おさがしですか]
                </Button>
                <Button variant="outline-danger">
                  しつれいします [しつれいします]
                </Button>
                <Button variant="outline-danger">
                  行ってきます [いってきます]
                </Button>
                <Button variant="outline-danger">
                  つかれました　[つかれました］
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </>
      );
    } else {
      content = (
        <>
          <Row>
            <Col>
              <Button
                block
                variant="outline-danger"
                onClick={this.handleStartQuiz}
              >
                Start
              </Button>
            </Col>
          </Row>
        </>
      );
    }
    return (
      <div>
        <Navbar bg="danger" variant="dark" expand="lg">
          <Navbar.Brand href="#home">Oboeru</Navbar.Brand>
        </Navbar>
        <Container className="content" fluid>
          {content}
        </Container>
      </div>
    );
  }
}

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
