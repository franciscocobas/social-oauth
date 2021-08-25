import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

import TwitterIcon from './images/twitter.svg';
import GithubIcon from './images/github-sign.svg';

type UserMetada = {
  avatar_url: string;
  full_name: string;
  user_name: string;
};

function App() {
  const supabaseClient = useRef<any>();
  const [user, setUser] = useState<UserMetada | undefined>();

  useEffect(() => {
    console.log(process.env.REACT_APP_SUPABASE_URL);
    if (
      process.env.REACT_APP_SUPABASE_URL &&
      process.env.REACT_APP_SUPABASE_ANON_KEY
    ) {
      supabaseClient.current = createClient(
        process.env.REACT_APP_SUPABASE_URL,
        process.env.REACT_APP_SUPABASE_ANON_KEY
      );
      const getUser = async () => {
        const supabaseUser = supabaseClient.current.auth.user();
        console.log(supabaseUser);
        if (supabaseUser) setUser(supabaseUser.user_metadata);
      };
      getUser();
    }
  }, []);

  const loginWithGithub = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { user, session, error } = await supabaseClient.current.auth.signIn({
      provider: 'github',
    });
  };
  const loginWithTwitter = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { user, session, error } = await supabaseClient.current.auth.signIn({
      provider: 'twitter',
    });
  };

  const logout = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { error } = await supabaseClient.current.auth.signOut();
    if (error) {
      console.log(error);
      return;
    }
    setUser(undefined);
  };

  return (
    <div className='login-container'>
      <form>
        <button onClick={loginWithGithub}>
          <img src={GithubIcon} alt='Icono de Github' />
          Login with Github
        </button>
        <button onClick={loginWithTwitter}>
          <img src={TwitterIcon} alt='Icono de Twitter' />
          Login with Twitter
        </button>
        <button onClick={logout}>Logout</button>
      </form>
      {user && (
        <div className='user-information'>
          <p>
            <img src={user.avatar_url} alt='User Avatar' />
          </p>
          <p>
            <b>Full Name:</b> {user.full_name}
          </p>
          <p>
            <b>Username:</b> {user.user_name}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
