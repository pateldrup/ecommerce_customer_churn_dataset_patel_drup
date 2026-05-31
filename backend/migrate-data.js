// Script to convert string fields to proper Number types in MongoDB
// Handles empty strings and null values gracefully
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function migrateData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const db = mongoose.connection.db;
    const collection = db.collection('customers');

    const numericFields = [
      'Age', 'Membership_Years', 'Login_Frequency', 'Session_Duration_Avg',
      'Pages_Per_Session', 'Cart_Abandonment_Rate', 'Wishlist_Items',
      'Total_Purchases', 'Average_Order_Value', 'Days_Since_Last_Purchase',
      'Discount_Usage_Rate', 'Returns_Rate', 'Email_Open_Rate',
      'Customer_Service_Calls', 'Product_Reviews_Written',
      'Social_Media_Engagement_Score', 'Mobile_App_Usage',
      'Payment_Method_Diversity', 'Lifetime_Value', 'Credit_Balance', 'Churned'
    ];

    console.log('Converting string fields to numbers...');

    // Build the $set object with proper null/empty handling
    const convertFields = {};
    numericFields.forEach(field => {
      convertFields[field] = {
        $cond: {
          if: {
            $or: [
              { $eq: [`$${field}`, null] },
              { $eq: [`$${field}`, ''] },
              { $eq: [`$${field}`, 'null'] },
              { $eq: [`$${field}`, 'NaN'] }
            ]
          },
          then: null,
          else: { $toDouble: `$${field}` }
        }
      };
    });

    const result = await collection.updateMany(
      {},
      [{ $set: convertFields }]
    );

    console.log(`Modified ${result.modifiedCount} documents.`);
    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateData();
