import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Container, Button, Form, Modal, Table, Header, Icon, Message, Image, Statistic, Segment, Placeholder, Grid, GridRow, Embed } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import _ from 'lodash';

class Room101Ambiance extends Component {

  state = {
    roomTemp: '',
    lightOne: '',
    lightTwo: '',
    ambiance: '',
    roomMusic: ''
  };

  componentDidMount() {
    var self = this
    var intervalID = window.setInterval(myCallback, 500);
    function myCallback() {
      self.getAmbiance();
    }
  }

  getAmbiance = async () => {
    const ambiancePromise = axios.get('http://localhost:5000/api/room101/all')
    
    const complete = await Promise.resolve(ambiancePromise)

    this.setState({ ambiance: complete.data.response }, () => {

    })
    this.setAmbiance()
  }

  setAmbiance = async () => {
    this.setState({ roomTemp: this.state.ambiance[0].room_temperature, lightOne: this.state.ambiance[0].bathroom_lighting, lightTwo: this.state.ambiance[0].bedroom_lighting })

    if ( this.state.ambiance[0].room_music === 'roomMusic' ) {

    } else {
      this.setState({ roomMusic: this.state.ambiance[0].room_music })
    }
  }

  render() {

    return (
      <Fragment>
        <Container fluid style={{ height: '100vh', 'background': `linear-gradient(to right, ${this.state.lightOne}, ${this.state.lightTwo})`, paddingLeft: '2vw', paddingRight: '2vw' }}>
          <Header as='h1' style={{ color: '#333', paddingTop: '3vh' }}>Welcome to Room 101</Header>
          <Container fluid>
            <Statistic size='huge' floated='right'>
              <Statistic.Label style={{ color: '#333' }}>Temperature</Statistic.Label>
              <Statistic.Value style={{ color: '#333' }} ><Icon name='thermometer half' /> {this.state.roomTemp}º</Statistic.Value>
            </Statistic>
          </Container>
          <Container fluid>
            <Statistic.Group size='tiny' widths={2}>
              <Statistic>
                <Statistic.Value style={{ color: '#333', 'position': 'absolute', 'bottom': '3vh' }} ><Icon name='bathtub' /> Bathroom Lighting</Statistic.Value>
              </Statistic>
              <Statistic floated='right'>
                <Statistic.Value style={{ color: '#333', 'position': 'absolute', 'bottom': '3vh', 'right': '2vw' }} >Bedroom Lighting <Icon name='bed' /></Statistic.Value>
              </Statistic>
            </Statistic.Group>
          </Container>
          <iframe width='0' height='0' src={this.state.roomMusic} frameborder='0' allow='autoplay'></iframe>
        </Container>
      </Fragment>
    );
  }
}

export default Room101Ambiance;