var express = require('express'),
    bodyParser = require('body-parser'),
    apiCtrl = require('./apiCtrl');
var app = express();

app.use(bodyParser.json());

app.get('/api/users', apiCtrl.getUsers);
app.get('/api/users/:param', apiCtrl.getUsersByParam);

app.post('/api/users', apiCtrl.createOrUpdateUser);
app.post('/api/users/:param', apiCtrl.createOrUpdateUser);
app.post('/api/users/:param/:userId', apiCtrl.createOrUpdateUser);

app.delete('/api/users/forums/:userId', apiCtrl.deleteForum);
app.delete('/api/users/:userId', apiCtrl.deleteUser);

app.put('/api/users/:userId', apiCtrl.updateById);

app.listen(3000, function(){
  console.log('Listening on port 3000.');
});

module.exports = app;
