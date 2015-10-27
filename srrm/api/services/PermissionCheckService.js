module.exports = {
    checkLevel: function(req, level) {
       	return User.findOne({id:req.session.User.id, level:{ '>=': level }}).then(function(user){
       		if (user) return user;
        });
    }
};