'use client';

import { useState, useEffect } from 'react';
import { Subscription } from '@/types/subscription';
import { Plus, Edit2, Trash2, Calendar, CreditCard, Activity } from 'lucide-react';

export default function Home() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<Subscription>>({
        name: '',
        cost: 0,
        period: 'monthly',
        next_due: '',
        currency: 'THB',
        is_trial: 0
    });

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        const response = await fetch('/api/subscriptions');
        const data = await response.json();
        setSubscriptions(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingId ? `/api/subscriptions/?id=${editingId}` : '/api/subscriptions';
        const method = editingId ? 'PUT' : 'POST';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        resetForm();
        fetchSubscriptions();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Freeze this subscription permanently?')) {
            await fetch(`/api/subscriptions/?id=${id}`, { method: 'DELETE' });
            fetchSubscriptions();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', cost: 0, period: 'monthly', next_due: '', currency: 'THB', is_trial: 0 });
        setEditingId(null);
        setIsFormOpen(false);
    };

    const stats = {
        monthly: subscriptions.reduce((sum, sub) => sum + (sub.period === 'monthly' ? sub.cost : sub.cost / 12), 0),
        count: subscriptions.length,
        trials: subscriptions.filter(s => s.is_trial === 1).length
    };

    return (
        <div className="min-h-screen bg-base-300 text-base-content font-sans p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tighter text-primary">SUBZERO ❄️</h1>
                        <p className="text-base-content/60 text-sm">Managing {stats.count} subscriptions</p>
                    </div>
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="btn btn-primary shadow-lg"
                    >
                        <Plus size={18} /> Add Sub
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard icon={<CreditCard className="text-info"/>} label="Monthly Burn" value={`฿${stats.monthly.toFixed(2)}`} />
                    <StatCard icon={<Activity className="text-success"/>} label="Active Services" value={stats.count} />
                    <StatCard icon={<Calendar className="text-secondary"/>} label="Trial Periods" value={stats.trials} />
                </div>

                {/* Subscriptions List */}
                <div className="grid gap-4">
                    {subscriptions.map(sub => (
                        <div 
                            key={sub.id} 
                            className="card bg-base-100 shadow-xl border border-base-content/10 p-5 group hover:bg-base-200/50 transition-all flex flex-col md:flex-row items-center gap-4"
                        >
                            <div className="flex flex-1 items-center gap-4 w-full">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full w-12 flex items-center justify-center">
                                        <span className="text-xl font-bold">
                                            {sub.name.charAt(0)}
                                        </span>
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-lg flex flex-wrap items-center gap-2">
                                        {sub.name} 
                                        {Boolean(sub.is_trial) && <div className="badge badge-success badge-outline badge-xs px-2 py-2">TRIAL</div>}
                                    </h3>
                                    <p className="text-base-content/50 text-sm truncate">
                                        Next due: {typeof sub.next_due === 'string' ? sub.next_due : new Date(sub.next_due).toLocaleDateString('en-GB')} • {sub.period}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between w-full md:w-auto md:gap-8 border-t border-base-content/10 pt-4 md:border-0 md:pt-0 mt-2 md:mt-0">
                                <div className="text-left md:text-right">
                                    <p className="text-2xl font-mono font-bold text-primary">฿{Number(sub.cost).toFixed(2)}</p>
                                </div>
                                
                                <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => { setEditingId(sub.id!); setFormData(sub); setIsFormOpen(true); }} 
                                        className="btn btn-ghost btn-sm text-info"
                                        aria-label="Edit"
                                    >
                                        <Edit2 size={18}/>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(sub.id!)} 
                                        className="btn btn-ghost btn-sm text-error"
                                        aria-label="Delete"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal Form */}
                {isFormOpen && (
                    <div className="modal modal-open">
                        <div className="modal-box bg-base-100 border border-base-content/10">
                            <h2 className="text-xl font-bold mb-6 text-primary">{editingId ? 'Update' : 'Add New'} Subscription</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Service Name</span></label>
                                    <input 
                                        className="input input-bordered w-full"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div className="flex gap-4">
                                    <div className="form-control flex-1">
                                        <label className="label"><span className="label-text">Cost</span></label>
                                        <input 
                                            type="number"
                                            className="input input-bordered w-full"
                                            value={formData.cost? formData.cost : ""}
                                            onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})}
                                            required
                                        />
                                    </div>
                                    <div className="form-control flex-1">
                                        <label className="label"><span className="label-text">Billing</span></label>
                                        <select 
                                            className="select select-bordered w-full"
                                            value={formData.period}
                                            onChange={e => setFormData({...formData, period: e.target.value as 'monthly' | 'yearly'})}
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label"><span className="label-text">Renewal Date</span></label>
                                    <input 
                                        type="date" 
                                        className="input input-bordered w-full"
                                        value={formData.next_due}
                                        onChange={e => setFormData({...formData, next_due: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="form-control mt-4">
                                    <label className="label cursor-pointer justify-start gap-4 bg-base-100 rounded-lg px-4">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.is_trial === 1}
                                            onChange={e => setFormData({...formData, is_trial: e.target.checked ? 1 : 0})}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text">Mark as trial period</span>
                                    </label>
                                </div>

                                <div className="modal-action">
                                    <button type="button" onClick={resetForm} className="btn btn-ghost">Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: any, label: string, value: any }) {
    return (
        <div className="card bg-base-100 border border-base-content/10 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
                {icon}
                <span className="label-text-alt font-bold uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}