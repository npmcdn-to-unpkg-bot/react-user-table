var RecordRow = React.createClass({
  getRemovedUserId: function(){
    var userId = this.props.user.id;
    this.props.onUserClick(userId);
  },
  render: function(){
    return (
      <tr className="record">
        <td><div className="lp-indicator"><span>{this.props.lp}</span></div></td>
        <td>{this.props.user.name}</td>
        <td>{this.props.user.email}</td>
        <td><button type="button" className="btn btn-remove_user" onClick={this.getRemovedUserId}>x</button></td>
      </tr>
    );
  }
});

var RecordTable = React.createClass({
  removeUser: function(userId){
    var users = this.props.users;
    users = _.reject(users, {id: userId});
    this.props.onUserInput({users: users});
    this.props.checkLimit(users);
  },

  render: function(){
    var rows = [];
    var _ref = this;
    var emptyTableMessage = "No users to display."
    var len = this.props.users.length;

    this.props.users.forEach(function(user){
      rows.unshift(<RecordRow user={user} key={user.id} lp={len-rows.length} onUserClick={_ref.removeUser}/>);
    });
    return (
      <table className="table">
        <thead className="table-head">
          <tr>
            <th className="table-head_lp">LP</th>
            <th className="table-head_name">NAME</th>
            <th className="table-head_email">EMAIL</th>
            <th className="table-head_remove-user"></th>
          </tr>
        </thead>
        <tbody>{len>0 ? rows : emptyTableMessage}</tbody>
      </table>
    );
  }
});

var NewUserForm = React.createClass({
  resetForm: function(){
    this.refs.newUser.value = '';
    this.refs.newEmail.value = '';
    this.props.onUserInput({isInputEmpty: true});
  },

  submitUser: function(e, users){
    e.preventDefault();
    var users = this.props.users;
    var hasNewUserBeenAdded = this.props.hasNewUserBeenAdded;
    var isFormHidden = this.props.isFormHidden;

    var newUser = this.refs.newUser.value.trim();
    var newEmail = this.refs.newEmail.value.trim();
    var id = Date.now();
    if (!newUser || !newEmail) {
      return;
    };

    users.push({
      id: id, 
      name: newUser, 
      email: newEmail
    });

    //reset values
    this.resetForm();

    //update state
    this.props.onUserInput({users: users, hasNewUserBeenAdded: true, isFormHidden: true});
    this.props.checkLimit(users);
  },

  showForm: function (){
    var isFormHidden = this.props.isFormHidden;
     //update state
    this.props.onUserInput({isFormHidden: false});
  },

  handleChange: function(event) {
    if (event.target.value){
      this.props.onUserInput({isInputEmpty: false});
    }
  },

  render: function(){
    return (
      <div className="form-group">
        <button disabled = {this.props.isLimitReached} onClick={this.showForm} className={this.props.isFormHidden ? 'btn btn-add_user' : 'hidden'}>
          Add user</button>
        <form className="form-inline" onSubmit={this.submitUser} className={this.props.isFormHidden ? 'hidden' : ''}>
            <input ref="newUser" placeholder="Name..." onChange={this.handleChange} 
              type="text" />
            <input ref="newEmail" placeholder="Email..." onChange={this.handleChange} type="email" />
            <button type="submit" className="btn">Submit</button>
            <button onClick={this.resetForm} className={this.props.isInputEmpty ? 'hidden' : 'btn btn-reset'}>
          Reset fields</button>
        </form>
        <div className={this.props.hasNewUserBeenAdded ? 'info' : 'hidden'}>You have successfully added a new user.</div>
        <div className={this.props.isLimitReached ? 'info' : 'hidden'}>You cannot add a new user because of a limit of 10 users.</div>
      </div>
    );
  }
});

var InteractiveUserTable = React.createClass({
  getInitialState: function(){
    return {
      users: USERS,
      isFormHidden: true,
      hasNewUserBeenAdded: false,
      isLimitReached: false,
      isInputEmpty: true
    }
  },
  handleUserInput: function(value) {
    this.setState(value);
  },

  checkUserLimit: function(users){
    var isLimitReached = this.props.isLimitReached;
    var len = users.length;
    var limit = 10;

    if (len === limit){
      //limit reached in the table at user submit
      this.handleUserInput({isLimitReached: true, hasNewUserBeenAdded: false});
    } else {
      //when user deletes row
      this.handleUserInput({isLimitReached: false});
    }
  },

  render: function(){
    return (
      <div>
        <NewUserForm 
          users={this.state.users} 
          onUserInput={this.handleUserInput} 
          isFormHidden={this.state.isFormHidden}
          hasNewUserBeenAdded={this.state.hasNewUserBeenAdded}           
          isLimitReached={this.state.isLimitReached}
          checkLimit = {this.checkUserLimit}
          isInputEmpty={this.state.isInputEmpty} />
        <RecordTable 
          users={this.state.users} 
          onUserInput={this.handleUserInput}
          checkLimit = {this.checkUserLimit} />
      </div>
    ); 
  }
});


var USERS = [
  {id: 1472740495088, name: "Ron Weasley",          email: "chudleycannonsrule@hogwarts.edu"},
  {id: 1472740541741, name: "Thomas Anderson",      email: "t.anderson@metacortex.com"},
  {id: 1472740549687, name: "Tyler Durder",         email: "project@mayhem.org"},
  {id: 1472740557898, name: "James Bond",           email: "007@mi6.co.uk"},
  {id: 1472740479569, name: "Katarzyna Zadurska",   email: "kzadurska@gmail.com"},
  {id: 1472740595560, name: "Jack Hall",            email: "jhall@noaa.gov"},
  {id: 1472740624443, name: "Neil Robertson",       email: "thunderfromdownunder@mail.au"},
  {id: 1472740634523, name: "Joanna Chyłka",        email: "chyłka@zelaznymcvay.pl"},
  {id: 1472740647382, name: "Milena Czelanska",     email: "milka@pl.skywatch.eu"},
];
 
ReactDOM.render(
  <InteractiveUserTable/>,
  document.getElementById('container')
);