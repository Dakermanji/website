Dakermanji Web Dev Portfolio
============================

This is a personal portfolio website showcasing my skills, projects, and professional experience as a full-stack web developer. The website includes dynamic sections such as "About Me," "Services," "Portfolio," and "Contact Me," with data stored in a MySQL database.

Features
--------

- **Dynamic Content**: Sections are dynamically rendered using EJS templates and modularized data sources.
- **Contact Form**: Messages submitted via the contact form are stored in a database for future management.
- **Sentry Integration**: Full error tracking and performance monitoring using Sentry.
- **Responsive Design**: Optimized for all devices using Bootstrap.
- **Backend**: Node.js with Express.js.
- **Database**: MySQL with connection pooling for scalability.

Installation
------------

### Prerequisites

- [Node.js](https://nodejs.org/) v14+ installed
- MySQL server installed and running

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/Dakermanji/website.git
    cd website
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Replace packages:
    Replace `connect-flash` in `node_modules` with the updated version from [this repository](https://github.com/Dakermanji/connect-flash).

4. Set up environment variables:

    Create a `.env` file in the root directory and add the following:

    ```env
    HOST=localhost
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=yourdatabase
    DB_PORT=3306
    SESSION_SECRET=your-session-secret
    SENTRY_DSN=your-sentry-dsn
    SENTRY_PROJECT_ID=your-sentry-project-id
    ```

5. Initialize the database:

    Create the required tables by running the SQL scripts in the `sql/` folder:
    - `messages.sql`

6. Start the server:

    ```bash
    npm start
    ```

7. Visit the website:

    Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

Usage
-----

- Navigate to the home page to view the portfolio.
- Use the contact form to send a message.
- Explore dynamic sections such as "About Me," "Services," and "Portfolio."

Technologies Used
-----------------

- **Frontend**: EJS, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Error Tracking**: Sentry
- **Session Management**: express-session, express-flash

Screenshots
-----------

<!-- Add screenshots here -->
- **Home Page**: _Coming Soon_
- **Contact Form**: _Coming Soon_

Contributing
------------

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature:

    ```bash
    git checkout -b feature-name
    ```

3. Commit your changes:

    ```bash
    git commit -m "Add feature-name"
    ```

4. Push to your branch:

    ```bash
    git push origin feature-name
    ```

5. Open a pull request on GitHub.

License
-------

This project is licensed under the [MIT License](LICENSE).

Contact
-------

If you have any questions or feedback, feel free to contact me:

- **Email**: [dakermanji@gmail.com](mailto:dakermanji@gmail.com)
- **LinkedIn**: [LinkedIn Profile](https://linkedin.com/in/yourprofile)
- **GitHub**: [GitHub Profile](https://github.com/Dakermanji)
