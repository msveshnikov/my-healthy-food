2.  **Install client-side dependencies:**

    ```bash
    bun install
    cd server
    bun install
    cd ..
    ```

    This will install all necessary npm packages for both the client and server applications.

3.  **Set up environment variables:**

    - Create a `.env` file in the root directory of the project.
    - Add the following environment variables based on `docker-compose.yml` and your configuration
      needs:

        ```env
        NODE_ENV=development # or production
        OPENAI_KEY=<Your OpenAI API Key>
        DEEPSEEK_KEY=<Your DeepSeek API Key>
        GOOGLE_KEY=<Your Google API Key>
        CLAUDE_KEY=<Your Claude API Key>
        GROK_KEY=<Your Grok API Key>
        UNSPLASH_API_KEY=<Your Unsplash API Key>
        GOOGLE_CLIENT_ID=652455043417-2tj5qo41pl38e6ufsvplut50e6a2asmp.apps.googleusercontent.com # Publicly available Client ID, should be reviewed for security in production.
        GA_API_SECRET=<Your Google Analytics API Secret>
        MONGODB_URI=mongodb://localhost:27017/myhealthy # For local MongoDB, or use 'mongodb://mongodb:27017/myhealthy' for Docker setup
        STRIPE_KEY=<Your Stripe API Key>
        STRIPE_WH_SECRET=<Your Stripe Webhook Secret>
        JWT_SECRET=<Your JWT Secret Key> # Secure random string for JWT signing
        EMAIL=<Your Email Address for SMTP>
        FROM_EMAIL=<Your "From" Email Address>
        EMAIL_PASSWORD=<Your Email Password or App Password>
        FRONTEND_URL=http://localhost:5173 # For development, use production URL in production
        ```

        **Note:** Replace placeholders like `<Your API Key>` with your actual API keys and secrets.
        Ensure the `GOOGLE_CLIENT_ID` is properly configured for your application, and consider
        security implications of hardcoding it. For production, use environment variables securely
        managed by your hosting provider.

4.  **Run MongoDB (if not using Docker):**
    - If you are not using Docker, ensure MongoDB is running locally on the specified `MONGODB_URI`
      (default: `mongodb://localhost:27017/myhealthy`).

### 2. Development

1.  **Start the development server:**

    ```bash
    bun run dev
    ```

    This command, defined in `package.json`, will start the Vite development server for the client
    application, usually accessible at `http://localhost:5173`. The server-side application (if
    configured to run separately for development) would need to be started in another terminal
    window (e.g., `bun server/index.js` or using nodemon for auto-reloading).

2.  **Access the application:** Open your browser and navigate to `http://localhost:5173`.

### 3. Production Deployment (using Docker)

1.  **Build the Docker image:**

    ```bash
    docker build -t myhealthy-food .
    ```

2.  **Run with Docker Compose:**

    ```bash
    docker-compose up -d
    ```

    This command, using `docker-compose.yml`, will start both the backend application and the
    MongoDB database in Docker containers. The application will be accessible at
    `http://localhost:8025` (as defined in `docker-compose.yml`).

    **Note:** For production, you should configure a reverse proxy (like Nginx or Apache) to serve
    the application on port 80 or 443 and handle SSL/TLS certificates. You also need to properly
    manage environment variables in a production environment, ideally not directly in
    `docker-compose.yml` but using Docker secrets or environment variable management tools.

### 4. Database Export (using `copy.cmd`)

The `copy.cmd` script is provided to export MongoDB collections from a remote server. To use it:

1.  **Ensure SSH access:** Make sure you have SSH access to the remote server (`AutoResearch.pro` as
    per script).
2.  **Configure script variables:** Modify `REMOTE_USER`, `REMOTE_HOST`, and `REMOTE_DIR` in
    `copy.cmd` if necessary to match your remote server setup.
3.  **Run the script:**
    ```cmd
    copy.cmd
    ```
    This will execute the script, which will:
    - SSH into the remote server.
    - Use `mongoexport` inside the `auto_mongodb_1` Docker container to export `users`,
      `presentations`, and `feedbacks` collections to CSV files on the remote server.
    - Use `scp` to copy these CSV files from the remote server to the current directory on your
      local machine.

### 5. Stopping the Application (using `kill.cmd`)

The `kill.cmd` script is a simple way to stop any running Node.js processes. In Windows command
prompt, run:
