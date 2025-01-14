import { useNavigate } from 'react-router';
import { useEffect } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const navigate = useNavigate();
  
  const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('accessToken='))?.split('=')[1]
    || localStorage.getItem('accessToken'); 

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) {
    return <div>Yükleniyor...</div>;
  }

  return <>{children}</>;
};

export default PrivateRoute;
