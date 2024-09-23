<h1>Node.js JWT Authentication and Authorization System</h1>

<p>This project implements an authentication and authorization system using <strong>JWT (JSON Web Tokens)</strong> in Node.js. It supports both <strong>Admin</strong> and <strong>Normal User</strong> roles, and includes a variety of APIs to handle token generation, verification, refresh, and termination.</p>

<h2>Project Features:</h2>
<ul>
  <li><strong>JWT Token Generation</strong>: 
    <p>Securely generate JWT tokens upon successful login for both admins and users. The tokens are used to authorize and authenticate the client on protected routes.</p>
  </li>

  <li><strong>Token Verification</strong>: 
    <p>APIs that verify if a token is valid or expired. This ensures only authenticated users can access certain routes or resources.</p>
  </li>

  <li><strong>Refresh Token Regeneration</strong>: 
    <p>Mechanism to regenerate refresh tokens when the original JWT token expires. This prevents users from having to log in again while still maintaining security.</p>
  </li>

  <li><strong>Refresh Token Termination</strong>: 
    <p>API to terminate refresh tokens, which can be useful when users log out or when an admin wants to revoke a user’s access.</p>
  </li>

  <li><strong>Admin and User Role Authorization</strong>: 
    <p>Different access levels for admins and regular users. Admins have elevated permissions to manage resources that normal users cannot access.</p>
  </li>
</ul>

<h2>Component Breakdown:</h2>

<h3>1. <strong>Authentication Component</strong></h3>
<p>This component handles user login, JWT token generation, and role-based user authentication.</p>
<pre><code>
// Sample code for login and token generation
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Verify user credentials and generate JWT token
  const token = jwt.sign({ username, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.json({ token });
});
</code></pre>

<h3>2. <strong>Authorization Middleware</strong></h3>
<p>This middleware verifies JWT tokens, ensuring that only authenticated users can access protected routes.</p>
<pre><code>
// Sample middleware for token verification
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token is required');
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');
    req.user = decoded;
    next();
  });
};
</code></pre>

<h3>3. <strong>Refresh Token Component</strong></h3>
<p>This component handles the regeneration of refresh tokens when the JWT token expires.</p>
<pre><code>
// Sample code to refresh the token
router.post('/refresh-token', (req, res) => {
  const refreshToken = req.body.token;
  // Verify refresh token and generate a new access token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid refresh token');
    const newToken = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ token: newToken });
  });
});
</code></pre>

<h3>4. <strong>Token Termination Component</strong></h3>
<p>This component handles the termination of refresh tokens when a user logs out or their access needs to be revoked.</p>
<pre><code>
// Sample code to terminate the refresh token
router.post('/logout', (req, res) => {
  const refreshToken = req.body.token;
  // Remove refresh token from the storage (DB or cache)
  res.status(200).send('Refresh token terminated');
});
</code></pre>

<h3>5. <strong>Role-Based Authorization</strong></h3>
<p>This component enforces different levels of access for users and admins based on their roles.</p>
<pre><code>
// Middleware to authorize based on user roles
const authorizeRoles = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).send('Access denied');
    next();
  };
};

// Example: Protecting an admin route
router.get('/admin/dashboard', [verifyToken, authorizeRoles('admin')], (req, res) => {
  res.send('Welcome Admin!');
});
</code></pre>

<h2>How to Use:</h2>

<ol>
  <li><strong>Clone the Repository</strong>:
    <pre><code>git clone https://github.com/prog-ankit/JWT-Authentication-Node-JS.git</code></pre>
  </li>

  <li><strong>Install Dependencies</strong>:
    <pre><code>npm install</code></pre>
  </li>

  <li><strong>Configure Environment Variables</strong>:  
    <p>Create a <code>.env</code> file and set your JWT secret and refresh token secret:</p>
    <pre><code>JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret</code></pre>
  </li>

  <li><strong>Run the Project</strong>:
    <pre><code>npm start</code></pre>
  </li>
</ol>

<h2>API Endpoints:</h2>

<ul>
  <li><strong>POST /api/login</strong>: Authenticate user and generate JWT token.</li>
  <li><strong>POST /api/refreshToken</strong>: Regenerate refresh token when the JWT token expires.</li>
  <li><strong>POST /api/users/logout</strong>: Terminate the refresh token when the user logs out.</li>
</ul>

<p>This project demonstrates secure authentication and role-based authorization using JWT tokens, ensuring both scalability and flexibility in managing user access.</p>
