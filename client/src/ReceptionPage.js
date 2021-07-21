import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Container, Button, Form, Modal, Table, Header, Icon, Message, Grid, Label, Confirm, Segment, Menu } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';

class ReceptionPage extends Component {

  state = {
    redirectAdmin: false,
    redirectReports: false,
    redirectBookings: false,
    redirectOrders: false,
    redirectReception: false,
    loginModalOpen: true,
    hasWrongCredentials: true,
    loginCredentials: '',
    signedInUser: '',
    checkInAvailable: true,
    checkInClosed: 'none',
    checkInModalOpen: false,
    checkOutModalOpen: false,
    reservations: [],
    reservationsOut: [],
    roomName: '',
    guestName: '',
    open: false,
    openOut: false,
    guestID: ''
  };

  openReports = () => {
    this.setState({ redirectReports: true })
  }

  openAdmin = () => {
    this.setState({ redirectAdmin: true })
  }

  openOrders = () => {
    this.setState({ redirectOrders: true })
  }

  openBookings = () => {
    this.setState({ redirectBookings: true })
  }

  openReception = () => {
    this.setState({ redirectReception: true })
  }

  componentDidMount() {
    this.getAllReservations()
    this.getAllCheckOuts()
  }

  signOut = () => {
    this.setState({ loginModalOpen: true, loginCredentials: '', signedInUser: '', hasWrongCredentials: true })
  }

  handleCancel = () => this.setState({ open: false, openOut: false })

  confirmCheckIn = async (reservation) => {
    this.setState({ roomName: reservation.room_name, guestName: reservation.first_name + ' ' + reservation.last_name, open: true, guestID: reservation._id })
  }

  confirmCheckOut = async (reservationOut) => {
    this.setState({ roomName: reservationOut.room_name, guestName: reservationOut.first_name + ' ' + reservationOut.last_name, openOut: true, guestID: reservationOut._id })
  }

  getAllCheckOuts = async () => {
    var today = new Date()
    const months = ['01','02','03','04','05','06','07','08','09','10','11','12']
    const days = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
    today = (today.getFullYear()+'-'+months[today.getMonth()]+'-'+days[today.getDate()]+'T00:00:00.000Z')

    const date = {
      today: today
    }

    console.log(today)

    const reservationsPromise = axios.post('http://localhost:5000/api/customers/getcheckouts', date)
    
    const complete = await Promise.resolve(reservationsPromise)
    
    this.setState({ reservationsOut: complete.data.response }, () => {

    })
  }

  getAllReservations = async () => {
    var today = new Date()
    const months = ['01','02','03','04','05','06','07','08','09','10','11','12']
    const days = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
    today = (today.getFullYear()+'-'+months[today.getMonth()]+'-'+days[today.getDate()]+'T00:00:00.000Z')

    const date = {
      today: today
    }

    console.log(date)

    const reservationsPromise = axios.post('http://localhost:5000/api/customers/bydate', date)
    
    const complete = await Promise.resolve(reservationsPromise)
    
    this.setState({ reservations: complete.data.response }, () => {

    })
  }

  checkIn = async () => {
    const { guestID } = this.state

    const checkIn = {
      guestID: guestID
    }

    axios.post('http://localhost:5000/api/customers/checkin', checkIn)
    this.handleCancel()
    this.getAllReservations()
    this.getAllCheckOuts()
    this.closeModal()
  }

  checkOutGuest = async () => {
    const { guestID } = this.state

    const checkOut = {
      guestID: guestID
    }

    axios.post('http://localhost:5000/api/customers/checkout', checkOut)
    this.handleCancel()
    this.getAllReservations()
    this.getAllCheckOuts()
    this.closeModal()
  }

  checkOut = () => {
    this.setState({ checkOutModalOpen: true })
  }

  checkInAvailable = () => {
    var currentTime = new Date();
    currentTime = parseInt(currentTime.getHours() + "" + ("0" + currentTime.getMinutes()).substr(-2) + "" + ("0" + currentTime.getSeconds()).substr(-2));
    
    if ((currentTime > 100000)) {
      this.setState({ checkInClosed: 'none', checkInModalOpen: true })
    } else
      this.setState({ checkInClosed: 'block' })
      setTimeout( () => { this.setState({ checkInClosed: 'none' }) }, 2000)

  }

  closeModal = () => {
    this.setState({ loginModalOpen: false, checkInModalOpen: false, checkOutModalOpen: false })
    this.getAllReservations()
  }

  valueChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  wrongCredentials = () => {
    this.setState({ hasWrongCredentials: false })
  }

  validateCredentials = async () => {
    const { loginCredentials } = this.state

    const deskLogin = {
      eposLogin: loginCredentials
    }

    const checkUser = axios.post('http://localhost:5000/api/staff/login', deskLogin)

    const awaitValidation = await Promise.resolve(checkUser)

    if (awaitValidation.data.response) {
      this.setState({ signedInUser: awaitValidation.data.response.first_name + ' ' + awaitValidation.data.response.last_name })
      this.closeModal()
    } else {
      this.wrongCredentials()
    }

  }

  render() {
    const { reservations, reservationsOut } = this.state

    if (this.state.redirectAdmin) {
      return <Redirect to='/Admin' />
    }
    else if (this.state.redirectOrders) {
      return <Redirect to='/OrderPage' />
    }
    else if (this.state.redirectBookings) {
      return <Redirect to='/BookingPage' />
    }
    else if (this.state.redirectReports) {
      return <Redirect to='/ReportsPage' />
    }

    return (
      <Fragment>
        <Container fluid style={{ backgroundColor: '#222', height: '60px', paddingLeft: '30px', paddingRight: '30px' }} textAlign={'right'}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column textAlign='left'>
                <Menu compact style={{ 'background-color': '#222' }}>
                  <Menu.Item style={{ 'color': '#FFF' }} as='a' onClick={this.openAdmin}><Icon name='home'/>Home</Menu.Item>
                  <Menu.Item style={{ 'color': '#1affc6' }} as='a'><Icon style={{ 'color': '#1affc6' }} name='desktop'/>Reception</Menu.Item>
                  <Menu.Item style={{ 'color': '#FFF' }} as='a' onClick={this.openBookings}><Icon name='calendar alternate outline'/>Bookings</Menu.Item>
                  <Menu.Item style={{ 'color': '#FFF' }} as='a' onClick={this.openOrders}><Icon name='food'/>Food & Bev</Menu.Item>
                  <Menu.Item style={{ 'color': '#FFF' }} as='a' onClick={this.openReports}><Icon name='clipboard outline'/>Reports</Menu.Item>
                </Menu>
              </Grid.Column>
              <Grid.Column textAlign='right'>
                <Header as={'h1'} style={{ color: '#FFF', paddingTop: '6px' }}>Modern Day Hotel</Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        <Container fluid style={{ paddingTop: '20px', paddingLeft: '30px', paddingRight: '30px' }}>
          <Modal open={this.state.loginModalOpen}>
            <Modal.Header>Swipe Employee Card or Enter Credentials</Modal.Header>
            <Modal.Content>
              <Message negative hidden={this.state.hasWrongCredentials}>
                <Message.Header>User Not Found</Message.Header>
                <p>Please try again, login code is case sensitive.</p>
              </Message>
              <Form>
                <Form.Input label='Enter four character code' name='loginCredentials' value={this.state.loginCredentials} onChange={this.valueChange.bind(this)} placeholder='eg - 1234' required />
              </Form>
              <Modal.Actions>
                <Button basic disabled={!this.state.loginCredentials} animated color='teal' style={{ marginTop: '25px' }} onClick={this.validateCredentials}><Button.Content visible>Login</Button.Content><Button.Content hidden><Icon name='lock open' /></Button.Content></Button>
              </Modal.Actions>
            </Modal.Content>
          </Modal>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Icon name='user' size='large' color='teal' style={{ display: 'inline', paddingRight: '5px', paddingBottom: '10px' }} /><Header as='h3' style={{ display: 'inline' }} content={`${this.state.signedInUser} has signed into Reception.`} />
              </Grid.Column>
              <Grid.Column>
                <Button onClick={this.signOut} floated='right' basic color='red'>Sign Out</Button>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={8}>  
              <Grid.Column>
                <Menu as='a' compact style={{ 'border': '1px solid #00b5ad' }}>
                  <Menu.Item onClick={this.checkInAvailable} style={{ 'color': '#00b5ad' }}>Check In Guest<Label color='red' floating content={`${this.state.reservations.length}`} /></Menu.Item>
                </Menu>
                <Label basic color='red' style={{ display: `${this.state.checkInClosed}`, width: '126px', marginTop: '7px', marginLeft: '0px', 'text-align': 'center' }} pointing='above'>Check In Closed!</Label>
              </Grid.Column>
              <Grid.Column>
                <Menu as='a' compact style={{ 'border': '1px solid #00b5ad' }}>
                  <Menu.Item onClick={this.checkOut} style={{ 'color': '#00b5ad' }}>Check Out Guest<Label color='red' floating content={`${this.state.reservationsOut.length}`} /></Menu.Item>
                </Menu>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Modal open={this.state.checkInModalOpen} onClose={this.closeModal}>
            <Modal.Header>Check In Itinerary</Modal.Header>
            <Modal.Content>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      <Icon name='bed' color='teal' />
                      Room
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Icon name='users' color='teal' />
                      Customer
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>
                      <Icon name='cogs' color='teal' />
                      Actions
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {reservations &&
                  _.map(reservations, (reservation) => (
                    <Table.Row key={reservation._id}>
                      <Table.Cell>{(reservation.room_name)}</Table.Cell>
                      <Table.Cell>{(reservation.first_name + ' ' + reservation.last_name)}</Table.Cell>
                      <Table.Cell textAlign='right'><Button basic color='teal' onClick={() => {{this.confirmCheckIn(reservation)}}}>Check In</Button></Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Modal.Content>
          </Modal>
          <Modal open={this.state.checkOutModalOpen} onClose={this.closeModal}>
            <Modal.Header>Check Out Itinerary</Modal.Header>
            <Modal.Content>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      <Icon name='bed' color='teal' />
                      Room
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Icon name='users' color='teal' />
                      Customer
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>
                      <Icon name='cogs' color='teal' />
                      Actions
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {reservationsOut &&
                  _.map(reservationsOut, (reservationOut) => (
                    <Table.Row key={reservationOut._id}>
                      <Table.Cell>{(reservationOut.room_name)}</Table.Cell>
                      <Table.Cell>{(reservationOut.first_name + ' ' + reservationOut.last_name)}</Table.Cell>
                      <Table.Cell textAlign='right'><Button basic color='teal' onClick={() => {{this.confirmCheckOut(reservationOut)}}}>Check Out</Button></Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Modal.Content>
          </Modal>
          <Confirm open={this.state.open} header='Confirm Check In' content={`Are you sure you wish to check ${this.state.guestName} in to room ${this.state.roomName}?`} onCancel={this.handleCancel} onConfirm={this.checkIn} />
          <Confirm open={this.state.openOut} header='Confirm Check Out' content={`Are you sure you wish to check ${this.state.guestName} out of room ${this.state.roomName}?`} onCancel={this.handleCancel} onConfirm={this.checkOutGuest} />
        </Container>
      </Fragment>
    );
  }
}

export default ReceptionPage;