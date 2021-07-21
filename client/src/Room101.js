import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Container, Button, Form, Modal, Table, Header, Icon, Message, Placeholder, Segment, Grid, Label, Image, Statistic, Divider } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import _ from 'lodash';
import { SketchPicker } from 'react-color';

var musicOptions = [
  { name: 'Weed, Whisky & Willie - Brothers Osborne', link: 'https://www.youtube-nocookie.com/embed/vHj5dA0T0tU?autoplay=1', image: 'brothersOsborne.jpg' },
  { name: 'Dani California - Red Hot Chili Peppers', link: 'https://www.youtube.com/embed/Sb5aq5HcS1A?autoplay=1', image: 'redHotChiliPeppers.jpg' },
  { name: 'Thunderstruck - AC/DC', link: 'https://www.youtube.com/embed/v2AC41dglnM?autoplay=1', image: 'acDc.jpg' },
  { name: 'Iris - Goo Goo Dolls', link: 'https://www.youtube.com/embed/NdYWuo9OFAw?autoplay=1', image: 'gooGooDolls.jpg' }
]

class Room101 extends Component {

  state = {
    authorisationModalOpen: true,
    roomMusicModal: false,
    roomAmbianceModal: false,
    hotelActivityModal: false,
    bathroomLighting: false,
    bedroomLighting: false,
    roomTemperature: false,
    musicImage: 'acDc.jpg',
    musicName: '',
    roomNumber: 'Room 101',
    currentTemp: '',
    guestSurname: '',
    guestPin: '',
    roomValidationFailed: true,
    roomTemp: '',
    lightOne: '',
    lightTwo: '',
    roomMusic: '',
    redirectTable: false,
    gymUsers: '',
    golfUsers: '',
    poolUsers: ''
  };

  componentDidMount() {
    this.getAmbiance()
  }

  setMusic = async (music) => {
    this.setState({ musicImage: music.image, musicName: music.name })

    const ambiance = {
      roomMusic: music.link,
      roomImage: music.image,
      musicName: music.name
    }

    axios.post('http://localhost:5000/api/room101/music', ambiance)
  }

  musicList = () => {
    if ( musicOptions.length !== 0 ) {
      return musicOptions.map( music => 
        <Grid>
          <Grid.Row style={{ 'padding': '0' }} onClick={() => {{this.setMusic(music)}}}>
            <Image style={{ 'margin': '0.2vw', 'padding': '0', 'width': '15vw', 'height': '15vw' }} src={require(`./images/${music.image}`)} floated='left' /><Header style={{ marginLeft: '3vw', 'color': '#FFF', 'font-size': '10px' }} content={`${music.name}`} />
          </Grid.Row><Divider style={{ 'padding': '0', 'margin': '0.2vw' }} />
        </Grid>
      )
    }
  }

  changeBathroomLighting = async (color) => {
    const ambiance = {
      lightOne: color.hex
    }

    axios.post('http://localhost:5000/api/room101/bathlight', ambiance)
  }

  changeBedroomLighting = async (color) => {
    const ambiance = {
      lightTwo: color.hex
    }

    axios.post('http://localhost:5000/api/room101/bedlight', ambiance)
  }

  roomMusicOpen = () => {
    this.setState({ roomMusicModal: true })
  }

  roomTempOpen = () => {
    this.setState({ roomTemperature: true })
  }

  bathroomLightingOpen = () => {
    this.setState({ bathroomLighting: true })
  }

  bedroomLightingOpen = () => {
    this.setState({ bedroomLighting: true })
  }

  redirectTablePage = () => {
    this.setState({ redirectTable: true })
  }

  ambianceModal = () => {
    this.setState({ roomAmbianceModal: true })
  }

  hotelActivity = () => {
    this.getAllLeisure()
  }

  getAllLeisure = async () => {
    this.setState({ hotelActivityModal: true })
    const leisurePromise = axios.get('http://localhost:5000/api/leisure/all')
    
    const complete = await Promise.resolve(leisurePromise)

    this.setState({ gymUsers: complete.data.response[0].gym_users, poolUsers: complete.data.response[0].pool_users, golfUsers: complete.data.response[0].golf_users }, () => {

    })
  }

  closeLightsModal = () => {
    this.setState({ bathroomLighting: false, bedroomLighting: false })
  }

  closeTempModal = () => {
    this.setState({ roomTemperature: false })
  }

  closeMusicModal = () => {
    this.setState({ roomMusicModal: false })
  }

  closeModal = () => {
    this.setState({ hotelActivityModal: false, authorisationModalOpen: false, roomAmbianceModal: false, roomTemp: '', lightOne: '', lightTwo: '', roomMusic: '' })
  }

  valueChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  incrementTemp = async () => {
    if (this.state.currentTemp === 24) {

    } else {
      const roomTemp = this.state.currentTemp + 1
      this.setState({ currentTemp: roomTemp })
      const ambiance = {
        roomTemp: roomTemp.toString()
      }
  
      axios.post('http://localhost:5000/api/room101/temp', ambiance)
    }
  }

  decrementTemp = async () => {
    if (this.state.currentTemp === 18) {

    } else {
      const roomTemp = this.state.currentTemp - 1
      this.setState({ currentTemp: roomTemp })
      const ambiance = {
        roomTemp: roomTemp.toString()
      }
  
      axios.post('http://localhost:5000/api/room101/temp', ambiance)
    }
  }

  validateRoom = async () => {
    const { guestPin, guestSurname, roomNumber } = this.state

    const roomLogin = {
      guestPin: guestPin.replace(/\s/g,''),
      guestSurname: guestSurname.replace(/\s/g,''),
      roomName: roomNumber
    }

    const checkGuest = axios.post('http://localhost:5000/api/customers/pin', roomLogin)

    const awaitValidation = await Promise.resolve(checkGuest)

    if (awaitValidation.data.response.length == 0) {
      this.setState({ roomValidationFailed: false })
    } else {
      this.closeModal()
    }
  }

  getAmbiance = async () => {
    const ambiancePromise = axios.get('http://localhost:5000/api/room101/all')
    
    const complete = await Promise.resolve(ambiancePromise)

    this.setState({ currentTemp: parseInt(complete.data.response[0].room_temperature), musicImage: complete.data.response[0].music_image, musicName: complete.data.response[0].music_name }, () => {

    })
  }

  render() {

    if (this.state.redirectTable) {
      return <Redirect to='/Room101Order' />
    }

    return (
      <Fragment>
        <Container fluid style={{ paddingTop: '20px' }}>
          <Modal open={this.state.authorisationModalOpen} centered={false}>
            <Modal.Header>Please Securely Login</Modal.Header>
            <Modal.Content>
            <Message negative hidden={this.state.roomValidationFailed}>
              <Message.Header>Room Validation Failed</Message.Header>
              <p>Please try again, the fields are case sensitive.</p>
            </Message>
              <Form>
                <Form.Input style={{ fontSize: '16px' }} onChange={this.valueChange.bind(this)} value={this.state.guestSurname} name='guestSurname' label='Surname' placeholder='eg - Smith' required></Form.Input>
                <Form.Input style={{ fontSize: '16px' }} onChange={this.valueChange.bind(this)} value={this.state.guestPin} name='guestPin' label='Pin Code' placeholder='eg - aBc1' required></Form.Input>
                <Form.Button onClick={this.validateRoom} disabled={!this.state.guestPin || !this.state.guestSurname} basic color='teal'>Log In</Form.Button>
              </Form>
            </Modal.Content>
          </Modal>
          <Segment tertiary inverted color='teal'>
            <Header as='h2' textAlign='center'>Welcome to Room 101</Header>
          </Segment>
          <Header as='h3' textAlign='center'>What would you like to do?</Header>
          <Grid stackable columns={2}>
            <Grid.Row stretched>
              <Grid.Column>
                <Segment raised onClick={this.redirectTablePage}>
                  <Label color='teal' ribbon>
                    Order Table Service
                  </Label>
                  <Image centered src={require('./images/tableService.jpg')} rounded size='medium'/>
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment raised>
                  <Label color='red' ribbon='right'>
                    NOT IN DEMO Order Room Service
                  </Label>
                  <Image centered src={require('./images/roomService.jpg')} rounded size='medium'/>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
              <Grid.Column>
                <Segment raised onClick={this.ambianceModal}>
                  <Label color='teal' ribbon>
                    Set Room Ambience
                  </Label>
                  <Image centered src={require('./images/roomAmbience.jpg')} rounded size='medium'/>
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment raised>
                  <Label color='red' ribbon='right'>
                    NOT IN DEMO Book Spa Treatment
                  </Label>
                  <Image centered src={require('./images/spaTreatment.jpg')} rounded size='medium'/>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
              <Grid.Column>
                <Segment raised>
                  <Label color='red' ribbon>
                    NOT IN DEMO Book Local Attractions
                  </Label>
                  <Image centered src={require('./images/localAttractions.jpg')} rounded size='medium'/>
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment raised onClick={this.hotelActivity}>
                  <Label color='teal' ribbon='right'>
                    Check Hotel Activity
                  </Label>
                  <Image centered src={require('./images/hotelActivity.jpg')} rounded size='medium'/>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Modal open={this.state.roomAmbianceModal} onClose={this.closeModal} centered={false}>
            <Modal.Header>Adjust Room Ambiance</Modal.Header>
            <Modal.Content>
              <Grid>
                <Grid.Row stretched textAlign='center' columns={2}>
                  <Grid.Column>
                    <Segment textAlign='center' onClick={this.bathroomLightingOpen}>
                      <Statistic size='small'>
                        <Statistic.Value><Icon name='bathtub' color='teal' /></Statistic.Value>
                        <Statistic.Label style={{ marginTop: '2vh' }}>Bathroom Lighting</Statistic.Label>
                      </Statistic>
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment textAlign='center' onClick={this.bedroomLightingOpen}>
                      <Statistic size='small'>
                        <Statistic.Value><Icon name='bed' color='teal' /></Statistic.Value>
                        <Statistic.Label style={{ marginTop: '2vh' }}>Bedroom Lighting</Statistic.Label>
                      </Statistic>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row stretched textAlign='center' columns={2}>
                  <Grid.Column>
                    <Segment textAlign='center' onClick={this.roomTempOpen}>
                      <Statistic size='small'>
                        <Statistic.Value><Icon name='thermometer half' color='teal' /></Statistic.Value>
                        <Statistic.Label style={{ marginTop: '2vh' }}>Room Temperature</Statistic.Label>
                      </Statistic>
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment textAlign='center' onClick={this.roomMusicOpen}>
                      <Statistic size='small'>
                        <Statistic.Value><Icon name='music' color='teal' /></Statistic.Value>
                        <Statistic.Label style={{ marginTop: '2vh' }}>Background Music</Statistic.Label>
                      </Statistic>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
          </Modal>
          <Modal open={this.state.bathroomLighting} onClose={this.closeLightsModal}>
            <Modal.Header>Bathroom Lighting</Modal.Header>
            <Modal.Content>
              <SketchPicker width='82.5vw' onChangeComplete={this.changeBathroomLighting} />
            </Modal.Content>
          </Modal>
          <Modal open={this.state.bedroomLighting} onClose={this.closeLightsModal}>
            <Modal.Header>Bedroom Lighting</Modal.Header>
            <Modal.Content>
              <SketchPicker width='82.5vw' onChangeComplete={this.changeBedroomLighting} />
            </Modal.Content>
          </Modal>
          <Modal open={this.state.roomTemperature} onClose={this.closeTempModal}>
            <Modal.Header>Room Temperature</Modal.Header>
            <Modal.Content style={{ marginLeft: '2vw', 'width': '93vw', marginBottom: '5vw', marginTop: '2vw' }}>
              <Button disabled={this.state.currentTemp === 18} icon='minus' onClick={this.decrementTemp} style={{ 'display': 'inline-block', 'height': '13vw', 'width': '13vw' }} basic circular color='teal'></Button>
                <Segment circular style={{ marginLeft: '3vw', marginRight: '3vw', 'display': 'inline-block', 'background': '#FFA500', 'height': '50vw', 'width': '50vw' }}>
                  <Header style={{ paddingLeft: '2vw', paddingTop: '10vw', fontSize: '60px' }} inverted content={`${this.state.currentTemp}º`} />
                </Segment>
              <Button disabled={this.state.currentTemp === 24} icon='plus' onClick={this.incrementTemp} style={{ 'display': 'inline-block', 'height': '13vw', 'width': '13vw' }} basic circular color='teal'></Button>
              <Grid centered><Grid.Row textAlign='center'><Statistic size='large'><Statistic.Label>Min. 18º - Max. 24º</Statistic.Label></Statistic></Grid.Row></Grid>
            </Modal.Content>
          </Modal>
          <Modal open={this.state.roomMusicModal} onClose={this.closeMusicModal}>
            <Modal.Header style={{ 'background': '#111', 'color': '#FFF' }}>Room Music</Modal.Header>
            <Modal.Content style={{ 'background': '#111' }}>
              <Container fluid textAlign='center'>
                <Image style={{ 'width': '65vw', 'height': '65vw' }} centered src={require(`./images/${this.state.musicImage}`)} />
                <Grid>
                  <Grid.Row centered style={{ 'margin-top': '5vw', 'margin-bottom': '0', 'padding-bottom': '0' }}>
                    <Statistic size='large'><Statistic.Label style={{ 'color': '#FFF' }}>Now Playing</Statistic.Label></Statistic>  
                  </Grid.Row>
                  <Grid.Row centered>
                    <Statistic><Statistic.Label style={{ 'color': '#FFF', marginBottom: '5vw', 'margin-top': '0', 'padding-top': '0', 'font-size': '8px' }} content={`${this.state.musicName}`} /></Statistic>
                  </Grid.Row>
                </Grid>
              </Container>
              <Container>
                { this.musicList() }
                <Grid>
                  <Grid.Row centered>
                    <Button basic color='teal' onClick={this.closeMusicModal}>Close</Button>
                  </Grid.Row>
                </Grid>
              </Container>
            </Modal.Content>
          </Modal>
          <Modal open={this.state.hotelActivityModal} onClose={this.closeModal} centered={false}>
            <Modal.Header>How Busy is The Hotel</Modal.Header>
            <Modal.Content>
            <Grid textAlign='center'>
              <Grid.Row>
                <Statistic>
                  <Statistic.Value style={{ color: '#333' }} ><Icon color='blue' name='tint' />{this.state.poolUsers}</Statistic.Value>
                  <Statistic.Label style={{ color: 'teal' }}>Swimmers In Pool</Statistic.Label>
                </Statistic>
              </Grid.Row>
              <Grid.Row>
                <Statistic>
                  <Statistic.Value style={{ color: '#333' }} ><Icon color='red' name='heartbeat' />{this.state.gymUsers}</Statistic.Value>
                  <Statistic.Label style={{ color: 'teal' }}>Gym Users</Statistic.Label>
                </Statistic>
              </Grid.Row>
              <Grid.Row>
                <Statistic>
                  <Statistic.Value style={{ color: '#333' }} ><Icon style={{ 'color': '#CCC' }} name='golf ball' />{this.state.golfUsers}</Statistic.Value>
                  <Statistic.Label style={{ color: 'teal' }}>Active Golfers</Statistic.Label>
                </Statistic>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          </Modal>
        </Container>
      </Fragment>
    );
  }
}

export default Room101;