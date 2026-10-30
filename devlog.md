# backlog
- login/register pages for author and reader apps 
- create post
- author dashboard (view/edit/delete for each post)
- edit post (in edit mode you can change the state of the post)
- author's comment carries a badge
- post will have three states drafts, review, published ... so drafts will be only for the owner, review will be displayed to authors in reader app (maybe leave different kind of comments there) and published for all
- cron job to clean up the expired refresh tokens

- don't forget helmet and rateLimit (for some reason)
- ask agent what did I not implement about refresh token (maybe this was about rotation)

- refresh token rotation + revoked field for refresh tokens (optional)
- session id (meaning refresh token id) in the access token, checked per request (optional)
- refresh endpoint call for author app should check if user is author (optional)

# done
- loading elements while fetching (kinda done)
- refresh token wrapper frontend
- logout reader app
- logout
- refresh token
- login/register endpoints + passport-jwt


# targets
- [19/10] login/register endpoints (without refresh tokens)
- [20/10] refresh tokens
- [21/10] login page + fetch request
- [22/10] preserve state after login + logout
- [28/10] apiService abstraction layer
- [29/10] refresh token wrapper frontend
- [30/10] author create post, author dashboard (dashboard has all types of posts)

# takeaways
- [19/10]:
    - a secure enough implementation is jwt access tokens + refresh tokens where access tokens are saved to the react's state management system and refresh tokens are delivered through cookies
    - refresh tokens are saved in the database and each user may have many refresh tokens (this serves the purpose of the same user being logged in to the application from several devices for example)
    - passport-jwt strategy (which needs passport also to work) is used for guarding the routes and what it does is to verify the signature and the expiry of the jwt and see if user is legit
- [20/10]:
    - /refresh should not be guarded, the check is done with the refresh cookie value looks at the database and sees the information it needs to return unauthorized or to create new access token
    - in each request we query the database because of passport-jwt which does this to fetch the user and attaches it to req
    - postman authorization header with bearer token selected doesnt need "Bearer" before the token
    - in login and register we generate new both access and refresh tokens
    - cookie-parser to parse cookies from request and to save we use httpOnly: true, secure: false for development, maxAge: same with expiresAt of the refresh token and sameSite: "lax" for browser to withhold the cookie on cross-site POSTs
    - clearCookie to delete with the above information but without the maxAge
    - gte to compare dates or values inside prisma query
    - middleware functions that need extra parameter need a wrapper function (if you do test(req, res, next) while you are adding it as middleware it will call itself and break where the wrapper function test(parameter) it will call itself and return a function and that function will function as the middleware)
- [21/10]:
    - Loaders and middleware run outside React, so they can’t use useContext. Three approaches came out of that: A, everything in React (chosen); B, the router fetches the user; C, a hybrid with a ref plus a wrapper. Fetch instead of axios is fine, you just write the wrapper yourself
- [22/10]:
    - use ref for token because ui never displays them
    - export functions from context, import them inside pages/components and use them - they will update the variables stored in state (this is the current pattern we use now)
    - {{value}} to pass context variables and functions to children but it is bad for performance because it creates a new object every new re-render
    - makes no difference to put ref variable in dependency array because the reference in memory stays the same during re-renders
    - to logout just put an onClick on the NavLink of logout
- [28/10]:
    - we need a wrapper function to do retries with the refresh token if the user gets 401
    - we have 3 cases 200, 401 and 500 - only in 401 we setUser(null)
- [29/10]:
    - wrapper function takes inner function as parameter, execute it once, sees status and then refreshes or returns execution result - after one refresh you return the status from refresh or you execute function again and return result
    - refresh retries have 3 outcomes - one success you return the request result, one 401 you log out the user and one 500 or something went wrong where you do nothing
    - also the wrapper function takes as argument a arrow function and call the wrapper function to wrap the request line and not the whole login for example
    - loading state implementation in my case is a state variable living the in component that gets the results of the requests - before executing the request you set it to true and at the end of the request no matter the result you set it to false - then you can inject it inside components and render things with an if
    - for guards create extra components, inject the user state and <Navigate to="" /> based on conditions - then wrap the components in the routes.jsx
    - you can set vite proxy in th vite.config.js to make the requests to target - broswer hits the_site/api then vite backend sees that api is a rule under proxy and sends the request to target set under api rule - then because of the changeOrigin changes the request's host header to target so backend sees that the request comes from the same origin - that way you can bypass cors (but better do not unset it in the server) - also this is for development and also by using this you don't need .env files for the base api url
    - vite proxy is for dev only - production needs other configurations
    - the browser enforces cors but the server is the one that sets the policy
    - based on the request some what a preflight and some not - if the preflight is rejected the actual request never leaves the broswer

