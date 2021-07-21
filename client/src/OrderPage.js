import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Container, Button, Form, Modal, Table, Header, Icon, Message, Grid, Input, Rating, Label, Menu } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import { isNull } from 'util';

class OrderPage extends Component {

  state = {
    loginModalOpen: true,
    stockOrderModal: false,
    removeOrderModal: false,
    cashPaymentModel: false,
    confirmationModalOpen: false,
    drinkIngredientCheckModal: false,
    foodIngredientCheckModal: false,
    giveChangeModal: false,
    payOrderModal: false,
    roomChargeModal: false,
    loginCredentials: '',
    managementCredentials: '',
    hasWrongCredentials: true,
    roomValidationFailed: true,
    tooLittleTendered: true,
    invalidAmount: true,
    notManagementCredentials: true,
    signedInUser: '',
    food: [],
    drink: [],
    table: [],
    orders: [],
    epos: [],
    closedOrders: [],
    tableID: '',
    foodID: '',
    allFoodID: [],
    selectedFood: [],
    selectedDrinks: [],
    drinkID: '',
    allDrinkID: [],
    eposID: '',
    orderID: '',
    removeOrderID: '',
    removeOrderEpos: '',
    eposName: '',
    payOrderPrice: '',
    tableName: '',
    paymentType: '',
    paymentAmount: '',
    orderRating: '',
    roomNumber: '',
    guestPin: '',
    guestSurname: '',
    cashGiven: '',
    changeDue: '',
    drinkName: '',
    drinkIngredients: '',
    foodName: '',
    foodIngredients: '',
    activeItem: 'openOrders',
    hiddenClosedOrders: true,
    hiddenOpenOrders: false,
    redirectAdmin: false,
    redirectBookings: false,
    redirectReception: false,
    redirectReports: false,
    redirectOrders: false,
    foodDrinkToOrder: []
  }

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

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
    if (this.state.activeItem === 'openOrders') {
      this.setState({ hiddenOpenOrders: true, hiddenClosedOrders: false })
    } else {
      this.setState({ hiddenOpenOrders: false, hiddenClosedOrders: true })
    }}

  componentDidMount() {
    this.getAllFood();
    this.getAllDrinks();
    this.getAllTables();
    this.getAllEpos();
  }

  orderStockModal = () => {
    this.setState({ stockOrderModal: true })
  }

  checkStock = async () => {
    const { food, drink } = this.state
    var orderListArray = []

    var i
    for (i = 0; i < food.length; i++) {
      var order = new Object()
      if (food[i].number_in_stock <= food[i].alert_amount ) {
        order['qty'] = food[i].number_in_stock
        order['name'] = food[i].name
        orderListArray.push(order)
      }
    }

    var j
    for (j = 0; j < drink.length; j++) {
      var order = new Object()
      if (drink[j].number_in_stock <= drink[j].alert_amount) {
        order['qty'] = drink[j].number_in_stock
        order['name'] = drink[j].name
        orderListArray.push(order)
      }
    }

    this.setState({ foodDrinkToOrder: orderListArray })
  }

  getAllFood = async () => {
    const foodPromise = axios.get('http://localhost:5000/api/food/all')
    
    const complete = await Promise.resolve(foodPromise)

    this.setState({ food: complete.data.response }, () => {

    })

    this.checkStock()
  }

  getAllDrinks = async () => {
    const drinkPromise = axios.get('http://localhost:5000/api/beverages/all')
    
    const complete = await Promise.resolve(drinkPromise)

    this.setState({ drink: complete.data.response }, () => {

    })

    this.checkStock()
  }

  getAllEpos = async () => {
    const eposPromise = axios.get('http://localhost:5000/api/epos/all')
    
    const complete = await Promise.resolve(eposPromise)

    this.setState({ epos: complete.data.response }, () => {

    })
  }

  getAllOrders = async () => {
    const { eposID } = this.state

    const eposDetails = {
      eposID: eposID
    }

    const orderPromise = axios.post('http://localhost:5000/api/orders/byepos', eposDetails)
    
    const complete = await Promise.resolve(orderPromise)

    this.setState({ orders: complete.data.response }, () => {

    })
  }

  getAllClosedOrders = async () => {
    const { eposID } = this.state

    const eposDetails = {
      eposID: eposID
    }

    const orderPromise = axios.post('http://localhost:5000/api/orders/closedbyepos', eposDetails)
    
    const complete = await Promise.resolve(orderPromise)

    this.setState({ closedOrders: complete.data.response }, () => {

    })
  }

  getAllTables = async () => {
    const tablePromise = axios.get('http://localhost:5000/api/tables/all')
    
    const complete = await Promise.resolve(tablePromise)

    this.setState({ table: complete.data.response }, () => {

    })
  }

  handleRate = (e, { rating }) => this.setState({ orderRating: rating })

  confirmationModal = () => {
    this.setState({ confirmationModalOpen: true })
  }

  giveChangeModal = () => {
    this.setState({ giveChangeModal: true })
  }

  roomCharge = () => {
    this.setState({ roomChargeModal: true })
  }

  cashPayment = () => {
    this.setState({ cashPaymentModel: true })
  }

  signOut = () => {
    this.setState({ loginModalOpen: true, loginCredentials: '', signedInUser: '', eposName: '', hasWrongCredentials: true })
  }

  closeModal = () => {
    this.setState({ stockOrderModal: false, drinkIngredientCheckModal: false, foodIngredientCheckModal: false, giveChangeModal: false, cashPaymentModel: false, confirmationModalOpen: false, loginModalOpen: false, removeOrderModal: false, roomChargeModal: false })
  }

  closeTheModal = () => {
    this.setState({ payOrderModal: false, orderRating: '' })
  }

  valueChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  cashValueChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  incrementFoodItemAmount (orderItems, e, data) {
    const { selectedFood, food } = this.state

    var i
    var j
    for (i = 0; i < food.length; i++) {
      if (orderItems.id == food[i]._id) {
        if (orderItems.qty != food[i].number_in_stock) {
          for (j = 0; j < selectedFood.length; j++) {
            if (orderItems.id == selectedFood[j].id) {
              selectedFood[j].qty = parseInt(selectedFood[j].qty + 1)
            }
          }
        } else {
          
        }
      }
    }
    this.setState({ selectedFood })
  }

  decrementFoodItemAmount (orderItems, e, data) {
    const { selectedFood } = this.state

    var i
    for (i = 0; i < selectedFood.length; i++) {
      if (orderItems.qty == 1) {

      } else {
        if (orderItems.id == selectedFood[i].id) {
          selectedFood[i].qty = parseInt(selectedFood[i].qty - 1)
        }
      }
    }
    this.setState({ selectedFood })
  }

  removeFoodItem (orderItems, e, data) {
    const { selectedFood } = this.state
    
    var i
    for (i = 0; i < selectedFood.length; i++) { 
      if ( orderItems.id == selectedFood[i].id) {
        selectedFood.splice(i, 1); 
      }
   }
    this.setState({ selectedFood })
  }

  incrementDrinkItemAmount (drinkItems, e, data) {
    const { selectedDrinks, drink } = this.state

    var i
    var j
    for (i = 0; i < drink.length; i++) {
      if (drinkItems.id == drink[i]._id) {
        if (drinkItems.qty != drink[i].number_in_stock) {
          for (j = 0; j < selectedDrinks.length; j++) {
            if (drinkItems.id == selectedDrinks[j].id) {
              selectedDrinks[j].qty = parseInt(selectedDrinks[j].qty + 1)
            }
          }
        } else {
          
        }
      }
    }
    this.setState({ selectedDrinks })
  }

  decrementDrinkItemAmount (drinkItems, e, data) {
    const { selectedDrinks } = this.state

    var i
    for (i = 0; i < selectedDrinks.length; i++) {
      if (drinkItems.qty == 1) {

      } else {
        if (drinkItems.id == selectedDrinks[i].id) {
          selectedDrinks[i].qty = parseInt(selectedDrinks[i].qty - 1)
        }
      }
    }
    this.setState({ selectedDrinks })
  }

  removeDrinkItem (drinkItems, e, data) {
    const { selectedDrinks } = this.state
    
    var i
    for (i = 0; i < selectedDrinks.length; i++) { 
      if ( drinkItems.id == selectedDrinks[i].id) {
        selectedDrinks.splice(i, 1); 
      }
   }

    this.setState({ selectedDrinks })
  }

  drinkIngredientCheck = async (drinkItems) => {
    this.setState({ drinkIngredientCheckModal: true, drinkName: drinkItems.name, drinkIngredients: drinkItems.ingredients[0] })
  }

  foodIngredientCheck = async (orderItems) => {
    this.setState({ foodIngredientCheckModal: true, foodName: orderItems.name, foodIngredients: orderItems.ingredients[0] })
  }

  wrongCredentials = () => {
    this.setState({ hasWrongCredentials: false })
  }

  wrongManagementCredentials = () => {
    this.setState({ notManagementCredentials: false })
  }

  amendOrder = async (order) => {
    const { food, selectedFood, drink, selectedDrinks } = this.state

    const orderDetails = {
      orderID: order._id
    }

    this.setState({ amendedOrder: order._id })

    const orderPromise = axios.post('http://localhost:5000/api/orders/id', orderDetails)

    const complete = await Promise.resolve(orderPromise)
    var beverageID = []
    var beverageQty = []
    var foodID = []
    var foodQty = []

    var i
    for (i = 0; i < complete.data.response[0].beverages.length; i++) {
      beverageID.push(complete.data.response[0].beverages[i])
      beverageQty.push(complete.data.response[0].quantity[i])
    }

    var j
    for (j = 0; j < complete.data.response[0].food.length; j++) {
      foodID.push(complete.data.response[0].food[j])
      foodQty.push(complete.data.response[0].quantity[j + complete.data.response[0].beverages.length])
    }

    var k
    var l
    for (k = 0; k < foodID.length; k++) {
      var objFood = new Object()
      for (l = 0; l < food.length; l++) {
        if (foodID[k] === food[l]._id) {
          objFood['id'] = food[l]._id
          objFood['name'] = food[l].name
          objFood['qty'] = foodQty[k]
          objFood['price'] = food[l].price
          objFood['ingredients'] = food[l].ingredients
          selectedFood.push(objFood)
        }
      }
    }

    var m
    var n
    for (m = 0; m < beverageID.length; m++) {
      var objDrink = new Object()
      for (n = 0; n < drink.length; n++) {
        if (beverageID[m] === drink[n]._id) {
          objDrink['id'] = drink[n]._id
          objDrink['name'] = drink[n].name
          objDrink['qty'] = beverageQty[m]
          objDrink['price'] = drink[n].price
          objDrink['ingredients'] = drink[n].ingredients
          selectedDrinks.push(objDrink)
        }
      }
    }

    const amendedQuantities = {
      food: selectedFood,
      beverages: selectedDrinks
    }

    axios.post('http://localhost:5000/api/orders/amendquantity', amendedQuantities)

    this.setState({ selectedFood: selectedFood, selectedDrinks: selectedDrinks, tableID: complete.data.response[0].table })
  }

  removeOrder = async () => {
    const { removeOrderEpos, removeOrderID } = this.state

    const orderDetails = {
      orderID: removeOrderID,
      eposID: removeOrderEpos
    }

    axios.post('http://localhost:5000/api/orders/remove', orderDetails)
      .then((response)=>{
        if(response.data.success){
          this.closeModal()
          this.setState({ managementCredentials: '', notManagementCredentials: true })
          this.getAllOrders()
          this.getAllClosedOrders()
        }
      })
  }

  addToList = async () => {
    const { food, foodID, selectedFood, allFoodID } = this.state

    var objFood = new Object()
    var i
    for (i = 0; i < food.length; i++) {
      if (foodID == food[i]._id) {
        objFood['id'] = foodID
        objFood['name'] = food[i].name
        objFood['qty'] = 1
        objFood['price'] = food[i].price
        objFood['ingredients'] = food[i].ingredients
      }  
    }
    selectedFood.push(objFood)
    allFoodID.push(objFood.id)

    this.setState({ selectedFood: selectedFood, allFoodID: allFoodID })
    this.setState({ foodID: '' })
  }

  addToDrinkList = async () => {
    const { drink, drinkID, selectedDrinks, allDrinkID } = this.state

    var objDrink = new Object()
    var j
    for (j = 0; j < drink.length; j++) {
      if (drinkID == drink[j]._id) {
        objDrink['id'] = drinkID
        objDrink['name'] = drink[j].name
        objDrink['qty'] = 1
        objDrink['price'] = drink[j].price
        objDrink['ingredients'] = drink[j].ingredients
      }  
    }
    selectedDrinks.push(objDrink)
    allDrinkID.push(objDrink.id)

    this.setState({ selectedDrinks: selectedDrinks, allDrinkID: allDrinkID })
    this.setState({ drinkID: '' })
  }

  createOrder = async () => {
    const { tableID, eposID, selectedFood, selectedDrinks, amendedOrder } = this.state

    var foodPrice = 0

    const tableSearch = {
      tableID: tableID
    }

    var i
    var price
    for (i = 0; i < selectedFood.length; i++) {
      price = selectedFood[i].qty * selectedFood[i].price
      foodPrice = foodPrice + price
    }

    var j
    var cost
    for (j = 0; j < selectedDrinks.length; j++) {
      cost = selectedDrinks[j].qty * selectedDrinks[j].price
      foodPrice = foodPrice + cost
    }

    const getTableName = axios.post('http://localhost:5000/api/tables/search', tableSearch)

    const awaitTable = await Promise.resolve(getTableName)

    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    if (currentMonth < 10) { 
      currentMonth = `0${currentMonth}`; 
    } else {
      currentMonth.toString()
    }

    const createOrder = {
      amendedOrder: amendedOrder,
      totalPrice: foodPrice,
      food: selectedFood,
      beverages: selectedDrinks,
      tableID: tableID,
      eposID: eposID,
      tableName: awaitTable.data.response.table_number,
      transactionMonth: currentMonth
    }

    axios.post('http://localhost:5000/api/orders/create', createOrder)
    .then((response)=>{
      if(response.data.success){
        this.getAllOrders()
        this.getAllClosedOrders()
        this.getAllFood()
        this.getAllDrinks()
        this.checkStock()
        this.setState({ allFoodID: [], tableID: '', allDrinkID: [], selectedDrinks: [], selectedFood: [] })
      }
    })  
  }

  validateCredentials = async () => {
    const { loginCredentials, eposID } = this.state

    const eposLogin = {
      eposLogin: loginCredentials
    }

    const getEpos = {
      eposID: eposID
    }

    const checkUser = axios.post('http://localhost:5000/api/staff/login', eposLogin)

    const awaitValidation = await Promise.resolve(checkUser)

    const checkEpos = axios.post('http://localhost:5000/api/epos/getname', getEpos)

    const awaitEpos = await Promise.resolve(checkEpos)

    if (awaitValidation.data.response) {
      this.setState({ signedInUser: awaitValidation.data.response.first_name + ' ' + awaitValidation.data.response.last_name, eposName: awaitEpos.data.response[0].name })
      this.getAllOrders()
      this.getAllClosedOrders()
      this.closeModal()
    } else {
      this.wrongCredentials()
    }

  }

  removeOrderModal = async (order) => {
    this.setState({ payOrderModal: false, removeOrderModal: true, removeOrderID: order._id, removeOrderEpos: order.epos })
  }

  payOrderModalOpen = async (order) => {
    this.setState({ payOrderModal: true, payOrderPrice: order.total_price, tableName: order.table_name, orderID: order._id })
  }

  makePayment = async () => {
    const { payOrderPrice, orderID, orderRating, cashGiven } = this.state

    const cashPaid = parseFloat(cashGiven)

    const orderDetails = {
      orderID: orderID,
      orderRating: orderRating
    }
    
    if (cashPaid === payOrderPrice) {
      axios.post('http://localhost:5000/api/orders/status', orderDetails)
      this.closeModal()
      this.closeTheModal()
      this.getAllOrders()
      this.getAllClosedOrders()
      this.confirmationModal()
      this.setState({ tooLittleTendered: true, cashGiven: '' })
    } else if (cashPaid < payOrderPrice) {
      this.setState({ tooLittleTendered: false })
    } else if (cashPaid > payOrderPrice) {
      this.setState({ changeDue: cashPaid - payOrderPrice })
      axios.post('http://localhost:5000/api/orders/status', orderDetails)
      this.getAllOrders()
      this.getAllClosedOrders()
      this.closeModal()
      this.closeTheModal()
      this.giveChangeModal()
      this.setState({ tooLittleTendered: true, cashGiven: '' })
    } 
  }

  validateRoomCharge = async () => {
    const { guestPin, guestSurname, roomNumber, payOrderPrice, orderID, orderRating } = this.state

    const roomCharge = {
      guestPin: guestPin,
      guestSurname: guestSurname,
      roomName: roomNumber
    }

    const orderDetails = {
      orderID: orderID,
      orderRating: orderRating
    }

    const checkGuest = axios.post('http://localhost:5000/api/customers/pin', roomCharge)

    const awaitValidation = await Promise.resolve(checkGuest)

    if (awaitValidation.data.response.length == 0) {
      this.setState({ roomValidationFailed: false })
    } else {
      const totalPrice = payOrderPrice + awaitValidation.data.response[0].room_charge_cost
      const newPrice = {
        totalPrice: totalPrice,
        customerID: awaitValidation.data.response[0]._id
      }
      axios.post('http://localhost:5000/api/customers/payment', newPrice)
      axios.post('http://localhost:5000/api/orders/status', orderDetails)
      this.getAllOrders()
      this.getAllClosedOrders()
      this.closeModal()
      this.closeTheModal()
      this.confirmationModal()
      this.setState({ guestPin: '', guestSurname: '', roomNumber: '' })
    }
  }

  validateManagementCredentials = async () => {
    const { managementCredentials } = this.state

    const managementCodeCheck = {
      managementCode: managementCredentials
    }

    const checkCode = axios.post('http://localhost:5000/api/staff/management', managementCodeCheck)

    const awaitValidation = await Promise.resolve(checkCode)

    if (awaitValidation.data.response) {
      this.removeOrder()
    } else {
      this.wrongManagementCredentials()
    }
  }

  foodNameChange = (e, data) => {
    this.setState({ foodID: data.value })
  }

  drinkNameChange = (e, data) => {
    this.setState({ drinkID: data.value })
  }

  tableNameChange = (e, data) => {
    this.setState({ tableID: data.value })
  }

  eposNameChange = (e, data) => {
    this.setState({ eposID: data.value })
  }

  orderList = () => {
    if ( this.state.foodDrinkToOrder.length !== 0 ) {
      return this.state.foodDrinkToOrder.map( lowStockItems =>
        <Table.Row>
          <Table.Cell>{( lowStockItems.name )}</Table.Cell>
          <Table.Cell textAlign='right'>{( lowStockItems.qty )}</Table.Cell>
        </Table.Row>
      )
    }
  }

  render() {

    const { food, table, orders, epos, drink, selectedFood, selectedDrinks, closedOrders } = this.state

    const foodList = food.map((list) => ({   
      key: list._id,
      value: `${list._id}`,
      text: `${list.name}`
    }))

    const drinkList = drink.map((list) => ({   
      key: list._id,
      value: `${list._id}`,
      text: `${list.name}`
    }))

    const tableList = table.map((list) => ({   
      key: list._id,
      value: `${list._id}`,
      text: `${list.table_number}`
    }))

    const eposList = epos.map((list) => ({   
      key: list._id,
      value: `${list._id}`,
      text: `${list.name}`
    }))

    const { activeItem } = this.state

    if (this.state.redirectAdmin) {
      return <Redirect to='/Admin' />
    }
    else if (this.state.redirectBookings) {
      return <Redirect to='/BookingPage' />
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
                  <Menu.Item style={{ 'color': '#FFF' }} as='a' onClick={this.openBookings}><Icon name='calendar alternate outline'/>Bookings</Menu.Item>
                  <Menu.Item style={{ 'color': '#1affc6' }} as='a'><Icon style={{ 'color': '#1affc6' }} name='food'/>Food & Bev</Menu.Item>
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
                <Form.Dropdown width={5} closeOnChange fluid search selection label='Epos Selection' name='eposID' options={eposList} onChange={this.eposNameChange} placeholder='Select epos terminal' />
              </Form>
              <Modal.Actions>
                <Button basic disabled={!this.state.eposID || !this.state.loginCredentials} animated color='teal' style={{ marginTop: '25px' }} onClick={this.validateCredentials}><Button.Content visible>Login</Button.Content><Button.Content hidden><Icon name='lock open' /></Button.Content></Button>
              </Modal.Actions>
            </Modal.Content>
          </Modal>
          <Message hidden={!this.state.foodDrinkToOrder.length > 0} error>Low stock alert! Order replenishments as soon as possible to avoid customer dissatisfaction. Click <a onClick={this.orderStockModal} style={{ 'font-weight': 'bold', 'color': '#a64947' }}>here</a> to see item(s)</Message>
          <Modal open={this.state.stockOrderModal} onClose={this.closeModal}>
            <Modal.Header>Low Stock</Modal.Header>
            <Modal.Content>
              <Table>
                <Table.Header>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell textAlign='right'>Amount in Stock</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                  { this.orderList() }
                </Table.Body>
              </Table>
            </Modal.Content>
          </Modal>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Icon name='user' size='large' color='teal' style={{ display: 'inline', paddingRight: '5px' }} /><Header as='h3' style={{ display: 'inline' }} content={`${this.state.signedInUser} has signed into ${this.state.eposName}.`} />
              </Grid.Column>
              <Grid.Column>
                <Button onClick={this.signOut} floated='right' basic color='red'>Sign Out</Button>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Menu attached='top' tabular pointing secondary>
                  <Menu.Item name='openOrders' active={activeItem === 'openOrders'} onClick={this.handleItemClick}><Icon color='teal' name='shopping cart' />Open Orders</Menu.Item>
                  <Menu.Item name='closedOrders' active={activeItem === 'closedOrders'} onClick={this.handleItemClick}><Icon color='teal' name='cloud' />Closed Orders</Menu.Item>
                </Menu>
                <Table hidden={this.state.hiddenOpenOrders} color='teal' basic attached='bottom'>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>
                        <Icon name='tag' color='teal' />
                        Table Number
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        <Icon name='pound' color='teal' />
                        Total
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign='right'>
                        <Icon name='settings' color='teal' />
                        Actions
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {orders &&
                    _.map(orders, (order) => (
                      <Table.Row key={order._id}>
                        <Table.Cell>{(order.table_name)}</Table.Cell>
                        <Table.Cell>£{(order.total_price)}</Table.Cell>
                        <Table.Cell textAlign='right'><Button basic color='teal' onClick={() => {{this.payOrderModalOpen(order)}}}>Pay</Button><Button disabled as='div' labelPosition='left'><Label basic color='red' pointing='right'>Not In Demo</Label><Button basic color='olive' onClick={() => {{this.amendOrder(order)}}}>Amend</Button></Button><Button basic color='red' onClick={() => {{this.removeOrderModal(order)}}}>Remove</Button></Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                <Table hidden={this.state.hiddenClosedOrders} color='teal' basic attached='bottom'>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>
                        <Icon name='tag' color='teal' />
                        Table Number
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        <Icon name='heart' color='teal' />
                        Rating
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign='right'>
                        <Icon name='pound' color='teal' />
                        Total
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {closedOrders &&
                    _.map(closedOrders, (closedOrder) => (
                      <Table.Row key={closedOrder._id}>
                        <Table.Cell>{(closedOrder.table_name)}</Table.Cell>
                        <Table.Cell><Rating disabled icon='heart' rating={(closedOrder.order_rating)} maxRating={5} /></Table.Cell>
                        <Table.Cell textAlign='right'>£{(closedOrder.total_price)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4'>Create New Order</Header>
                <Form>
                  <Form.Dropdown width={3} closeOnChange fluid search selection label='Table Number' name='tableID' value={this.state.tableID} options={tableList} onChange={this.tableNameChange} placeholder='Select table' />
                  <Form.Group>
                    <Form.Dropdown width={6} closeOnChange fluid search selection clearable label='Food' name='foodID' value={this.state.foodID} options={foodList} onChange={this.foodNameChange} placeholder='Select food' />
                    <Form.Dropdown width={6} closeOnChange fluid search selection clearable label='Drink' name='drinkID' value={this.state.drinkID} options={drinkList} onChange={this.drinkNameChange} placeholder='Select drink(s)' />
                  </Form.Group>
                  <Form.Group>
                    <Form.Button basic color='teal' disabled={!this.state.tableID || (this.state.selectedFood.length < 1 && this.state.selectedDrinks.length < 1)} onClick={this.createOrder}>Create</Form.Button>
                    <Form.Button basic color='teal' disabled={(this.state.foodID && this.state.drinkID) || (!this.state.foodID && !this.state.drinkID) || !this.state.foodID} onClick={this.addToList}>Add Food</Form.Button>
                    <Form.Button basic color='teal' disabled={(this.state.foodID && this.state.drinkID) || (!this.state.foodID && !this.state.drinkID) || !this.state.drinkID} onClick={this.addToDrinkList}>Add Drinks</Form.Button>
                  </Form.Group>
                </Form>
                    <Table color='teal'>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell colSpan='5'><Icon name='food' color='teal' />Food Item(s)</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                      {selectedFood &&
                      _.map(selectedFood, (orderItems) => (
                        <Table.Row key={orderItems.id}>
                          <Table.Cell textAlign='left'><Button onClick={() => {{this.foodIngredientCheck(orderItems)}}} size='mini' circular icon><Icon name='question' /></Button></Table.Cell>
                          <Table.Cell>{(orderItems.name)}</Table.Cell>
                          <Table.Cell textAlign='right'><Input color='teal' labelPosition='right' label='Qty' disabled value={orderItems.qty} /></Table.Cell>
                          <Table.Cell textAlign='left'><Button.Group><Button onClick={this.incrementFoodItemAmount.bind(this, orderItems)} icon color='teal'><Icon name='plus'/></Button><Button onClick={this.decrementFoodItemAmount.bind(this, orderItems)} icon color='teal'><Icon name='minus'/></Button></Button.Group></Table.Cell>
                          <Table.Cell textAlign='right'><Button basic color='red' onClick={this.removeFoodItem.bind(this, orderItems)}>Remove</Button></Table.Cell>
                        </Table.Row>
                      ))}
                      </Table.Body>
                    </Table>
                    <Table color='teal'>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell colSpan='5'><Icon name='beer' color='teal' />Drink Item(s)</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                      {selectedDrinks &&
                      _.map(selectedDrinks, (drinkItems) => (
                        <Table.Row key={drinkItems.id}>
                          <Table.Cell textAlign='left'><Button onClick={() => {{this.drinkIngredientCheck(drinkItems)}}} size='mini' circular icon><Icon name='question' /></Button></Table.Cell>
                          <Table.Cell>{(drinkItems.name)}</Table.Cell>
                          <Table.Cell textAlign='right'><Input color='teal' labelPosition='right' label='Qty' disabled value={drinkItems.qty} /></Table.Cell>
                          <Table.Cell textAlign='left'><Button.Group><Button onClick={this.incrementDrinkItemAmount.bind(this, drinkItems)} icon color='teal'><Icon name='plus'/></Button><Button onClick={this.decrementDrinkItemAmount.bind(this, drinkItems)} icon color='teal'><Icon name='minus'/></Button></Button.Group></Table.Cell>
                          <Table.Cell textAlign='right'><Button basic color='red' onClick={this.removeDrinkItem.bind(this, drinkItems)}>Remove</Button></Table.Cell>
                        </Table.Row>
                      ))}
                      </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid.Row>
          </Grid>
          <Modal open={this.state.removeOrderModal} onClose={this.closeModal}>
            <Modal.Header>Order Removal Authorisation</Modal.Header>
            <Modal.Content>
              <Message negative hidden={this.state.notManagementCredentials}>
                <Message.Header>Not Management Credentials</Message.Header>
                <p>Please try again, credentials are case sensitive and must be management credentials.</p>
              </Message>
              <Form>
                <Form.Input label='Enter management credentials' name='managementCredentials' value={this.state.managementCredentials} onChange={this.valueChange.bind(this)} placeholder='eg - 1234' required />
              </Form>
              <Modal.Actions>
                <Button basic disabled={!this.state.managementCredentials} animated color='teal' style={{ marginTop: '25px' }} onClick={this.validateManagementCredentials}><Button.Content visible>Remove Order</Button.Content><Button.Content hidden><Icon name='trash alternate outline' /></Button.Content></Button>
              </Modal.Actions>
            </Modal.Content>
          </Modal>
          <Modal size='tiny' open={this.state.payOrderModal} onClose={this.closeTheModal}>
            <Modal.Header>Order Payment Screen</Modal.Header>
            <Modal.Content>
              <Header as='h4' content={`The total bill for table ${this.state.tableName} is £${this.state.payOrderPrice}.`}></Header>
              <Message attached content='Get feedback and choose a payment method'/>
              <Form className='attached fluid segment'>
                <Rating onRate={this.handleRate} maxRating={5} defaultRating={0} icon='heart' size='huge' style={{ marginBottom: '20px', marginTop: '5px' }}/>
                <Form.Group widths='equal'>
                  <Form.Button onClick={this.cashPayment} disabled={!this.state.orderRating} animated basic color='teal'><Button.Content visible>Pay with Cash</Button.Content><Button.Content hidden><Icon name='pound' /></Button.Content></Form.Button>
                  <Form.Field>
                    <Form.Button disabled={!this.state.orderRating} animated basic color='teal'><Button.Content visible>Pay by Card</Button.Content><Button.Content hidden><Icon name='credit card' /></Button.Content></Form.Button>
                    <Label size='tiny' basic color='red' pointing>Not in Demo Version</Label>
                  </Form.Field>
                  <Form.Button onClick={this.roomCharge} disabled={!this.state.orderRating} animated basic color='teal'><Button.Content visible>Charge to Room</Button.Content><Button.Content hidden><Icon name='bed' /></Button.Content></Form.Button>
                </Form.Group>
              </Form>
            </Modal.Content>
          </Modal>
          <Modal size='small' open={this.state.roomChargeModal} onClose={this.closeModal}>
            <Modal.Header>Room Charge Payment</Modal.Header>
              <Modal.Content>
                <Header as='h4' content={`A total of £${this.state.payOrderPrice} will be charged to the account.`}></Header>
                <Message negative hidden={this.state.roomValidationFailed}>
                  <Message.Header>Room Validation Failed</Message.Header>
                  <p>Please try again, the fields are case sensitive.</p>
                </Message>
                <Form>
                  <Form.Group widths='equal'>
                    <Form.Input label='Room Number' value={this.state.roomNumber} onChange={this.valueChange.bind(this)} name='roomNumber' required></Form.Input>
                    <Form.Input label='Guest Pin Code' value={this.state.guestPin} onChange={this.valueChange.bind(this)} name='guestPin' required></Form.Input>
                    <Form.Input label='Guest Surname' value={this.state.guestSurname} onChange={this.valueChange.bind(this)} name='guestSurname' required></Form.Input>
                  </Form.Group>
                  <Form.Button onClick={this.validateRoomCharge} disabled={!this.state.roomNumber || !this.state.guestPin || !this.state.guestSurname} basic color='teal'>Pay</Form.Button>
                </Form>
              </Modal.Content>
          </Modal>
          <Modal size='small' open={this.state.cashPaymentModel} onClose={this.closeModal}>
            <Modal.Header>Cash Payment</Modal.Header>
            <Modal.Content>
              <Header as='h4' content={`A total of £${this.state.payOrderPrice} is due.`}></Header>
              <Message negative hidden={this.state.tooLittleTendered}>
                <Message.Header>Too Little Tendered</Message.Header>
                <p>Please check cash again.</p>
              </Message>
              <Message negative hidden={this.state.invalidAmount}>
                <Message.Header>Only Numbers Allowed</Message.Header>
                <p>Please check your entry, only number are allowed here.</p>
              </Message>
              <Form>
                <Form.Input label='Cash Tendered' value={this.state.cashGiven} onChange={this.cashValueChange.bind(this)} name='cashGiven' required></Form.Input>
                <Form.Button onClick={this.makePayment} disabled={!this.state.cashGiven} basic color='teal'>Pay</Form.Button>
              </Form>
            </Modal.Content>
          </Modal>
          <Modal size='small' open={this.state.giveChangeModal}>
            <Modal.Header>Change Due!</Modal.Header>
            <Modal.Content>
            <Header as='h4' content={`A total of £${this.state.changeDue} is due to the customer.`}></Header>
              <Modal.Actions>
                <Button basic color='olive' onClick={this.closeModal}>Continue</Button>
                <Button basic color='red' onClick={this.signOut}>Sign Out</Button>
              </Modal.Actions>
            </Modal.Content>
          </Modal>
          <Modal size='tiny' open={this.state.confirmationModalOpen}>
            <Modal.Header>Payment Complete!</Modal.Header>
            <Modal.Content>
            <p>Do you wish to sign out?</p>
              <Modal.Actions>
                <Button basic color='olive' onClick={this.signOut}>Yes</Button>
                <Button basic color='red' onClick={this.closeModal}>No</Button>
              </Modal.Actions>
            </Modal.Content>
          </Modal>
          <Modal size='small' open={this.state.drinkIngredientCheckModal}>
            <Modal.Header>Ingredient Check</Modal.Header>
            <Modal.Content>
            <Header as='h5' content={`${this.state.drinkName} contains ${this.state.drinkIngredients}.`} />
              <Modal.Actions>
                <Button basic color='teal' onClick={this.closeModal}>Close</Button>
              </Modal.Actions>
            </Modal.Content>
          </Modal>
          <Modal size='small' open={this.state.foodIngredientCheckModal}>
            <Modal.Header>Ingredient Check</Modal.Header>
            <Modal.Content>
            <Header as='h5' content={`${this.state.foodName} contains ${this.state.foodIngredients}.`} />
              <Modal.Actions>
                <Button basic color='teal' onClick={this.closeModal}>Close</Button>
              </Modal.Actions>
            </Modal.Content>
          </Modal>
        </Container>
      </Fragment>
    )

  }

}

export default OrderPage;