import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Award, ShieldAlert, Heart, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import customerService from '../services/customerService';
import { addToast } from '../store/uiSlice';
import { useDispatch } from 'react-redux';

// Cohorts definitions
const segmentsList = [
  {
    key: 'premium',
    name: 'Premium Cohort',
    icon: Award,
    color: 'border-indigo-200 dark:border-indigo-500/20 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5',
    criteria: 'LTV ≥ $5,000 and Membership Tenure ≥ 3 Years',
    description: 'High-value customer base with excellent credit limits. Ideal for exclusive loyalty tiers and upsells.',
    sampleCount: 1543,
  },
  {
    key: 'loyal',
    name: 'Loyal Cohort',
    icon: Heart,
    color: 'border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/5',
    criteria: 'Membership tenure ≥ 4 Years (Active)',
    description: 'Customers with long-standing tenure. Highly resilient to churn. Good candidates for brand advocacy.',
    sampleCount: 3820,
  },
  {
    key: 'risky',
    name: 'Risky Cohort',
    icon: ShieldAlert,
    color: 'border-rose-200 dark:border-rose-500/20 text-rose-650 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-500/5',
    criteria: 'Inactive ≥ 60 Days & Logins ≤ 5 times',
    description: 'Users exhibiting declining logins, high abandonment, or low credit limits. Require immediate intervention.',
    sampleCount: 941,
  },
  {
    key: 'inactive',
    name: 'Inactive Cohort',
    icon: Clock,
    color: 'border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-500/5',
    criteria: 'Zero purchases in past 90 days',
    description: 'Dormant accounts. Target with win-back promotions, reactive discount notifications, or feedback surveys.',
    sampleCount: 1104,
  },
];

export const Segments = () => {
  const dispatch = useDispatch();
  const [activeSegment, setActiveSegment] = useState(segmentsList[0]);
  const [sampleCustomers, setSampleCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCohortData = async (cohortKey) => {
    setLoading(true);
    try {
      const res = await customerService.getSegment(cohortKey);
      if (res?.data) {
        setSampleCustomers(res.data);
      } else {
        setSampleCustomers([]);
      }
    } catch (e) {
      console.warn(`Failed to fetch live members for segment: ${cohortKey}`, e);
      setSampleCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCohortData(activeSegment.key);
  }, [activeSegment]);

  return (
    <div className="p-8 space-y-8">
      <Helmet>
        <title>Customer Cohorts & Segments - Churnlytics</title>
        <meta name="description" content="Explore custom customer cohorts based on lifetime value, membership tenure, and retention risk criteria." />
        <meta property="og:title" content="Cohorts & Segments | Churnlytics" />
      </Helmet>

      {/* Title */}
      <div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Customer Cohorts & Segments</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Automated customer groupings designed to support tailored CRM campaigns and churn-prevention initiatives.
        </p>
      </div>

      {/* Cohort Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {segmentsList.map((segment) => {
          const Icon = segment.icon;
          const isSelected = activeSegment.key === segment.key;
          return (
            <div
              key={segment.key}
              onClick={() => setActiveSegment(segment)}
              className={`p-6 border rounded-2xl cursor-pointer transition-all duration-300 ${segment.color} ${
                isSelected ? 'ring-2 ring-indigo-500/50 shadow-xl translate-y-[-4px]' : 'opacity-70 hover:opacity-100 hover:translate-y-[-2px]'
              }`}
            >
              <div className="flex justify-between items-center">
                <Icon size={24} />
                <span className="text-xs bg-slate-100 dark:bg-slate-900/60 px-2.5 py-1 rounded-full font-semibold border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-300">
                  Cohort
                </span>
              </div>
              <h4 className="text-md font-bold mt-4 text-slate-800 dark:text-slate-200">{segment.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{segment.description}</p>
            </div>
          );
        })}
      </div>

      {/* Selected Cohort Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cohort details */}
        <Card title={`${activeSegment.name} Overview`} subtitle="Cohort parameters and segmentation criteria" className="lg:col-span-1">
          <div className="space-y-5 mt-2">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Segmentation Criteria</p>
              <p className="text-sm text-indigo-600 font-medium mt-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 px-3 py-2 rounded-xl">
                {activeSegment.criteria}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Intervention Strategy</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {activeSegment.description} This group is updated dynamically based on incoming purchase logs and event tracking middleware hooks.
              </p>
            </div>

            <Button
              onClick={() => fetchCohortData(activeSegment.key)}
              loading={loading}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} />
              <span>Refresh Segment Data</span>
            </Button>
          </div>
        </Card>

        {/* Sample Customer lists */}
        <Card title={`Sample Users (${activeSegment.name})`} subtitle="Live database profiles matching current rules" className="lg:col-span-2">
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-100/60 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-3">User ID</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Age / Gender</th>
                  <th className="px-6 py-3">LTV</th>
                  <th className="px-6 py-3">Credit Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/40 text-sm text-slate-700 dark:text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-slate-500">
                      Syncing segment profiles...
                    </td>
                  </tr>
                ) : sampleCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-slate-500">
                      No customer records match this cohort criteria in MongoDB.
                    </td>
                  </tr>
                ) : (
                  sampleCustomers.map((c) => {
                    const id = c._id || c.id;
                    const formattedId = id?.toString().slice(-8).toUpperCase();
                    const nameStr = `Client-${formattedId}`;
                    return (
                      <tr key={id} className="hover:bg-slate-100 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                          <div>
                            <p>{nameStr}</p>
                            <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">{id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {c.City}, {c.Country}
                        </td>
                        <td className="px-6 py-4">{c.Age} yrs / <span className="text-xs text-slate-500">{c.Gender}</span></td>
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">${c.Lifetime_Value?.toFixed(2)}</td>
                        <td className="px-6 py-4 font-semibold">{c.Credit_Balance}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Segments;
