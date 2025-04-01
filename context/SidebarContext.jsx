import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';

const SidebarContext = createContext();

const initialState = {
  user: null,
  billingUrl: '/#pricing',
  loading: true,
};

function sidebarReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'SET_BILLING_URL':
      return { ...state, billingUrl: action.payload };
    default:
      return state;
  }
}

export function SidebarProvider({ children }) {
  const [state, dispatch] = useReducer(sidebarReducer, initialState);
  const router = useRouter();
  const dataFetched = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/user/user");
      const userData = await response.json();
      dispatch({ type: 'SET_USER', payload: userData });

      if (userData?.name) {
        const portalResponse = await fetch("/api/create-portal-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: userData.name }),
        });
        const { url } = await portalResponse.json();
        dispatch({ type: 'SET_BILLING_URL', payload: url });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      dispatch({ type: 'SET_USER', payload: null });
    }
  }, []);

  useEffect(() => {
    if (router.pathname.startsWith('/dashboard/') && !dataFetched.current) {
      dataFetched.current = true;
      fetchData();
    }
  }, [fetchData, router.pathname]);

  return (
    <SidebarContext.Provider value={{ state, dispatch, refreshData: fetchData }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);