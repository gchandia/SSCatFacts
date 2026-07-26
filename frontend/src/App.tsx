import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { authService } from './services/auth.service';
import { catFactsService } from './services/catfacts.service';
import type { LikedFact } from './services/catfacts.service';
import axios from 'axios';

function MainApp() {
  const { user, login, logout, isAuthenticated } = useAuth();

  // Estados de Auth
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');

  // Estados de Cat Facts
  const [currentFact, setCurrentFact] = useState<string>('');
  const [loadingFact, setLoadingFact] = useState(false);
  const [likedFacts, setLikedFacts] = useState<LikedFact[]>([]);
  const [isCurrentLiked, setIsCurrentLiked] = useState(false);

  // Obtener un dato aleatorio al hacer clic en el botón
  const fetchRandomFact = useCallback(async () => {
    setLoadingFact(true);
    setIsCurrentLiked(false);
    try {
      const data = await catFactsService.getRandomFact();
      setCurrentFact(data.fact);
    } catch (err) {
      console.error('Error al obtener el hecho:', err);
    } finally {
      setLoadingFact(false);
    }
  }, []);

  // Función para recargar la lista de likes tras interacciones de usuario
  const fetchMyLikes = useCallback(async () => {
    if (!isAuthenticated) {
      setLikedFacts([]);
      return;
    }
    try {
      const likes = await catFactsService.getMyLikes();
      setLikedFacts(likes);
    } catch (err) {
      console.error('Error al obtener mis likes:', err);
    }
  }, [isAuthenticated]);

  // UN SOLO useEffect DE MONTAJE: Carga inicial de Fact + Likes (si ya venía autenticado)
  useEffect(() => {
    let isMounted = true;

    const initData = async () => {
      setLoadingFact(true);
      setIsCurrentLiked(false);

      try {
        // Petición del dato aleatorio
        const data = await catFactsService.getRandomFact();
        if (isMounted) {
          setCurrentFact(data.fact);
        }

        // Petición de los likes si el usuario ya tenía sesión en localStorage
        if (isAuthenticated) {
          const likes = await catFactsService.getMyLikes();
          if (isMounted) {
            setLikedFacts(likes);
          }
        }
      } catch (err) {
        console.error('Error en la inicialización de datos:', err);
      } finally {
        if (isMounted) {
          setLoadingFact(false);
        }
      }
    };

    initData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      let res;
      if (isRegistering) {
        await authService.register(usernameInput, passwordInput);
        res = await authService.login(usernameInput, passwordInput);
      } else {
        res = await authService.login(usernameInput, passwordInput);
      }
      login(res.token, res.user);
      setUsernameInput('');
      setPasswordInput('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Axios identifica automáticamente el tipo del error
        setAuthError(err.response?.data?.error || 'Ocurrió un error en el servidor');
      } else if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError('Ocurrió un error inesperado');
      }
    }
  };

  // Toggle Me Gusta
  const handleToggleLike = async () => {
    if (!isAuthenticated || !currentFact) return;
    try {
      const res = await catFactsService.toggleLike(currentFact);
      setIsCurrentLiked(res.liked);
      fetchMyLikes();
    } catch (err) {
      console.error('Error al dar like:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-6">
      <header className="w-full max-w-2xl flex justify-between items-center mb-8 pb-4 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-amber-400">🐱 SSCatFacts</h1>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              Hola, <strong className="text-amber-300">{user?.username}</strong>
            </span>
            <button
              onClick={() => {
                logout();
                setLikedFacts([]);
              }}
              className="bg-slate-700 hover:bg-slate-600 text-xs px-3 py-1.5 rounded transition"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400">Inicia sesión para guardar tus datos favoritos</span>
        )}
      </header>

      <main className="w-full max-w-2xl space-y-8">
        {/* Formulario de Login/Registro si no está autenticado */}
        {!isAuthenticated && (
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">
              {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h2>
            {authError && <p className="text-red-400 text-sm mb-4 text-center">{authError}</p>}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Usuario</label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 font-semibold py-2 rounded text-slate-950 transition"
              >
                {isRegistering ? 'Registrarse' : 'Entrar'}
              </button>
            </form>
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-center text-xs text-amber-400 mt-4 hover:underline"
            >
              {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        )}

        {/* Tarjeta del Hecho Aleatorio */}
        <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Dato Curioso sobre Gatos</h2>
          <div className="min-h-[80px] flex items-center justify-center">
            {loadingFact ? (
              <span className="text-slate-400 animate-pulse">Cargando dato...</span>
            ) : (
              <p className="text-lg text-slate-200 text-center italic">"{currentFact}"</p>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchRandomFact}
              className="flex-1 bg-slate-700 hover:bg-slate-600 font-medium py-2 rounded transition"
            >
              Siguiente Dato 🎲
            </button>
            {isAuthenticated && (
              <button
                onClick={handleToggleLike}
                className={`px-6 py-2 rounded font-medium transition ${
                  isCurrentLiked
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                }`}
              >
                {isCurrentLiked ? '❤️ Te gusta' : '🤍 Me gusta'}
              </button>
            )}
          </div>
        </section>

        {/* Lista de Mis Likes */}
        {isAuthenticated && (
          <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-amber-400">Mis Datos Favoritos ({likedFacts.length})</h2>
            {likedFacts.length === 0 ? (
              <p className="text-sm text-slate-500">Aún no le has dado "Me Gusta" a ningún dato.</p>
            ) : (
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {likedFacts.map((item) => (
                  <li key={item.id} className="p-3 bg-slate-900 rounded border border-slate-700/50 text-sm text-slate-300">
                    "{item.fact}"
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
