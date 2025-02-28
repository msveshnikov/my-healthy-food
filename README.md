# My Healthy Food

Platform for generating AI recipes in any language using flash-thinking model via JSON prompt (with
pre-search) and very nice rendering or recipe + SEO + sharing + unsplash pictures (or google images)

![alt text](public/image.jpg)

# PROD

https://MyHealthy.Food

## Overview

My Healthy Food is a platform designed to revolutionize recipe discovery and creation. Leveraging
advanced AI models, it generates recipes in multiple languages based on user prompts, incorporating
real-time web searches to enhance accuracy and relevance. The platform aims to provide a seamless
user experience with features ranging from recipe rendering and SEO optimization to social sharing
and integration with image resources like Unsplash and Google Images. Monetization is through
SEO/AdSense.

## Key Features

- **AI-Powered Recipe Generation:** Utilizes a flash-thinking model to create diverse recipes from
  user prompts.
- **Multi-Language Support:** Generates recipes in various languages to cater to a global audience.
- **Real-time Web Search Integration:** Enhances recipe accuracy and relevance through pre-search
  functionality.
- **Rich Recipe Rendering:** Presents recipes with visually appealing layouts, optimized for
  readability.
- **SEO Optimization:** Ensures recipes are search engine friendly for broader discoverability.
- **Social Sharing Capabilities:** Enables users to easily share their generated recipes on social
  platforms.
- **Image Integration:** Fetches relevant and appealing images from Unsplash and Google Images to
  complement recipes.
- **User Authentication and Management:** Secure user accounts with login, signup, and password
  recovery features.
- **User Feedback System:** Allows users to provide feedback, contributing to platform improvement.
- **Admin Interface:** Dedicated admin panel for system management, user oversight, and content
  moderation.

## Project Architecture

- **Root Files:**

    - **Configuration & Deployment:** `.prettierrc`, `copy.cmd`, `deploy.cmd`, `kill.cmd` for
      development, styling, and deployment processes.
    - **Dockerization:** `Dockerfile`, `docker-compose.yml` for containerization and environment
      consistency.
    - **Core Application:** `index.html`, `landing.html`, `package.json`, `vite.config.js`,
      `rest.http`, `playground-1.mongodb.js` for entry points, dependencies, build configurations,
      and API testing.

- **Client (src/):**

    - **Core Components:** `App.jsx`, `Navbar.jsx`, `Landing.jsx`, `main.jsx` defining the
      application structure, navigation, and main entry point.
    - **User Interface & Navigation:** `BottomNavigationBar.jsx` for enhanced mobile navigation.
    - **User Management:** `Login.jsx`, `SignUp.jsx`, `Forgot.jsx`, `Reset.jsx`, `Profile.jsx` for
      user authentication and profile management.
    - **Feedback & Documentation:** `Feedback.jsx`, `Docs.jsx` for user feedback collection and
      in-app documentation access.
    - **Informational Pages:** `Privacy.jsx`, `Terms.jsx` for legal and policy information.
    - **Admin Panel:** `Admin.jsx` for administrative functionalities.

- **Server (server/):**

    - **Authentication & Administration:** `admin.js`, `middleware/auth.js`, `user.js` for
      server-side user and admin management with secure authentication middleware.
    - **AI Integrations:** `claude.js`, `deepseek.js`, `gemini.js`, `grok.js`, `openai.js`
      integrating multiple AI engines for recipe generation and diverse content processing.
    - **Search & Image Services:** `search.js`, `imageService.js` for web search integration and
      image retrieval and processing.
    - **Data Schemas & Models:** `recipeSchema.json`, `models/Recipe.js`, `models/Feedback.js`,
      `models/User.js` defining data structures and models for recipes, feedback, and users.
    - **Utilities & Entry Point:** `utils.js`, `index.js` for utility functions and server
      application entry point.
    - **Server Package Management:** `package.json` for server-side dependencies.

- **Public (public/):**

    - **Static Assets:** `ads.txt`, `landing.html`, `robots.txt` for static resources, landing page,
      and SEO directives.

- **Documentation (docs/):**
    - **Application & Policies:** `app_description.txt`, `privacy_policy.html`, `release_notes.txt`,
      `short_description.txt` providing application details, policies, and release information.
    - **Branding & Marketing:** `landing_page_copy.html`, `social_media_content.json`,
      `keywords.txt`, `subtitle.txt`, `title.txt` for marketing assets and branding consistency.

This architecture emphasizes modularity, security, and scalability, allowing for independent
development and deployment of client, server, and documentation components.

## Design Ideas & Considerations

- **Modern UI/UX Enhancements:**

    - **Component-Driven Design:** Develop reusable UI components to ensure consistency and
      accelerate feature development across the platform.
    - **Responsive and Adaptive Interfaces:** Implement layouts that seamlessly adapt to various
      screen sizes and devices, including mobile-first considerations and a dedicated mobile
      navigation via `BottomNavigationBar.jsx`.
    - **Interactive Recipe Presentation:** Enhance recipe rendering with interactive elements, user
      customization options, and visually engaging layouts.
    - **In-App Documentation:** Integrate `Docs.jsx` to provide contextual help and user guides
      directly within the application.

- **Expanded Admin & Moderation Capabilities:**

    - **Dedicated Admin Panel (`Admin.jsx`):** Develop a comprehensive admin dashboard to oversee
      user feedback, manage system settings, monitor operational metrics, and handle content
      moderation.
    - **Detailed Logging and Alerting:** Implement robust logging and alerting systems to monitor
      system health, track user activities, and proactively identify and address potential issues.
    - **User Feedback Management:** Centralize user feedback management within the admin panel to
      efficiently review, prioritize, and respond to user input.

- **Optimized Backend & Extended AI Integrations:**

    - **Scalable Backend Operations:** Utilize containerization (Docker) and consider orchestration
      tools (Kubernetes) for scaling backend services to handle increased traffic and computational
      demands.
    - **Multi-AI Engine Strategy:** Leverage diverse AI engines (DeepSeek, OpenAI, Gemini, Claude,
      Grok) for specialized tasks like semantic search, content generation, and language processing
      to optimize results and provide flexibility.
    - **Structured Data Management:** Utilize `recipeSchema.json` and `models/Recipe.js` to enforce
      data consistency and facilitate efficient data handling and API interactions for recipes.

- **Continuous Integration/Delivery & Automated Testing:**

    - **CI/CD Pipelines:** Establish CI/CD pipelines (using GitHub Actions or GitLab CI) to automate
      build, test, and deployment processes, ensuring rapid and reliable software releases.

## TODO

- add bulk recipes generation (select cousine,language, count - then generate N recipe titles, then generate each
  title in each language manually after approval, using normal one recipe endpoint /api/generate-recipe)
