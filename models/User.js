const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')
const userSchema = new Schema({

  email: {
    type: String,
    required:[true ,'Please Enter An Email'],
    unique:true,
    lowercase:true,
    validate:[isEmail,'Please Enter a valid email']
  },
  password: {
    type: String,
    required: [true,'Please Enter An Password'],
    minLength:[6,'min six char']
  },

});


userSchema.pre('save',async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt)
  // console.log('user about to be created and saved',this)
  next()
})

//static method for user login

userSchema.statics.login = async function(email,password){

  const user = await this.findOne({email})
  if (user) {

const auth = await bcrypt.compare(password, user.password)
if(auth){
  return user
}  
throw Error('incorrect password')
}

  throw Error('Incorrect Email')

}
const User = mongoose.model('user',userSchema)
module.exports = User
