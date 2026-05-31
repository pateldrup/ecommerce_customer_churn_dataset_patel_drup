class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'q'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Build MongoDB filter from custom query params
    const mongoFilter = {};

    // Age range filters
    if (this.queryString.minAge) mongoFilter.Age = { ...mongoFilter.Age, $gte: Number(this.queryString.minAge) };
    if (this.queryString.maxAge) mongoFilter.Age = { ...mongoFilter.Age, $lte: Number(this.queryString.maxAge) };

    // Membership years (minimum)
    if (this.queryString.membershipYears) mongoFilter.Membership_Years = { $gte: Number(this.queryString.membershipYears) };

    // Numeric min filters
    if (this.queryString.minPurchases) mongoFilter.Total_Purchases = { $gte: Number(this.queryString.minPurchases) };
    if (this.queryString.minLifetime) mongoFilter.Lifetime_Value = { $gte: Number(this.queryString.minLifetime) };
    if (this.queryString.minCredit) mongoFilter.Credit_Balance = { $gte: Number(this.queryString.minCredit) };
    if (this.queryString.minLoginFrequency) mongoFilter.Login_Frequency = { $gte: Number(this.queryString.minLoginFrequency) };
    if (this.queryString.minMobileUsage) mongoFilter.Mobile_App_Usage = { $gte: Number(this.queryString.minMobileUsage) };
    if (this.queryString.minDiscountRate) mongoFilter.Discount_Usage_Rate = { $gte: Number(this.queryString.minDiscountRate) };
    if (this.queryString.minSessionDuration) mongoFilter.Session_Duration_Avg = { $gte: Number(this.queryString.minSessionDuration) };

    // Churned status (handle 0 as valid value)
    if (this.queryString.churned !== undefined && this.queryString.churned !== '') {
      mongoFilter.Churned = Number(this.queryString.churned);
    }

    // Signup quarter
    if (this.queryString.signupQuarter) mongoFilter.Signup_Quarter = this.queryString.signupQuarter;

    // Country, city, gender mapped directly (case-sensitive exact match)
    if (this.queryString.country) mongoFilter.Country = this.queryString.country;
    if (this.queryString.city) mongoFilter.City = this.queryString.city;
    if (this.queryString.gender) mongoFilter.Gender = this.queryString.gender;

    this.query = this.query.find(mongoFilter);
    return this;
  }

  search() {
    if (this.queryString.q) {
      const q = this.queryString.q;
      // Search across multiple string fields
      this.query = this.query.find({
        $or: [
          { Country: { $regex: q, $options: 'i' } },
          { City: { $regex: q, $options: 'i' } },
          { Gender: { $regex: q, $options: 'i' } },
          { Signup_Quarter: { $regex: q, $options: 'i' } }
        ]
      });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // Map frontend sort names to backend schema fields
      const sortMap = {
        'age': 'Age',
        'membershipYears': 'Membership_Years',
        'loginFrequency': 'Login_Frequency',
        'sessionDuration': 'Session_Duration_Avg',
        'purchases': 'Total_Purchases',
        'averageOrderValue': 'Average_Order_Value',
        'lifetimeValue': 'Lifetime_Value',
        'creditBalance': 'Credit_Balance',
        'discountRate': 'Discount_Usage_Rate',
        'mobileUsage': 'Mobile_App_Usage'
      };
      
      const sortBy = this.queryString.sort.split(',').map(field => {
        if (field.startsWith('-')) {
          return `-${sortMap[field.substring(1)] || field.substring(1)}`;
        }
        return sortMap[field] || field;
      }).join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
