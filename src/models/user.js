var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/** User Schema Details
 * fullName
 * role
 * email
 * password
 * newsPreferences
 * createdDate
 */

//Model of User schema along with Validation
const userSchema = new Schema ({ 
    fullName: {
        type: String,
        required: [true, "Full Name not provided "],
      },
      role: {
        type: String,
        enum: ["normal" , "admin"],
        required: [true, "Please specify user role as user/admin"]
      },
      email: {
        type: String,
        unique: [true, "Email already exists in database!"],
        lowercase: true,
        trim: true,
        required: [true, "Email not provided"],
        validate: {
          validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: '{VALUE} is not a valid email!'
        }
      },
      password: {
        type: String,
        required: true
      },
      newsPreferences: { 
        type: [String],
        enum: ["business","entertainment","general","health","science","sports","technology"],
        required: true
      },
      createdDate: {
        type: Date,
        default: Date.now
      },
      updatedDate: {
        type: Date,
        default: Date.now
      }
});

module.exports = mongoose.model('User' , userSchema);