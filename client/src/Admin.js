import React, { Component, Fragment } from 'react';
import { Container, Header, Button, Modal, Form, Grid, Image, Menu, Icon, Divider, Table, Statistic } from 'semantic-ui-react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import _ from 'lodash';

class Admin extends Component {

  state = {
    redirectAdmin: false,
    redirectBookings: false,
    redirectOrders: false,
    redirectReception: false,
    department: [],
    food: [],
    rooms: [],
    firstRoom: '',
    secondRoom: '',
    thirdRoom: '',    
    firstFood: '',
    secondFood: '',
    thirdFood: '',
    drink: [],
    firstDrink: '',
    secondDrink: '',
    thirdDrink: '',
    departmentID: '',
    departmentName: '',
    roomName: '',
    eposName: '',
    maxOccupancy: '',
    price: '',
    description: '',
    barName: '',
    tableNumber: '',
    tableSize: '',
    beverageName: '',
    beverageIngredients: '',
    beveragePrice: '',
    beverageStockAmount: '',
    foodName: '',
    foodIngredients: '',
    foodPrice: '',
    foodStockAmount: '',
    firstName: '',
    lastName: '',
    eposLogin: '',
    managementCode: '',
    alertAmount: '',
    departmentModalOpen: false,
    roomModalOpen: false,
    barsModalOpen: false,
    eposModalOpen: false,
    tableModalOpen: false,
    beverageModalOpen: false,
    foodModalOpen: false,
    staffModalOpen: false,
    redirectBookingPage: false,
    redirectOrderPage: false,
    redirectReceptionPage: false,
    redirectReports: false,
    gymUsers: '',
    golfUsers: '',
    poolUsers: '',
    orders: []
  }

  openAdmin = () => {
    this.setState({ redirectAdmin: true })
  }

  openReports = () => {
    this.setState({ redirectReports: true })
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
    var self = this
    var intervalID = window.setInterval(myCallback, 500);
    function myCallback() {
      self.getAllBeverages();
      self.getAllFood();
      self.getAllRooms();
      self.getAllLeisure();
      self.getAllOrders();
    }
    this.getAllDepartments();
    this.getAllFood();
    this.getAllBeverages();
    this.getAllRooms();
  }

  getAllOrders = async () => {
    const ordersPromise = axios.get('http://localhost:5000/api/orders/allapp')
    
    const complete = await Promise.resolve(ordersPromise)

    this.setState({ orders: complete.data.response }, () => {

    })
  }

  getAllLeisure = async () => {
    const leisurePromise = axios.get('http://localhost:5000/api/leisure/all')
    
    const complete = await Promise.resolve(leisurePromise)

    this.setState({ gymUsers: complete.data.response[0].gym_users, poolUsers: complete.data.response[0].pool_users, golfUsers: complete.data.response[0].golf_users }, () => {

    })
  }

  generateTopThree = async () => {
    const { food } = this.state

    var i, firstNameFood, secondNameFood, thirdNameFood
    var first = 0
    var second = 0
    var third = 0

    for (i = 0; i < food.length; i++) {
      if (parseInt(food[i].number_sold) > first) {
        third = second
        thirdNameFood = secondNameFood
        second = first
        secondNameFood = firstNameFood
        first = parseInt(food[i].number_sold)
        firstNameFood = food[i]
      }
      else if (parseInt(food[i].number_sold) > second) {
        third = second
        thirdNameFood = secondNameFood
        second = parseInt(food[i].number_sold)
        secondNameFood = food[i]
      }
      else if (parseInt(food[i].number_sold) > third) {
        third = parseInt(food[i].number_sold)
        thirdNameFood = food[i]
      }
    }

    this.setState({ firstFood: firstNameFood, secondFood: secondNameFood, thirdFood: thirdNameFood })
  }

  generateTopThreeDrink = async () => {
    const { drink } = this.state

    var i, firstNameDrink, secondNameDrink, thirdNameDrink
    var first = 0
    var second = 0
    var third = 0

    for (i = 0; i < drink.length; i++) {
      if (parseInt(drink[i].number_sold) > first) {
        third = second
        thirdNameDrink = secondNameDrink
        second = first
        secondNameDrink = firstNameDrink
        first = parseInt(drink[i].number_sold)
        firstNameDrink = drink[i]
      }
      else if (parseInt(drink[i].number_sold) > second) {
        third = second
        thirdNameDrink = secondNameDrink
        second = parseInt(drink[i].number_sold)
        secondNameDrink = drink[i]
      }
      else if (parseInt(drink[i].number_sold) > third) {
        third = parseInt(drink[i].number_sold)
        thirdNameDrink = drink[i]
      }
    }

    this.setState({ firstDrink: firstNameDrink, secondDrink: secondNameDrink, thirdDrink: thirdNameDrink })
  }

  generateTopThreeRooms = async () => {
    const { rooms } = this.state

    var i, firstNameRoom, secondNameRoom, thirdNameRoom
    var first = 0
    var second = 0
    var third = 0

    for (i = 0; i < rooms.length; i++) {
      if (parseInt(rooms[i].number_of_bookings) > first) {
        third = second
        thirdNameRoom = secondNameRoom
        second = first
        secondNameRoom = firstNameRoom
        first = parseInt(rooms[i].number_of_bookings)
        firstNameRoom = rooms[i]
      }
      else if (parseInt(rooms[i].number_of_bookings) > second) {
        third = second
        thirdNameRoom = secondNameRoom
        second = parseInt(rooms[i].number_of_bookings)
        secondNameRoom = rooms[i]
      }
      else if (parseInt(rooms[i].number_of_bookings) > third) {
        third = parseInt(rooms[i].number_of_bookings)
        thirdNameRoom = rooms[i]
      }
    }

    this.setState({ firstRoom: firstNameRoom, secondRoom: secondNameRoom, thirdRoom: thirdNameRoom })
  }

  getAllFood = async () => {
    const foodPromise = axios.get('http://localhost:5000/api/food/all')
    
    const complete = await Promise.resolve(foodPromise)

    this.setState({ food: complete.data.response }, () => {
      this.generateTopThree()
    })
  }

  getAllRooms = async () => {
    const roomPromise = axios.get('http://localhost:5000/api/rooms/all')
    
    const complete = await Promise.resolve(roomPromise)

    this.setState({ rooms: complete.data.response }, () => {
      this.generateTopThreeRooms()
    })
  }

  getAllBeverages = async () => {
    const drinkPromise = axios.get('http://localhost:5000/api/beverages/all')
    
    const complete = await Promise.resolve(drinkPromise)

    this.setState({ drink: complete.data.response }, () => {
      this.generateTopThreeDrink()
    })
  }

  getAllDepartments = async () => {
    const departmentPromise = axios.get('http://localhost:5000/api/departments/all')
    
    const complete = await Promise.resolve(departmentPromise)

    this.setState({ department: complete.data.response }, () => {

    })
  }

  openBookingPage = () => {
    this.setState({ redirectBookingPage: true })
  }

  openOrderPage = () => {
    this.setState({ redirectOrderPage: true })
  }

  openReceptionPage = () => {
    this.setState({ redirectReceptionPage: true })
  }

  closeModal = () => {
    this.setState({ alertAmount: '', firstName: '', lastName: '', eposLogin: '', managementCode: '', foodIngredients: '', foodName: '', foodPrice: '', foodStockAmount: '', beverageIngredients: '', beverageName: '', beveragePrice: '', beverageStockAmount: '', tableNumber: '', tableSize: '', departmentID: '', departmentName: '', roomName: '', barName: '', eposName: '', maxOccupancy: '', price: '', description: '', departmentModalOpen: false, roomModalOpen: false, barsModalOpen: false, eposModalOpen: false, tableModalOpen: false, beverageModalOpen: false, foodModalOpen: false, staffModalOpen: false })
  }

  openDepartmentModal = () => {
    this.setState({ departmentModalOpen: true })
  }

  openRoomModal = () => {
    this.setState({ roomModalOpen: true })
  }

  openBarsModal = () => {
    this.setState({ barsModalOpen: true })
  }

  openEposModal = () => {
    this.setState({ eposModalOpen: true })
  }

  openTableModal = () => {
    this.setState({ tableModalOpen: true })
  }

  openBeverageModal = () => {
    this.setState({ beverageModalOpen: true })
  }

  openFoodModal = () => {
    this.setState({ foodModalOpen: true })
  }

  openStaffModal = () => {
    this.setState({ staffModalOpen: true })
  }

  valueChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  departmentNameChange = (e, data) => {
    this.setState({ departmentD: data.value })
  }

  createDepartment = async () => {
    const departmentName = this.state

    axios.post('http://localhost:5000/api/departments/create', departmentName)
    .then((response)=>{
      if(response.data.success){
        this.closeModal()
        this.getAllDepartments()
      }
    })
  }

  createRoom = async () => {
    const { roomName, maxOccupancy, price, description } = this.state

    const room = {
      roomName: roomName,
      maxOccupancy: maxOccupancy,
      price: price,
      description: description
    }

    axios.post('http://localhost:5000/api/rooms/create', room)
    .then((response)=>{
      if(response.data.success){
        this.closeModal()
      }
    })
  }

  createBar = async () => {
    const { barName, departmentID } = this.state

    const bar = {
      barName: barName,
      departmentID: departmentID[0]
    }

    axios.post('http://localhost:5000/api/bars/create', bar)
    .then((response)=>{
      if(response.data.success){
        this.closeModal()
      }
    })
  }

  createEpos = async () => {
    const { eposName, departmentID } = this.state

    const epos = {
      eposName: eposName,
      departmentID: departmentID[0]
    }

    axios.post('http://localhost:5000/api/epos/create', epos)
    .then((response)=>{
      if(response.data.success){
        this.closeModal()
      }
    })
  }

  createTable = async () => {
    const { tableNumber, tableSize, departmentID } = this.state

    const table = {
      tableNumber: tableNumber,
      tableSize: tableSize,
      departmentID: departmentID[0]
    }

    axios.post('http://localhost:5000/api/tables/create', table)
    .then((response)=>{
      if(response.data.success){
        this.closeModal()
      }
    })
  }

  createBeverage = async () => {
    const { beverageName, beverageIngredients, beveragePrice, beverageStockAmount, alertAmount } = this.state

    const beverage = {
      beverageName: beverageName,
      ingredients: beverageIngredients,
      price: beveragePrice,
      stockAmount: beverageStockAmount,
      alertAmount: alertAmount
    }

    axios.post('http://localhost:5000/api/beverages/create', beverage)
    .then((response)=>{
      if(response.data.success){
        this.closeModal()
      }
    })
  }

  createFood = async () => {
    const { foodName, foodIngredients, foodPrice, foodStockAmount, alertAmount } = this.state

    const food = {
      foodName: foodName,
      ingredients: foodIngredients,
      price: foodPrice,
      stockAmount: foodStockAmount,
      alertAmount: alertAmount
    }

    axios.post('http://localhost:5000/api/food/create', food)
    .then((response)=>{
      if(response.data.success){
        this.closeModal()
      }
    })
  }

  createStaff = async () => {
    const { firstName, lastName, departmentID, eposLogin, managementCode } = this.state

    const staff = {
      firstName: firstName,
      lastName: lastName,
      departmentID: departmentID[0],
      eposLogin: eposLogin,
      managementCode: managementCode
    }

    axios.post('http://localhost:5000/api/staff/create', staff)
    .then((response)=>{
      if(response.data.success){
        this.closeModal()
      }
    })
  }

  render() {
    const { department, orders } = this.state

    const departmentList = department.map((list) => ({   
      key: list._id,
      value: `${list._id}`,
      text: `${list.name}`
    }))

    if (this.state.redirectReception) {
      return <Redirect to='/ReceptionPage' />
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
        <Container fluid style={{ 'background': 'linear-gradient(to right, #222, #666)', height: '60px', paddingLeft: '30px', paddingRight: '30px', marginBottom: '30px' }} textAlign={'right'}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column textAlign='left'>
                <Menu compact style={{ 'background-color': 'transparent', 'border': '0px' }}>
                  <Menu.Item style={{ 'color': '#1affc6' }} as='a'><Icon name='home' style={{ 'color': '#1affc6' }}/>Home</Menu.Item>
                  <Menu.Item style={{ 'color': '#FFF' }} as='a' onClick={this.openReception}><Icon name='desktop'/>Reception</Menu.Item>
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
        <Container fluid>
          <Grid stackable columns={6} textAlign='center' style={{ marginBottom: '10px' }}>
            <Grid.Row>
              <Grid.Column>
                <Modal open={this.state.roomModalOpen} onClose={this.closeModal} trigger={<Button basic color='teal' onClick={this.openRoomModal} style={{ width: '150px', height: '50px' }}><Icon name='bed' />Create Room</Button>}>
                  <Modal.Header>Create a New Room</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Form.Input label='Room Name' name='roomName' value={this.state.roomName} onChange={this.valueChange.bind(this)} placeholder='Enter room name...' required />
                      <Form.Input label='Max Occupancy' name='maxOccupancy' value={this.state.maxOccupancy} onChange={this.valueChange.bind(this)} placeholder='Maximum number of guests...' required />
                      <Form.Input label='Room Price' name='price' value={this.state.price} onChange={this.valueChange.bind(this)} placeholder='Cost per night...' required />
                      <Form.Input label='Room Amenities' name='description' value={this.state.description} onChange={this.valueChange.bind(this)} placeholder='What does this room offer...' required />
                      <Modal.Actions>
                        <Button basic color='teal' onClick={this.createRoom}>Create</Button>
                        <Button basic color='red' onClick={this.closeModal}>Cancel</Button>
                      </Modal.Actions>
                    </Form>
                  </Modal.Content>
                </Modal>
              </Grid.Column>
              <Grid.Column>
                <Modal open={this.state.staffModalOpen} onClose={this.closeModal} trigger={<Button basic color='teal' onClick={this.openStaffModal} style={{ width: '150px', height: '50px' }}><Icon name='users' />Create Staff</Button>}>
                  <Modal.Header>Create a New Staff Member</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Form.Input label='First Name' name='firstName' value={this.state.firstName} onChange={this.valueChange.bind(this)} placeholder='Enter first name...' required />
                      <Form.Input label='Last Name' name='lastName' value={this.state.lastName} onChange={this.valueChange.bind(this)} placeholder='Enter last name...' required />  
                      <Form.Input label='EPOS Login Code' name='eposLogin' value={this.state.eposLogin} onChange={this.valueChange.bind(this)} placeholder='Enter unique four character login code...' />
                      <Form.Input label='Management Code' name='managementCode' value={this.state.managementCode} onChange={this.valueChange.bind(this)} placeholder='Enter unique four character management code...' />
                      <Modal.Actions>
                        <Button basic color='teal' onClick={this.createStaff}>Create</Button>
                        <Button basic color='red' onClick={this.closeModal}>Cancel</Button>
                      </Modal.Actions>
                    </Form>
                  </Modal.Content>
                </Modal>
              </Grid.Column>
              <Grid.Column>
                <Modal open={this.state.eposModalOpen} onClose={this.closeModal} trigger={<Button basic color='teal' onClick={this.openEposModal} style={{ width: '150px', height: '50px' }}><Icon name='pound' />Create Revenue Centre</Button>}>
                  <Modal.Header>Create a New Revenue Centre</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Form.Input label='Revenue Centre Name' name='eposName' value={this.state.eposName} onChange={this.valueChange.bind(this)} placeholder='Enter Revenue Centre name...' required />  
                      <Modal.Actions>
                        <Button basic color='teal' onClick={this.createEpos}>Create</Button>
                        <Button basic color='red' onClick={this.closeModal}>Cancel</Button>
                      </Modal.Actions>
                    </Form>
                  </Modal.Content>
                </Modal>
              </Grid.Column>
              <Grid.Column>
                <Modal open={this.state.tableModalOpen} onClose={this.closeModal} trigger={<Button basic color='teal' onClick={this.openTableModal} style={{ width: '150px', height: '50px' }}><Icon name='tumblr' />Create Table</Button>}>
                  <Modal.Header>Create a New Table</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Form.Input label='Table Number' name='tableNumber' value={this.state.tableNumber} onChange={this.valueChange.bind(this)} placeholder='Enter table number...' required />
                      <Form.Input label='Maximum Size' name='tableSize' value={this.state.tableSize} onChange={this.valueChange.bind(this)} placeholder='Enter max number of guests...' required />  
                      <Modal.Actions>
                        <Button basic color='teal' onClick={this.createTable}>Create</Button>
                        <Button basic color='red' onClick={this.closeModal}>Cancel</Button>
                      </Modal.Actions>
                    </Form>
                  </Modal.Content>
                </Modal>
              </Grid.Column>
              <Grid.Column>
                <Modal open={this.state.beverageModalOpen} onClose={this.closeModal} trigger={<Button basic color='teal' onClick={this.openBeverageModal} style={{ width: '150px', height: '50px' }}><Icon name='coffee' />Create Beverage</Button>}>
                  <Modal.Header>Create a New Beverage</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Form.Input label='Beverage Name' name='beverageName' value={this.state.beverageName} onChange={this.valueChange.bind(this)} placeholder='Enter beverage name...' required />
                      <Form.Input label='Price' name='beveragePrice' value={this.state.beveragePrice} onChange={this.valueChange.bind(this)} placeholder='Enter beverage price...' required />
                      <Form.Input label='Amount Adding to Stock' name='beverageStockAmount' value={this.state.beverageStockAmount} onChange={this.valueChange.bind(this)} placeholder='How many are being added...' required />
                      <Form.Input label='Amount to Trigger Alert' name='alertAmount' value={this.state.alertAmount} onChange={this.valueChange.bind(this)} placeholder='Get notified when stock levels reach...' required />
                      <Form.Input label='Ingredients' name='beverageIngredients' value={this.state.beverageIngredients} onChange={this.valueChange.bind(this)} placeholder='What are the ingredients...' required />   
                      <Modal.Actions>
                        <Button basic color='teal' onClick={this.createBeverage}>Create</Button>
                        <Button basic color='red' onClick={this.closeModal}>Cancel</Button>
                      </Modal.Actions>
                    </Form>
                  </Modal.Content>
                </Modal>
              </Grid.Column>
              <Grid.Column>
                <Modal open={this.state.foodModalOpen} onClose={this.closeModal} trigger={<Button basic color='teal' onClick={this.openFoodModal} style={{ width: '150px', height: '50px' }}><Icon name='food' />Create Food</Button>}>
                  <Modal.Header>Create New Food</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Form.Input label='Food Name' name='foodName' value={this.state.foodName} onChange={this.valueChange.bind(this)} placeholder='Enter food name...' required />
                      <Form.Input label='Price' name='foodPrice' value={this.state.foodPrice} onChange={this.valueChange.bind(this)} placeholder='Enter food price...' required />
                      <Form.Input label='Amount Adding to Stock' name='foodStockAmount' value={this.state.foodStockAmount} onChange={this.valueChange.bind(this)} placeholder='How many are being added...' required />
                      <Form.Input label='Amount to Trigger Alert' name='alertAmount' value={this.state.alertAmount} onChange={this.valueChange.bind(this)} placeholder='Get notified when stock levels reach...' required />
                      <Form.Input label='Ingredients' name='foodIngredients' value={this.state.foodIngredients} onChange={this.valueChange.bind(this)} placeholder='What are the ingredients...' required />   
                      <Modal.Actions>
                        <Button basic color='teal' onClick={this.createFood}>Create</Button>
                        <Button basic color='red' onClick={this.closeModal}>Cancel</Button>
                      </Modal.Actions>
                    </Form>
                  </Modal.Content>
                </Modal>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={3} padded style={{ marginBottom: '10px' }}>
            <Grid.Row>
              <Grid.Column>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell style={{ 'background': '#444', 'color': '#1affc6' }} textAlign='center' colSpan='2'>Top Selling Food</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                      <Table.HeaderCell style={{ 'background': '#AAA', 'color': '#FFF' }} width='12'>Food Name</Table.HeaderCell>
                      <Table.HeaderCell style={{ 'background': '#AAA', 'color': '#FFF' }} width='4' textAlign='right'>Amount Sold</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell><Icon name='star' style={{ 'color': '#FFD700' }}/>{this.state.firstFood.name}</Table.Cell>
                      <Table.Cell textAlign='right' content={this.state.firstFood.number_sold} />
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Icon name='star' style={{ 'color': '#C0C0C0' }}/>{this.state.secondFood.name}</Table.Cell>
                      <Table.Cell textAlign='right' content={this.state.secondFood.number_sold} />
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Icon name='star' style={{'color': '#cd7f32' }}/>{this.state.thirdFood.name}</Table.Cell>
                      <Table.Cell textAlign='right' content={this.state.thirdFood.number_sold} />
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
              <Grid.Column>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell style={{ 'background': '#444', 'color': '#1affc6' }} textAlign='center' colSpan='2'>Top Selling Drinks</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                      <Table.HeaderCell style={{ 'background': '#AAA', 'color': '#FFF' }} width='12'>Drink Name</Table.HeaderCell>
                      <Table.HeaderCell style={{ 'background': '#AAA', 'color': '#FFF' }} width='4' textAlign='right'>Amount Sold</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell><Icon name='star' style={{ 'color': '#FFD700' }}/>{this.state.firstDrink.name}</Table.Cell>
                      <Table.Cell textAlign='right' content={this.state.firstDrink.number_sold} />
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Icon name='star' style={{ 'color': '#C0C0C0' }}/>{this.state.secondDrink.name}</Table.Cell>
                      <Table.Cell textAlign='right' content={this.state.secondDrink.number_sold} />
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Icon name='star' style={{'color': '#cd7f32' }}/>{this.state.thirdDrink.name}</Table.Cell>
                      <Table.Cell textAlign='right' content={this.state.thirdDrink.number_sold} />
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
              <Grid.Column>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell style={{ 'background': '#444', 'color': '#1affc6' }} textAlign='center' colSpan='2'>Top Selling Rooms</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                      <Table.HeaderCell style={{ 'background': '#AAA', 'color': '#FFF' }} width='12'>Room Name / Number</Table.HeaderCell>
                      <Table.HeaderCell style={{ 'background': '#AAA', 'color': '#FFF' }} width='4' textAlign='right'>Times Booked</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell><Icon name='star' style={{ 'color': '#FFD700' }}/>{this.state.firstRoom.name}</Table.Cell>
                      <Table.Cell textAlign='right' content={this.state.firstRoom.number_of_bookings} />
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Icon name='star' style={{ 'color': '#C0C0C0' }}/>{this.state.secondRoom.name}</Table.Cell>
                      <Table.Cell textAlign='right' content={this.state.secondRoom.number_of_bookings} />
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><Icon name='star' style={{'color': '#cd7f32' }}/>{this.state.thirdRoom.name}</Table.Cell>
                      <Table.Cell textAlign='right' content={this.state.thirdRoom.number_of_bookings} />
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid padded columns={3}>
            <Grid.Row>
              <Grid.Column>
                <Grid>
                  <Grid.Row textAlign='center' verticalAlign='middle'>
                    <Grid.Column>
                      <Header as='h2' style={{ 'display': 'inline-block', paddingRight: '10px' }}>Leisure Facilities Status</Header><Header style={{ 'display': 'inline-block' }} color='red' as='h6'><Icon name='dot circle outline' color='red' />LIVE</Header>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row textAlign='center'>
                    <Grid.Column>
                      <Statistic style={{ marginRight: '45px' }}>
                        <Statistic.Value><Icon color='red' name='heartbeat' />{this.state.gymUsers}</Statistic.Value>
                        <Statistic.Label>Gym Users</Statistic.Label>
                      </Statistic>
                      <Statistic style={{ marginLeft: '45px' }}>
                        <Statistic.Value><Icon color='blue' name='tint' />{this.state.poolUsers}</Statistic.Value>
                        <Statistic.Label>Swimmers</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row textAlign='center'>
                    <Grid.Column>
                      <Statistic>
                        <Statistic.Value><Icon style={{ 'color': '#CCC' }} name='golf ball' />{this.state.golfUsers}</Statistic.Value>
                        <Statistic.Label>Active Golfers</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column>
                
              </Grid.Column>
              <Grid.Column>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell style={{ 'background': '#444', 'color': '#1affc6' }} textAlign='center' colSpan='3'>Table App Orders</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                      <Table.HeaderCell style={{ 'background': '#AAA', 'color': '#FFF' }}>Table</Table.HeaderCell>
                      <Table.HeaderCell style={{ 'background': '#AAA', 'color': '#FFF' }}>Order Price</Table.HeaderCell>
                      <Table.HeaderCell style={{ 'background': '#AAA', 'color': '#FFF' }}>Order Time</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {orders &&
                    _.map(orders, (order) => (
                      <Table.Row key={order._id}>
                        <Table.Cell>{(order.table_name)}</Table.Cell>
                        <Table.Cell>£{(order.total_price)}</Table.Cell>
                        <Table.Cell>{(order.transaction_time)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row> 
          </Grid>
        </Container>
      </Fragment>
    )
  }
};

export default Admin;