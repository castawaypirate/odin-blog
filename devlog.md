# backlog
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

# takeaways
- [19/10]:
    - a culnerability-free implementation is jwt access tokens + refresh tokens where access tokens are saved to the react's state management system and refresh tokens are delivered through cookies
    - refresh tokens are saved in the database and each user may have many refresh tokens (this serves the purpose of the same user being logged in to the application from several devices for example)
    - passport-jwt strategy (which needs passport also to work) is used for guarding the routes and what it does is to verify the signature and the expiry of the jwt and see if user is legit
