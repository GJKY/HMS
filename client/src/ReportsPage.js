import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Container, Button, Form, Modal, Table, Header, Icon, Message, Grid, Menu } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import _ from 'lodash';

const monthOptions = [
  { text: 'January', value: '01' },
  { text: 'February', value: '02' },
  { text: 'March', value: '03' },
  { text: 'April', value: '04' },
  { text: 'May', value: '05' },
  { text: 'June', value: '06' },
  { text: 'July', value: '07' },
  { text: 'August', value: '08' },
  { text: 'September', value: '09' },
  { text: 'October', value: '10' },
  { text: 'November', value: '11' },
  { text: 'December', value: '12' }
]

class ReportsPage extends Component {

  state = {
    revenueCentres: [],
    selectedRevenue: '',
    selectedMonth: '',
    reportData: '',
    reportSum: '',
    redirectAdmin: false,
    redirectBookings: false,
    redirectOrders: false,
    redirectReception: false
  };

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
    this.getRevenueCentres()
  }

  generateReport = async () => {
    const { selectedMonth, selectedRevenue } = this.state

    const reportOptions = {
      month: selectedMonth,
      revenue: selectedRevenue
    }

    const getReportData = axios.post('http://localhost:5000/api/orders/reports', reportOptions)

    const reportPromise = await Promise.resolve(getReportData)

    this.setState({ reportData: reportPromise.data.response })

    const sum = this.state.reportData.map(report => report.total_price).reduce((prev, curr) => prev + curr, 0);

    this.setState({ reportSum: sum })
  }

  getRevenueCentres = async () => {
    const getEpos = axios.get('http://localhost:5000/api/epos/all')

    const eposPromise = await Promise.resolve(getEpos)

    this.setState({ revenueCentres: eposPromise.data.response })
  }

  changeRevenue = (e, result) => {
    this.setState({ selectedRevenue: result.value })
  }

  changeMonth = (e, result) => {
    this.setState({ selectedMonth: result.value })
  }

  render() {
    const { revenueCentres } = this.state

    const revenueOptions = revenueCentres.map((revenueList) => ({   
      key: revenueList._id,
      value: `${revenueList._id}`,
      text: `${revenueList.name}`
    }))

    if (this.state.redirectAdmin) {
      return <Redirect to='/Admin' />
    }
    else if (this.state.redirectBookings) {
      return <Redirect to='/BookingPage' />
    }
    else if (this.state.redirectReception) {
      return <Redirect to='/ReceptionPage' />
    }
    else if (this.state.redirectOrders) {
      return <Redirect to='/OrderPage' />
    }

    return (
      <Fragment>
        <Container fluid style={{ backgroundColor: '#222', height: '60px', paddingLeft: '30px', paddingRight: '30px', marginBottom: '40px' }} textAlign={'right'}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column textAlign='left'>
                <Menu compact style={{ 'background-color': '#222' }}>
                  <Menu.Item style={{ 'color': '#FFF' }} as='a' onClick={this.openAdmin}><Icon name='home'/>Home</Menu.Item>
                  <Menu.Item style={{ 'color': '#FFF' }} as='a' onClick={this.openReception}><Icon name='desktop'/>Reception</Menu.Item>
                  <Menu.Item style={{ 'color': '#FFF' }} as='a' onClick={this.openBookings}><Icon name='calendar alternate outline'/>Bookings</Menu.Item>
                  <Menu.Item style={{ 'color': '#FFF' }} as='a' onClick={this.openOrders}><Icon name='food'/>Food & Bev</Menu.Item>
                  <Menu.Item style={{ 'color': '#1affc6' }} as='a'><Icon name='clipboard outline' style={{ 'color': '#1affc6' }}/>Reports</Menu.Item>
                </Menu>
              </Grid.Column>
              <Grid.Column textAlign='right'>
                <Header as={'h1'} style={{ color: '#FFF', paddingTop: '6px' }}>Modern Day Hotel</Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        <Grid style={{ paddingLeft: '2vw', paddingRight: '2vw' }}>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Container>
                <Header as='h1'>Revenue Reports</Header>
                <Form>
                  <Form.Select options={revenueOptions} value={this.state.selectedRevenue} onChange={this.changeRevenue} label='Select Revenue Centre' />
                  <Form.Select options={monthOptions} value={this.state.selectedMonth} onChange={this.changeMonth} label='Select Month' />
                  <Form.Button basic color='teal' disabled={!this.state.selectedMonth || !this.state.selectedRevenue} onClick={this.generateReport}>Generate Report</Form.Button>
                </Form>
              </Container>
              <Container style={{ marginTop: '3vw' }}>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Number of Transactions</Table.HeaderCell>
                      <Table.HeaderCell>Total Revenue</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{( this.state.reportData.length )}</Table.Cell>
                      <Table.Cell>£{( this.state.reportSum )}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Container>
            </Grid.Column>
            <Grid.Column>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Fragment>
    );
  }
}

export default ReportsPage;