import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Admin from './Admin';
import BookingPage from './BookingPage';
import OrderPage from './OrderPage';
import Room101 from './Room101';
import Room101Order from './Room101Order';
import ReceptionPage from './ReceptionPage';
import Room101Ambiance from './Room101Ambiance';
import ReportsPage from './ReportsPage';
import LeisureFacilitiesPage from './LeisureFacilitiesPage'

class App extends Component {

  render() {
    return (
      <Router>
        <Fragment>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/Admin" />} />
            <Route path='/Admin' component={Admin} />
            <Route path='/BookingPage' component={BookingPage} />
            <Route path='/OrderPage' component={OrderPage} />
            <Route path='/Room101' component={Room101} />
            <Route path='/Room101Ambiance' component={Room101Ambiance} />
            <Route path='/Room101Order' component={Room101Order} />
            <Route path='/ReceptionPage' component={ReceptionPage} />
            <Route path='/ReportsPage' component={ReportsPage} />
            <Route path='/LeisureFacilitiesPage' component={LeisureFacilitiesPage} />
          </Switch>
        </Fragment>
      </Router>
    );
  }

}

export default App;