import React, { useState, useEffect } from 'react';
import { FaSpinner, FaCheck, FaExclamationTriangle, FaPlus } from 'react-icons/fa';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', position: '', salary: '' });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:5000/employees');
    setEmployees(await res.json());
    setLoading(false);
  };

  const handleAddEmployee = async (newEmployee) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      });
      if (res.ok) {
        setToast({ type: 'success', message: 'Employee added successfully' });
        fetchEmployees();
      } else {
        throw new Error('Error adding employee');
      }
    } catch (error) {
      setToast({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setForm(employee);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setLoading(true);
      await fetch(`http://localhost:5000/employees/${id}`, { method: 'DELETE' });
      setLoading(false);
      fetchEmployees();
    }
  };

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.position.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => { fetchEmployees(); }, []);

  return (
    <div className="p-5 max-w-4xl mx-auto">
      {toast && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          <button className="absolute top-0 right-0 p-1" onClick={() => setToast(null)}>×</button>
          <div className="flex items-center space-x-2">
            <span>{toast.type === 'success' ? <FaCheck /> : <FaExclamationTriangle />}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold text-center mb-5">Employee Management</h1>
      <AddEmployeeCard onAddEmployee={handleAddEmployee} loading={loading} />
      <input
        type="text"
        placeholder="Search..."
        className="w-full border border-gray-300 p-3 mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 cursor-pointer hover:text-blue-800">Name</th>
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 cursor-pointer hover:text-blue-800">Email</th>
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 cursor-pointer hover:text-blue-800">Position</th>
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 cursor-pointer hover:text-blue-800">Salary</th>
            <th className="border border-gray-300 px-4 py-2 bg-gray-100">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((e) => (
            <tr key={e._id}>
              <td className="border border-gray-300 px-4 py-2">{e.name}</td>
              <td className="border border-gray-300 px-4 py-2">{e.email}</td>
              <td className="border border-gray-300 px-4 py-2">{e.position}</td>
              <td className="border border-gray-300 px-4 py-2">${e.salary}</td>
              <td className="border border-gray-300 px-4 py-2 space-x-2">
                <button className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600" onClick={() => handleEdit(e)}>
                  Edit
                </button>
                <button className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" onClick={() => handleDelete(e._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AddEmployeeCard = ({ onAddEmployee, loading }) => {
  const [form, setForm] = useState({ name: '', email: '', position: '', salary: '' });
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAddEmployee(form);
      setForm({ name: '', email: '', position: '', salary: '' });
      setToast({ type: 'success', message: 'Employee added successfully' });
    } catch (error) {
      setToast({ type: 'error', message: 'Error adding employee' });
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto bg-white rounded-lg shadow-md mb-8">
      {toast && (
        <div className={`p-3 rounded-lg ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white mb-4`}>
          <button className="absolute top-0 right-0 p-1" onClick={() => setToast(null)}>×</button>
          <div className="flex items-center space-x-2">
            <span>{toast.type === 'success' ? <FaCheck /> : <FaExclamationTriangle />}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
      <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          value={form.name}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          value={form.email}
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          value={form.position}
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          value={form.salary}
        />
        <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"  >
            Add Employee
        </button>
      </form>
    </div>
  );
};

export default App;
