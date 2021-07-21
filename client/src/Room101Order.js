import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Container, Button, Form, Modal, Table, Header, Icon, Message, Grid, Input, Rating, Label, Menu, Segment, Card } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import { isNull } from 'util';

class Room101Order extends Component {

  state = {
    redirectHome: false,
    noTable: false,
    confirmedOrderModal: false,
    header: 'block',
    activeItem: 'foodMenu',
    hiddenFood: 'block',
    hiddenDrink: 'none',
    summaryModalOpen: false,
    payOrderModal: false,
    roomChargeModal: false,
    roomValidationFailed: true,
    food: [],
    drink: [],
    table: [],
    tableID: '',
    foodID: '',
    allFoodID: [],
    selectedFood: [],
    selectedDrinks: [],
    drinkID: '',
    allDrinkID: [],
    payOrderPrice: '0',
    tableName: '',
    guestPin: '',
    guestSurname: ''
  }

  createOrder = async () => {
    const { tableID, selectedFood, selectedDrinks } = this.state

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

    var currentTime = new Date();
    var time = currentTime.getHours() + ":" + currentTime.getMinutes();

    const createOrder = {
      totalPrice: foodPrice,
      food: selectedFood,
      beverages: selectedDrinks,
      tableName: awaitTable.data.response.table_number,
      transactionTime: time
    }

    axios.post('http://localhost:5000/api/orders/appcreate', createOrder)
    .then((response)=>{
      if(response.data.success){

      }
    })  
  }

  goHome = () => {
    this.setState({ redirectHome: true })
  }

  openSummaryModal = () => {
    this.setState({ summaryModalOpen: true, header: 'none' })
  }

  calculatePrice = () => {
    const { selectedDrinks, selectedFood } = this.state
    
    var foodPrice = 0

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

    this.setState({ payOrderPrice: foodPrice })
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
    if (name === 'foodMenu') {
      this.setState({ hiddenFood: 'block', hiddenDrink: 'none' })
    } else {
      this.setState({ hiddenFood: 'none', hiddenDrink: 'block' })
    }
    this.foodCards()
    this.drinkCards()
  }

  componentDidMount() {
    this.getAllFood();
    this.getAllDrinks();
    this.getAllTables();
  }

  getAllFood = async () => {
    const foodPromise = axios.get('http://localhost:5000/api/food/all')
    
    const complete = await Promise.resolve(foodPromise)

    this.setState({ food: complete.data.response }, () => {

    })
  }

  getAllDrinks = async () => {
    const drinkPromise = axios.get('http://localhost:5000/api/beverages/all')
    
    const complete = await Promise.resolve(drinkPromise)

    this.setState({ drink: complete.data.response }, () => {

    })
  }

  getAllTables = async () => {
    const tablePromise = axios.get('http://localhost:5000/api/tables/all')
    
    const complete = await Promise.resolve(tablePromise)

    this.setState({ table: complete.data.response }, () => {

    })
  }

  roomCharge = () => {
    this.setState({ roomChargeModal: true })
  }

  closeModal = () => {
    this.setState({ header: 'block', summaryModalOpen: false, roomChargeModal: false })
  }

  closeTheModal = () => {
    this.setState({ payOrderModal: false })
  }

  valueChange(e) {
    this.setState({ [e.target.name]: e.target.value });
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
    this.calculatePrice()
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
    this.calculatePrice()
  }

  removeFoodItem (orderItems, e, data) {
    const { selectedFood, allFoodID } = this.state
    
    var i
    for (i = 0; i < selectedFood.length; i++) { 
      if ( orderItems.id == selectedFood[i].id) {
        selectedFood.splice(i, 1)
        allFoodID.splice(i, 1)
      }
    }

    this.setState({ selectedFood })
    this.calculatePrice()
    this.foodCards()
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
    this.calculatePrice()
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
    this.calculatePrice()
  }

  removeDrinkItem (drinkItems, e, data) {
    const { selectedDrinks, allDrinkID } = this.state
    
    var i
    for (i = 0; i < selectedDrinks.length; i++) { 
      if ( drinkItems.id == selectedDrinks[i].id) {
        selectedDrinks.splice(i, 1)
        allDrinkID.splice(i, 1)
      }
   }

    this.setState({ selectedDrinks })
    this.drinkCards()
    this.calculatePrice()
  }

  addToList = async (foods) => {
    const { food, foodID, selectedFood, allFoodID } = this.state

    var objFood = new Object()
    objFood['id'] = foods._id
    objFood['name'] = foods.name
    objFood['qty'] = 1
    objFood['price'] = foods.price
    objFood['ingredients'] = foods.ingredients
     
    selectedFood.push(objFood)
    allFoodID.push(objFood.id)

    this.setState({ selectedFood: selectedFood, allFoodID: allFoodID })
    this.setState({ foodID: '' })
    this.calculatePrice()
  }

  addToDrinkList = async (drinks) => {
    const { drink, drinkID, selectedDrinks, allDrinkID } = this.state

    var objDrink = new Object()
    objDrink['id'] = drinks._id
    objDrink['name'] = drinks.name
    objDrink['qty'] = 1
    objDrink['price'] = drinks.price
    objDrink['ingredients'] = drinks.ingredients
  
    selectedDrinks.push(objDrink)
    allDrinkID.push(objDrink.id)

    this.setState({ selectedDrinks: selectedDrinks, allDrinkID: allDrinkID })
    this.setState({ drinkID: '' })
    this.calculatePrice()
  }

  payOrderModalOpen = async (order) => {
    const { tableID } = this.state

    this.setState({ payOrderModal: true })

    const tableSearch = {
      tableID: tableID
    }

    const getTableName = axios.post('http://localhost:5000/api/tables/search', tableSearch)

    const awaitTable = await Promise.resolve(getTableName)

    this.setState({ tableName: awaitTable.data.response.table_number })
  }

  validateRoomCharge = async () => {
    const { guestPin, guestSurname, payOrderPrice } = this.state

    const roomCharge = {
      guestPin: guestPin,
      guestSurname: guestSurname,
      roomName: 'Room 101'
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
      this.closeModal()
      this.closeTheModal()
      this.setState({ confirmedOrderModal: true, header: 'none' })
      this.setState({ guestPin: '', guestSurname: '' })
      this.createOrder()
    }
  }


  tableNameChange = (e, data) => {
    this.setState({ tableID: data.value, noTable: true })
  }

  foodCards = () => {
    if ( this.state.food.length !== 0 ) {
      return this.state.food.map( foods => 
        <Card style={{ 'box-shadow': '0 0 0 1px #d4d4d5, 0 2px 4px 0 #fff, 0 2px 5px 0 #008080', 'display': `${this.state.hiddenFood}` }} raised centered header={`${foods.name} for £${foods.price}`} description={foods.ingredients} extra={<Button basic color='teal' content={'Add'} onClick={() => {{this.addToList(foods)}}} disabled={this.state.allFoodID.includes(foods._id)} />} />
      )
    }
  }

  drinkCards = () => {
    if ( this.state.drink.length !== 0 ) {
      return this.state.drink.map( drinks => 
         <Card style={{ 'box-shadow': '0 0 0 1px #d4d4d5, 0 2px 4px 0 #fff, 0 2px 5px 0 #008080', 'display': `${this.state.hiddenDrink}` }} raised centered header={`${drinks.name} for £${drinks.price}`} description={drinks.ingredients} extra={<Button basic color='teal' content={'Add'} onClick={() => {{this.addToDrinkList(drinks)}}} disabled={this.state.allDrinkID.includes(drinks._id)} />} />
      )
    }
  }

  render() {

    const { table, selectedFood, selectedDrinks } = this.state

    const tableList = table.map((list) => ({   
      key: list._id,
      value: `${list._id}`,
      text: `${list.table_number}`
    }))

    const { activeItem } = this.state

    if (this.state.redirectHome) {
      return <Redirect to='/Room101' />
    }

    return (
      <Fragment>
        <Container fluid style={{ 'display': `${this.state.header}`, backgroundColor: '#FFF', paddingTop: '20px', marginBottom: '20px', 'position': '-webkit-sticky', 'top': '0', 'z-index': '3000' }}>
          <Segment tertiary inverted color='teal'>
            <Header as='h2' textAlign='center'>Create an Order</Header>
          </Segment>
          <Grid>
            <Grid.Row centered>
              <Form>
                <Form.Group>
                  <Form.Dropdown style={{ fontSize: '16px' }} closeOnChange selection name='tableID' value={this.state.tableID} options={tableList} onChange={this.tableNameChange} placeholder='Select Table' />                  
                  <Label onClick={this.openSummaryModal} size='big' basic color='teal' icon='shopping cart'  content={`£${this.state.payOrderPrice}`}/>
                </Form.Group>
              </Form>
            </Grid.Row>
          </Grid>
          <Menu attached='top' tabular pointing secondary>
            <Menu.Item position='left' name='foodMenu' active={activeItem === 'foodMenu'} onClick={this.handleItemClick}><Icon color='teal' name='food' />Food Menu</Menu.Item>
            <Menu.Item position='right' name='drinkMenu' active={activeItem === 'drinkMenu'} onClick={this.handleItemClick}><Icon color='teal' name='coffee' />Drink Menu</Menu.Item>
          </Menu>
        </Container>
        <Container fluid>
        <Grid>
          <Grid.Row centered>
            { this.foodCards() }
            { this.drinkCards() }
          </Grid.Row>
        </Grid>
          <Modal open={this.state.summaryModalOpen} onClose={this.closeModal}>
            <Modal.Header>Order Summary<Label style={{ 'position': 'absolute', 'right': '7vw', marginTop: '-0.5vh' }} size='large' basic color='teal' icon='shopping cart' content={`£${this.state.payOrderPrice}`}/></Modal.Header>
            <Modal.Content>
            <Message warning hidden={this.state.noTable}>
              <Message.Header>Table Number Must Be Selected</Message.Header>
              <Message.Content>Before paying, you must select your table on the order page.</Message.Content>
            </Message>
              <Table color='teal'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign='center'><Icon name='food' color='teal' />Food Item(s)</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
              {selectedFood &&
              _.map(selectedFood, (orderItems) => (
                <Table.Row key={orderItems.id} textAlign='center'>
                  <Table.Cell><Header as='h5' content={`${orderItems.name} x${orderItems.qty}`} /></Table.Cell>
                  <Table.Cell><Button.Group size='tiny'><Button size='mini' onClick={this.incrementFoodItemAmount.bind(this, orderItems)} icon color='teal'><Icon name='plus'/></Button><Button size='mini' onClick={this.decrementFoodItemAmount.bind(this, orderItems)} icon color='teal'><Icon name='minus'/></Button></Button.Group></Table.Cell>
                  <Table.Cell><Button size='mini' basic color='red' onClick={this.removeFoodItem.bind(this, orderItems)}>Remove</Button></Table.Cell>
                </Table.Row>
              ))}
              </Table.Body>
            </Table>
            <Table color='teal'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign='center'><Icon name='beer' color='teal' />Drink Item(s)</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
              {selectedDrinks &&
              _.map(selectedDrinks, (drinkItems) => (
                <Table.Row key={drinkItems.id} textAlign='center'>
                  <Table.Cell><Header as='h5' content={`${drinkItems.name} x${drinkItems.qty}`} /></Table.Cell>
                  <Table.Cell><Button.Group size='tiny'><Button size='mini' onClick={this.incrementDrinkItemAmount.bind(this, drinkItems)} icon color='teal'><Icon name='plus'/></Button><Button size='mini' onClick={this.decrementDrinkItemAmount.bind(this, drinkItems)} icon color='teal'><Icon name='minus'/></Button></Button.Group></Table.Cell>
                  <Table.Cell><Button size='mini' basic color='red' onClick={this.removeDrinkItem.bind(this, drinkItems)}>Remove</Button></Table.Cell>
                </Table.Row>
              ))}
              </Table.Body>
            </Table>
            <Container>
              <Grid>
                <Grid.Row columns={2}>
                <Grid.Column textAlign='center'>
                  <Form.Button basic color='teal' disabled={!this.state.tableID || (this.state.selectedFood.length < 1 && this.state.selectedDrinks.length < 1)} onClick={this.payOrderModalOpen}>Pay</Form.Button>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                  <Form.Button basic color='red' onClick={this.closeModal}>Close</Form.Button>
                </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
            </Modal.Content>
          </Modal>
          <Modal size='tiny' open={this.state.payOrderModal} onClose={this.closeTheModal}>
            <Modal.Header>Order Payment</Modal.Header>
            <Modal.Content>
              <Header as='h4' content={`The total bill for table ${this.state.tableName} is £${this.state.payOrderPrice}.`}></Header>
              <Form style={{ 'text-align': 'center' }}>
                <Form.Group widths='equal'>
                  <Form.Field>
                    <Form.Button animated basic color='teal'><Button.Content visible>Pay by Card</Button.Content><Button.Content hidden><Icon name='credit card' /></Button.Content></Form.Button>
                    <Label size='tiny' basic color='red' pointing>Not in Demo Version</Label>
                  </Form.Field>
                  <Form.Button onClick={this.roomCharge} animated basic color='teal'><Button.Content visible>Charge to Room</Button.Content><Button.Content hidden><Icon name='bed' /></Button.Content></Form.Button>
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
                    <Form.Input style={{ fontSize: '16px' }} label='Pin Code' value={this.state.guestPin} onChange={this.valueChange.bind(this)} name='guestPin' required></Form.Input>
                    <Form.Input style={{ fontSize: '16px' }} label='Surname' value={this.state.guestSurname} onChange={this.valueChange.bind(this)} name='guestSurname' required></Form.Input>
                  </Form.Group>
                  <Form.Button onClick={this.validateRoomCharge} disabled={!this.state.guestPin || !this.state.guestSurname} basic color='teal'>Pay</Form.Button>
                </Form>
              </Modal.Content>
          </Modal>
          <Modal open={this.state.confirmedOrderModal}>
            <Modal.Header style={{ 'text-align': 'center' }}>Order Confirmed!</Modal.Header>
            <Modal.Content style={{ 'text-align': 'center' }}><Button basic color='teal' onClick={this.goHome}>Home</Button></Modal.Content>
          </Modal>
        </Container>
      </Fragment>
    )

  }

}

export default Room101Order;