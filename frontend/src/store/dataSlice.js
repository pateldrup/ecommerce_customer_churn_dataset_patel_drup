import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customerService from '../services/customerService';

// Fallback Mock Customer Database
const MOCK_CUSTOMERS = [
  { _id: '64b1f8c12a874b3d88e00001', City: 'Paris', Country: 'France', Age: 34, Gender: 'Female', Credit_Balance: 2400, Total_Purchases: 18, Lifetime_Value: 2450.00, Churned: 0, Signup_Quarter: 'Q1', Cart_Abandonment_Rate: 25, Login_Frequency: 14 },
  { _id: '64b1f8c12a874b3d88e00002', City: 'Marseille', Country: 'France', Age: 45, Gender: 'Male', Credit_Balance: 4100, Total_Purchases: 25, Lifetime_Value: 3890.50, Churned: 0, Signup_Quarter: 'Q2', Cart_Abandonment_Rate: 15, Login_Frequency: 22 },
  { _id: '64b1f8c12a874b3d88e00003', City: 'Berlin', Country: 'Germany', Age: 29, Gender: 'Male', Credit_Balance: 1200, Total_Purchases: 8, Lifetime_Value: 950.00, Churned: 1, Signup_Quarter: 'Q4', Cart_Abandonment_Rate: 65, Login_Frequency: 4 },
  { _id: '64b1f8c12a874b3d88e00004', City: 'Munich', Country: 'Germany', Age: 52, Gender: 'Female', Credit_Balance: 4800, Total_Purchases: 30, Lifetime_Value: 5400.20, Churned: 0, Signup_Quarter: 'Q1', Cart_Abandonment_Rate: 10, Login_Frequency: 28 },
  { _id: '64b1f8c12a874b3d88e00005', City: 'Madrid', Country: 'Spain', Age: 38, Gender: 'Female', Credit_Balance: 1850, Total_Purchases: 14, Lifetime_Value: 1620.00, Churned: 0, Signup_Quarter: 'Q3', Cart_Abandonment_Rate: 40, Login_Frequency: 11 },
  { _id: '64b1f8c12a874b3d88e00006', City: 'Barcelona', Country: 'Spain', Age: 31, Gender: 'Male', Credit_Balance: 3200, Total_Purchases: 20, Lifetime_Value: 2750.80, Churned: 1, Signup_Quarter: 'Q2', Cart_Abandonment_Rate: 55, Login_Frequency: 8 },
  { _id: '64b1f8c12a874b3d88e00007', City: 'Lyon', Country: 'France', Age: 23, Gender: 'Female', Credit_Balance: 950, Total_Purchases: 5, Lifetime_Value: 480.00, Churned: 1, Signup_Quarter: 'Q3', Cart_Abandonment_Rate: 75, Login_Frequency: 3 },
  { _id: '64b1f8c12a874b3d88e00008', City: 'Hamburg', Country: 'Germany', Age: 41, Gender: 'Female', Credit_Balance: 3900, Total_Purchases: 22, Lifetime_Value: 4120.00, Churned: 0, Signup_Quarter: 'Q1', Cart_Abandonment_Rate: 20, Login_Frequency: 19 },
  { _id: '64b1f8c12a874b3d88e00009', City: 'Valencia', Country: 'Spain', Age: 47, Gender: 'Male', Credit_Balance: 2800, Total_Purchases: 16, Lifetime_Value: 2150.40, Churned: 0, Signup_Quarter: 'Q4', Cart_Abandonment_Rate: 30, Login_Frequency: 15 },
  { _id: '64b1f8c12a874b3d88e00010', City: 'Nice', Country: 'France', Age: 61, Gender: 'Female', Credit_Balance: 3300, Total_Purchases: 12, Lifetime_Value: 1800.00, Churned: 0, Signup_Quarter: 'Q2', Cart_Abandonment_Rate: 35, Login_Frequency: 10 },
  { _id: '64b1f8c12a874b3d88e00011', City: 'Frankfurt', Country: 'Germany', Age: 36, Gender: 'Male', Credit_Balance: 2100, Total_Purchases: 15, Lifetime_Value: 1980.00, Churned: 0, Signup_Quarter: 'Q3', Cart_Abandonment_Rate: 28, Login_Frequency: 13 },
  { _id: '64b1f8c12a874b3d88e00012', City: 'Seville', Country: 'Spain', Age: 55, Gender: 'Female', Credit_Balance: 4400, Total_Purchases: 28, Lifetime_Value: 4920.50, Churned: 0, Signup_Quarter: 'Q1', Cart_Abandonment_Rate: 18, Login_Frequency: 25 },
  { _id: '64b1f8c12a874b3d88e00013', City: 'Toulouse', Country: 'France', Age: 27, Gender: 'Male', Credit_Balance: 1400, Total_Purchases: 7, Lifetime_Value: 820.00, Churned: 1, Signup_Quarter: 'Q4', Cart_Abandonment_Rate: 50, Login_Frequency: 6 },
  { _id: '64b1f8c12a874b3d88e00014', City: 'Cologne', Country: 'Germany', Age: 48, Gender: 'Female', Credit_Balance: 3050, Total_Purchases: 19, Lifetime_Value: 2950.00, Churned: 0, Signup_Quarter: 'Q2', Cart_Abandonment_Rate: 22, Login_Frequency: 16 },
  { _id: '64b1f8c12a874b3d88e00015', City: 'Zaragoza', Country: 'Spain', Age: 33, Gender: 'Male', Credit_Balance: 2500, Total_Purchases: 11, Lifetime_Value: 1350.20, Churned: 0, Signup_Quarter: 'Q3', Cart_Abandonment_Rate: 38, Login_Frequency: 9 },
  { _id: '64b1f8c12a874b3d88e00016', City: 'Chicago', Country: 'USA', Age: 26, Gender: 'Male', Credit_Balance: 2900, Total_Purchases: 10, Lifetime_Value: 1150.00, Churned: 0, Signup_Quarter: 'Q2', Cart_Abandonment_Rate: 40, Login_Frequency: 8 },
  { _id: '64b1f8c12a874b3d88e00017', City: 'New York', Country: 'USA', Age: 42, Gender: 'Female', Credit_Balance: 3700, Total_Purchases: 21, Lifetime_Value: 3400.00, Churned: 0, Signup_Quarter: 'Q1', Cart_Abandonment_Rate: 15, Login_Frequency: 18 },
  { _id: '64b1f8c12a874b3d88e00018', City: 'Toronto', Country: 'Canada', Age: 39, Gender: 'Male', Credit_Balance: 2250, Total_Purchases: 14, Lifetime_Value: 1850.40, Churned: 1, Signup_Quarter: 'Q3', Cart_Abandonment_Rate: 45, Login_Frequency: 11 },
  { _id: '64b1f8c12a874b3d88e00019', City: 'London', Country: 'UK', Age: 35, Gender: 'Female', Credit_Balance: 3450, Total_Purchases: 22, Lifetime_Value: 3100.50, Churned: 0, Signup_Quarter: 'Q1', Cart_Abandonment_Rate: 20, Login_Frequency: 19 },
  { _id: '64b1f8c12a874b3d88e00020', City: 'Mumbai', Country: 'India', Age: 30, Gender: 'Female', Credit_Balance: 1950, Total_Purchases: 12, Lifetime_Value: 1240.00, Churned: 0, Signup_Quarter: 'Q4', Cart_Abandonment_Rate: 35, Login_Frequency: 10 },
];

const getFilteredSortedMockCustomers = (params) => {
  let list = [...MOCK_CUSTOMERS];

  // 1. Search Query
  if (params.q) {
    const q = params.q.toLowerCase();
    list = list.filter(c => 
      c._id.toLowerCase().includes(q) || 
      c.City.toLowerCase().includes(q) || 
      c.Country.toLowerCase().includes(q)
    );
  }

  // 2. Country Filter
  if (params.country && params.country !== 'All') {
    list = list.filter(c => c.Country.toLowerCase() === params.country.toLowerCase());
  }

  // 3. Gender Filter
  if (params.gender && params.gender !== 'All') {
    list = list.filter(c => c.Gender.toLowerCase() === params.gender.toLowerCase());
  }

  // 4. Churn Status Filter
  if (params.churned !== undefined) {
    list = list.filter(c => c.Churned === Number(params.churned));
  }

  // 5. Sorting
  if (params.sort) {
    const sortField = params.sort;
    if (sortField === 'age') {
      list.sort((a, b) => a.Age - b.Age);
    } else if (sortField === '-age') {
      list.sort((a, b) => b.Age - a.Age);
    } else if (sortField === 'lifetimeValue') {
      list.sort((a, b) => a.Lifetime_Value - b.Lifetime_Value);
    } else if (sortField === '-lifetimeValue') {
      list.sort((a, b) => b.Lifetime_Value - a.Lifetime_Value);
    } else if (sortField === 'creditBalance') {
      list.sort((a, b) => a.Credit_Balance - b.Credit_Balance);
    } else if (sortField === '-creditBalance') {
      list.sort((a, b) => b.Credit_Balance - a.Credit_Balance);
    } else if (sortField === 'purchases') {
      list.sort((a, b) => a.Total_Purchases - b.Total_Purchases);
    } else if (sortField === '-purchases') {
      list.sort((a, b) => b.Total_Purchases - a.Total_Purchases);
    }
  }

  // 6. Pagination
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return {
    total: list.length,
    pages: Math.ceil(list.length / limit),
    page,
    limit,
    data: list.slice(startIndex, endIndex)
  };
};

export const fetchCustomers = createAsyncThunk(
  'data/fetchCustomers',
  async (params, { rejectWithValue }) => {
    try {
      const data = await customerService.getCustomers(params);
      return data;
    } catch (error) {
      console.warn('Backend server offline. Activating Local Demo Mode customer fallback data.');
      const result = getFilteredSortedMockCustomers(params);
      return {
        success: true,
        count: result.total,
        pagination: {
          total: result.total,
          pages: result.pages,
          page: result.page,
          limit: result.limit,
        },
        data: result.data
      };
    }
  }
);

export const addCustomer = createAsyncThunk(
  'data/addCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const data = await customerService.createCustomer(customerData);
      return data.data;
    } catch (error) {
      const mockNew = {
        _id: 'mock-' + Date.now(),
        ...customerData
      };
      MOCK_CUSTOMERS.unshift(mockNew);
      return mockNew;
    }
  }
);

export const modifyCustomer = createAsyncThunk(
  'data/modifyCustomer',
  async ({ id, customerData }, { rejectWithValue }) => {
    try {
      const data = await customerService.updateCustomer(id, customerData);
      return data.data;
    } catch (error) {
      const idx = MOCK_CUSTOMERS.findIndex(c => c._id === id || c.id === id);
      if (idx !== -1) {
        MOCK_CUSTOMERS[idx] = { ...MOCK_CUSTOMERS[idx], ...customerData };
        return MOCK_CUSTOMERS[idx];
      }
      return rejectWithValue('Customer not found');
    }
  }
);

export const removeCustomer = createAsyncThunk(
  'data/removeCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await customerService.deleteCustomer(id);
      return id;
    } catch (error) {
      const idx = MOCK_CUSTOMERS.findIndex(c => c._id === id || c.id === id);
      if (idx !== -1) {
        MOCK_CUSTOMERS.splice(idx, 1);
        return id;
      }
      return rejectWithValue('Customer not found');
    }
  }
);

const initialState = {
  customers: [],
  pagination: {
    total: 0,
    pages: 1,
    page: 1,
    limit: 10,
  },
  loading: false,
  error: null,
  selectedCustomer: null,
  filters: {
    search: '',
    country: 'All',
    gender: 'All',
    churnStatus: 'All',
    page: 1,
    sort: '',
  },
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { ...initialState.filters };
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    clearDataError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          total: action.payload.data?.length || 0,
          pages: 1,
          page: 1,
          limit: 10,
        };
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Customer
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false;
        // Prepend new customer or add to list
        state.customers = [action.payload, ...state.customers];
        state.pagination.total += 1;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Modify Customer
      .addCase(modifyCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(modifyCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.map(c => 
          (c._id === action.payload._id || c.id === action.payload.id) ? action.payload : c
        );
      })
      .addCase(modifyCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Customer
      .addCase(removeCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(c => c._id !== action.payload && c.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(removeCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilter, resetFilters, setSelectedCustomer, clearDataError } = dataSlice.actions;
export default dataSlice.reducer;
