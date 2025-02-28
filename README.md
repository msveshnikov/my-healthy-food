# My Healthy Food

Platform for generating AI recipes in any language using flash-thinking model via JSON prompt (with
pre-search) and very nice rendering or recipe + SEO + sharing + unsplash pictures (or google images)

![alt text](public/image.jpg)

# PROD

https://MyHealthy.Food

## Overview

My Healthy Food is an innovative platform redefining recipe discovery and creation. By harnessing
the power of advanced AI models, it generates recipes in multiple languages from user-defined
prompts. The platform intelligently incorporates real-time web searches to ensure recipe accuracy,
relevance, and novelty. My Healthy Food is committed to providing a superior user experience through
features such as visually rich recipe rendering, robust SEO optimization, seamless social sharing,
and integration with vast image libraries like Unsplash and Google Images. The platform's
monetization strategy is centered around SEO and AdSense.

## Key Features

- **Intelligent AI Recipe Generation:** Employs a cutting-edge flash-thinking model to generate a
  wide array of recipes tailored to user prompts.
- **Global Multi-Language Support:** Offers recipe generation in numerous languages, broadening
  accessibility and catering to a diverse global audience.
- **Real-time Web Search Augmentation:** Integrates pre-search functionality to dynamically enhance
  recipe accuracy and incorporate current culinary trends.
- **Visually Rich Recipe Rendering:** Presents recipes with aesthetically pleasing and user-friendly
  layouts optimized for clarity and engagement.
- **Search Engine Optimized (SEO):** Implements SEO best practices to ensure high discoverability of
  generated recipes across search engines.
- **Effortless Social Sharing:** Enables users to quickly and easily share their customized recipes
  across various social media platforms.
- **Integrated Image Services:** Automatically sources and incorporates high-quality, relevant
  images from Unsplash and Google Images to enrich recipe presentation.
- **Secure User Authentication and Management:** Provides a secure user environment with
  comprehensive account management features including login, signup, and password recovery.
- **User Feedback Mechanism:** Incorporates a user feedback system to continuously gather user input
  and drive platform improvements.
- **Comprehensive Admin Interface:** Features a dedicated admin panel for efficient system
  management, user oversight, content moderation, and performance monitoring.

## Project Architecture

My Healthy Food is built with a modular architecture designed for scalability, maintainability, and
independent deployability of its components.

- **Root Level:**

    - **Development & Deployment Scripts:** Includes `.prettierrc` for code styling consistency,
      `copy.cmd`, `deploy.cmd`, and `kill.cmd` for streamlined development and deployment workflows.
    - **Containerization:** Utilizes `Dockerfile` and `docker-compose.yml` to ensure consistent
      environments and simplified deployment through Docker.
    - **Core Application Files:** Contains `index.html` and `landing.html` as primary entry points,
      `package.json` for dependency management, `vite.config.js` for build configurations,
      `rest.http` for API testing, and `playground-1.mongodb.js` for database interactions.

- **Client Application (src/):**

    - **Core Structure:** `App.jsx`, `Navbar.jsx`, `Landing.jsx`, and `main.jsx` define the
      application's core structure, navigation, landing experience, and main execution point.
    - **User Interface Components:** Features reusable UI components for key functionalities such as
      `RecipeList.jsx`, `Recipe.jsx`, `RecipeCreator.jsx`, and `BulkCreator.jsx` ensuring UI
      consistency and development efficiency.
    - **Mobile Navigation:** `BottomNavigationBar.jsx` is implemented for enhanced mobile user
      experience and navigation.
    - **User Authentication Modules:** Includes `Login.jsx`, `SignUp.jsx`, `Forgot.jsx`,
      `Reset.jsx`, and `Profile.jsx` for complete user account and profile management.
    - **User Support & Information:** Provides `Feedback.jsx` and `Docs.jsx` for user feedback
      collection and in-app documentation access, alongside informational pages like `Privacy.jsx`
      and `Terms.jsx`.
    - **Administration Panel:** `Admin.jsx` serves as the entry point for administrative
      functionalities.

- **Server Application (server/):**

    - **Authentication & Authorization:** `admin.js`, `user.js`, and `middleware/auth.js` manage
      server-side user and admin authentication and authorization, ensuring secure API access.
    - **AI Engine Integrations:** Integrates with multiple AI providers through dedicated modules:
      `claude.js`, `deepseek.js`, `gemini.js`, `grok.js`, and `openai.js`, allowing for flexible and
      optimized AI-driven content generation.
    - **External Services:** `search.js` and `imageService.js` handle integration with web search
      engines and image retrieval services, enhancing recipe data and visual appeal.
    - **Data Management:** Defines data schemas in `recipeSchema.json` and utilizes
      `models/Recipe.js`, `models/Feedback.js`, and `models/User.js` to manage data models for
      recipes, user feedback, and user accounts.
    - **Server Utilities & Entry:** `utils.js` provides utility functions, and `index.js` serves as
      the server application's main entry point.
    - **Server Dependencies:** `package.json` manages server-side dependencies.

- **Public Assets (public/):**

    - **Static Files:** Contains `ads.txt` for ad management, `landing.html` for the initial landing
      page, and `robots.txt` for SEO directives.

- **Documentation (docs/):**
    - **Application Documentation:** Includes `app_description.txt`, `privacy_policy.html`,
      `release_notes.txt`, and `short_description.txt` for application details, legal policies, and
      release information.
    - **Marketing & Branding Assets:** Stores `landing_page_copy.html`, `social_media_content.json`,
      `keywords.txt`, `subtitle.txt`, and `title.txt` for consistent branding and marketing efforts.

This architecture promotes modular development, allowing for focused feature enhancements and
independent scaling of client and server components.

## Design Ideas & Future Considerations

- **Enhanced User Interface and Experience (UI/UX):**

    - **Component Library and Design System:** Establish a comprehensive component library and
      design system to ensure UI consistency, accelerate development, and improve maintainability
      across the platform.
    - **Responsive and Adaptive Layouts:** Further refine responsive designs to ensure seamless
      adaptation across all devices and screen sizes, prioritizing mobile-first design principles.
    - **Interactive Recipe Features:** Introduce interactive elements within recipe rendering, such
      as user customization options for ingredients and servings, step-by-step interactive guides,
      and nutritional information displays.
    - **Contextual In-App Documentation:** Enhance `Docs.jsx` to provide more contextual help and
      interactive user guides directly within relevant sections of the application, improving user
      onboarding and feature discovery.

- **Advanced Administration and Moderation Tools:**

    - **Comprehensive Admin Dashboard:** Expand the `Admin.jsx` panel to include detailed dashboards
      for user activity monitoring, system health metrics, content moderation queues, and feedback
      management, providing a 360-degree view of platform operations.
    - **Robust Logging and Alerting System:** Implement detailed logging and real-time alerting to
      proactively monitor system performance, track critical user actions, and quickly identify and
      resolve potential issues or security threats.
    - **Streamlined User Feedback Management:** Centralize and optimize user feedback management
      within the admin panel, enabling efficient review, categorization, prioritization, and
      response workflows for user input.

- **Backend Optimization and AI Expansion:**

    - **Scalable Backend Infrastructure:** Explore and implement technologies like Kubernetes for
      orchestrating backend services to ensure high availability, fault tolerance, and seamless
      scaling to accommodate increasing user traffic and computational demands.
    - **Specialized AI Engine Utilization:** Further leverage the multi-AI engine strategy by
      specializing AI engine usage based on task type – e.g., dedicating specific engines for
      semantic search, creative content generation, or nuanced language processing – to optimize
      output quality and efficiency.
    - **Refined Data Management and API Design:** Optimize `recipeSchema.json` and API interactions
      to ensure efficient data handling, improve API performance, and support future feature
      expansions requiring complex data manipulations.

- **Development Process and Automation:**
    - **Automated CI/CD Pipelines:** Fully implement CI/CD pipelines using platforms like GitHub
      Actions or GitLab CI to automate the build, test, and deployment processes, ensuring rapid,
      reliable, and consistent software releases.
    
## TODO

- **UI/UX Enhancements:**
    - Develop a reusable component library and design system for the React client.
    - Implement interactive elements in recipe rendering (e.g., ingredient scaling, interactive
      steps).
    - Enhance mobile navigation and UI based on user feedback.
- **Admin & Moderation Capabilities:**
    - Implement a robust logging and alerting system for production monitoring.
- **Backend & AI Optimization:**
    - Optimize AI engine selection for specific recipe generation tasks.
    - Refine `recipeSchema.json` for better data management and API efficiency.
- **Feature Enhancements:**
    - Implement user recipe saving and personal recipe collections.
    - Add user recipe ratings and review system.
    - Explore advanced recipe filtering and search options.
