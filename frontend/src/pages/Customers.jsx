import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import {
  Search,
  Filter,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  X,
  TrendingDown,
  Activity,
  Check,
  AlertTriangle
} from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';

import {
  fetchCustomers,
  addCustomer,
  modifyCustomer,
  removeCustomer,
  setFilter,
  resetFilters
} from '../store/dataSlice';
import { addToast } from '../store/uiSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export const Customers = () => {
  const dispatch = useDispatch();
  const { customers, pagination, loading, error, filters } = useSelector((state) => state.data);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Sync with backend on filter / page changes
  const loadCustomers = () => {
    const params = {
      page: filters.page,
      limit: 10,
    };

    if (filters.search) params.q = filters.search;
    if (filters.country !== 'All') params.country = filters.country;
    if (filters.gender !== 'All') params.gender = filters.gender;
    if (filters.churnStatus !== 'All') {
      params.churned = filters.churnStatus === 'Churned' ? 1 : 0;
    }
    if (filters.sort) params.sort = filters.sort;

    dispatch(fetchCustomers(params));
  };

  useEffect(() => {
    loadCustomers();
  }, [filters.page, filters.country, filters.gender, filters.churnStatus, filters.sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilter({ page: 1 }));
    loadCustomers();
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());
    dispatch(addToast({ message: 'Filters cleared successfully.', type: 'info' }));
  };

  // Validation Schema for Add/Edit Form
  const customerValidationSchema = Yup.object().shape({
    Age: Yup.number().required('Age is required').min(18, 'Must be 18 or older').max(100, 'Must be 100 or younger'),
    Gender: Yup.string().required('Gender is required').oneOf(['Male', 'Female', 'Other']),
    Country: Yup.string().required('Country is required'),
    City: Yup.string().required('City is required'),
    Lifetime_Value: Yup.number().min(0, 'Cannot be negative').required('LTV is required'),
    Credit_Balance: Yup.number().min(0, 'Cannot be negative').required('Credit balance is required'),
    Churned: Yup.number().required('Status is required').oneOf([0, 1]),
    Signup_Quarter: Yup.string().required('Signup quarter is required').oneOf(['Q1', 'Q2', 'Q3', 'Q4']),
    Total_Purchases: Yup.number().min(0, 'Cannot be negative').default(0),
    Cart_Abandonment_Rate: Yup.number().min(0).max(100).default(0),
    Login_Frequency: Yup.number().min(0).default(0),
  });

  // Formik for Adding Customer
  const addFormik = useFormik({
    initialValues: {
      Age: 35,
      Gender: 'Female',
      Country: 'France',
      City: 'Paris',
      Lifetime_Value: 1500,
      Credit_Balance: 2000,
      Churned: 0,
      Signup_Quarter: 'Q1',
      Total_Purchases: 10,
      Cart_Abandonment_Rate: 35,
      Login_Frequency: 15,
    },
    validationSchema: customerValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(addCustomer(values)).unwrap();
        dispatch(addToast({ message: 'Customer added successfully to database.', type: 'success' }));
        setIsAddOpen(false);
        resetForm();
        loadCustomers();
      } catch (err) {
        dispatch(addToast({ message: err || 'Failed to add customer.', type: 'error' }));
      }
    },
  });

  // Formik for Editing Customer
  const editFormik = useFormik({
    initialValues: {
      Age: '',
      Gender: '',
      Country: '',
      City: '',
      Lifetime_Value: '',
      Credit_Balance: '',
      Churned: '',
      Signup_Quarter: '',
      Total_Purchases: '',
      Cart_Abandonment_Rate: '',
      Login_Frequency: '',
    },
    validationSchema: customerValidationSchema,
    onSubmit: async (values) => {
      try {
        const id = selectedCustomer._id || selectedCustomer.id;
        await dispatch(modifyCustomer({ id, customerData: values })).unwrap();
        dispatch(addToast({ message: 'Customer updated successfully.', type: 'success' }));
        setIsEditOpen(false);
        loadCustomers();
      } catch (err) {
        dispatch(addToast({ message: err || 'Failed to update customer.', type: 'error' }));
      }
    },
  });

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    editFormik.setValues({
      Age: customer.Age || '',
      Gender: customer.Gender || 'Female',
      Country: customer.Country || '',
      City: customer.City || '',
      Lifetime_Value: customer.Lifetime_Value || 0,
      Credit_Balance: customer.Credit_Balance || 0,
      Churned: customer.Churned !== undefined ? customer.Churned : 0,
      Signup_Quarter: customer.Signup_Quarter || 'Q1',
      Total_Purchases: customer.Total_Purchases || 0,
      Cart_Abandonment_Rate: customer.Cart_Abandonment_Rate || 0,
      Login_Frequency: customer.Login_Frequency || 0,
    });
    setIsEditOpen(true);
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const id = selectedCustomer._id || selectedCustomer.id;
      await dispatch(removeCustomer(id)).unwrap();
      dispatch(addToast({ message: 'Customer deleted successfully.', type: 'success' }));
      setIsDeleteOpen(false);
      loadCustomers();
    } catch (err) {
      dispatch(addToast({ message: err || 'Failed to delete customer.', type: 'error' }));
    }
  };

  return (
    <div className="p-8 space-y-6">
      <Helmet>
        <title>Customer Records - Churnlytics</title>
        <meta name="description" content="View and manage e-commerce customer profiles. Apply filters, sort records, and add or delete customer segments in real-time." />
        <meta property="og:title" content="Customer Records | Churnlytics Console" />
        <meta property="og:description" content="Access demographic insights, credit scoring indexes, and churn flags of all platform customers." />
      </Helmet>

      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Customer Records</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Displaying {pagination.total.toLocaleString()} records from MongoDB database.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          variant="primary"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500"
        >
          <UserPlus size={16} />
          <span>New Customer</span>
        </Button>
      </div>

      {/* Filters Form */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          {/* Search */}
          <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2 lg:col-span-2">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Search ID / Country / City</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Ex: Marseille, Canada..."
                value={filters.search}
                onChange={(e) => dispatch(setFilter({ search: e.target.value, page: 1 }))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Country filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Country</label>
            <select
              value={filters.country}
              onChange={(e) => dispatch(setFilter({ country: e.target.value, page: 1 }))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Countries</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Spain">Spain</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="UK">UK</option>
              <option value="India">India</option>
              <option value="Japan">Japan</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          {/* Gender filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Gender</label>
            <select
              value={filters.gender}
              onChange={(e) => dispatch(setFilter({ gender: e.target.value, page: 1 }))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Churn filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Churn Status</label>
            <select
              value={filters.churnStatus}
              onChange={(e) => dispatch(setFilter({ churnStatus: e.target.value, page: 1 }))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Churned">Churned</option>
            </select>
          </div>

          {/* Sort filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => dispatch(setFilter({ sort: e.target.value, page: 1 }))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Default</option>
              <option value="age">Age (Asc)</option>
              <option value="-age">Age (Desc)</option>
              <option value="lifetimeValue">LTV (Asc)</option>
              <option value="-lifetimeValue">LTV (Desc)</option>
              <option value="creditBalance">Credit Score (Asc)</option>
              <option value="-creditBalance">Credit Score (Desc)</option>
              <option value="purchases">Purchases (Asc)</option>
              <option value="-purchases">Purchases (Desc)</option>
            </select>
          </div>
        </form>
        <div className="flex justify-end gap-2 mt-3">
          <Button onClick={loadCustomers} variant="secondary" size="sm">
            Refresh List
          </Button>
          <Button onClick={handleClearFilters} variant="outline" size="sm">
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Main Records Table */}
      <Card className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Customer ID</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Demographics</th>
                <th className="px-6 py-4">Credit Score</th>
                <th className="px-6 py-4">Total Purchases</th>
                <th className="px-6 py-4">LTV</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/40 text-sm text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-20 text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <CircularProgress size={30} className="text-indigo-500" />
                      <span>Syncing with MongoDB Atlas...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle size={24} className="text-amber-500" />
                      <span>No matching records found. Try modifying filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const id = c._id || c.id;
                  const formattedId = id?.toString().slice(-8).toUpperCase();
                  const nameStr = `Client-${formattedId}`;

                  return (
                    <tr key={id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-200">{nameStr}</p>
                          <p className="text-[10px] font-mono text-indigo-400 mt-0.5">{id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-slate-200">{c.City}</p>
                          <p className="text-xs text-slate-500">{c.Country}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {c.Age} yrs / <span className="text-xs text-slate-500">{c.Gender}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{c.Credit_Balance}</span>
                          <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                c.Credit_Balance > 3000 ? 'bg-emerald-500' : c.Credit_Balance > 1500 ? 'bg-indigo-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, (c.Credit_Balance / 5000) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-300">
                        {c.Total_Purchases || 0} items
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-200">
                        ${Number(c.Lifetime_Value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            c.Churned === 0
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {c.Churned === 0 ? 'Active' : 'Churned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                          <button
                            onClick={() => openEditModal(c)}
                            className="hover:text-indigo-400 transition-colors cursor-pointer"
                            title="Edit Customer"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(c)}
                            className="hover:text-rose-500 transition-colors cursor-pointer"
                            title="Delete Profile"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Page {filters.page} of {pagination.pages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(setFilter({ page: Math.max(filters.page - 1, 1) }))}
                disabled={filters.page === 1}
                className="flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Prev</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(setFilter({ page: Math.min(filters.page + 1, pagination.pages) }))}
                disabled={filters.page === pagination.pages}
                className="flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ===================== MUI ADD DIALOG ===================== */}
      <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)} fullWidth maxWidth="md">
        <DialogTitle className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold flex justify-between items-center">
          <span>Create New Customer Record</span>
          <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
            <X size={18} />
          </button>
        </DialogTitle>
        <form onSubmit={addFormik.handleSubmit}>
          <DialogContent className="bg-white dark:bg-slate-900 space-y-4 pt-6 text-slate-750 dark:text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Age */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Age</label>
                <input
                  type="number"
                  name="Age"
                  value={addFormik.values.Age}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter age (e.g. 35)"
                  required
                />
                {addFormik.touched.Age && addFormik.errors.Age && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{addFormik.errors.Age}</span>
                )}
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Gender</label>
                <select
                  name="Gender"
                  value={addFormik.values.Gender}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
                {addFormik.touched.Gender && addFormik.errors.Gender && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{addFormik.errors.Gender}</span>
                )}
              </div>

              {/* Country */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Country</label>
                <input
                  type="text"
                  name="Country"
                  value={addFormik.values.Country}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter country (e.g. France)"
                  required
                />
                {addFormik.touched.Country && addFormik.errors.Country && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{addFormik.errors.Country}</span>
                )}
              </div>

              {/* City */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">City</label>
                <input
                  type="text"
                  name="City"
                  value={addFormik.values.City}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter city (e.g. Paris)"
                  required
                />
                {addFormik.touched.City && addFormik.errors.City && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{addFormik.errors.City}</span>
                )}
              </div>

              {/* Lifetime Value */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Lifetime Value ($)</label>
                <input
                  type="number"
                  name="Lifetime_Value"
                  value={addFormik.values.Lifetime_Value}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter LTV amount"
                  required
                />
                {addFormik.touched.Lifetime_Value && addFormik.errors.Lifetime_Value && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{addFormik.errors.Lifetime_Value}</span>
                )}
              </div>

              {/* Credit Balance */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Credit Balance Score</label>
                <input
                  type="number"
                  name="Credit_Balance"
                  value={addFormik.values.Credit_Balance}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter credit balance"
                  required
                />
                {addFormik.touched.Credit_Balance && addFormik.errors.Credit_Balance && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{addFormik.errors.Credit_Balance}</span>
                )}
              </div>

              {/* Churn Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Churn Status</label>
                <select
                  name="Churned"
                  value={addFormik.values.Churned}
                  onChange={(e) => addFormik.setFieldValue('Churned', Number(e.target.value))}
                  onBlur={addFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value={0}>Active</option>
                  <option value={1}>Churned</option>
                </select>
                {addFormik.touched.Churned && addFormik.errors.Churned && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{addFormik.errors.Churned}</span>
                )}
              </div>

              {/* Signup Quarter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Signup Quarter</label>
                <select
                  name="Signup_Quarter"
                  value={addFormik.values.Signup_Quarter}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
                {addFormik.touched.Signup_Quarter && addFormik.errors.Signup_Quarter && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{addFormik.errors.Signup_Quarter}</span>
                )}
              </div>

              {/* Total Purchases */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Purchases</label>
                <input
                  type="number"
                  name="Total_Purchases"
                  value={addFormik.values.Total_Purchases}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter total purchases count"
                />
                {addFormik.touched.Total_Purchases && addFormik.errors.Total_Purchases && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{addFormik.errors.Total_Purchases}</span>
                )}
              </div>

              {/* Cart Abandonment Rate */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Cart Abandonment Rate (%)</label>
                <input
                  type="number"
                  name="Cart_Abandonment_Rate"
                  value={addFormik.values.Cart_Abandonment_Rate}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter abandonment %"
                />
                {addFormik.touched.Cart_Abandonment_Rate && addFormik.errors.Cart_Abandonment_Rate && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{addFormik.errors.Cart_Abandonment_Rate}</span>
                )}
              </div>
            </div>
          </DialogContent>
          <DialogActions className="bg-white dark:bg-slate-900 p-6 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium">
              Create Customer
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ===================== MUI EDIT DIALOG ===================== */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} fullWidth maxWidth="md">
        <DialogTitle className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold flex justify-between items-center">
          <span>Edit Customer: Client-{selectedCustomer?.id?.toString().slice(-8).toUpperCase()}</span>
          <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
            <X size={18} />
          </button>
        </DialogTitle>
        <form onSubmit={editFormik.handleSubmit}>
          <DialogContent className="bg-white dark:bg-slate-900 space-y-4 pt-6 text-slate-750 dark:text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Age */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Age</label>
                <input
                  type="number"
                  name="Age"
                  value={editFormik.values.Age}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter age (e.g. 35)"
                  required
                />
                {editFormik.touched.Age && editFormik.errors.Age && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{editFormik.errors.Age}</span>
                )}
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Gender</label>
                <select
                  name="Gender"
                  value={editFormik.values.Gender}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
                {editFormik.touched.Gender && editFormik.errors.Gender && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{editFormik.errors.Gender}</span>
                )}
              </div>

              {/* Country */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Country</label>
                <input
                  type="text"
                  name="Country"
                  value={editFormik.values.Country}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter country (e.g. France)"
                  required
                />
                {editFormik.touched.Country && editFormik.errors.Country && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{editFormik.errors.Country}</span>
                )}
              </div>

              {/* City */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">City</label>
                <input
                  type="text"
                  name="City"
                  value={editFormik.values.City}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter city (e.g. Paris)"
                  required
                />
                {editFormik.touched.City && editFormik.errors.City && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{editFormik.errors.City}</span>
                )}
              </div>

              {/* Lifetime Value */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Lifetime Value ($)</label>
                <input
                  type="number"
                  name="Lifetime_Value"
                  value={editFormik.values.Lifetime_Value}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter LTV amount"
                  required
                />
                {editFormik.touched.Lifetime_Value && editFormik.errors.Lifetime_Value && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{editFormik.errors.Lifetime_Value}</span>
                )}
              </div>

              {/* Credit Balance */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Credit Balance Score</label>
                <input
                  type="number"
                  name="Credit_Balance"
                  value={editFormik.values.Credit_Balance}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter credit balance"
                  required
                />
                {editFormik.touched.Credit_Balance && editFormik.errors.Credit_Balance && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{editFormik.errors.Credit_Balance}</span>
                )}
              </div>

              {/* Churn Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Churn Status</label>
                <select
                  name="Churned"
                  value={editFormik.values.Churned}
                  onChange={(e) => editFormik.setFieldValue('Churned', Number(e.target.value))}
                  onBlur={editFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value={0}>Active</option>
                  <option value={1}>Churned</option>
                </select>
                {editFormik.touched.Churned && editFormik.errors.Churned && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{editFormik.errors.Churned}</span>
                )}
              </div>

              {/* Signup Quarter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Signup Quarter</label>
                <select
                  name="Signup_Quarter"
                  value={editFormik.values.Signup_Quarter}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
                {editFormik.touched.Signup_Quarter && editFormik.errors.Signup_Quarter && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{editFormik.errors.Signup_Quarter}</span>
                )}
              </div>

              {/* Total Purchases */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Purchases</label>
                <input
                  type="number"
                  name="Total_Purchases"
                  value={editFormik.values.Total_Purchases}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter total purchases count"
                />
                {editFormik.touched.Total_Purchases && editFormik.errors.Total_Purchases && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{editFormik.errors.Total_Purchases}</span>
                )}
              </div>

              {/* Cart Abandonment Rate */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-semibold">Cart Abandonment Rate (%)</label>
                <input
                  type="number"
                  name="Cart_Abandonment_Rate"
                  value={editFormik.values.Cart_Abandonment_Rate}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter abandonment %"
                />
                {editFormik.touched.Cart_Abandonment_Rate && editFormik.errors.Cart_Abandonment_Rate && (
                  <span className="text-xs text-rose-500 font-medium mt-0.5">{editFormik.errors.Cart_Abandonment_Rate}</span>
                )}
              </div>
            </div>
          </DialogContent>
          <DialogActions className="bg-white dark:bg-slate-900 p-6 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ===================== MUI DELETE DIALOG ===================== */}
      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
          <AlertTriangle className="text-rose-500" size={20} />
          <span>Delete Customer Record?</span>
        </DialogTitle>
        <DialogContent className="bg-white dark:bg-slate-900 pt-5 text-slate-700 dark:text-slate-300">
          <p className="text-sm leading-relaxed">
            Are you sure you want to delete customer <strong>Client-{selectedCustomer?.id?.toString().slice(-8).toUpperCase()}</strong>?
            This action cannot be undone and will remove the record directly from MongoDB Atlas.
          </p>
        </DialogContent>
        <DialogActions className="bg-white dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Record
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Customers;
