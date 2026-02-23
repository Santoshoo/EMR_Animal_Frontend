import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../api';
import { Plus, Cat, Dog, Rabbit, Bird, Search, Activity, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimalIcon = ({ species, size = 20, className = '' }) => {
  switch (species?.toLowerCase()) {
    case 'dog': return <Dog size={size} className={`text-blue-400 ${className}`} />;
    case 'cat': return <Cat size={size} className={`text-amber-400 ${className}`} />;
    case 'bird': return <Bird size={size} className={`text-emerald-400 ${className}`} />;
    default: return <Rabbit size={size} className={`text-purple-400 ${className}`} />;
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAnimal, setNewAnimal] = useState({ name: '', species: 'dog', breed: '', age: '', weight: '', gender: 'unknown' });

  const fetchAnimals = async () => {
    try {
      const { data } = await api.get('/animals');
      setAnimals(data.data.animals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleAddAnimal = async (e) => {
    e.preventDefault();
    try {
      await api.post('/animals', newAnimal);
      setShowAddModal(false);
      fetchAnimals();
      setNewAnimal({ name: '', species: 'dog', breed: '', age: '', weight: '', gender: 'unknown' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-300 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 mt-4 relative z-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Patient Roster</h1>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">Overview of all registered animals and medical profiles.</p>
          </div>
          
          {user?.role !== 'owner' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2.5 px-5 rounded-full transition-all shadow-lg hover:shadow-emerald-500/20"
            >
              <Plus size={20} />
              <span>Admit Patient</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32 z-10 relative">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 relative z-10">
            {animals.length === 0 ? (
               <div className="col-span-full py-20 text-center border border-dashed border-slate-700/50 rounded-2xl bg-slate-800/20 backdrop-blur-sm">
                 <Search size={48} className="mx-auto text-slate-600 mb-4" />
                 <h3 className="text-xl font-medium text-slate-300">No patients found</h3>
                 <p className="text-slate-500 mt-2">Get started by admitting a new animal patient to the clinic.</p>
               </div>
            ) : (
                animals.map((animal, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={animal.id}
                  >
                    <Link
                      to={`/animals/${animal.id}`}
                      className="group flex flex-col justify-between h-full bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-emerald-500/10 hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={80} className="text-emerald-400 -rotate-12 translate-x-4 -translate-y-4" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                          <div className="p-3 bg-slate-900/80 rounded-xl shadow-inner border border-slate-700">
                            <AnimalIcon species={animal.species} size={28} />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${
                             animal.gender === 'male' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                             animal.gender === 'female' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 
                             'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                            {animal.gender?.toUpperCase() || 'N/A'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{animal.name}</h3>
                        <p className="text-sm font-medium text-slate-400 capitalize mb-4">{animal.breed || animal.species}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/30">
                            <span className="block text-slate-500 mb-1">Age</span>
                            <span className="font-semibold text-slate-300">{animal.age ? `${animal.age} yrs` : '-'}</span>
                          </div>
                          <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/30">
                            <span className="block text-slate-500 mb-1">Weight</span>
                            <span className="font-semibold text-slate-300">{animal.weight ? `${animal.weight} kg` : '-'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between text-sm text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                         <span>View Profile</span>
                         <ChevronRight size={16} />
                      </div>
                    </Link>
                  </motion.div>
                ))
            )}
          </div>
        )}

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Plus className="text-emerald-400" size={24} /> Register Patient
                  </h3>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                </div>
                
                <form onSubmit={handleAddAnimal} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Name</label>
                    <input type="text" required value={newAnimal.name} onChange={e => setNewAnimal({...newAnimal, name: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-600" placeholder="e.g. Max" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Species</label>
                      <select value={newAnimal.species} onChange={e => setNewAnimal({...newAnimal, species: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all">
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="bird">Bird</option>
                        <option value="reptile">Reptile</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Gender</label>
                      <select value={newAnimal.gender} onChange={e => setNewAnimal({...newAnimal, gender: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Breed</label>
                    <input type="text" value={newAnimal.breed} onChange={e => setNewAnimal({...newAnimal, breed: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-600" placeholder="e.g. Golden Retriever" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Age (Yrs)</label>
                      <input type="number" step="0.1" value={newAnimal.age} onChange={e => setNewAnimal({...newAnimal, age: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-600" placeholder="e.g. 5" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">Weight (Kg)</label>
                      <input type="number" step="0.1" value={newAnimal.weight} onChange={e => setNewAnimal({...newAnimal, weight: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-600" placeholder="e.g. 15.5" />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium">Cancel</button>
                    <button type="submit" className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20">Register</button>
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

export default Dashboard;
