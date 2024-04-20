# Paytm Wallet

A live application for users  to send funds directly to other user accounts

Some Features:
- Tech stack: MERN  + TailwindCSS + Daisy UI
- Authentication: Users can log in with their credentials and receive a JWT token.
- Authorization: Routes and endpoints can be protected with middleware that verifies the JWT token to grant access to authenticated users only.
- Users can view their account balance and other users
- Implemented MongoDB Transactions to ensure data consistency and reliability
- Implemented lazy loading to enhance website performance and scalability.
- 🐞 Error handling both on the server and on the client

### clone the repo

```shell
git clone https://github.com/abhishekgupta1906/Paytm-Project-Backend.git
```

### Start the app

```shell
npm run dev
```


**Set Environment Variables**
  ```
   MONGODB_URL= your-mongo-db-url
   PORT = 3000
   JWT_SECRET = your-jwt-secret
   ```


