import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Container, Button, Form, Modal, Table, Header, Icon, Message, Grid, Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import _ from 'lodash';

class LeisureFacilitiesPage extends Component {

  state = {
    gymUsers: '',
    poolUsers: '',
    golfUsers: ''
  };

  componentDidMount() {
    this.getAllLeisure()
  }

  setFigures = async () => {
    const figures = {
      gymUsers: this.state.gymUsers,
      poolUsers: this.state.poolUsers,
      golfUsers: this.state.golfUsers
    }

    axios.post('http://localhost:5000/api/leisure/figures', figures)
  }

  incrementGym = async () => {
    const { gymUsers } = this.state

    this.setState({ gymUsers: gymUsers + 1 }, () => {
      this.setFigures()
    })
  }

  incrementGolf = async () => {
    const { golfUsers } = this.state

    this.setState({ golfUsers: golfUsers + 1 }, () => {
      this.setFigures()
    })
  }

  incrementPool = async () => {
    const { poolUsers } = this.state

    this.setState({ poolUsers: poolUsers + 1 }, () => {
      this.setFigures()
    })
  }

  decrementGym = async () => {
    const { gymUsers } = this.state

    if (gymUsers < 1) {

    }
    else {
      this.setState({ gymUsers: gymUsers - 1 }, () => {
        this.setFigures()
      })
    }
  }

  decrementGolf = async () => {
    const { golfUsers } = this.state

    if (golfUsers < 1) {

    }
    else {
      this.setState({ golfUsers: golfUsers - 1 }, () => {
        this.setFigures()
      })
    }
  }

  decrementPool = async () => {
    const { poolUsers } = this.state

    if (poolUsers < 1) {

    }
    else {
      this.setState({ poolUsers: poolUsers - 1 }, () => {
        this.setFigures()
      })
    }
  }

  getAllLeisure = async () => {
    const leisurePromise = axios.get('http://localhost:5000/api/leisure/all')
    
    const complete = await Promise.resolve(leisurePromise)

    this.setState({ gymUsers: complete.data.response[0].gym_users, poolUsers: complete.data.response[0].pool_users, golfUsers: complete.data.response[0].golf_users }, () => {

    })
  }

  render() {

    return (
      <Fragment>
        <Container fluid>
          <Grid padded columns={3}>
            <Grid.Row>
              <Grid.Column>
                <Segment fluid>
                  <Header as='h4'><Icon name='heartbeat' color='red'/>Gym</Header>
                  <Grid columns={2}>
                    <Grid.Row>
                      <Grid.Column>
                        <Button basic color='teal' onClick={this.incrementGym}>In</Button>
                        <Button basic color='teal' onClick={this.decrementGym}>Out</Button>
                      </Grid.Column>
                      <Grid.Column textAlign='right' verticalAlign='middle'>
                        <Header as='h4' content={`${this.state.gymUsers} Gym Users`} />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment fluid>
                  <Header as='h4'><Icon name='tint' color='blue'/>Pool</Header>
                  <Grid columns={2}>
                    <Grid.Row>
                      <Grid.Column>
                        <Button basic color='teal' onClick={this.incrementPool}>In</Button>
                        <Button basic color='teal' onClick={this.decrementPool}>Out</Button>
                      </Grid.Column>
                      <Grid.Column textAlign='right' verticalAlign='middle'>
                        <Header as='h4' content={`${this.state.poolUsers} Swimmers`} />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment fluid>
                  <Header as='h4'><Icon name='golf ball' style={{ 'color': '#CCC' }}/>Golf Course</Header>
                  <Grid columns={2}>
                    <Grid.Row>
                      <Grid.Column>
                        <Button basic color='teal' onClick={this.incrementGolf}>In</Button>
                        <Button basic color='teal' onClick={this.decrementGolf}>Out</Button>
                      </Grid.Column>
                      <Grid.Column textAlign='right' verticalAlign='middle'>
                        <Header as='h4' content={`${this.state.golfUsers} Active Golfers`} />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Fragment>
    );
  }
}

export default LeisureFacilitiesPage;