import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/allUsers');
      setUsers(response.data);
    } catch (err) { setError('Failed to fetch users.'); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this user?')) {
        try {
            await api.delete(`/admin/delete/${id}`);
            fetchUsers();
        } catch (err) { setError('Failed to delete user.'); }
    }
  };
  
  const handleApprove = async (user) => {
    if(window.confirm('Are you sure you want to approve this user?')) {
        try {
            await api.put(`/users/${user.id}`, { ...user, approved: true });
            fetchUsers();
        } catch (err) { setError('Failed to approve user.'); }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.approved ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {user.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="py-2 px-4 space-x-2">
                  {!user.approved && user.role !== 'ADMIN' && (
                    <button onClick={() => handleApprove(user)} className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Approve</button>
                  )}
                  {user.role !== 'ADMIN' && (
                     <button onClick={() => handleDelete(user.id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;