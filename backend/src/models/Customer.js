const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  Age: { type: Number, required: true },
  Gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  Country: { type: String, required: true },
  City: { type: String, required: true },
  Membership_Years: { type: Number },
  Login_Frequency: { type: Number },
  Session_Duration_Avg: { type: Number },
  Pages_Per_Session: { type: Number },
  Cart_Abandonment_Rate: { type: Number },
  Wishlist_Items: { type: Number },
  Total_Purchases: { type: Number },
  Average_Order_Value: { type: Number },
  Days_Since_Last_Purchase: { type: Number },
  Discount_Usage_Rate: { type: Number },
  Returns_Rate: { type: Number },
  Email_Open_Rate: { type: Number },
  Customer_Service_Calls: { type: Number },
  Product_Reviews_Written: { type: Number },
  Social_Media_Engagement_Score: { type: Number },
  Mobile_App_Usage: { type: Number },
  Payment_Method_Diversity: { type: Number },
  Lifetime_Value: { type: Number },
  Credit_Balance: { type: Number },
  Churned: { type: Number, required: true, enum: [0, 1] }, // 0 for active, 1 for churned
  Signup_Quarter: { type: String }
}, {
  timestamps: true
});

// Adding indexes to optimize performance for common queries
CustomerSchema.index({ Country: 1 });
CustomerSchema.index({ Churned: 1 });
CustomerSchema.index({ Lifetime_Value: -1 });

module.exports = mongoose.model('Customer', CustomerSchema);
