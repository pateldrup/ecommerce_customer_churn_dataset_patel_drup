import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BrainCircuit, AlertTriangle, Lightbulb, CheckCircle2, ShieldAlert, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import customerService from '../services/customerService';
import { addToast } from '../store/uiSlice';
import { useDispatch } from 'react-redux';

export const Predictions = () => {
  const dispatch = useDispatch();
  // Simulator inputs
  const [age, setAge] = useState(42);
  const [credit, setCredit] = useState(600);
  const [purchases, setPurchases] = useState(15);
  const [discount, setDiscount] = useState(30);
  const [cartAbandonment, setCartAbandonment] = useState(65);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // High risk list from backend
  const [atRiskCustomers, setAtRiskCustomers] = useState([]);
  const [fetchingRisks, setFetchingRisks] = useState(false);

  const fetchRiskData = async () => {
    setFetchingRisks(true);
    try {
      const res = await customerService.getChurnPredictions();
      if (res?.data) {
        setAtRiskCustomers(res.data);
      }
    } catch (e) {
      console.warn('Failed to load live predictions from backend', e);
    } finally {
      setFetchingRisks(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
  }, []);

  const handleSimulate = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Scoring logic matching the advancedController backend rules
      let score = 0;
      if (credit < 1500) score += 20;
      if (purchases < 5) score += 25;
      if (age > 45) score += 15;
      if (cartAbandonment > 70) score += 20;
      if (discount > 50) score += 10;
      if (score === 0) score = 15; // baseline

      const risk = score > 60 ? 'High' : score > 35 ? 'Medium' : 'Low';
      const color = risk === 'High' ? 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30' : risk === 'Medium' ? 'text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' : 'text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';

      setResult({ risk, score, color });
      setLoading(false);
      dispatch(addToast({ message: 'Simulation completed successfully!', type: 'success' }));
    }, 800);
  };

  return (
    <div className="p-8 space-y-8">
      <Helmet>
        <title>AI Predictions Console - Churnlytics</title>
        <meta name="description" content="Simulate customer churn rates and visualize high-risk user profiles using scoring rules and live MongoDB analytics feeds." />
        <meta property="og:title" content="AI Churn Predictions | Churnlytics" />
      </Helmet>

      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">AI & Rule-Based Predictions</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Predicting customer churn probabilities and retention segments using scoring rules.
          </p>
        </div>
        <Button onClick={fetchRiskData} loading={fetchingRisks} variant="outline" className="flex items-center gap-2">
          <RefreshCw size={15} />
          <span>Refresh Flagged Feeds</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulator Panel */}
        <Card title="Churn Probability Simulator" subtitle="Input customer metrics to predict risk" className="lg:col-span-2">
          <form onSubmit={handleSimulate} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Customer Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  min="18"
                  max="100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Credit Score / Balance</label>
                <input
                  type="number"
                  value={credit}
                  onChange={(e) => setCredit(parseInt(e.target.value))}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  min="0"
                  max="5000"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Purchases</label>
                <input
                  type="number"
                  value={purchases}
                  onChange={(e) => setPurchases(parseInt(e.target.value))}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  min="0"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Discount Utilized Rate (%)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseInt(e.target.value))}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  min="0"
                  max="100"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Cart Abandonment Rate ({cartAbandonment}%)</label>
                <input
                  type="range"
                  value={cartAbandonment}
                  onChange={(e) => setCartAbandonment(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 dark:accent-indigo-500 bg-slate-200 dark:bg-slate-900"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full flex justify-center items-center gap-2 bg-indigo-600">
              <BrainCircuit size={16} />
              <span>Simulate Risk Probabilities</span>
            </Button>
          </form>

          {/* Results card */}
          {result && (
            <div className={`mt-6 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between transition-all ${result.color}`}>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Prediction Outcome</p>
                <h4 className="text-2xl font-bold mt-1">{result.risk} Risk Profile</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Churn vulnerability score: {result.score} / 100</p>
              </div>
              <div className="flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {result.risk === 'High' ? <ShieldAlert size={28} /> : result.risk === 'Medium' ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />}
              </div>
            </div>
          )}
        </Card>

        {/* Marketing Recommendations side bar */}
        <Card title="Loyalty Interventions" subtitle="Automated retention plans">
          <div className="space-y-4 mt-2">
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-200 dark:border-rose-500/10 text-xs">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold mb-1">
                <AlertTriangle size={14} />
                <span>Campaign: At-Risk Alerts</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Send targeted cashback or credit vouchers to users with credit scores under 1500 experiencing high cart abandonment.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-200 dark:border-indigo-500/10 text-xs">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                <Lightbulb size={14} />
                <span>Campaign: High Segment Retention</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Initiate premium loyalty gifts or concierge check-ins for users categorized under high-value with active memberships.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Flagged Risks list */}
      <Card title="Flagged Risk Customers" subtitle="Active users matching critical churn parameters in MongoDB">
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100/60 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3">Customer ID</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Age / Gender</th>
                <th className="px-6 py-3">Vulnerability Level</th>
                <th className="px-6 py-3">Key Risk Driver Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/40 text-sm text-slate-700 dark:text-slate-300">
              {fetchingRisks ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-500">
                    Syncing risk logs...
                  </td>
                </tr>
              ) : atRiskCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-500">
                    No high-risk active customer signals currently flagged.
                  </td>
                </tr>
              ) : (
                atRiskCustomers.map((customer) => {
                  const id = customer._id || customer.id;
                  return (
                    <tr key={id} className="hover:bg-slate-100 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-indigo-600 dark:text-indigo-400">{id}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{customer.Country}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{customer.Age} yrs / <span className="text-xs text-slate-500 dark:text-slate-500">{customer.Gender}</span></td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          customer.churnScore >= 60 ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                        }`}>
                          {customer.churnScore >= 60 ? 'Critical' : 'High'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-rose-600 dark:text-rose-400">{customer.churnScore} % score</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Predictions;
