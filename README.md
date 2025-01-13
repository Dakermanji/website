Dakermanji Web Dev Portfolio
============================

This is a personal portfolio website showcasing my skills, projects, and professional experience as a full-stack web developer. The website includes dynamic sections such as "About Me," "Services," "Portfolio," and "Contact Me," with data stored in a MySQL database.

Features
--------

- **Dynamic Content**: Sections are dynamically rendered using EJS templates and modularized data sources.
- **Contact Form**: Messages submitted via the contact form are sanitized, validated, and stored securely in a database.
- **Sentry Integration**: Full error tracking and performance monitoring using Sentry.
- **Responsive Design**: Optimized for all devices using Bootstrap.
- **SEO Friendly**: Follows modern web standards for improved discoverability.
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

3. Set up environment variables:

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

4. Initialize the database:

    Create the required tables by running the SQL scripts in the `sql/` folder:
    - `messages.sql`

5. Start the server:

    ```bash
    npm start
    ```

6. Visit the website:

    Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

7. (Optional) Deploy to production:
    - Set `NODE_ENV=production` in your environment variables.

Usage
-----

- Navigate to the home page to view the portfolio.
- Use the contact form to send a message.
- Explore dynamic sections such as "About Me," "Services," and "Portfolio."

Screenshots
-----------

- **Home Page**: ![Home Page](./screenshots/home.png)
- **Contact Form**: ![Contact Form](./screenshots/contact.png)

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
- **LinkedIn**: [LinkedIn Profile](https://linkedin.com/in/dakermanji)
- **GitHub**: [GitHub Profile](https://github.com/Dakermanji)
