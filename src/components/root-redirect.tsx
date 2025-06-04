import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RootRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
      navigate('/', { replace: true });  // Redirect to "/" if email exists
    } else {
      navigate('/pmslogin', { replace: true });  // Otherwise to "/pmslogin"
    }
  }, [navigate]);

  return null; // No UI, just redirect
};

export default RootRedirect;
