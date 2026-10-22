# backlog
- login/register pages for author and reader apps 
- cron job to clean up the expired refresh tokens
- don't forget helmet and rateLimit (for some reason)
- refresh token rotation + revoked field for refresh tokens (optional)
- session id (meaning refresh token id) in the access token, checked per request (optional)

# done
- logout
- refresh token
- login/register endpoints + passport-jwt


# targets
- [19/10] login/register endpoints (without refresh tokens)
- [20/10] refresh tokens
- [21/10] login page + fetch request
- [22/10] preserve state after login

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
