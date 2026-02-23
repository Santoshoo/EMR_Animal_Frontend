import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Activity, CalendarDays, User, ArrowLeft, Stethoscope, FileText, Pill, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimalDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [animal, setAnimal] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [newRecord, setNewRecord] = useState({ diagnosis: '', treatment: '', notes: '', prescription: [] });

  const fetchData = async () => {
    try {
      const [animalRes, recordsRes] = await Promise.all([
        api.get(`/animals/${id}`),
        api.get(`/records/${id}`)
      ]);
      setAnimal(animalRes.data.data.animal);
      setRecords(recordsRes.data.data.records || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/records`, { ...newRecord, animal_id: id });
      setShowRecordModal(false);
      fetchData();
      setNewRecord({ diagnosis: '', treatment: '', notes: '', prescription: [] });
    } catch (err) {
      console.error("Failed to add record", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] text-white">
        <Navbar />
        <div className="flex justify-center items-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
        </div>
      </div>
    );
  }

  if (!animal) return <div className="min-h-screen bg-[#0a0f1c] text-white"><Navbar /><div className="py-20 text-center">Patient not found</div></div>;

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-300 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <Link to="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Roster</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Patient Overview Side */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Activity size={180} className="text-emerald-500 -rotate-12 translate-x-10 -translate-y-10" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-slate-900 shadow-inner flex items-center justify-center border border-slate-800 border-b-emerald-500/50 border-b-4">
                    <span className="text-3xl font-bold text-white uppercase">{animal.name.charAt(0)}</span>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide border ${
                     animal.gender === 'male' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                     animal.gender === 'female' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 
                     'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    {animal.gender?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold text-white mb-1">{animal.name}</h1>
                <p className="text-emerald-400 font-medium capitalize flex items-center gap-2 mb-8">
                  {animal.species} • {animal.breed}
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
                    <div className="flex items-center gap-3 text-slate-400">
                      <CalendarDays size={20} className="text-indigo-400" />
                      <span>Age</span>
                    </div>
                    <span className="font-bold text-white tracking-wide">{animal.age ? `${animal.age} Years` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Activity size={20} className="text-rose-400" />
                      <span>Weight</span>
                    </div>
                    <span className="font-bold text-white tracking-wide">{animal.weight ? `${animal.weight} Kg` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
                    <div className="flex items-center gap-3 text-slate-400">
                      <User size={20} className="text-amber-400" />
                      <span>Owner ID</span>
                    </div>
                    <span className="font-mono text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded truncate max-w-[120px]" title={animal.owner_id}>
                      {animal.owner_id ? animal.owner_id.split('-')[0] + '...' : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Medical Records Side */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/20 backdrop-blur border border-slate-700/50 rounded-3xl p-8 min-h-[600px]">
              <div className="flex justify-between items-center mb-8 border-b border-slate-700/50 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FileText className="text-emerald-400" /> Medical History
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Chronological record of past diagnoses and treatments.</p>
                </div>
                {user?.role !== 'owner' && (
                  <button 
                    onClick={() => setShowRecordModal(true)}
                    className="flex items-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-900 border border-emerald-500/20 font-bold py-2 px-4 rounded-xl transition-all"
                  >
                    <Plus size={18} />
                    <span>New Entry</span>
                  </button>
                )}
              </div>

              {records.length === 0 ? (
                <div className="text-center py-24 px-4">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
                    <Stethoscope size={32} className="text-slate-500" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-300">No medical records found</h3>
                  <p className="text-slate-500 mt-2 max-w-md mx-auto">This patient has a clean slate. Any new diagnoses, treatments, or prescriptions will appear here.</p>
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                  {records.map((record, index) => (
                    <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 group-hover:border-emerald-500 group-hover:bg-emerald-500/10 text-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                        <Stethoscope size={16} />
                      </div>
                      
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-900/50 hover:bg-slate-900/80 p-6 rounded-2xl border border-slate-700/50 shadow-sm transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 flex-shrink-0">
                            {new Date(record.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">Dr. {record.vet_name || 'Staff'}</span>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</h4>
                            <p className="text-white text-base leading-relaxed">{record.diagnosis}</p>
                          </div>
                          
                          <div className="h-px w-full bg-slate-800" />

                          <div>
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Treatment</h4>
                            <p className="text-slate-300 leading-relaxed text-sm">{record.treatment}</p>
                          </div>

                          {(record.notes || (record.prescription && record.prescription.length > 0)) && (
                            <div className="h-px w-full bg-slate-800" />
                          )}

                          {record.notes && (
                            <div>
                              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</h4>
                              <p className="text-slate-400 italic text-sm">{record.notes}</p>
                            </div>
                          )}

                          {record.prescription && Array.isArray(record.prescription) && record.prescription.length > 0 && (
                            <div>
                               <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-2">
                                 <Pill size={14} /> Prescriptions
                               </h4>
                               <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
                                 {record.prescription.map((rx, idx) => (
                                   <li key={idx}>{rx}</li>
                                 ))}
                               </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Add Record Modal */}
        <AnimatePresence>
          {showRecordModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="text-emerald-400" size={24} /> New Medical Record
                  </h3>
                  <button onClick={() => setShowRecordModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                </div>
                
                <form onSubmit={handleAddRecord} className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Diagnosis</label>
                    <input type="text" required value={newRecord.diagnosis} onChange={e => setNewRecord({...newRecord, diagnosis: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-600" placeholder="Primary evaluation..." />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Treatment Regimen</label>
                    <textarea required rows="3" value={newRecord.treatment} onChange={e => setNewRecord({...newRecord, treatment: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-600 resize-none" placeholder="Procedures or actions taken..."></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1 flex items-center justify-between">
                      Notes (Optional)
                    </label>
                    <textarea rows="2" value={newRecord.notes} onChange={e => setNewRecord({...newRecord, notes: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-600 resize-none" placeholder="Additional observations..."></textarea>
                  </div>

                  {/* To handle prescriptions, a simple block. In a real app we'd map over it, here just simple split by comma */}
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Prescriptions (Comma separated)</label>
                    <input type="text" value={newRecord.prescription.join(', ')} onChange={e => setNewRecord({...newRecord, prescription: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-600" placeholder="Amoxicillin 250mg, Rimadyl 50mg..." />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setShowRecordModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium">Cancel</button>
                    <button type="submit" className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20">Save Record</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AnimalDetail;
