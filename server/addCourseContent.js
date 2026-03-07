/**
 * Add rich content (descriptions, videoUrls, resources) to all course lessons.
 * Run: node addCourseContent.js
 */
const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');
const connectDB = require('./config/db');

// Embeddable video URLs for course topics (YouTube embed format)
const videoPool = {
  'Web Development': [
    'https://www.youtube.com/embed/qz0aGYrrlhU', // HTML Tutorial
    'https://www.youtube.com/embed/1PnVor36_40', // CSS Tutorial
    'https://www.youtube.com/embed/W6NZfCO5SIk', // JavaScript Tutorial
    'https://www.youtube.com/embed/Oe421EPjeBE', // Node.js Tutorial
    'https://www.youtube.com/embed/SqcY0GlETPk', // React Tutorial
    'https://www.youtube.com/embed/zb3Qk8SG5Ms', // JS Promises
  ],
  'Data Science': [
    'https://www.youtube.com/embed/kqtD5dpn9C8', // Python Tutorial
    'https://www.youtube.com/embed/QUT1VHiLmmI', // NumPy Tutorial
    'https://www.youtube.com/embed/vmEHCJofslg', // Pandas Tutorial
    'https://www.youtube.com/embed/3Xc3CA655Y4', // Matplotlib Tutorial
    'https://www.youtube.com/embed/7eh4d6sabA0', // ML Tutorial
  ],
  'React': [
    'https://www.youtube.com/embed/SqcY0GlETPk', // React Tutorial
    'https://www.youtube.com/embed/TNhaISOUy6Q', // JSX
    'https://www.youtube.com/embed/dpw9EHDh2bM', // React Hooks
    'https://www.youtube.com/embed/fKjWuIOnlE4', // Redux
    'https://www.youtube.com/embed/Sklc_fQBmcs', // Next.js
  ],
  'Mobile Development': [
    'https://www.youtube.com/embed/comQ1-x2a1Q', // Swift Tutorial
    'https://www.youtube.com/embed/CwA1VWP0Ldw', // SwiftUI
    'https://www.youtube.com/embed/F2ojC6TNwws', // iOS Dev
  ],
  'Cloud Computing': [
    'https://www.youtube.com/embed/ulprqHHWlng', // AWS Tutorial
    'https://www.youtube.com/embed/r4YIdn2eTm4', // EC2
    'https://www.youtube.com/embed/77lMCiiMilo', // S3
    'https://www.youtube.com/embed/eOBq__h4OJ4', // Lambda
  ],
  'Cybersecurity': [
    'https://www.youtube.com/embed/hXSFdwIOfnE', // Cyber Security
    'https://www.youtube.com/embed/sdpxddDzXfE', // Encryption
    'https://www.youtube.com/embed/E03gh1huvW4', // Network Security
  ],
  'UI/UX Design': [
    'https://www.youtube.com/embed/c9Wg6Cb_YlU', // UI/UX Design
    'https://www.youtube.com/embed/FTFaQWZBqQ8', // Figma Tutorial
    'https://www.youtube.com/embed/wIuVvCuiJhU', // Wireframing
  ],
  'Digital Marketing': [
    'https://www.youtube.com/embed/bixR-KIJKYM', // Digital Marketing
    'https://www.youtube.com/embed/DvwS7cV9GmQ', // SEO Tutorial
    'https://www.youtube.com/embed/9Eczuhagy5g', // Google Ads
  ],
  'DevOps': [
    'https://www.youtube.com/embed/fqMOX6JJhGo', // Docker Tutorial
    'https://www.youtube.com/embed/X48VuDVv0do', // Kubernetes Tutorial
    'https://www.youtube.com/embed/R8_veQiYBjI', // CI/CD
  ],
  'Machine Learning': [
    'https://www.youtube.com/embed/7eh4d6sabA0', // ML Tutorial
    'https://www.youtube.com/embed/aircAruvnKk', // Neural Networks
    'https://www.youtube.com/embed/GwIo3gDZCVQ', // TensorFlow
  ],
  'MERN': [
    'https://www.youtube.com/embed/7CqJlxBYj-M', // MERN Tutorial
    'https://www.youtube.com/embed/-0exw-9YJBo', // MongoDB
    'https://www.youtube.com/embed/SqcY0GlETPk', // React
    'https://www.youtube.com/embed/Oe421EPjeBE', // Node.js
  ],
};

// Course-specific content data: keyed by exact course title
const courseContent = {
  'The Complete 2024 Web Development Bootcamp': {
    category: 'Web Development',
    modules: {
      'Front-End Web Development': {
        lessons: {
          "What You'll Get In This Course": 'Get an overview of the entire web development journey from HTML basics to full-stack applications. Learn what tools you will use, the projects you will build, and how this course is structured to maximize your learning.',
          'How Does the Internet Actually Work?': 'Understand the fundamentals of how the internet works — from DNS resolution to HTTP requests. Learn about servers, clients, IP addresses, and the request-response cycle that powers every website.',
          'How Do Websites Actually Work?': 'Dive into the browser rendering pipeline. Learn how HTML, CSS, and JavaScript come together to create the web pages you see every day. Understand the DOM and how browsers parse code.',
          'Introduction to HTML': 'Start writing your first HTML code. Learn about tags, elements, attributes, and the basic structure of an HTML document. Build your very first web page from scratch.',
          'HTML Heading Elements': 'Master the six levels of HTML headings (h1-h6). Learn semantic heading hierarchy, accessibility best practices, and how headings impact SEO and screen readers.',
          'HTML Paragraph Elements': 'Learn to structure text content with paragraph elements, line breaks, horizontal rules, and text formatting tags. Practice creating well-structured content layouts.',
        },
      },
      'Introduction to CSS': {
        lessons: {
          'Introduction to CSS': 'Discover how CSS transforms plain HTML into beautiful web pages. Learn the three ways to add CSS to your projects — inline, internal, and external stylesheets.',
          'CSS Selectors': 'Master CSS selectors from basic type selectors to complex combinators. Learn class selectors, ID selectors, attribute selectors, pseudo-classes, and specificity rules.',
          'CSS Colors & Backgrounds': 'Explore the world of CSS colors using hex codes, RGB, HSL, and named colors. Add background images, gradients, and learn about opacity and transparency.',
          'The CSS Box Model': 'Understand the fundamental CSS Box Model — content, padding, border, and margin. Learn box-sizing, margin collapse, and how to control element dimensions.',
          'CSS Display Property': 'Learn the differences between block, inline, inline-block, and none display values. Understand how display properties affect element layout and flow.',
          'CSS Float and Clear': 'Understand the legacy float-based layout system. Learn when to use floats, how to clear them, and why modern alternatives like Flexbox are preferred.',
          'Flexbox Layout': 'Master CSS Flexbox for one-dimensional layouts. Learn flex containers, flex items, alignment, justification, wrapping, and build responsive navbars and card layouts.',
          'CSS Grid': 'Learn CSS Grid for two-dimensional layouts. Master grid containers, grid items, template areas, auto-placement, and build complex page layouts with ease.',
        },
      },
      'JavaScript ES6+': {
        lessons: {
          'Introduction to JavaScript': 'Begin your JavaScript journey. Learn what JavaScript is, where it runs, how to add it to web pages, and write your first interactive script.',
          'Variables and Data Types': 'Understand let, const, and var. Learn about primitive data types — strings, numbers, booleans, null, undefined, and symbols. Practice variable declaration and assignment.',
          'Functions and Scope': 'Master function declarations, expressions, and arrow functions. Understand scope — global, function, and block scope. Learn closures and higher-order functions.',
          'Arrays and Objects': 'Work with JavaScript arrays and objects. Learn array methods like map, filter, reduce, forEach. Understand object destructuring, spread operator, and nested data.',
          'DOM Manipulation': 'Connect JavaScript to HTML. Learn to select elements, change content, modify styles, handle events, and create dynamic, interactive web pages.',
          'ES6 Arrow Functions & Template Literals': 'Deep dive into ES6+ features: arrow function syntax, template literals for string interpolation, and how they simplify your code compared to ES5.',
          'Destructuring and Spread Operator': 'Master destructuring assignment for arrays and objects. Learn the spread and rest operators for copying, merging, and handling variable arguments.',
          'Async/Await and Promises': 'Understand asynchronous JavaScript. Learn callbacks, promises, async/await, and how to handle API calls, timers, and asynchronous data flows elegantly.',
        },
      },
      'React.js - Frontend Framework': {
        lessons: {
          'What is React?': 'Understand what React is, why it was created, and the problems it solves. Learn about components, virtual DOM, and React ecosystem overview.',
          'JSX and Components': 'Learn JSX syntax — the HTML-like language used in React. Build your first functional components and understand how React renders UI elements to the DOM.',
          'Props and State': 'Master the two core concepts of React data flow. Learn to pass data with props and manage component-local data with state. Understand one-way data flow.',
          'React Hooks - useState & useEffect': 'Deep dive into the two most important React Hooks. Use useState for state management and useEffect for side effects like API calls and subscriptions.',
          'Event Handling in React': 'Handle user interactions in React. Learn synthetic events, event handlers, form handling, and controlled vs uncontrolled components.',
          'Conditional Rendering': 'Show or hide UI elements based on conditions. Learn ternary operators, logical AND rendering, early returns, and switch-based rendering patterns.',
          'Building a React Project': 'Put it all together in a capstone project. Build a complete React application with routing, state management, API integration, and deployment.',
        },
      },
      'Node.js & Express': {
        lessons: {
          'Introduction to Node.js': 'Understand what Node.js is and why it allows JavaScript to run on servers. Learn the event loop, non-blocking I/O, and Node.js architecture.',
          'Node.js Modules': 'Learn the Node.js module system — CommonJS require/exports, built-in modules (fs, path, http), and npm packages.',
          'Express.js Setup': 'Set up your first Express server. Learn routing, request/response objects, serving static files, and middleware basics.',
          'RESTful APIs': 'Design and build RESTful APIs. Understand HTTP methods (GET, POST, PUT, DELETE), status codes, request parameters, and JSON responses.',
          'Middleware in Express': 'Master Express middleware for logging, authentication, error handling, and request parsing. Build custom middleware and use popular third-party packages.',
          'Authentication with JWT': 'Implement secure authentication using JSON Web Tokens. Learn token generation, password hashing with bcrypt, protected routes, and auth middleware.',
        },
      },
    },
  },

  'Python for Data Science and Machine Learning Bootcamp': {
    category: 'Data Science',
    modules: {
      'Python Crash Course': {
        lessons: {
          'Introduction to Python': 'Get started with Python — installation, running scripts, and understanding why Python is the language of choice for data science and machine learning.',
          'Python Data Types': 'Master Python data types: integers, floats, strings, lists, dictionaries, tuples, and sets. Learn type conversion and understand mutable vs immutable types.',
          'Python Comparison Operators': 'Learn comparison and logical operators in Python. Understand truthiness, equality vs identity, chaining comparisons, and using these in control flow.',
          'Python Statements': 'Master control flow with if/elif/else, for loops, while loops, list comprehensions, and try/except for error handling.',
          'Methods and Functions': 'Write your own Python functions. Learn parameters, return values, *args and **kwargs, lambda functions, and built-in functions like map and filter.',
        },
      },
      'NumPy': {
        lessons: {
          'NumPy Arrays': 'Learn to create and manipulate NumPy arrays — the foundation of scientific computing in Python. Understand array creation, shapes, dtypes, and vectorized operations.',
          'NumPy Indexing and Selection': 'Master array indexing, slicing, boolean masking, and fancy indexing. Learn to efficiently select and modify subsets of array data.',
          'NumPy Operations': 'Perform mathematical operations on arrays: arithmetic, broadcasting, universal functions (ufuncs), aggregations (sum, mean, std), and axis-based operations.',
          'NumPy Exercises': 'Apply your NumPy knowledge through hands-on exercises covering array manipulation, mathematical operations, random number generation, and performance comparisons.',
        },
      },
      'Pandas': {
        lessons: {
          'Introduction to Pandas': 'Meet Pandas — the most powerful data manipulation library in Python. Learn why Pandas is essential for data science and how it builds on NumPy.',
          'Series and DataFrames': 'Create and work with the two primary Pandas data structures. Build Series from arrays and DataFrames from dictionaries, CSVs, and databases.',
          'Missing Data & Groupby': 'Handle real-world messy data. Learn to detect, fill, and drop missing values. Master groupby operations for aggregation and split-apply-combine patterns.',
          'Merging, Joining, and Concatenating': 'Combine multiple DataFrames using merge, join, and concat. Understand inner, outer, left, right joins and when to use each approach.',
          'Data Input and Output': 'Read and write data from CSV, Excel, JSON, SQL databases, and web APIs. Learn to handle different data formats and large datasets efficiently.',
        },
      },
      'Data Visualization with Matplotlib': {
        lessons: {
          'Matplotlib Basics': 'Create your first data visualizations. Learn matplotlib\'s figure and axes system, line plots, scatter plots, bar charts, and customizing plot appearance.',
          'Advanced Matplotlib': 'Create publication-quality figures with subplots, custom color maps, annotations, 3D plots, and export to various formats (PNG, SVG, PDF).',
          'Seaborn for Statistical Plots': 'Use Seaborn for beautiful statistical visualizations. Create distribution plots, count plots, heatmaps, pair plots, and categorical data visualizations.',
          'Plotly and Cufflinks': 'Build interactive visualizations with Plotly. Create hover-enabled charts, 3D surface plots, geographic maps, and dashboards for data exploration.',
        },
      },
      'Machine Learning': {
        lessons: {
          'Introduction to Machine Learning': 'Understand what machine learning is, the types of ML (supervised, unsupervised, reinforcement), and how to approach ML problems methodically.',
          'Linear Regression': 'Master linear regression from theory to implementation. Learn the math (cost function, gradient descent), scikit-learn implementation, and model evaluation.',
          'Logistic Regression': 'Apply logistic regression for classification tasks. Understand the sigmoid function, decision boundaries, confusion matrices, and classification metrics.',
          'K Nearest Neighbors': 'Learn the KNN algorithm for classification and regression. Understand distance metrics, choosing K, and the bias-variance tradeoff.',
          'Decision Trees and Random Forests': 'Build tree-based models. Understand entropy, information gain, tree pruning, and how random forests improve accuracy through ensemble learning.',
          'Support Vector Machines': 'Master SVMs for classification. Learn hyperplanes, kernels (linear, RBF, polynomial), support vectors, and when to use SVMs in practice.',
          'Neural Networks with TensorFlow': 'Build your first neural network. Understand neurons, layers, activation functions, forward propagation, backpropagation, and train models with TensorFlow/Keras.',
        },
      },
    },
  },

  'React - The Complete Guide 2024 (incl. Next.js, Redux)': {
    category: 'React',
    modules: {
      'Getting Started': {
        lessons: {
          'Welcome To The Course!': 'Get oriented with the course structure, prerequisites, and how to get the most out of your learning experience. Set up your development environment.',
          'What is React.js?': 'Understand what React is — a JavaScript library for building user interfaces. Learn the component-based architecture and how React differs from traditional approaches.',
          'Why React Instead of Vanilla JS?': 'Compare vanilla JavaScript DOM manipulation with React\'s declarative approach. See how React simplifies complex UI development through components and state management.',
          'ReactJS vs React Native': 'Understand the difference between React (web) and React Native (mobile). Learn how the core concepts transfer between platforms.',
          'Creating a React Project': 'Set up a new React project using Create React App and Vite. Understand the project structure, configuration files, and development workflow.',
        },
      },
      'React Essentials - Components, JSX, Props, State': {
        lessons: {
          'Module Introduction': 'Overview of React essentials you will learn in this section — the building blocks of every React application.',
          'JSX & React Components': 'Deep dive into JSX — the syntax extension that lets you write HTML-like code in JavaScript. Understand how JSX gets compiled and the rules for valid JSX.',
          'Building & Using a Component': 'Create reusable components from scratch. Learn component file organization, naming conventions, and how to compose components together.',
          'Props - Making Components Configurable': 'Pass data to components using props. Learn prop types, default values, children prop, and how props enable component reusability.',
          'State - Managing Component Data': 'Manage dynamic data with useState. Learn state updates, immutability, state batching, and lifting state up for component communication.',
          'Rendering Lists & Conditional Content': 'Render dynamic lists with map() and conditionally show content. Learn the key prop for list optimization and common rendering patterns.',
        },
      },
      'React Hooks In Detail': {
        lessons: {
          'useState In Detail': 'Advanced useState patterns: lazy initialization, functional updates, complex state objects, multiple state variables, and when to use useReducer instead.',
          'useEffect - Handling Side Effects': 'Master useEffect for API calls, subscriptions, timers, and DOM interactions. Understand dependency arrays, cleanup functions, and common pitfalls.',
          'useRef & useReducer': 'Use useRef for DOM access and persisting values without re-renders. Learn useReducer for complex state logic with actions and reducers.',
          'useContext - Sharing State': 'Share state across components without prop drilling. Create context providers, consume context with useContext, and understand when context is the right tool.',
          'useMemo & useCallback': 'Optimize React performance with memoization. Learn when to use useMemo for expensive calculations and useCallback for stable function references.',
          'Custom Hooks': 'Extract and share logic across components with custom hooks. Build practical custom hooks for data fetching, form handling, and local storage.',
        },
      },
      'Redux & Redux Toolkit': {
        lessons: {
          'What is Redux': 'Understand Redux — the predictable state container for JavaScript apps. Learn the three principles: single source of truth, state is read-only, changes via pure functions.',
          'Redux Toolkit Setup': 'Set up Redux Toolkit in a React project. Configure the store, understand the difference between vanilla Redux and Redux Toolkit.',
          'Creating Slices': 'Define state, reducers, and actions in one place with createSlice. Learn Immer-powered immutable updates and auto-generated action creators.',
          'Async Operations with Thunks': 'Handle asynchronous logic in Redux with createAsyncThunk. Learn loading states, error handling, and integrating API calls with Redux.',
          'Redux DevTools': 'Debug Redux applications with the Redux DevTools browser extension. Inspect state, replay actions, time-travel debug, and trace dispatches.',
        },
      },
      'Next.js Introduction': {
        lessons: {
          'What is Next.js?': 'Understand Next.js as a React framework for production. Learn about server-side rendering, static generation, and the benefits over plain React.',
          'File-based Routing': 'Master Next.js file-based routing. Create pages, dynamic routes, catch-all routes, and understand the Link component for client-side navigation.',
          'Server-Side Rendering (SSR)': 'Implement SSR with getServerSideProps. Understand when to use SSR vs SSG (getStaticProps), ISR (Incremental Static Regeneration), and trade-offs.',
          'API Routes in Next.js': 'Build backend API routes within your Next.js app. Handle different HTTP methods, connect to databases, and create full-stack features.',
          'Deploying Next.js Apps': 'Deploy your Next.js application to Vercel and other platforms. Configure environment variables, custom domains, and production optimizations.',
        },
      },
    },
  },

  'The Web Developer Bootcamp 2024': {
    category: 'Web Development',
    modules: {
      'Introduction to This Course': {
        lessons: {
          'A Note On This Course': 'Welcome and important information about how this course is structured, what software you need, how to get help, and tips for success.',
          'Syllabus Download & Welcome': 'Download the complete course syllabus, set up your coding environment, and join the student community for support and collaboration.',
          'Tips For This Course': 'Learn the best strategies for learning to code — active coding over passive watching, building personal projects, taking notes effectively, and staying motivated.',
        },
      },
      'HTML: The Essentials': {
        lessons: {
          'Introduction to HTML': 'Begin with HTML — the skeleton of every web page. Understand what HTML is, its role in web development, and how browsers interpret HTML documents.',
          'Our Very First HTML Page': 'Write and save your first HTML file. Open it in a browser, make changes, and see the live results. Learn the basic document structure.',
          'MDN & Documentation': 'Learn to use MDN Web Docs — the developer\'s best reference. Practice looking up HTML elements, reading documentation, and finding answers independently.',
          'Paragraph Elements': 'Structure text content with paragraph tags. Learn about whitespace handling, text formatting elements (strong, em), and inline vs block elements.',
          'HTML Boilerplate': 'Master the standard HTML5 boilerplate — DOCTYPE, html, head, meta, title, and body. Understand character encoding and viewport meta tags.',
          'Forms & Tables': 'Build HTML forms for user input and tables for tabular data. Learn form controls (input, select, textarea), form submission, and table structure.',
        },
      },
      'CSS: The Complete Guide': {
        lessons: {
          'CSS Basics': 'Style your first web page with CSS. Learn syntax, selectors, properties, values, and the three ways to add CSS (inline, internal, external).',
          'Selectors Deep Dive': 'Master CSS selectors: element, class, ID, attribute, pseudo-class (:hover, :focus), pseudo-element (::before, ::after), and combinators.',
          'The Box Model': 'Every element is a box. Master content, padding, border, margin, box-sizing, and how these properties affect element sizing and spacing.',
          'Flexbox': 'Build flexible, responsive layouts with CSS Flexbox. Learn flex direction, justify-content, align-items, flex-wrap, gap, and practical layout patterns.',
          'Responsive Design & Media Queries': 'Make websites work on all devices. Learn media queries, breakpoints, mobile-first design, responsive images, and fluid typography.',
          'CSS Grid': 'Create two-dimensional layouts with CSS Grid. Learn grid tracks, areas, template columns/rows, minmax, auto-fit/auto-fill, and complex layout patterns.',
          'Bootstrap 5': 'Use Bootstrap 5 for rapid UI development. Learn the grid system, utility classes, components (navbars, cards, modals), and customizing Bootstrap themes.',
        },
      },
      'JavaScript Fundamentals': {
        lessons: {
          'JS Intro & Primitives': 'Start JavaScript from scratch. Learn to run JS in the browser console and scripts. Understand primitive types: number, string, boolean, undefined, null.',
          'The World of Strings': 'Master JavaScript strings — template literals, string methods (slice, replace, includes, split), string immutability, and Unicode.',
          'Decision Making': 'Control program flow with if/else, switch statements, ternary operators, and logical operators (&&, ||, ??). Handle multiple conditions and edge cases.',
          'Arrays': 'Store and manipulate collections of data. Learn array creation, indexing, push/pop/shift/unshift, slice/splice, and array iteration methods.',
          'Object Literals': 'Work with JavaScript objects. Learn property access (dot and bracket notation), methods, nested objects, computed properties, and destructuring.',
          'Functions': 'Write reusable code with functions. Learn declarations, expressions, arrow functions, parameters, default values, return values, and function scope.',
          'Callbacks & Higher Order Functions': 'Understand callbacks and higher-order functions. Master forEach, map, filter, reduce, sort, and function composition patterns.',
          'Async JavaScript': 'Handle asynchronous operations. Learn the call stack, Web APIs, callback queue, Promises (then/catch), async/await, and error handling strategies.',
        },
      },
      'Backend with Node & Express': {
        lessons: {
          'Intro to Node.js': 'Transition from browser JS to server-side. Install Node.js, run scripts from the terminal, understand the runtime, and learn npm basics.',
          'Express Basics': 'Build your first web server with Express. Learn app creation, route handling, request/response objects, status codes, and serving responses.',
          'Templating with EJS': 'Generate dynamic HTML with EJS templates. Learn template syntax, passing data to views, partials, layouts, and template logic.',
          'RESTful Routes': 'Design RESTful APIs following REST conventions. Implement CRUD routes (Create, Read, Update, Delete) for resources and understand REST principles.',
          'MongoDB & Mongoose': 'Store data with MongoDB and Mongoose ODM. Learn CRUD operations, schemas, models, validation, relationships, and query building.',
          'Authentication & Authorization': 'Secure your application with user authentication using Passport.js. Implement registration, login, sessions, password hashing, and role-based access control.',
        },
      },
    },
  },

  'Machine Learning Specialization': {
    category: 'Machine Learning',
    modules: {
      'Supervised Learning: Regression and Classification': {
        lessons: {
          'Welcome to Machine Learning!': 'Begin your ML journey with an overview of the field, its applications in the real world, and the mathematical foundations you will develop.',
          'Applications of Machine Learning': 'Explore real-world ML applications: recommendation systems, self-driving cars, medical diagnosis, natural language processing, and computer vision.',
          'What is Machine Learning?': 'Define machine learning formally. Understand the difference between traditional programming and ML — learning from data instead of explicit rules.',
          'Supervised vs Unsupervised Learning': 'Compare the two main ML paradigms. Learn when to use supervised learning (labeled data) vs unsupervised learning (unlabeled data) with examples.',
          'Linear Regression Model': 'Build your first ML model. Understand the hypothesis function, parameters (weights and bias), and how to represent the linear regression model mathematically.',
          'Cost Function': 'Learn the cost function (mean squared error) that measures how well your model fits the training data. Visualize the cost surface and understand optimization goals.',
          'Gradient Descent': 'Master the gradient descent optimization algorithm. Understand learning rate, convergence, batch vs stochastic gradient descent, and feature scaling.',
        },
      },
      'Advanced Learning Algorithms': {
        lessons: {
          'Neural Networks Intuition': 'Understand the biological inspiration behind neural networks. Learn about neurons, layers, activation, and why neural networks can learn complex patterns.',
          'Neural Network Model': 'Build a neural network mathematically. Understand forward propagation, matrix operations, hidden layers, and how networks transform inputs to outputs.',
          'TensorFlow Implementation': 'Implement neural networks with TensorFlow and Keras. Learn Sequential models, Dense layers, model compilation, training, and prediction.',
          'Activation Functions': 'Explore activation functions: sigmoid, tanh, ReLU, softmax. Understand why non-linearity is essential and how to choose the right activation for each layer.',
          'Multiclass Classification': 'Extend binary classification to multiple classes. Learn one-vs-all, softmax regression, and building multiclass neural networks.',
          'Back Propagation': 'Understand how neural networks learn through backpropagation. Learn the chain rule, gradient computation, weight updates, and the training loop.',
        },
      },
      'Unsupervised Learning & Recommender Systems': {
        lessons: {
          'Clustering': 'Discover patterns in unlabeled data with clustering. Understand use cases: customer segmentation, image compression, anomaly detection, and document grouping.',
          'K-means Algorithm': 'Implement the K-means clustering algorithm. Learn initialization, assignment, update steps, elbow method for choosing K, and K-means++ improvement.',
          'Anomaly Detection': 'Detect unusual patterns using statistical methods. Learn Gaussian distribution, density estimation, evaluation metrics (precision, recall, F1), and practical applications.',
          'Collaborative Filtering': 'Build recommendation systems that learn from user behavior. Understand user-item matrices, similarity measures, and matrix factorization.',
          'Content-based Filtering': 'Recommend items based on features. Learn TF-IDF, feature engineering for content, and how to combine content-based with collaborative approaches.',
          'Reinforcement Learning': 'Introduction to reinforcement learning. Understand agents, environments, rewards, policies, and how RL differs from supervised/unsupervised learning.',
        },
      },
    },
  },

  'MERN Stack Front To Back: Full Stack React, Redux & Node.js': {
    category: 'MERN',
    modules: {
      'Express & MongoDB Setup': {
        lessons: {
          'Welcome To The Course': 'Get introduced to the MERN stack project you will build — a full social network with authentication, profiles, posts, and real-time features.',
          'Environment & Setup': 'Set up your development environment: VS Code, Node.js, npm, Postman. Configure extensions and shortcuts for efficient full-stack development.',
          'MongoDB Atlas Setup': 'Create a free MongoDB Atlas cluster. Configure network access, create a database user, get the connection string, and understand cloud database benefits.',
          'Install Dependencies & Server Setup': 'Initialize the project, install Express, Mongoose, and other dependencies. Create the entry point, set up scripts, and configure nodemon for development.',
          'Connecting to MongoDB': 'Connect your Express app to MongoDB using Mongoose. Handle connection events, configure options, and test the database connection.',
          'Route Files With Express Router': 'Organize routes using Express Router. Create separate route files for users, auth, profiles, and posts. Implement route prefixes and modularity.',
        },
      },
      'User API Routes & JWT Auth': {
        lessons: {
          'Creating the User Model': 'Design the User schema with Mongoose. Define fields for name, email, password, avatar, and date. Add validation rules and schema options.',
          'Request & Body Validation': 'Validate incoming request data using express-validator. Create middleware for checking required fields, email format, password length, and custom validators.',
          'User Registration': 'Implement the registration endpoint. Check for duplicate emails, hash passwords with bcrypt, create users, and return JWT tokens upon successful registration.',
          'Implementing JWT': 'Generate and verify JSON Web Tokens. Understand JWT structure (header, payload, signature), token expiration, and creating a utility function for token generation.',
          'Custom Auth Middleware': 'Build authentication middleware to protect routes. Extract tokens from headers, verify them, attach user data to requests, and handle invalid tokens.',
          'User Authentication / Login': 'Implement the login endpoint. Validate credentials, compare hashed passwords with bcrypt, generate tokens, and return user data.',
        },
      },
      'Profile API Routes': {
        lessons: {
          'Creating the Profile Model': 'Design the Profile schema to store user details: company, website, location, skills, bio, experience, education, and social media links.',
          'Get Current User Profile': 'Build the profile retrieval endpoint. Populate user data from the User model, handle the case when no profile exists, and format the response.',
          'Create & Update Profile Routes': 'Implement endpoints to create and update profiles. Handle both cases with a single route, validate social links, and use findOneAndUpdate.',
          'Get All Profiles & Profile By User ID': 'Build public profile routes. List all profiles with pagination, get a profile by user ID, and handle "not found" cases.',
          'Delete Profile & User': 'Implement account deletion. Remove the profile, user, and all associated posts. Use transactions for data consistency and handle cascade deletes.',
        },
      },
      'React & Redux Frontend': {
        lessons: {
          'React & Concurrently Setup': 'Set up the React frontend with Create React App. Use concurrently to run the client and server simultaneously during development.',
          'React Router Setup': 'Configure React Router for client-side navigation. Set up routes for landing, login, register, dashboard, and profiles. Implement a private route wrapper.',
          'Register Form & useState Hook': 'Build the registration form component. Use useState to manage form fields, handle form submission, and create action to call the API.',
          'Redux Setup & Auth Reducer': 'Configure the Redux store with Redux Toolkit. Create the auth slice with login, register, and logout reducer logic. Set up the Provider.',
          'Login Form & Action': 'Build the login form, create the login thunk action, handle loading and error states, and redirect authenticated users to the dashboard.',
          'Dashboard & Profile Management': 'Build the dashboard to display user profile data. Add experience and education forms, edit profile functionality, and account deletion.',
          'Post Feed & Likes': 'Build the social feed with post creation, display, deletion, and like/unlike functionality. Implement real-time updates and optimistic UI patterns.',
        },
      },
    },
  },

  'iOS & Swift - The Complete iOS App Development Bootcamp': {
    category: 'Mobile Development',
    modules: {
      'Getting Started with iOS Development': {
        lessons: {
          'Welcome to the Course': 'Welcome to iOS development! Learn about the course structure, what apps you will build, and how to maximize your learning experience.',
          'Download Xcode': 'Download and install Xcode — Apple\'s integrated development environment. Explore the Xcode interface, understand the project navigator, and configure your first project.',
          'Your First iOS App': 'Build your very first iOS application — a simple UI with buttons and labels. Learn about storyboards, Interface Builder, and connecting UI to code.',
          'Swift Basics': 'Learn Swift programming fundamentals: variables, constants, type inference, string interpolation, optionals, and control flow (if/else, switch, loops).',
        },
      },
      'SwiftUI Fundamentals': {
        lessons: {
          'Intro to SwiftUI': 'Understand SwiftUI — Apple\'s modern declarative UI framework. Learn the difference between UIKit and SwiftUI, and why SwiftUI is the future of iOS development.',
          'Views and Modifiers': 'Build UIs with SwiftUI views. Learn Text, Image, Button, and other views. Apply modifiers to customize appearance and understand modifier order.',
          'Layout System': 'Master SwiftUI layout with HStack, VStack, ZStack, Spacer, and padding. Understand how SwiftUI\'s layout system differs from Auto Layout.',
          'Navigation and Lists': 'Build navigation flows with NavigationView and NavigationLink. Display data in scrollable lists, implement detail views, and handle dynamic data.',
          'State Management': 'Manage app data with @State, @Binding, @ObservedObject, and @EnvironmentObject. Understand SwiftUI\'s data flow and reactivity model.',
        },
      },
      'Networking & APIs': {
        lessons: {
          'URLSession Basics': 'Make network requests in Swift using URLSession. Understand tasks, delegates, configuration, and the request lifecycle.',
          'JSON Parsing with Codable': 'Parse JSON responses using Swift\'s Codable protocol. Learn Decodable, Encodable, nested models, and handling optional fields.',
          'Async/Await in Swift': 'Use modern Swift concurrency with async/await. Replace completion handlers with cleaner async code, understand actors and structured concurrency.',
          'Building a Weather App': 'Build a complete weather app that fetches real-time data from a weather API. Display temperature, conditions, icons, and implement location services.',
        },
      },
    },
  },

  'AWS Certified Solutions Architect - Associate 2024': {
    category: 'Cloud Computing',
    modules: {
      'AWS Fundamentals': {
        lessons: {
          'What is Cloud Computing?': 'Understand cloud computing models (IaaS, PaaS, SaaS), deployment models (public, private, hybrid), and how AWS pioneered cloud infrastructure.',
          'AWS Global Infrastructure': 'Learn about AWS Regions, Availability Zones, Edge Locations, and how to choose the right region. Understand high availability and disaster recovery concepts.',
          'IAM - Identity and Access Management': 'Master AWS IAM — users, groups, roles, and policies. Understand the principle of least privilege, policy documents (JSON), and IAM best practices.',
          'IAM Hands-On Lab': 'Follow along as we create IAM users, groups, assign policies, set up MFA, and configure password policies in the AWS Console.',
          'AWS CLI Setup': 'Install and configure the AWS CLI. Set up named profiles, configure default regions, and run your first CLI commands to interact with AWS services.',
        },
      },
      'EC2 - Elastic Compute Cloud': {
        lessons: {
          'EC2 Basics': 'Launch your first EC2 instance. Understand AMIs, instance families, key pairs, and how to connect via SSH. Learn EC2 user data for bootstrap scripts.',
          'EC2 Instance Types': 'Choose the right instance type for your workload. Understand general purpose, compute optimized, memory optimized, and storage optimized families.',
          'Security Groups': 'Configure firewall rules with Security Groups. Learn inbound/outbound rules, port ranges, CIDR blocks, and chaining security groups.',
          'EC2 Purchasing Options': 'Optimize costs with On-Demand, Reserved, Spot, and Dedicated instances. Understand Savings Plans, capacity reservations, and pricing strategies.',
          'EBS Volumes & AMIs': 'Work with Elastic Block Store volumes. Understand volume types (gp3, io2, st1, sc1), snapshots, AMIs, and cross-region copying.',
          'Auto Scaling Groups': 'Scale your application automatically. Configure launch templates, scaling policies (target tracking, step, simple), and health checks.',
        },
      },
      'S3 & Storage Solutions': {
        lessons: {
          'S3 Overview': 'Understand Amazon S3 — the object storage service. Learn about buckets, objects, keys, versioning, and the S3 data consistency model.',
          'S3 Bucket Policies': 'Secure S3 resources with bucket policies and ACLs. Learn policy syntax, condition keys, and common use cases like public access and cross-account access.',
          'S3 Storage Classes': 'Optimize storage costs with S3 storage classes: Standard, IA, One Zone-IA, Intelligent-Tiering, Glacier, and Glacier Deep Archive.',
          'S3 Lifecycle Policies': 'Automate data management with lifecycle policies. Move objects between storage classes, set expiration rules, and optimize long-term storage costs.',
          'CloudFront & Global Accelerator': 'Deliver content globally with CloudFront CDN. Understand edge locations, cache behaviors, origins, and Global Accelerator for low-latency access.',
        },
      },
      'Serverless & Lambda': {
        lessons: {
          'Serverless Introduction': 'Understand the serverless paradigm. Learn how serverless differs from traditional architecture, its benefits, and when to use serverless on AWS.',
          'Lambda Basics': 'Write your first Lambda function. Understand triggers, execution context, memory/timeout configuration, environment variables, and Lambda pricing.',
          'API Gateway': 'Expose Lambda functions as REST APIs. Configure resources, methods, stages, request validation, and integrate with Lambda proxy mode.',
          'DynamoDB': 'Store data in DynamoDB — AWS managed NoSQL database. Learn tables, items, primary keys, secondary indexes, read/write capacity modes, and DAX caching.',
          'Step Functions & SQS': 'Orchestrate serverless workflows with Step Functions. Decouple services with SQS queues. Understand dead-letter queues, FIFO queues, and event-driven architecture.',
        },
      },
    },
  },

  'The Complete Cyber Security Course: Hackers Exposed!': {
    category: 'Cybersecurity',
    modules: {
      'Security Quick Win & Mindset': {
        lessons: {
          'Goals & Learning Objectives': 'Set your cybersecurity learning goals. Understand what you will learn: threat identification, risk assessment, security implementations, and incident response.',
          'Threat Landscape': 'Map the modern threat landscape: nation-state hackers, organized cybercrime, hacktivists, insider threats, and the evolving nature of cyber attacks.',
          'Your Security Posture': 'Assess your current security posture. Identify vulnerabilities in your personal and professional digital life and create a security improvement plan.',
          'Security vs Privacy vs Anonymity': 'Understand the critical differences between security (protection), privacy (control of information), and anonymity (hiding identity). Learn when each matters.',
        },
      },
      'Encryption & VPNs': {
        lessons: {
          'Symmetric Encryption': 'Understand symmetric encryption algorithms: AES, DES, 3DES, Blowfish. Learn key management, block vs stream ciphers, and modes of operation (CBC, GCM).',
          'Asymmetric Encryption': 'Master public-key cryptography: RSA, elliptic curves, Diffie-Hellman key exchange. Understand key pairs, digital signatures, and certificate authorities.',
          'Hashing & PKI': 'Learn cryptographic hashing (SHA-256, bcrypt, Argon2) and Public Key Infrastructure. Understand certificates, CAs, TLS/SSL, and how HTTPS works.',
          'VPN Types & Setup': 'Compare VPN protocols: OpenVPN, WireGuard, IKEv2, L2TP/IPSec. Set up a VPN, understand split tunneling, and evaluate commercial VPN providers.',
          'TOR & Onion Routing': 'Understand The Onion Router (TOR) network. Learn how multi-layer encryption provides anonymity, TOR browser usage, and limitations of TOR.',
        },
      },
      'Network Security': {
        lessons: {
          'Network Basics': 'Review networking fundamentals for security: TCP/IP model, ports, protocols, DNS, and the OSI model. Understand attack surfaces in network communication.',
          'Firewalls & IDS': 'Configure firewalls (network and application level). Learn Intrusion Detection Systems (IDS) vs Intrusion Prevention Systems (IPS), and SIEM solutions.',
          'Wireless Security': 'Secure wireless networks. Understand WPA2/WPA3, Evil Twin attacks, deauthentication attacks, Wi-Fi security best practices, and enterprise wireless security.',
          'Network Attacks & Defenses': 'Study common network attacks: MITM, DNS spoofing, ARP poisoning, DDoS, port scanning. Learn detection and prevention techniques for each.',
        },
      },
    },
  },

  'UI/UX Design Bootcamp: Master Figma & Design Thinking': {
    category: 'UI/UX Design',
    modules: {
      'Design Fundamentals': {
        lessons: {
          'What is UI/UX Design?': 'Define UI (User Interface) and UX (User Experience) design. Understand the design process, career paths, and the difference between UI and UX.',
          'Design Thinking Process': 'Master the 5-stage Design Thinking process: Empathize, Define, Ideate, Prototype, Test. Learn how this human-centered approach drives innovation.',
          'Color Theory': 'Understand color psychology, color wheels, complementary/analogous/triadic schemes, contrast ratios for accessibility, and creating cohesive color palettes.',
          'Typography Essentials': 'Learn typography hierarchy, font pairing, readability, line height, letter spacing, and how to choose fonts that communicate the right brand message.',
          'Layout & Spacing': 'Master layout principles: visual hierarchy, whitespace, grids, alignment, proximity, and the 8-point spacing system used by professional designers.',
        },
      },
      'Figma Mastery': {
        lessons: {
          'Figma Interface Tour': 'Navigate the Figma interface: toolbar, layers panel, properties panel, pages, assets. Learn keyboard shortcuts and workflow efficiency tips.',
          'Frames and Auto Layout': 'Use frames as the building blocks of Figma designs. Master Auto Layout for responsive components that resize and reflow automatically.',
          'Components & Variants': 'Create reusable design components. Build variants for different states (hover, active, disabled), implement component properties, and manage a component library.',
          'Prototyping & Interactions': 'Turn static designs into interactive prototypes. Add transitions, create micro-interactions, smart animate between frames, and test user flows.',
          'Design Systems': 'Build a complete design system with tokens (colors, typography, spacing), components, patterns, and documentation for consistent design at scale.',
        },
      },
      'Real Project: Mobile App Design': {
        lessons: {
          'User Research & Personas': 'Conduct user research through interviews, surveys, and competitive analysis. Create detailed user personas based on research findings.',
          'Information Architecture': 'Structure your app content with sitemaps, card sorting, and user flows. Create navigation structures that feel intuitive and efficient.',
          'Wireframing': 'Create low-fidelity wireframes to plan layouts and interactions. Learn wireframing best practices, tools, and how to iterate quickly.',
          'High-Fidelity Mockups': 'Transform wireframes into pixel-perfect high-fidelity designs. Apply your design system, add real content, and polish every visual detail.',
          'Interactive Prototype': 'Build a fully interactive prototype in Figma. Connect screens with interactions, create transition animations, and prepare for usability testing.',
          'Usability Testing': 'Conduct usability tests with real users. Write test scripts, facilitate sessions, analyze results, identify pain points, and iterate on your designs.',
        },
      },
    },
  },

  'Digital Marketing Masterclass: Get Your First 1,000 Customers': {
    category: 'Digital Marketing',
    modules: {
      'Digital Marketing Foundations': {
        lessons: {
          'The Digital Marketing Landscape': 'Survey the digital marketing ecosystem: channels, platforms, tools, and trends. Understand how digital marketing fits into the overall business strategy.',
          'Building Your Marketing Strategy': 'Create a comprehensive digital marketing strategy. Define objectives, target audience, unique value proposition, channel mix, and KPIs.',
          'Understanding Your Audience': 'Build detailed customer personas. Learn audience research techniques, buyer journey mapping, psychographic profiling, and segmentation strategies.',
          'Setting Up Analytics': 'Install and configure Google Analytics 4. Set up conversion tracking, create dashboards, understand key metrics (sessions, bounce rate, conversions), and UTM parameters.',
        },
      },
      'SEO Mastery': {
        lessons: {
          'How Search Engines Work': 'Understand Google\'s crawling, indexing, and ranking process. Learn about search algorithms, ranking factors, and how search results pages (SERPs) are structured.',
          'Keyword Research': 'Find profitable keywords using Google Keyword Planner, SEMrush, and Ahrefs. Understand search intent, long-tail keywords, keyword difficulty, and content gap analysis.',
          'On-Page SEO': 'Optimize individual pages: title tags, meta descriptions, header hierarchy, internal linking, image alt text, URL structure, and content optimization.',
          'Link Building Strategies': 'Build high-quality backlinks ethically. Learn guest posting, broken link building, HARO, digital PR, and avoiding toxic link tactics.',
          'Technical SEO': 'Optimize the technical foundation: site speed, mobile-friendliness, XML sitemaps, robots.txt, structured data (Schema.org), canonical tags, and Core Web Vitals.',
        },
      },
      'Paid Advertising': {
        lessons: {
          'Google Ads Setup': 'Create your Google Ads account, understand the campaign structure (account > campaign > ad group > ad), and configure billing and account settings.',
          'Campaign Types & Bidding': 'Master Google Ads campaign types: Search, Display, Shopping, Video, and Performance Max. Learn bidding strategies: manual CPC, target CPA, maximize conversions.',
          'Facebook & Instagram Ads': 'Set up Meta Ads Manager. Create audiences (custom, lookalike, interest-based), design ad creatives, and understand the Facebook ad auction system.',
          'Retargeting Strategies': 'Bring visitors back with retargeting campaigns. Set up pixel tracking, create retargeting audiences, build sequential ad funnels, and measure ROAS.',
          'A/B Testing & Optimization': 'Optimize campaigns with A/B testing. Test headlines, images, CTAs, landing pages, and audiences. Use statistical significance to make data-driven decisions.',
        },
      },
    },
  },

  'Docker & Kubernetes: The Complete Guide': {
    category: 'DevOps',
    modules: {
      'Docker Fundamentals': {
        lessons: {
          'Why use Docker?': 'Understand the problems Docker solves: environment consistency, dependency isolation, microservices architecture, and the "works on my machine" problem.',
          'Docker Setup & Installation': 'Install Docker Desktop on your operating system. Verify installation, understand Docker components (daemon, CLI, registry), and run your first container.',
          'Using the Docker CLI': 'Master essential Docker commands: run, ps, stop, rm, exec, logs, inspect. Understand container lifecycle, port mapping, and volume mounting.',
          'Building Custom Images': 'Write Dockerfiles to build custom images. Learn FROM, COPY, RUN, CMD, WORKDIR, ENV, EXPOSE instructions. Understand layers and build cache optimization.',
          'Docker Compose': 'Orchestrate multi-container applications with Docker Compose. Write docker-compose.yml files, manage services, networks, and volumes declaratively.',
        },
      },
      'Production-Grade Workflow': {
        lessons: {
          'Development Workflow': 'Set up a Docker-based development workflow with hot reloading. Use volumes for live code syncing and separate dev/prod Dockerfiles.',
          'Multi-Step Docker Builds': 'Optimize image size with multi-stage builds. Separate build and runtime stages, use build arguments, and create minimal production images.',
          'GitHub Actions CI/CD': 'Automate testing and deployment with GitHub Actions. Write workflows for building, testing, and pushing Docker images on every commit.',
          'AWS Deployment': 'Deploy Docker applications to AWS Elastic Beanstalk. Configure environments, set up RDS for databases, and implement blue-green deployments.',
        },
      },
      'Kubernetes': {
        lessons: {
          'Why Kubernetes?': 'Understand why Kubernetes is the standard for container orchestration. Learn about scheduling, self-healing, scaling, rolling updates, and service discovery.',
          'Pods, Services, Deployments': 'Master core Kubernetes objects. Create Pods to run containers, Services for networking, and Deployments for declarative updates and rollbacks.',
          'Managing App State': 'Handle stateful applications with ConfigMaps for configuration, Secrets for sensitive data, and environment variables injected at runtime.',
          'Persistent Volumes': 'Store data persistently beyond pod lifecycle. Understand PersistentVolumes, PersistentVolumeClaims, StorageClasses, and dynamic provisioning.',
          'Helm & HTTPS Setup': 'Use Helm package manager for Kubernetes deployments. Install charts, create custom charts, and set up cert-manager for automatic HTTPS certificates.',
          'Production Deployment': 'Deploy to a production Kubernetes cluster on AWS EKS or Google GKE. Configure ingress controllers, monitoring, logging, and horizontal pod autoscaling.',
        },
      },
    },
  },
};

// Map category from course object to video pool key
function getVideoPoolKey(course) {
  const t = course.title.toLowerCase();
  if (t.includes('web development') || t.includes('web developer')) return 'Web Development';
  if (t.includes('python') || t.includes('data science')) return 'Data Science';
  if (t.includes('react')) return 'React';
  if (t.includes('ios') || t.includes('swift')) return 'Mobile Development';
  if (t.includes('aws') || t.includes('cloud')) return 'Cloud Computing';
  if (t.includes('cyber') || t.includes('security')) return 'Cybersecurity';
  if (t.includes('ui/ux') || t.includes('design') && !t.includes('marketing')) return 'UI/UX Design';
  if (t.includes('marketing')) return 'Digital Marketing';
  if (t.includes('docker') || t.includes('kubernetes')) return 'DevOps';
  if (t.includes('machine learning')) return 'Machine Learning';
  if (t.includes('mern')) return 'MERN';
  return 'Web Development'; // fallback
}

async function addContent() {
  const courses = await Course.find();
  let updated = 0;

  for (const course of courses) {
    const content = courseContent[course.title];
    if (!content) {
      console.log(`⚠️  No content mapping for: ${course.title}`);
      continue;
    }

    const poolKey = getVideoPoolKey(course);
    const videos = videoPool[poolKey] || videoPool['Web Development'];
    let videoIdx = 0;
    let modified = false;

    for (const mod of course.modules) {
      const moduleContent = content.modules[mod.title];
      if (!moduleContent) {
        console.log(`   ⚠️  No module content for: ${mod.title} (in ${course.title})`);
        continue;
      }

      for (const lesson of mod.lessons) {
        const desc = moduleContent.lessons[lesson.title];
        if (desc) {
          lesson.description = desc;
          modified = true;
        }

        // Assign video URL (always overwrite to ensure embed format)
        if (!lesson.videoUrl || !lesson.videoUrl.includes('/embed/')) {
          lesson.videoUrl = videos[videoIdx % videos.length];
          videoIdx++;
          modified = true;
        }
      }
    }

    if (modified) {
      await course.save();
      updated++;
      const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
      const withDesc = course.modules.reduce((a, m) => a + m.lessons.filter(l => l.description).length, 0);
      const withVideo = course.modules.reduce((a, m) => a + m.lessons.filter(l => l.videoUrl).length, 0);
      console.log(`✅ ${course.title}: ${totalLessons} lessons, ${withDesc} descriptions, ${withVideo} videos`);
    }
  }

  console.log(`\n🎉 Updated ${updated}/${courses.length} courses with content`);
}

module.exports = addContent;

// Run standalone: node addCourseContent.js
if (require.main === module) {
  connectDB().then(() => addContent()).then(() => process.exit(0)).catch(err => { console.error('Failed:', err); process.exit(1); });
}
