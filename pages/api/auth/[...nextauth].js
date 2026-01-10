import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

async function refreshAccessTokenCredentials(token) {
  const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'api/auth/token/refresh/'
  const payload = {
    refresh: token.refreshToken
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }

    })
    const refreshedTokens = await response.json()
    if (!response.ok) {
      throw refreshedTokens
    }
    return {
      ...token,
      error: undefined,
      accessToken: refreshedTokens.access,
      // accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      accessTokenExpires: Math.floor(new Date(refreshedTokens.access_token_expiration)), //refreshedTokens.access_token_expiration,
      refreshToken: refreshedTokens.refresh ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }

}
export default NextAuth({
  // Base URL for NextAuth (set via NEXTAUTH_URL environment variable)
  // This ensures the redirect URI is correctly constructed for OAuth callbacks
  // NextAuth will automatically append /api/auth/ to construct API routes
  // IMPORTANT: NEXTAUTH_URL should be the base domain (e.g., https://chitralhive.com)
  // If your app is deployed at /admin/, you should use basePath in next.config.js
  // instead of including /admin/ in NEXTAUTH_URL
  ...(process.env.NEXTAUTH_URL && { 
    url: (() => {
      let url = process.env.NEXTAUTH_URL.endsWith('/') 
        ? process.env.NEXTAUTH_URL.slice(0, -1) 
        : process.env.NEXTAUTH_URL;
      // Always extract just the origin (protocol + host) to avoid path issues
      // Next.js basePath (if set) will handle the /admin/ path automatically
      try {
        const urlObj = new URL(url);
        return urlObj.origin;
      } catch {
        // If URL parsing fails, try to extract origin manually
        const match = url.match(/^https?:\/\/[^\/]+/);
        return match ? match[0] : url;
      }
    })()
  }),
  secret: process.env.JWT_SECRET,


  providers: [
    // CredentialsProvider({

    //   name: 'Email and Password',
    //   credentials: {
    //     email: { label: 'Email', type: 'text'},
    //     password: { label: 'Password', type: 'password' }
    //   },
    //   // This is were you can put your own external API call to validate Email and Password
    //   authorize: async (credentials) => {
    //     if (credentials.email === 'user@email.com' && credentials.password === '123') {
    //       return { id: 11, name: 'User', email: 'user@email.com'} 
    //     }

    //     return null;

    //   }
    // }),
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        username: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        const payload = {
          email: credentials.username, // Send email in email field
          username: credentials.username, // Also send in username field for compatibility
          password: credentials.password,
          role: credentials.role
        };
        const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'api/auth/login/'
        try {
          const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" }
          })
          
          // Check if response is JSON
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error("Non-JSON response from backend:", text.substring(0, 200));
            return null;
          }
          
          const user = await res.json()
          if (res.ok && user) {
            return user;
          }
          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      }
    }),

  ],
  theme: {
    colorScheme: "dark",
  },
  pages: {
    signIn: '/login',
    //    signOut: '/signout',

  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },

    async jwt({ token, user, account }) {
      if (account?.provider === 'credentials') {
        if (user && account) {
          // first time -> 
          token = Object.assign(Object.assign({}, token), 
                { accessToken:user.access_token,
                  refreshToken: user.refresh_token, 
                  accessTokenExpires: Math.floor(new Date(user.access_token_expiration)) - 0.5*60*1000, 
                  refreshTokenExpires:Math.floor(new Date(user.refresh_token_expiration)),
                  user: user.user,
                  provider:account.provider });
                return token;
          // token = Object.assign(Object.assign({}, token), { accessToken: user.access_token, refreshToken: user.refresh_token, accessTokenExpires: Date.now() + process.env.ACCESS_TOKEN_LIFETIME * 1000 * 60 - 1 * 60 * 1000, user: user.user, provider: account.provider });
          // return token;
        }
      }
      // Initial sign in
      if (account && user && account.provider === 'google') {
        // make a POST request to the DRF backend
        const response = await axios({
          method: 'post',
          url: process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'api/google/',
          data: {
            access_token: account.access_token,
            id_token: account.id_token,
          }
        }
        );

        const { access_token, refresh_token, user } = response.data;
        user.name = token.name;
        user.picture = token.picture;
        token = Object.assign(Object.assign({}, token), 
                { accessToken:user.access_token,
                  refreshToken: user.refresh_token, 
                  accessTokenExpires: Math.floor(new Date(user.access_token_expiration)) - 0.5*60*1000, 
                  refreshTokenExpires:Math.floor(new Date(user.refresh_token_expiration)),
                  user: user.user,
                  provider:account.provider });
                return token;
      }

      // Return previous token if the access token has not expired yet

      // Return previous token if the access token has not expired yet
      
     if (Date.now() >= token.refreshTokenExpires) {

      return {
         ...token,
        // Return an error code 
        accessToken : undefined,
        refreshToken : undefined,
        user : undefined,
         error: "SessionTimedOut",
        }
    }
    if (Date.now() < token.accessTokenExpires) {
      return token
    }
      return refreshAccessTokenCredentials(token)
    },


    async session({ session, token, user }) {
      // Only set session properties if token exists and has valid data
      if (token.user) {
        session.user = token.user
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken
      }
      if (token.error) {
        session.error = token.error
      }


      const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "getGeneralSetting";

      if (session.accessToken) {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const logo = await response.json();
       
            session.logodata =logo[0].site_logo;
          } else {
          }
        } catch (error) {
        }
      }







      // Handle session timeout
      if (session.error === 'SessionTimedOut' || token.error === 'SessionTimedOut'){
        session.accessToken = undefined;
        session.refreshToken = undefined;
        session.user = undefined;
      }
      
      // Set expiration only if token has expiration data
      if (token.accessTokenExpires) {
        session.expires = new Date(token.accessTokenExpires).toISOString();
        session.accessTokenExpires = token.accessTokenExpires;
      }
      
      return session
    },
  },

})
