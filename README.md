# web-dev-task
In this repo I update my day wise progress.


# User Registration & Login Pages

## Project Overview

This project contains two responsive web pages:

1. **User Registration Page**
2. **User Login Page**

The pages are created using **HTML, CSS, JavaScript, and Bootstrap**. The main focus of the project is to create user-friendly, responsive forms with proper validation, styling, and API-based Country and State data.

---

## 1. User Registration Page

The Registration Page contains the following fields:

- Full Name
- Email
- Mobile Number
- Date of Birth
- Gender
- Password
- Confirm Password
- Address
- Country
- State
- Submit Button
- Reset Button

### Features

- Semantic HTML form elements
- Proper labels for all input fields
- Input field borders and spacing
- Password Show/Hide functionality
- Country data fetched from API
- State data fetched based on Country selection
- Form validation
- Error message containers
- Submit and Reset functionality
- Focus effects on input fields
- Responsive layout for desktop and mobile devices

---

## 2. User Login Page

The Login Page contains:

- Email
- Password
- Remember Me
- Login Button
- Forgot Password option

### Features

- Vertically and horizontally centered login form
- Responsive design
- Password Show/Hide functionality
- Input focus effects
- Button hover effects
- Proper spacing and alignment
- Mobile-friendly layout

---

## Technologies Used

- **HTML5** – Structure of the web pages
- **CSS3** – Styling, layout, responsive design and effects
- **JavaScript** – Form functionality, validation, password Show/Hide and API handling
- **Bootstrap 5** – Responsive design and UI components
- **API** – Country and State data

---

## Project Structure

```text
Registration-Login-Project/
│
├── Registration/
│   ├── Registration.html
│   ├── RegStylesheet.css
│   └── Registration.js
│
├── Login/
│   ├── Login.html
│   ├── LoginStylesheet.css
│   └── Login.js
│
└── README.md
```

> File names can be changed according to the actual project structure.

---

## Responsive Design

Both pages are designed to work on different screen sizes:

- Desktop
- Laptop
- Tablet
- Mobile

CSS media queries and Bootstrap responsive classes are used to make the pages mobile-friendly.

---

## Form Validation

The Registration and Login forms include validation to help ensure that users enter valid information.

Examples:

- Required fields
- Valid email format
- Mobile number validation
- Password validation
- Confirm Password matching
- Country and State selection

Error message containers are provided to display validation messages to the user.

---

## API Integration

The Registration Page uses an API to fetch:

- Country list
- State list

The Country dropdown is populated using API data. After selecting a country, the corresponding states are loaded automatically.

---

## UI Features

The project includes:

- Clean form layout
- Proper spacing
- Input borders
- Focus effects
- Button hover effects
- Show/Hide password
- Responsive design
- Error message display
- User-friendly form controls

---

## How to Run the Project

1. Download or clone the project.
2. Open the project folder in **VS Code**.
3. Open `Registration.html` to view the Registration Page.
4. Open `Login.html` to view the Login Page.
5. Use **Live Server** in VS Code for the best experience, especially for API-related functionality.

---

## Project Objective

The objective of this project is to practice and understand:

- HTML form structure
- Semantic HTML elements
- CSS styling
- Responsive web design
- Bootstrap classes
- JavaScript form handling
- Form validation
- API integration
- Password Show/Hide functionality
- User interface design

---

## Conclusion

This project demonstrates the implementation of responsive **Registration and Login pages** with form fields, validation, API integration, responsive layouts, and interactive UI features using HTML, CSS, JavaScript, and Bootstrap.