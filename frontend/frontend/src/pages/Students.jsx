import React from 'react';
import { useAuth } from '../utils/useAuth';

const Students = () => {
  const { user } = useAuth();
  console.log('Students component rendered, user:', user);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Students Management Page</h1>
      <p>This page is working!</p>
      <p>User: {user ? `${user.name} (${user.role})` : 'Not logged in'}</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default Students;