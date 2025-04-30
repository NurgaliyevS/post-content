import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';

const SidebarContext = createContext();

const initialState = {
  user: null,
  billingUrl: '/#pricing',
  loading: true,
  hasScheduledPosts: false,
};

function sidebarReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'SET_BILLING_URL':
      return { ...state, billingUrl: action.payload };
    case 'SET_HAS_SCHEDULED_POSTS':
      return { ...state, hasScheduledPosts: action.payload };
    default:
      return state;
  }
}

export function SidebarProvider({ children }) {
  const [state, dispatch] = useReducer(sidebarReducer, initialState);
  const router = useRouter();
  const dataFetched = useRef(false);

  const fetchHasScheduledPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/post/get-last-post");
      const scheduledPosts = await response.json();
      dispatch({ type: 'SET_HAS_SCHEDULED_POSTS', payload: !!scheduledPosts?.lastPost });
    } catch (e) {
      dispatch({ type: 'SET_HAS_SCHEDULED_POSTS', payload: false });
    }
  }, []);

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
      fetchHasScheduledPosts();
    } catch (error) {
      console.error("Error fetching user data:", error);
      dispatch({ type: 'SET_USER', payload: null });
    }
  }, [fetchHasScheduledPosts]);

  useEffect(() => {
    if (router.pathname.startsWith('/dashboard/') && !dataFetched.current) {
      dataFetched.current = true;
      fetchData();
    }
  }, [fetchData, router.pathname]);

  return (
    <SidebarContext.Provider value={{
      state,
      dispatch,
      refreshData: fetchData,
      hasScheduledPosts: state.hasScheduledPosts,
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);