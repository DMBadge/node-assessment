var users = require('./users.json');

function customFilter(values) {
 return function(item) {
    var keys = Object.keys( values );
    var answer = true;
    for( var i = 0, len = keys.length; i < len; i++) {
        if( item[keys[i]].toLowerCase() !== values[keys[i]].toLowerCase() ) {
            answer = false;
            break;
        }
    }
    return answer;
 };
}

module.exports = {
  getUsers: function(req,res){
    if(Object.keys(req.query).length === 0){
      res.status(200).send(users);
    } else {
      var filters = req.query;
      var filteredUsers = users.filter(customFilter(req.query));
      if(filteredUsers.length > 0){
        res.status(200).send(filteredUsers);
      } else {
        res.status(404).send('No users found.');
      }
    }
  },
  getUsersByParam: function(req,res){
    var filteredUsers = users.filter(function(item){
      if(isNaN(parseInt(req.params.param))){
        return req.params.param === item.type;
      }
      return parseInt(req.params.param) === item.id;
    });

    switch(filteredUsers.length){
      case 0:
        res.status(404).send('User(s) not found.');
        break;
      case 1:
        res.status(200).send(filteredUsers[0]);
        break;
      default:
        res.status(200).send(filteredUsers);
    }
  },
  createOrUpdateUser: function(req,res){
    var updatedUser = '';

    switch(req.params.param){

      case 'language':
        if(isNaN(req.params.userId)){
          res.status(404).send('Invalid user id');
        } else {
          for(var i = 0; i < users.length; i++){
            if(parseInt(req.params.userId) === users[i].id){
              users[i].language = req.body.language;
              updatedUser = users[i];
              break;
            }
          }
          res.status(200).send(updatedUser);
        }
        break;

      case 'forums':
        if(isNaN(req.params.userId)){
          res.status(404).send('Invalid user id');
        } else {
          for(var i = 0; i < users.length; i++){
            if(parseInt(req.params.userId) === users[i].id){
              users[i].favorites.push(req.body.add);
              updatedUser = users[i];
              break;
            }
          }
          if(updatedUser){
            res.status(200).send(updatedUser);
          } else {
            res.status(404).send('User not found!');
          }
        }
        break;

      default:
        var userType = req.params.param ? req.params.param : 'user';
        if(userType === 'admin' || userType === 'moderator' || userType === 'user'){
          req.body.id = users[users.length-1].id+1;
          req.body.type = userType;
          if(!req.body.favorites){
            req.body.favorites = [];
          }
          users.push(req.body);
          res.status(200).send(req.body);
        } else {
          res.status(404).send('Invalid user type!');
        }
    }

  },
  deleteForum: function(req,res){
    if(isNaN(req.params.userId)){
      res.status(404).send('Invalid user id');
    } else if(!req.query.favorite){
      res.status(404).send('No favorite forum set!');
    } else {
      var updatedUser = '';
      var error = 'User not found!';
      for(var i = 0; i < users.length; i++){
        if(parseInt(req.params.userId) === users[i].id){
          var favoriteIndex = users[i].favorites.indexOf(req.query.favorite);
          if(favoriteIndex === -1){
            error = req.query.favorite + ' isn\'t a favorite of that user!';
            break;
          }
          users[i].favorites.splice(favoriteIndex, 1);
          updatedUser = users[i];
          break;
        }
      }
      if(updatedUser){
        res.status(200).send(updatedUser);
      } else {
        res.status(404).send(error);
      }
    }
  },
  deleteUser: function(req,res){
    if(isNaN(req.params.userId)){
      res.status(404).send('Invalid user id!');
    } else {
      for(var i = 0; i < users.length; i++){
        if(users[i].id === parseInt(req.params.userId)){
          var spliced = users.splice(i,1);
          spliced = spliced[0];
          break;
        }
      }

      if(spliced){
        res.status(200).send('Successfully nuked user ' + spliced.id + ' - ' + spliced.first_name + ' ' + spliced.last_name);
      } else {
        res.status(404).send('User not found!');
      }

    }
  },
  updateById: function(req,res){
    var query = req.body;
    var updatedUser = '';
    for(var i = 0; i < users.length; i++){
        if(parseInt(req.params.userId) === users[i].id){
          for(var prop in query){
            if( query.hasOwnProperty( prop ) ) {
              users[i][prop] = query[prop];
            }
          }
          updatedUser = users[i];
          break;
        }
    }
    if(updatedUser){
      res.status(200).send(updatedUser);
    } else {
      res.status(404).send('User not found!');
    }

  }
};
