import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Container, Button, Form, Modal, Table, Header, Icon, Message, Confirm, Segment, Step, Grid, Menu } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const options = [
  { key: 'm', text: 'Male', value: 'Male' },
  { key: 'f', text: 'Female', value: 'Female' },
]

class BookingPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirectAdmin: false,
      redirectBookings: false,
      redirectOrders: false,
      redirectReception: false,
      redirectReports: false,
      totalGuests: '',
      numberOfAdults: '',
      numberOfKids: '',
      dateBooked: [],
      rooms: [],
      customerID: '',
      roomID: '',
      checkRoomModalOpen: false,
      bookingConfirmationModal: false,
      bookingModalOpen: false,
      startDate: new Date().setHours(0,0,0,0),
      endDate: new Date().setHours(0,0,0,0),
      tooManyAdults: true,
      endDateBeforeStartDate: true,
      noRooms: true,
      specialCharachters: true,
      validEmail: true,
      validNumber: true,
      roomName: '',
      firstName: '',
      lastName: '',
      gender: '',
      email: '',
      firstDay: '',
      dayOne: '',
      endDay: '',
      telNumber: '',
      creditCardNum: '',
      totalPrice: '',
      totalNights: '',
      validCard: true,
      validCVC: true,
      cvcNumber: '',
      open: false,
      hashedCardDetails: '',
      guestTitle: '',
      personalStepActive: true,
      contactStepActive: false,
      billingStepActive: false,
      contactStep: true,
      billingStep: true,
      personalDetails: 'true',
      contactDetails: 'none',
      billingDetails: 'none'
    };
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
  }

  showContact = () => {
    this.setState({ personalStepActive: false, contactStepActive: true, contactStep: false, personalDetails: 'none', contactDetails: 'flex' })
  }

  showBilling = () => {
    this.setState({ contactStepActive: false, billingStepActive: true, billingStep: false, contactDetails: 'none', billingDetails: 'flex' })
  }

  show = () => {
    const { creditCardNum } = this.state

    const lastFour = creditCardNum.substr(creditCardNum.length - 4)
    const hashedCardDetails = `**** **** **** ${lastFour}`

    this.setState({ open: true, hashedCardDetails: hashedCardDetails })
  }

  handleCancel = () => this.setState({ open: false })

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

  closeModal = () => {
    this.setState({ checkRoomModalOpen: false })
  }

  closeBookingConfirmationModal = () => {
    this.setState({ dateBooked: [], bookingConfirmationModal: false })
  }

  closeBookingModal = () => {
    this.setState({ bookingModalOpen: false })
  }

  openBookingModal = async (room) => {
    const numberOfNights = this.state.dateBooked.length - 1
    const roomCost = parseInt(room.price)
    const roomCharge = (numberOfNights * roomCost)

    this.setState({ bookingModalOpen: true, roomName: room.name, totalPrice: roomCharge, totalNights: numberOfNights })
  }

  confirmReservation = async () => {
    const { dateBooked, roomName, firstName, lastName, gender, email, telNumber, creditCardNum, totalNights, startDate, dayOne, endDay } = this.state

    var firstDay = (moment(startDate).format('dddd, DD MMMM YYYY') )

    const customer = {
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      email: email,
      telNumber: telNumber,
      creditCardNum: creditCardNum,
      bookedRoom: roomName,
      startDate: firstDay,
      totalNights: totalNights,
      dayOne: dayOne,
      endDay: endDay
    }

    if (gender === 'Male') {
      this.setState({ guestTitle: 'Mr' })
    } else {
      this.setState({ guestTitle: 'Mrs' })
    }

    const roomSearch = {
      roomName: roomName
    }

    const getCustomer = axios.post('http://localhost:5000/api/customers/create', customer)
  
    const getRoom =  axios.post('http://localhost:5000/api/rooms/search', roomSearch)

    const awaitCustomer = await Promise.resolve(getCustomer)
    const awaitRoom = await Promise.resolve(getRoom)

    const reservation = {
      dateBooked: dateBooked,
      customerID: awaitCustomer.data.response._id,
      roomID: awaitRoom.data.response._id
    }

    axios.post('http://localhost:5000/api/bookings/create', reservation)
    .then((response)=>{
      if(response.data.success){
        this.closeBookingModal()
        this.closeModal()
        this.setState({ open: false, bookingConfirmationModal: true })
      }
    })    
  }

  checkRooms = async () => {
    this.setState({ checkRoomModalOpen: true })

    const { dateBooked, startDate, endDate, numberOfAdults, numberOfKids } = this.state

    var currentDate = moment(startDate);
    const stopDate = moment(endDate);
    var dayNumberOne = []
    var theFirstDayOne = []
    var firstDay
    var theFirstDay

    for (var i = 0; i < 1; i++) {
      dayNumberOne.push(moment(currentDate).format('YYYY-MM-DD'))
      firstDay = dayNumberOne[0] + 'T00:00:00.000Z'
    }

    for (var i = 0; i < 1; i++) {
      theFirstDayOne.push(moment(currentDate).format('DD MMMM YYYY'))
      theFirstDay = theFirstDayOne[0]
    }

    this.setState({ dayOne: firstDay })
    this.setState({ firstDay: theFirstDay })

    while (currentDate <= stopDate) {
        dateBooked.push(moment(currentDate).format('YYYY-MM-DD') )
        currentDate = moment(currentDate).add(1, 'days');
    }

    for (var i = 0; i < dateBooked.length; i++){
      dateBooked[i] = dateBooked[i]+'T00:00:00.000Z';
    }

    var lastDay = dateBooked[dateBooked.length - 1]

    this.setState({ endDay: lastDay })

    const totalKids = parseInt(numberOfKids)
    const totalAdults = parseInt(numberOfAdults)
    const totalGuests = totalAdults + totalKids

    this.setState({ dateBooked: dateBooked })
    this.setState({ totalGuests: totalGuests })

    const dateRange = {
      dateBooked: dateBooked,
      totalGuests: totalGuests
    }

    axios.post('http://localhost:5000/api/rooms/available', dateRange)
    .then((response)=>{
      if(response.data.success){
        this.setState({ rooms: response.data.response })
        if (this.state.rooms === undefined || this.state.rooms.length == 0) {
          this.setState({ noRooms: false })
      } else this.setState({ noRooms: true })
      }
    })
  }

  handleChangeStart(date) {
    this.setState({ startDate: date, endDate: date }); 
  }

  handleChangeEnd(date) {
    this.setState({ endDate: date }, () => {
      if (this.state.startDate > this.state.endDate) {
        this.setState({ endDateBeforeStartDate: false })
      } else this.setState({ endDateBeforeStartDate: true })
    }); 
  }

  valueChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  firstNameValueChange(e) {
    const format = /^[A-Za-z]+$/;

    this.setState({ [e.target.name]: e.target.value }, () => {
      if (format.test(this.state.firstName)) {
        this.setState({ specialCharachters: true })
      } else {
        this.setState({ specialCharachters: false })
      }
    })
  }

  lastNameValueChange(e) {
    const format = /^[A-Za-z]+$/;

    this.setState({ [e.target.name]: e.target.value }, () => {
      if (format.test(this.state.lastName)) {
        this.setState({ specialCharachters: true })
      } else {
        this.setState({ specialCharachters: false })
      }
    })
  }

  emailValidation(e) {
    const format = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

    this.setState({ [e.target.name]: e.target.value }, () => {
      if (format.test(this.state.email)) {
        this.setState({ validEmail: false })
      } else {
        this.setState({ validEmail: true })
      }
    })
  }

  phoneValidation(e) {
    const format = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

    this.setState({ [e.target.name]: e.target.value }, () => {
      if (format.test(this.state.telNumber)) {
        this.setState({ validNumber: false })
      } else {
        this.setState({ validNumber: true })
      }
    })
  }

  creditCardValidation(e) {
    const format = /\b[1-9](?:\d[ -]*?){15}\b/

    this.setState({ [e.target.name]: e.target.value }, () => {
      if (format.test(this.state.creditCardNum)) {
        this.setState({ validCard: false })
      } else {
        this.setState({ validCard: true })
      }
    })
  }

  cvcValidation(e) {
    const format = /\b(?:[0-9]{3})\b/

    this.setState({ [e.target.name]: e.target.value }, () => {
      if (format.test(this.state.cvcNumber)) {
        this.setState({ validCVC: false })
      } else {
        this.setState({ validCVC: true })
      }
    })
  }

  genderChange = (e, result) => {
    this.setState({ gender: result.value })
  }

  adultValueChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.numberOfAdults == 1 || this.state.numberOfAdults == 2 || this.state.numberOfAdults == 3 || this.state.numberOfAdults == 4 || this.state.numberOfAdults == '') {
        this.setState({ tooManyAdults: true })
      } else this.setState({ tooManyAdults: false }) 
    })
  }

  childValueChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.numberOfKids == 0 || this.state.numberOfKids == 1 || this.state.numberOfKids == 2 || this.state.numberOfKids == 3 || this.state.numberOfKids == '') {
        this.setState({ tooManyAdults: true })
      } else this.setState({ tooManyAdults: false }) 
    })
  }

  render() {
    const { rooms } = this.state

    if (this.state.redirectAdmin) {
      return <Redirect to='/Admin' />
    }
    else if (this.state.redirectOrders) {
      return <Redirect to='/OrderPage' />
    }
    else if (this.state.redirectReception) {
      return <Redirect to='/ReceptionPage' />
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
                  <Menu.Item style={{ 'color': '#FFF' }} as='a' onClick={this.openReception}><Icon name='desktop'/>Reception</Menu.Item>
                  <Menu.Item style={{ 'color': '#1affc6' }} as='a'><Icon style={{ 'color': '#1affc6' }} name='calendar alternate outline'/>Bookings</Menu.Item>
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
          <Header>Make a Reservation</Header>
          <Message negative hidden={this.state.tooManyAdults}>
            <Message.Header>Too Many Occupants or Incorrect Entry.</Message.Header>
            <p>Please note, a maximum of four adults and three children per room. Entered in number format - eg. 1, 2, 3, 4.</p>
          </Message>
          <Form>
            <Form.Group equal widths>
              <Form.Input required label='Start Date'>
                <DatePicker dateFormat='d MMMM yyyy' minDate={new Date()} selected={this.state.startDate} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} onChange={this.handleChangeStart}/>
              </Form.Input>
              <Form.Input required label='End Date'>
                <DatePicker dateFormat='d MMMM yyyy' minDate={new Date()} selected={this.state.endDate} selectsEnd startDate={this.state.startDate} endDate={this.state.endDate} onChange={this.handleChangeEnd}/>
              </Form.Input>
              <Form.Input label='Number of Adults (16+)' name='numberOfAdults' value={this.state.numberOfAdults} onChange={this.adultValueChange.bind(this)} placeholder='Room for...' required />
              <Form.Input label='Number of Children' name='numberOfKids' value={this.state.numberOfKids} onChange={this.childValueChange.bind(this)} placeholder='Any children?' required />
              <Modal open={this.state.checkRoomModalOpen} onClose={this.closeModal} trigger={<Form.Button disabled={!this.state.numberOfKids || !this.state.numberOfAdults || this.state.startDate >= this.state.endDate || this.state.numberOfAdults > 4 || this.state.numberOfKids > 3} basic animated color='teal' style={{ marginTop: '25px' }} onClick={this.checkRooms}><Button.Content visible>Check Rooms</Button.Content><Button.Content hidden><Icon name='long arrow alternate right' /></Button.Content></Form.Button>}>
                <Modal.Header>Available Rooms</Modal.Header>
                <Modal.Content>
                <Message negative hidden={this.state.noRooms}>
                  <Message.Header>Sorry, there are no rooms matching your criteria.</Message.Header>
                  <p>Please try another date, or if you have many guests, try booking more than one room.</p>
                </Message>
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell width={3}>
                          Room Name
                        </Table.HeaderCell>
                        <Table.HeaderCell width={8}>
                          Room Highlights
                        </Table.HeaderCell>
                        <Table.HeaderCell width={2}>
                          Price
                        </Table.HeaderCell>
                        <Table.HeaderCell width={3}></Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {rooms &&
                      _.map(rooms, (room) => (
                        <Table.Row key={room._id}>
                          <Table.Cell>{(room.name)}</Table.Cell>
                          <Table.Cell>{(room.description)}</Table.Cell>
                          <Table.Cell>£{(room.price)}</Table.Cell>
                          <Table.Cell><Button onClick={() => {{this.openBookingModal(room)}}} basic animated color='teal'><Button.Content visible>Book Now</Button.Content><Button.Content hidden><Icon name='calendar check outline' /></Button.Content></Button></Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                  <Modal.Actions>
                    <Button basic animated negative onClick={this.closeModal}><Button.Content visible>Cancel</Button.Content><Button.Content hidden><Icon name='cancel' /></Button.Content></Button>
                  </Modal.Actions>
                </Modal.Content>
              </Modal>
              <Modal open={this.state.bookingModalOpen} onClose={this.closeBookingModal}>
                <Modal.Header content={`Book Room ${this.state.roomName} for ${this.state.totalNights} nights for only £${this.state.totalPrice}!`}></Modal.Header>
                <Container fluid textAlign='center' style={{ paddingTop: '15px' }}>
                  <Step.Group size='mini'>
                    <Step active={this.state.personalStepActive}>
                      <Icon name='users' color='teal' />
                      <Step.Content>
                        <Step.Title>Personal Details</Step.Title>
                        <Step.Description>Enter your personal information</Step.Description>
                      </Step.Content>
                    </Step>
                    <Step disabled={this.state.contactStep} active={this.state.contactStepActive}>
                      <Icon name='phone' color='teal' />
                      <Step.Content>
                        <Step.Title>Contact Details</Step.Title>
                        <Step.Description>Enter your contact information</Step.Description>
                      </Step.Content>
                    </Step>
                    <Step disabled={this.state.billingStep} active={this.state.billingStepActive}>
                      <Icon name='credit card outline' color='teal' />
                      <Step.Content>
                        <Step.Title>Billing Details</Step.Title>
                        <Step.Description>Enter your billing information</Step.Description>
                      </Step.Content>
                    </Step>
                  </Step.Group>
                </Container>
                <Modal.Content>
                  <Form>
                  <Message negative hidden={this.state.specialCharachters}>
                    <Message.Header>Name field can only accept letters.</Message.Header>
                    <p>Please note, no special charachters are permitted.</p>
                  </Message>
                    <Form.Group style={{ display: `${this.state.personalDetails}` }}>
                      <Form.Input width={6} label='First Name' name='firstName' value={this.state.firstName} onChange={this.firstNameValueChange.bind(this)} placeholder='Enter first name...' required />
                      <Form.Input width={6} label='Last Name' name='lastName' value={this.state.lastName} onChange={this.lastNameValueChange.bind(this)} placeholder='Enter last name...' required />
                      <Form.Select width={4} label='Gender' name='gender' options={options} value={this.state.gender} onChange={this.genderChange} placeholder='Select gender...' required />
                      <Form.Button onClick={this.showContact} basic disabled={!this.state.firstName || !this.state.lastName || !this.state.gender} style={{ marginTop: '22px' }} animated color='teal'><Button.Content visible>Next</Button.Content><Button.Content hidden><Icon name='long arrow alternate right' /></Button.Content></Form.Button>
                    </Form.Group>
                    <Form.Group style={{ display: `${this.state.contactDetails}` }}>
                      <Form.Input width={12} label='Email Address' name='email' value={this.state.email} onChange={this.emailValidation.bind(this)} placeholder='Enter valid email address...' required />
                      <Icon style={{ marginTop: '30px' }} name='check circle' color='green' disabled={this.state.validEmail}></Icon>
                      <Form.Input width={4} label='Telephone Number' name='telNumber' value={this.state.telNumber} onChange={this.phoneValidation.bind(this)} placeholder='Enter contact number...' required />
                      <Icon style={{ marginTop: '30px' }} name='check circle' color='green' disabled={this.state.validNumber}></Icon>
                      <Form.Button onClick={this.showBilling} basic disabled={this.state.validEmail || this.state.validNumber} style={{ marginTop: '22px' }} animated color='teal'><Button.Content visible>Next</Button.Content><Button.Content hidden><Icon name='long arrow alternate right' /></Button.Content></Form.Button>                    
                    </Form.Group>
                    <Form.Group style={{ display: `${this.state.billingDetails}` }}>
                      <Form.Input width={8} label='Credit Card Number' name='creditCardNum' value={this.state.creditCardNum} onChange={this.creditCardValidation.bind(this)} placeholder='Enter credit card number...' required />
                      <Icon style={{ marginTop: '30px' }} name='check circle' color='green' disabled={this.state.validCard}></Icon>
                      <Form.Input width={3} label='CVC' name='cvcNumber' placeholder='eg - 123' value={this.state.cvcNumber} onChange={this.cvcValidation.bind(this)} required />
                      <Icon style={{ marginTop: '30px' }} name='check circle' color='green' disabled={this.state.validCVC}></Icon>
                      <Form.Button onClick={this.show} basic disabled={this.state.validCard || this.state.validCVC} style={{ marginTop: '22px' }} animated color='teal'><Button.Content visible>Pay Now</Button.Content><Button.Content hidden><Icon name='payment' /></Button.Content></Form.Button>
                    </Form.Group>
                  </Form>
                </Modal.Content>
              </Modal>
              <Confirm open={this.state.open} header='Confirm Payment' content={`Pay £${this.state.totalPrice} on card ${this.state.hashedCardDetails}, for ${this.state.totalNights} night(s) in room ${this.state.roomName}?`} onCancel={this.handleCancel} onConfirm={this.confirmReservation} />
            </Form.Group>
          </Form>
          <Modal open={this.state.bookingConfirmationModal}>
            <Modal.Header>Booking Confirmed</Modal.Header>
            <Modal.Content>
              <Header as='h5' attached='top' content={`Thank you for your booking ${this.state.guestTitle} ${this.state.lastName}!`} />
              <Segment attached content={`Room ${this.state.roomName} has been booked from ${this.state.firstDay} for ${this.state.totalNights} nights. A confirmation email has been sent to ${this.state.email}. We are looking forward to your visit.`} />
            </Modal.Content>
            <Modal.Actions>
              <Button basic color='teal' onClick={this.closeBookingConfirmationModal}>Ok</Button>
            </Modal.Actions>
          </Modal>
        </Container>
      </Fragment>
    );
  }
}

export default BookingPage;