# Career Tools Web Application

A multi-page client-side web application built with HTML, CSS and JavaScript. The application provides career-related tools including a take-home pay calculator and a vacancy search interface.

The project was originally developed as part of my university web development coursework and has since been refined with improved styling, client-side validation, calculation history and error handling.

## Overview

The application consists of three main pages:

- **Homepage** – Provides an overview of the application and its functionality.
- **Take Home Pay Calculator** – Calculates estimated take-home pay based on salary, working hours, tax rate and National Insurance rate.
- **Vacancy Search** – Allows users to search for vacancies by job title and location using the LMI for All API.

The project demonstrates the use of client-side web technologies to create an interactive application with user input, calculations, dynamic content generation, browser storage and API integration.

## Features

### Take Home Pay Calculator

- Accepts job title, gross pay, pay timeframe and working hours.
- Supports yearly, monthly, weekly and hourly salary inputs.
- Calculates estimated take-home pay.
- Displays estimated:
  - Hourly pay
  - Weekly pay
  - Monthly pay
  - Annual pay
- Performs client-side input validation.
- Provides user-friendly error messages for invalid input.
- Stores the five most recent calculations using browser `localStorage`.
- Allows users to clear their saved calculation history.

### Vacancy Search

- Search for vacancies using a job title.
- Optional location filtering.
- Retrieves vacancy information using an external API.
- Displays up to ten vacancy results.
- Vacancy information can be expanded and collapsed.
- Displays company, location, description and application link information.
- Provides loading, error and no-results messages.
- External application links open in a new browser tab.

### User Interface

- Responsive layout for different screen sizes.
- Consistent navigation across all pages.
- Modernised form and card-based styling.
- Interactive navigation and form elements.
- Responsive mobile layout.

## Technologies Used

- **HTML5** – Page structure and forms
- **CSS3** – Layout, styling and responsive design
- **JavaScript** – Application logic, validation, calculations and dynamic content
- **Browser localStorage** – Persistent calculation history
- **Fetch API** – Communication with the vacancy search API
- **LMI for All API** – Vacancy data

