import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('usuario');
      
      if (userData) {
        try {
          const parsedUser = userData.startsWith('{') ? JSON.parse(userData) : { data: userData };
          setUser(parsedUser);
        } catch (error) {
          console.error('Error al parsear usuario:', error);
          localStorage.removeItem('usuario');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email, contrasena) => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, contrasena })
      });

      const data = await res.text();

      if (res.ok) {
        localStorage.setItem("usuario", data);
        
        try {
          const parsedUser = data.startsWith('{') ? JSON.parse(data) : { data };
          setUser(parsedUser);
        } catch {
          setUser({ data });
        }
        
        return { success: true, message: "Inicio de sesión exitoso" };
      } else {
        return { success: false, message: data || "Error al iniciar sesión" };
      }
    } catch (error) {
      return { 
        success: false, 
        message: "Error de conexión: " + error.message 
      };
    }
  };

  // Registro
  const register = async (userData) => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await res.text();

      if (res.ok) {
        return { success: true, message: "Usuario registrado con éxito" };
      } else {
        return { success: false, message: data || "Error al registrar" };
      }
    } catch (error) {
      return { 
        success: false, 
        message: "Error de conexión: " + error.message 
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('usuario');
    setUser(null);
  };

  // Recuperar contraseña
  const recoverPassword = async (email) => {
    try {
      // Simular envío (ajusta según tu backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, message: "Código enviado exitosamente" };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Error al enviar código' 
      };
    }
  };

  // Restablecer contraseña
  const resetPassword = async (email, code, newPassword) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, message: "Contraseña actualizada" };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Error al restablecer contraseña' 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    recoverPassword,
    resetPassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};