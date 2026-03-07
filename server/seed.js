const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Notification = require('./models/Notification');
const Review = require('./models/Review');

const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();
  console.log('🗑️  Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Enrollment.deleteMany({}),
    Notification.deleteMany({}),
    Review.deleteMany({}),
  ]);

  // ─── Instructors ─────────────────────────────
  const salt = await bcrypt.genSalt(12);
  const hashedPw = await bcrypt.hash('password123', salt);

  const instructors = await User.insertMany([
    {
      name: 'Dr. Angela Yu',
      email: 'angela@eduverse.com',
      password: hashedPw,
      role: 'instructor',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Lead instructor at the London App Brewery. 7+ years teaching full-stack development to over 2.5 million students worldwide.',
      phone: '+44 7700 900123',
    },
    {
      name: 'Jose Portilla',
      email: 'jose@eduverse.com',
      password: hashedPw,
      role: 'instructor',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Head of Data Science at Pierian Training. Specializes in Python, Machine Learning, and Deep Learning with 10+ years of experience.',
      phone: '+1 555 234 5678',
    },
    {
      name: 'Maximilian Schwarzmuller',
      email: 'max@eduverse.com',
      password: hashedPw,
      role: 'instructor',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      bio: 'Professional web developer and instructor with a passion for React, Angular, Node.js, and cloud technologies.',
      phone: '+49 170 1234567',
    },
    {
      name: 'Colt Steele',
      email: 'colt@eduverse.com',
      password: hashedPw,
      role: 'instructor',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
      bio: 'Former Galvanize Lead Instructor. Created one of the most popular web development bootcamps. Loves algorithms and data structures.',
      phone: '+1 555 345 6789',
    },
    {
      name: 'Andrew Ng',
      email: 'andrew@eduverse.com',
      password: hashedPw,
      role: 'instructor',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      bio: 'Co-founder of Coursera, former VP & Chief Scientist at Baidu, Adjunct Professor at Stanford University. Pioneer in AI & Machine Learning.',
      phone: '+1 650 555 0199',
    },
    {
      name: 'Brad Traversy',
      email: 'brad@eduverse.com',
      password: hashedPw,
      role: 'instructor',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      bio: 'Full stack web developer and YouTube educator. Owner of Traversy Media with 2M+ subscribers. Focused on practical, project-based learning.',
      phone: '+1 555 456 7890',
    },
  ]);

  // ─── Students ────────────────────────────────
  const students = await User.insertMany([
    {
      name: 'Rahul Sharma',
      email: 'student@eduverse.com',
      password: hashedPw,
      role: 'student',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      bio: 'Computer Science student passionate about web development.',
    },
    {
      name: 'Priya Patel',
      email: 'priya@eduverse.com',
      password: hashedPw,
      role: 'student',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      bio: 'Aspiring data scientist looking to break into the AI industry.',
    },
    {
      name: 'James Wilson',
      email: 'james@eduverse.com',
      password: hashedPw,
      role: 'student',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      bio: 'Career switcher from finance to tech. Currently learning full-stack development.',
    },
    {
      name: 'Sarah Chen',
      email: 'sarah@eduverse.com',
      password: hashedPw,
      role: 'student',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      bio: 'UX designer expanding skills into frontend development.',
    },
    {
      name: 'Alex Johnson',
      email: 'alex@eduverse.com',
      password: hashedPw,
      role: 'student',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      bio: 'DevOps engineer looking to strengthen cloud computing knowledge.',
    },
  ]);

  // ─── Admin ───────────────────────────────────
  await User.insertMany([{
    name: 'Admin',
    email: 'admin@eduverse.com',
    password: hashedPw,
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Platform administrator',
  }]);

  console.log('👤 Users created');

  // ─── Courses ─────────────────────────────────
  const coursesData = [
    {
      title: 'The Complete 2024 Web Development Bootcamp',
      description: `Become a Full-Stack Web Developer with just ONE course. HTML, CSS, JavaScript, Node, React, PostgreSQL, Web3 and DApps.\n\nWelcome to the Complete Web Development Bootcamp, the only course you need to learn to code and become a full-stack web developer. With 150,000+ ratings and a 4.7 average, this is one of the HIGHEST RATED courses in the history of the platform!\n\nAt 65+ hours, this Web Development course is without a doubt the most comprehensive web development course available online. Even if you have zero programming experience, this course will take you from beginner to mastery.\n\nThis course doesn't cut any corners, there are beautiful animated explanation videos and tens of real-world projects which you will get to build.`,
      shortDescription: 'Become a full-stack web developer with just ONE course. HTML, CSS, JavaScript, Node, React, MongoDB, and more!',
      instructor: instructors[0]._id,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
      category: 'Web Development',
      level: 'Beginner',
      tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Web3'],
      price: 84.99,
      isPublished: true,
      enrollmentCount: 892450,
      rating: { average: 4.7, count: 152340 },
      requirements: [
        'No programming experience needed - I will teach you everything you need to know',
        'A computer with access to the internet',
        'No paid software required',
        'I will walk you through, step-by-step how to get all the software installed and set up',
      ],
      whatYouWillLearn: [
        'Build 16+ web development projects for your portfolio',
        'Learn the latest technologies including Javascript, React, Node and Web3 development',
        'Build fully-fledged websites and web apps for your startup or business',
        'Master frontend & backend development with HTML, CSS, JavaScript, Node.js',
        'Learn professional developer best practices',
        'Work with APIs and databases (SQL & NoSQL)',
        'Understand Web3 and blockchain technology fundamentals',
        'Deploy your applications to production',
      ],
      modules: [
        {
          title: 'Front-End Web Development',
          description: 'Learn HTML5 and CSS3 from the ground up',
          order: 1,
          lessons: [
            { title: 'What You\'ll Get In This Course', videoUrl: 'https://www.youtube.com/watch?v=placeholder1', duration: 6, order: 1 },
            { title: 'How Does the Internet Actually Work?', videoUrl: '', duration: 12, order: 2 },
            { title: 'How Do Websites Actually Work?', videoUrl: '', duration: 8, order: 3 },
            { title: 'Introduction to HTML', videoUrl: '', duration: 18, order: 4 },
            { title: 'HTML Heading Elements', videoUrl: '', duration: 14, order: 5 },
            { title: 'HTML Paragraph Elements', videoUrl: '', duration: 11, order: 6 },
          ],
        },
        {
          title: 'Introduction to CSS',
          description: 'Master CSS styling, flexbox, and grid',
          order: 2,
          lessons: [
            { title: 'Introduction to CSS', videoUrl: '', duration: 15, order: 1 },
            { title: 'CSS Selectors', videoUrl: '', duration: 20, order: 2 },
            { title: 'CSS Colors & Backgrounds', videoUrl: '', duration: 18, order: 3 },
            { title: 'The CSS Box Model', videoUrl: '', duration: 22, order: 4 },
            { title: 'CSS Display Property', videoUrl: '', duration: 16, order: 5 },
            { title: 'CSS Float and Clear', videoUrl: '', duration: 14, order: 6 },
            { title: 'Flexbox Layout', videoUrl: '', duration: 25, order: 7 },
            { title: 'CSS Grid', videoUrl: '', duration: 28, order: 8 },
          ],
        },
        {
          title: 'JavaScript ES6+',
          description: 'Modern JavaScript fundamentals and advanced concepts',
          order: 3,
          lessons: [
            { title: 'Introduction to JavaScript', videoUrl: '', duration: 10, order: 1 },
            { title: 'Variables and Data Types', videoUrl: '', duration: 15, order: 2 },
            { title: 'Functions and Scope', videoUrl: '', duration: 20, order: 3 },
            { title: 'Arrays and Objects', videoUrl: '', duration: 18, order: 4 },
            { title: 'DOM Manipulation', videoUrl: '', duration: 25, order: 5 },
            { title: 'ES6 Arrow Functions & Template Literals', videoUrl: '', duration: 14, order: 6 },
            { title: 'Destructuring and Spread Operator', videoUrl: '', duration: 16, order: 7 },
            { title: 'Async/Await and Promises', videoUrl: '', duration: 22, order: 8 },
          ],
        },
        {
          title: 'React.js - Frontend Framework',
          description: 'Build modern user interfaces with React',
          order: 4,
          lessons: [
            { title: 'What is React?', videoUrl: '', duration: 8, order: 1 },
            { title: 'JSX and Components', videoUrl: '', duration: 18, order: 2 },
            { title: 'Props and State', videoUrl: '', duration: 22, order: 3 },
            { title: 'React Hooks - useState & useEffect', videoUrl: '', duration: 28, order: 4 },
            { title: 'Event Handling in React', videoUrl: '', duration: 15, order: 5 },
            { title: 'Conditional Rendering', videoUrl: '', duration: 12, order: 6 },
            { title: 'Building a React Project', videoUrl: '', duration: 45, order: 7 },
          ],
        },
        {
          title: 'Node.js & Express',
          description: 'Server-side JavaScript with Node.js',
          order: 5,
          lessons: [
            { title: 'Introduction to Node.js', videoUrl: '', duration: 12, order: 1 },
            { title: 'Node.js Modules', videoUrl: '', duration: 15, order: 2 },
            { title: 'Express.js Setup', videoUrl: '', duration: 18, order: 3 },
            { title: 'RESTful APIs', videoUrl: '', duration: 25, order: 4 },
            { title: 'Middleware in Express', videoUrl: '', duration: 20, order: 5 },
            { title: 'Authentication with JWT', videoUrl: '', duration: 30, order: 6 },
          ],
        },
      ],
    },
    {
      title: 'Python for Data Science and Machine Learning Bootcamp',
      description: `Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, Tensorflow, and more!\n\nAre you ready to start your path to becoming a Data Scientist?\n\nThis comprehensive course will be your guide to learning how to use the power of Python to analyze data, create beautiful visualizations, and use powerful machine learning algorithms!\n\nThis course is designed for both beginners with some programming experience or experienced developers looking to make the jump to Data Science!\n\nData Scientist has been ranked the number one job on many job-search websites, and the average salary of a data scientist is over $120,000 in the United States.`,
      shortDescription: 'Master Python for Data Science & ML using NumPy, Pandas, Scikit-Learn, TensorFlow, and more with hands-on projects.',
      instructor: instructors[1]._id,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      category: 'Data Science',
      level: 'Intermediate',
      tags: ['Python', 'Data Science', 'Machine Learning', 'Pandas', 'NumPy', 'TensorFlow'],
      price: 94.99,
      isPublished: true,
      enrollmentCount: 645820,
      rating: { average: 4.6, count: 98450 },
      requirements: [
        'Basic Python knowledge (variables, loops, functions)',
        'A computer with internet access',
        'Willingness to learn – everything else is provided!',
      ],
      whatYouWillLearn: [
        'Use Python for Data Science and Machine Learning',
        'Implement Machine Learning Algorithms using Scikit-Learn',
        'Use NumPy for numerical data processing',
        'Use Pandas for data analysis and manipulation',
        'Create data visualizations with Matplotlib and Seaborn',
        'Use Plotly for interactive dynamic visualizations',
        'Build Neural Networks with TensorFlow 2.0',
        'Perform Natural Language Processing and recommender systems',
      ],
      modules: [
        {
          title: 'Python Crash Course',
          description: 'Quick python refresher for data science',
          order: 1,
          lessons: [
            { title: 'Introduction to Python', videoUrl: '', duration: 10, order: 1 },
            { title: 'Python Data Types', videoUrl: '', duration: 15, order: 2 },
            { title: 'Python Comparison Operators', videoUrl: '', duration: 12, order: 3 },
            { title: 'Python Statements', videoUrl: '', duration: 18, order: 4 },
            { title: 'Methods and Functions', videoUrl: '', duration: 20, order: 5 },
          ],
        },
        {
          title: 'NumPy',
          description: 'Numerical computing with NumPy arrays',
          order: 2,
          lessons: [
            { title: 'NumPy Arrays', videoUrl: '', duration: 22, order: 1 },
            { title: 'NumPy Indexing and Selection', videoUrl: '', duration: 18, order: 2 },
            { title: 'NumPy Operations', videoUrl: '', duration: 15, order: 3 },
            { title: 'NumPy Exercises', videoUrl: '', duration: 25, order: 4 },
          ],
        },
        {
          title: 'Pandas',
          description: 'Data analysis and manipulation',
          order: 3,
          lessons: [
            { title: 'Introduction to Pandas', videoUrl: '', duration: 12, order: 1 },
            { title: 'Series and DataFrames', videoUrl: '', duration: 20, order: 2 },
            { title: 'Missing Data & Groupby', videoUrl: '', duration: 25, order: 3 },
            { title: 'Merging, Joining, and Concatenating', videoUrl: '', duration: 18, order: 4 },
            { title: 'Data Input and Output', videoUrl: '', duration: 15, order: 5 },
          ],
        },
        {
          title: 'Data Visualization with Matplotlib',
          description: 'Creating static visualizations',
          order: 4,
          lessons: [
            { title: 'Matplotlib Basics', videoUrl: '', duration: 18, order: 1 },
            { title: 'Advanced Matplotlib', videoUrl: '', duration: 22, order: 2 },
            { title: 'Seaborn for Statistical Plots', videoUrl: '', duration: 28, order: 3 },
            { title: 'Plotly and Cufflinks', videoUrl: '', duration: 20, order: 4 },
          ],
        },
        {
          title: 'Machine Learning',
          description: 'Core ML algorithms and concepts',
          order: 5,
          lessons: [
            { title: 'Introduction to Machine Learning', videoUrl: '', duration: 15, order: 1 },
            { title: 'Linear Regression', videoUrl: '', duration: 30, order: 2 },
            { title: 'Logistic Regression', videoUrl: '', duration: 25, order: 3 },
            { title: 'K Nearest Neighbors', videoUrl: '', duration: 22, order: 4 },
            { title: 'Decision Trees and Random Forests', videoUrl: '', duration: 28, order: 5 },
            { title: 'Support Vector Machines', videoUrl: '', duration: 25, order: 6 },
            { title: 'Neural Networks with TensorFlow', videoUrl: '', duration: 35, order: 7 },
          ],
        },
      ],
    },
    {
      title: 'React - The Complete Guide 2024 (incl. Next.js, Redux)',
      description: `Dive in and learn React.js from scratch! Learn React, Hooks, Redux, React Router, Next.js, Best Practices and way more!\n\nThis course is the most up-to-date, comprehensive and bestselling React course. It was completely updated and re-recorded for React 18 and it teaches React in-depth, from the ground up, step by step.\n\nThis course also includes videos on Next.js and fullstack React development, while also covering React fundamentals and advanced concepts in great detail.\n\nYou'll learn all the key fundamentals as well as advanced concepts and related topics to turn you into a React.js developer.`,
      shortDescription: 'Dive in and learn React.js from scratch! Learn Hooks, Redux, React Router, Next.js and way more!',
      instructor: instructors[2]._id,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      category: 'Web Development',
      level: 'Beginner',
      tags: ['React', 'Next.js', 'Redux', 'JavaScript', 'Hooks', 'React Router'],
      price: 89.99,
      isPublished: true,
      enrollmentCount: 782150,
      rating: { average: 4.8, count: 187620 },
      requirements: [
        'JavaScript + HTML + CSS fundamentals are absolutely required',
        'You do NOT need any prior React or any other JS framework experience',
        'ES6+ JavaScript knowledge is beneficial but not required',
      ],
      whatYouWillLearn: [
        'Build powerful, fast, user-friendly and reactive web apps',
        'Apply for high-paid jobs or work as a freelance developer',
        'Learn all about React Hooks and React Components',
        'Manage complex state efficiently with React Context & Redux',
        'Build fullstack React apps with Next.js',
        'Learn React Router for navigation in Single Page Applications',
        'Implement Authentication and Database access',
        'Unit Testing React applications',
      ],
      modules: [
        {
          title: 'Getting Started',
          description: 'Understanding what React is and why it matters',
          order: 1,
          lessons: [
            { title: 'Welcome To The Course!', videoUrl: '', duration: 5, order: 1 },
            { title: 'What is React.js?', videoUrl: '', duration: 8, order: 2 },
            { title: 'Why React Instead of Vanilla JS?', videoUrl: '', duration: 14, order: 3 },
            { title: 'ReactJS vs React Native', videoUrl: '', duration: 6, order: 4 },
            { title: 'Creating a React Project', videoUrl: '', duration: 18, order: 5 },
          ],
        },
        {
          title: 'React Essentials - Components, JSX, Props, State',
          description: 'Core building blocks of React',
          order: 2,
          lessons: [
            { title: 'Module Introduction', videoUrl: '', duration: 3, order: 1 },
            { title: 'JSX & React Components', videoUrl: '', duration: 20, order: 2 },
            { title: 'Building & Using a Component', videoUrl: '', duration: 15, order: 3 },
            { title: 'Props - Making Components Configurable', videoUrl: '', duration: 22, order: 4 },
            { title: 'State - Managing Component Data', videoUrl: '', duration: 25, order: 5 },
            { title: 'Rendering Lists & Conditional Content', videoUrl: '', duration: 18, order: 6 },
          ],
        },
        {
          title: 'React Hooks In Detail',
          description: 'Deep dive into all React hooks',
          order: 3,
          lessons: [
            { title: 'useState In Detail', videoUrl: '', duration: 20, order: 1 },
            { title: 'useEffect - Handling Side Effects', videoUrl: '', duration: 28, order: 2 },
            { title: 'useRef & useReducer', videoUrl: '', duration: 22, order: 3 },
            { title: 'useContext - Sharing State', videoUrl: '', duration: 18, order: 4 },
            { title: 'useMemo & useCallback', videoUrl: '', duration: 20, order: 5 },
            { title: 'Custom Hooks', videoUrl: '', duration: 25, order: 6 },
          ],
        },
        {
          title: 'Redux & Redux Toolkit',
          description: 'State management at scale',
          order: 4,
          lessons: [
            { title: 'What is Redux', videoUrl: '', duration: 12, order: 1 },
            { title: 'Redux Toolkit Setup', videoUrl: '', duration: 20, order: 2 },
            { title: 'Creating Slices', videoUrl: '', duration: 18, order: 3 },
            { title: 'Async Operations with Thunks', videoUrl: '', duration: 25, order: 4 },
            { title: 'Redux DevTools', videoUrl: '', duration: 10, order: 5 },
          ],
        },
        {
          title: 'Next.js Introduction',
          description: 'Full-stack React with Next.js',
          order: 5,
          lessons: [
            { title: 'What is Next.js?', videoUrl: '', duration: 10, order: 1 },
            { title: 'File-based Routing', videoUrl: '', duration: 18, order: 2 },
            { title: 'Server-Side Rendering (SSR)', videoUrl: '', duration: 22, order: 3 },
            { title: 'API Routes in Next.js', videoUrl: '', duration: 20, order: 4 },
            { title: 'Deploying Next.js Apps', videoUrl: '', duration: 15, order: 5 },
          ],
        },
      ],
    },
    {
      title: 'The Web Developer Bootcamp 2024',
      description: `The only course you need to learn web development - HTML, CSS, JS, Node, and More!\n\nHi! Welcome to the brand new version of The Web Developer Bootcamp, the most popular web development course. This course was just completely overhauled to prepare you for 2024 and beyond.\n\nThis is the only web development course you'll ever need. There are a lot of options for online web development training, but this course is without a doubt the most comprehensive and effective on the market.\n\nWhen you're learning to code you often have to sacrifice learning the exciting and current technologies in favor of the "beginner friendly" classes. With this course, you get the best of both worlds.`,
      shortDescription: 'The only course you need to learn web development - HTML, CSS, JS, Node, and More!',
      instructor: instructors[3]._id,
      thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80',
      category: 'Web Development',
      level: 'Beginner',
      tags: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'Bootstrap'],
      price: 74.99,
      isPublished: true,
      enrollmentCount: 918340,
      rating: { average: 4.7, count: 268790 },
      requirements: [
        'Have a computer with Internet',
        'Be ready to learn an insane amount of awesome stuff',
        'Prepare to build real web apps!',
      ],
      whatYouWillLearn: [
        'The ins and outs of HTML5, CSS3, and Modern JavaScript',
        'Make REAL web applications using cutting-edge technologies',
        'Create responsive, accessible, and beautiful layouts',
        'Recognize and prevent common security exploits (XSS, SQL Injection)',
        'Use Express, MongoDB, and Mongoose to build full-stack JS apps',
        'Create a beautiful, responsive landing page for any startup',
        'Implement full authentication from scratch',
        'Deploy your applications and work with cloud databases',
      ],
      modules: [
        {
          title: 'Introduction to This Course',
          order: 1,
          lessons: [
            { title: 'A Note On This Course', videoUrl: '', duration: 5, order: 1 },
            { title: 'Syllabus Download & Welcome', videoUrl: '', duration: 8, order: 2 },
            { title: 'Tips For This Course', videoUrl: '', duration: 6, order: 3 },
          ],
        },
        {
          title: 'HTML: The Essentials',
          order: 2,
          lessons: [
            { title: 'Introduction to HTML', videoUrl: '', duration: 12, order: 1 },
            { title: 'Our Very First HTML Page', videoUrl: '', duration: 15, order: 2 },
            { title: 'MDN & Documentation', videoUrl: '', duration: 8, order: 3 },
            { title: 'Paragraph Elements', videoUrl: '', duration: 10, order: 4 },
            { title: 'HTML Boilerplate', videoUrl: '', duration: 14, order: 5 },
            { title: 'Forms & Tables', videoUrl: '', duration: 22, order: 6 },
          ],
        },
        {
          title: 'CSS: The Complete Guide',
          order: 3,
          lessons: [
            { title: 'CSS Basics', videoUrl: '', duration: 15, order: 1 },
            { title: 'Selectors Deep Dive', videoUrl: '', duration: 20, order: 2 },
            { title: 'The Box Model', videoUrl: '', duration: 18, order: 3 },
            { title: 'Flexbox', videoUrl: '', duration: 25, order: 4 },
            { title: 'Responsive Design & Media Queries', videoUrl: '', duration: 22, order: 5 },
            { title: 'CSS Grid', videoUrl: '', duration: 20, order: 6 },
            { title: 'Bootstrap 5', videoUrl: '', duration: 28, order: 7 },
          ],
        },
        {
          title: 'JavaScript Fundamentals',
          order: 4,
          lessons: [
            { title: 'JS Intro & Primitives', videoUrl: '', duration: 12, order: 1 },
            { title: 'The World of Strings', videoUrl: '', duration: 15, order: 2 },
            { title: 'Decision Making', videoUrl: '', duration: 18, order: 3 },
            { title: 'Arrays', videoUrl: '', duration: 20, order: 4 },
            { title: 'Object Literals', videoUrl: '', duration: 16, order: 5 },
            { title: 'Functions', videoUrl: '', duration: 22, order: 6 },
            { title: 'Callbacks & Higher Order Functions', videoUrl: '', duration: 25, order: 7 },
            { title: 'Async JavaScript', videoUrl: '', duration: 30, order: 8 },
          ],
        },
        {
          title: 'Backend with Node & Express',
          order: 5,
          lessons: [
            { title: 'Intro to Node.js', videoUrl: '', duration: 10, order: 1 },
            { title: 'Express Basics', videoUrl: '', duration: 18, order: 2 },
            { title: 'Templating with EJS', videoUrl: '', duration: 20, order: 3 },
            { title: 'RESTful Routes', videoUrl: '', duration: 22, order: 4 },
            { title: 'MongoDB & Mongoose', videoUrl: '', duration: 28, order: 5 },
            { title: 'Authentication & Authorization', videoUrl: '', duration: 32, order: 6 },
          ],
        },
      ],
    },
    {
      title: 'Machine Learning Specialization',
      description: `Master the fundamentals of machine learning and AI. Build practical machine learning models using Python, TensorFlow, and scikit-learn.\n\nThis beginner-friendly program will teach you the fundamentals of machine learning and how to use these techniques to build real-world AI applications.\n\nThis Specialization is taught by Andrew Ng, an AI visionary who has led critical research at Stanford University, Google Brain, Baidu, and Landing.AI to advance the AI field.\n\nBy the end, you'll have the practical know-how to apply machine learning to challenging and real-world problems.`,
      shortDescription: 'Master machine learning fundamentals. Build real-world AI applications with Python, TensorFlow & scikit-learn.',
      instructor: instructors[4]._id,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      category: 'Machine Learning',
      level: 'Beginner',
      tags: ['Machine Learning', 'Python', 'TensorFlow', 'AI', 'Deep Learning', 'Neural Networks'],
      price: 79.99,
      isPublished: true,
      enrollmentCount: 1245600,
      rating: { average: 4.9, count: 312450 },
      requirements: [
        'Basic Python programming knowledge',
        'High school level mathematics (algebra)',
        'No prior machine learning experience needed',
      ],
      whatYouWillLearn: [
        'Build ML models with NumPy and scikit-learn',
        'Build and train supervised models for prediction & classification',
        'Build neural networks with TensorFlow for multi-class classification',
        'Apply best practices for ML development',
        'Build recommender systems with collaborative filtering & deep learning',
        'Build a deep reinforcement learning model',
        'Understand unsupervised learning techniques including clustering and anomaly detection',
        'Master gradient descent and advanced optimization algorithms',
      ],
      modules: [
        {
          title: 'Supervised Learning: Regression and Classification',
          order: 1,
          lessons: [
            { title: 'Welcome to Machine Learning!', videoUrl: '', duration: 8, order: 1 },
            { title: 'Applications of Machine Learning', videoUrl: '', duration: 15, order: 2 },
            { title: 'What is Machine Learning?', videoUrl: '', duration: 12, order: 3 },
            { title: 'Supervised vs Unsupervised Learning', videoUrl: '', duration: 18, order: 4 },
            { title: 'Linear Regression Model', videoUrl: '', duration: 25, order: 5 },
            { title: 'Cost Function', videoUrl: '', duration: 20, order: 6 },
            { title: 'Gradient Descent', videoUrl: '', duration: 28, order: 7 },
          ],
        },
        {
          title: 'Advanced Learning Algorithms',
          order: 2,
          lessons: [
            { title: 'Neural Networks Intuition', videoUrl: '', duration: 15, order: 1 },
            { title: 'Neural Network Model', videoUrl: '', duration: 22, order: 2 },
            { title: 'TensorFlow Implementation', videoUrl: '', duration: 30, order: 3 },
            { title: 'Activation Functions', videoUrl: '', duration: 18, order: 4 },
            { title: 'Multiclass Classification', videoUrl: '', duration: 20, order: 5 },
            { title: 'Back Propagation', videoUrl: '', duration: 25, order: 6 },
          ],
        },
        {
          title: 'Unsupervised Learning & Recommender Systems',
          order: 3,
          lessons: [
            { title: 'Clustering', videoUrl: '', duration: 20, order: 1 },
            { title: 'K-means Algorithm', videoUrl: '', duration: 22, order: 2 },
            { title: 'Anomaly Detection', videoUrl: '', duration: 18, order: 3 },
            { title: 'Collaborative Filtering', videoUrl: '', duration: 25, order: 4 },
            { title: 'Content-based Filtering', videoUrl: '', duration: 20, order: 5 },
            { title: 'Reinforcement Learning', videoUrl: '', duration: 30, order: 6 },
          ],
        },
      ],
    },
    {
      title: 'MERN Stack Front To Back: Full Stack React, Redux & Node.js',
      description: `Build and deploy a social network with Node.js, Express, React, Redux & MongoDB. Full MERN stack project from scratch.\n\nThis is a project-based course where we build an extensive, in-depth social network application using Node.js, Express, React, Redux and MongoDB along with ES6+.\n\nWe will start with a blank text editor and end with a deployed full stack application.\n\nThis is NOT a superficial or purely informational course. This course deals with the practical aspects of development. Each concept is explained clearly and then applied in a practical manner.`,
      shortDescription: 'Build and deploy a social network with MERN stack. Full project from scratch with authentication & deployment.',
      instructor: instructors[5]._id,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      category: 'Web Development',
      level: 'Intermediate',
      tags: ['MERN', 'React', 'Node.js', 'Express', 'MongoDB', 'Redux', 'Full Stack'],
      price: 69.99,
      isPublished: true,
      enrollmentCount: 356780,
      rating: { average: 4.6, count: 78430 },
      requirements: [
        'Basic JavaScript knowledge is required',
        'Understanding of ES6 features (arrow functions, promises)',
        'Basic knowledge of React is helpful but not required',
      ],
      whatYouWillLearn: [
        'Build a full stack social network app with React, Redux, Node, Express & MongoDB',
        'Create an extensive backend API with Express',
        'Use Stateless JWT authentication practices',
        'Integrate React with an Express backend elegantly',
        'React Hooks, Async/Await & modern JavaScript practices',
        'Use Redux for state management and implement complex patterns',
        'Deploy to Heroku/Render with a custom domain',
        'Create private routes and protected API endpoints',
      ],
      modules: [
        {
          title: 'Express & MongoDB Setup',
          order: 1,
          lessons: [
            { title: 'Welcome To The Course', videoUrl: '', duration: 5, order: 1 },
            { title: 'Environment & Setup', videoUrl: '', duration: 10, order: 2 },
            { title: 'MongoDB Atlas Setup', videoUrl: '', duration: 12, order: 3 },
            { title: 'Install Dependencies & Server Setup', videoUrl: '', duration: 15, order: 4 },
            { title: 'Connecting to MongoDB', videoUrl: '', duration: 10, order: 5 },
            { title: 'Route Files With Express Router', videoUrl: '', duration: 18, order: 6 },
          ],
        },
        {
          title: 'User API Routes & JWT Auth',
          order: 2,
          lessons: [
            { title: 'Creating the User Model', videoUrl: '', duration: 12, order: 1 },
            { title: 'Request & Body Validation', videoUrl: '', duration: 15, order: 2 },
            { title: 'User Registration', videoUrl: '', duration: 20, order: 3 },
            { title: 'Implementing JWT', videoUrl: '', duration: 18, order: 4 },
            { title: 'Custom Auth Middleware', videoUrl: '', duration: 14, order: 5 },
            { title: 'User Authentication / Login', videoUrl: '', duration: 16, order: 6 },
          ],
        },
        {
          title: 'Profile API Routes',
          order: 3,
          lessons: [
            { title: 'Creating the Profile Model', videoUrl: '', duration: 10, order: 1 },
            { title: 'Get Current User Profile', videoUrl: '', duration: 12, order: 2 },
            { title: 'Create & Update Profile Routes', videoUrl: '', duration: 20, order: 3 },
            { title: 'Get All Profiles & Profile By User ID', videoUrl: '', duration: 15, order: 4 },
            { title: 'Delete Profile & User', videoUrl: '', duration: 12, order: 5 },
          ],
        },
        {
          title: 'React & Redux Frontend',
          order: 4,
          lessons: [
            { title: 'React & Concurrently Setup', videoUrl: '', duration: 12, order: 1 },
            { title: 'React Router Setup', videoUrl: '', duration: 10, order: 2 },
            { title: 'Register Form & useState Hook', videoUrl: '', duration: 18, order: 3 },
            { title: 'Redux Setup & Auth Reducer', videoUrl: '', duration: 22, order: 4 },
            { title: 'Login Form & Action', videoUrl: '', duration: 15, order: 5 },
            { title: 'Dashboard & Profile Management', videoUrl: '', duration: 25, order: 6 },
            { title: 'Post Feed & Likes', videoUrl: '', duration: 20, order: 7 },
          ],
        },
      ],
    },
    {
      title: 'iOS & Swift - The Complete iOS App Development Bootcamp',
      description: `From beginner to iOS App Developer with just one course! Includes comprehensive modules on SwiftUI, ARKit, CoreML, and more.\n\nWelcome to the Complete iOS App Development Bootcamp. With over 55 hours of content, this is the most comprehensive iOS development course online.\n\nEven if you have ZERO programming experience, this course will take you from complete novice to an actual iOS developer.\n\nThis course has been fine-tuned and optimized with the latest Swift and iOS best practices.`,
      shortDescription: 'From beginner to iOS App Developer with just one course! SwiftUI, ARKit, CoreML and more.',
      instructor: instructors[0]._id,
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
      category: 'Mobile Development',
      level: 'Beginner',
      tags: ['iOS', 'Swift', 'SwiftUI', 'Xcode', 'ARKit', 'CoreML'],
      price: 89.99,
      isPublished: true,
      enrollmentCount: 378920,
      rating: { average: 4.8, count: 96540 },
      requirements: [
        'No programming experience needed - I will teach you everything',
        'A Mac computer (macOS Monterey or newer)',
        'No paid software required - all apps used in the course are free',
      ],
      whatYouWillLearn: [
        'Build any app you want using Swift 5 and iOS 17',
        'Create a portfolio of iOS apps to apply for junior developer jobs',
        'Learn SwiftUI for building modern user interfaces',
        'Master app design principles and asset creation',
        'Build augmented reality apps using ARKit',
        'Use CoreML for machine learning in iOS apps',
        'Implement core data for persistent storage',
        'Publish your apps to the App Store',
      ],
      modules: [
        {
          title: 'Getting Started with iOS Development',
          order: 1,
          lessons: [
            { title: 'Welcome to the Course', videoUrl: '', duration: 5, order: 1 },
            { title: 'Download Xcode', videoUrl: '', duration: 8, order: 2 },
            { title: 'Your First iOS App', videoUrl: '', duration: 20, order: 3 },
            { title: 'Swift Basics', videoUrl: '', duration: 25, order: 4 },
          ],
        },
        {
          title: 'SwiftUI Fundamentals',
          order: 2,
          lessons: [
            { title: 'Intro to SwiftUI', videoUrl: '', duration: 15, order: 1 },
            { title: 'Views and Modifiers', videoUrl: '', duration: 20, order: 2 },
            { title: 'Layout System', videoUrl: '', duration: 22, order: 3 },
            { title: 'Navigation and Lists', videoUrl: '', duration: 25, order: 4 },
            { title: 'State Management', videoUrl: '', duration: 18, order: 5 },
          ],
        },
        {
          title: 'Networking & APIs',
          order: 3,
          lessons: [
            { title: 'URLSession Basics', videoUrl: '', duration: 15, order: 1 },
            { title: 'JSON Parsing with Codable', videoUrl: '', duration: 18, order: 2 },
            { title: 'Async/Await in Swift', videoUrl: '', duration: 20, order: 3 },
            { title: 'Building a Weather App', videoUrl: '', duration: 35, order: 4 },
          ],
        },
      ],
    },
    {
      title: 'AWS Certified Solutions Architect - Associate 2024',
      description: `Pass the AWS Certified Solutions Architect Associate Certification. Master AWS cloud services including EC2, S3, Lambda, DynamoDB, and more.\n\nWelcome to the Ultimate AWS Certified Solutions Architect Associate course!\n\nCloud Computing and AWS are essential skills for modern developers and architects. This comprehensive course covers all the topics needed to pass the AWS Certified Solutions Architect - Associate certification exam.\n\nWith hands-on labs, real-world scenarios, and practice tests, you'll gain both theoretical knowledge and practical experience.`,
      shortDescription: 'Pass the AWS Solutions Architect exam. Full hands-on course covering all AWS services and best practices.',
      instructor: instructors[2]._id,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
      category: 'Cloud Computing',
      level: 'Intermediate',
      tags: ['AWS', 'Cloud', 'DevOps', 'Solutions Architect', 'EC2', 'S3', 'Lambda'],
      price: 99.99,
      isPublished: true,
      enrollmentCount: 456780,
      rating: { average: 4.7, count: 134560 },
      requirements: [
        'No AWS Cloud experience necessary, we will learn it together',
        'A computer with internet access',
        'An AWS Free Tier account (instructions provided)',
      ],
      whatYouWillLearn: [
        'Pass the AWS Certified Solutions Architect Associate exam with confidence',
        'ALL 30+ AWS services covered in depth (EC2, S3, RDS, Lambda, etc.)',
        'Master AWS fundamentals (IAM, VPC, Security Groups)',
        'Design highly available, cost-efficient, fault-tolerant systems',
        'Implement AWS best practices for security and compliance',
        'Hands-on practice with all important AWS services',
        'Understand serverless architectures with Lambda and API Gateway',
        'Create scalable solutions using Auto Scaling and Load Balancers',
      ],
      modules: [
        {
          title: 'AWS Fundamentals',
          order: 1,
          lessons: [
            { title: 'What is Cloud Computing?', videoUrl: '', duration: 12, order: 1 },
            { title: 'AWS Global Infrastructure', videoUrl: '', duration: 15, order: 2 },
            { title: 'IAM - Identity and Access Management', videoUrl: '', duration: 25, order: 3 },
            { title: 'IAM Hands-On Lab', videoUrl: '', duration: 20, order: 4 },
            { title: 'AWS CLI Setup', videoUrl: '', duration: 12, order: 5 },
          ],
        },
        {
          title: 'EC2 - Elastic Compute Cloud',
          order: 2,
          lessons: [
            { title: 'EC2 Basics', videoUrl: '', duration: 15, order: 1 },
            { title: 'EC2 Instance Types', videoUrl: '', duration: 18, order: 2 },
            { title: 'Security Groups', videoUrl: '', duration: 12, order: 3 },
            { title: 'EC2 Purchasing Options', videoUrl: '', duration: 20, order: 4 },
            { title: 'EBS Volumes & AMIs', videoUrl: '', duration: 22, order: 5 },
            { title: 'Auto Scaling Groups', videoUrl: '', duration: 25, order: 6 },
          ],
        },
        {
          title: 'S3 & Storage Solutions',
          order: 3,
          lessons: [
            { title: 'S3 Overview', videoUrl: '', duration: 12, order: 1 },
            { title: 'S3 Bucket Policies', videoUrl: '', duration: 15, order: 2 },
            { title: 'S3 Storage Classes', videoUrl: '', duration: 18, order: 3 },
            { title: 'S3 Lifecycle Policies', videoUrl: '', duration: 14, order: 4 },
            { title: 'CloudFront & Global Accelerator', videoUrl: '', duration: 20, order: 5 },
          ],
        },
        {
          title: 'Serverless & Lambda',
          order: 4,
          lessons: [
            { title: 'Serverless Introduction', videoUrl: '', duration: 10, order: 1 },
            { title: 'Lambda Basics', videoUrl: '', duration: 18, order: 2 },
            { title: 'API Gateway', videoUrl: '', duration: 20, order: 3 },
            { title: 'DynamoDB', videoUrl: '', duration: 22, order: 4 },
            { title: 'Step Functions & SQS', videoUrl: '', duration: 18, order: 5 },
          ],
        },
      ],
    },
    {
      title: 'The Complete Cyber Security Course: Hackers Exposed!',
      description: `Become a Cyber Security Specialist. Learn how to stop hackers, prevent hacking, learn IT security & INFOSEC from a seasoned expert.\n\nVolume 1 of this Cyber Security course is to provide you with a practical and useful skill set to protect yourself from hackers, identity theft, credit card fraud, online scams, and other digital threats.\n\nYou will master all online account security, email security, device and physical security, social engineering, identity theft prevention, online transaction security, and much more.\n\nThis course covers current threats and countermeasures from expert perspectives.`,
      shortDescription: 'Become a Cyber Security Specialist. Learn to stop hackers, prevent hacking, and master IT security fundamentals.',
      instructor: instructors[3]._id,
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
      category: 'Cybersecurity',
      level: 'Beginner',
      tags: ['Cybersecurity', 'Ethical Hacking', 'Network Security', 'Penetration Testing', 'InfoSec'],
      price: 64.99,
      isPublished: true,
      enrollmentCount: 234560,
      rating: { average: 4.5, count: 56780 },
      requirements: [
        'No prior knowledge of cybersecurity is required',
        'A willingness to learn about current digital threats',
        'A computer with internet access',
      ],
      whatYouWillLearn: [
        'An advanced practical skill set in defeating all online threats',
        'Start a career in cyber security with practical knowledge',
        'Understand the threat landscape and vulnerability categories',
        'Master encryption, VPNs, and anonymous browsing',
        'Protect your email, social media, and financial accounts',
        'Implement security policies and incident response plans',
        'Understand network security and firewalls',
        'Prevent identity theft and fraud',
      ],
      modules: [
        {
          title: 'Security Quick Win & Mindset',
          order: 1,
          lessons: [
            { title: 'Goals & Learning Objectives', videoUrl: '', duration: 8, order: 1 },
            { title: 'Threat Landscape', videoUrl: '', duration: 15, order: 2 },
            { title: 'Your Security Posture', videoUrl: '', duration: 12, order: 3 },
            { title: 'Security vs Privacy vs Anonymity', videoUrl: '', duration: 10, order: 4 },
          ],
        },
        {
          title: 'Encryption & VPNs',
          order: 2,
          lessons: [
            { title: 'Symmetric Encryption', videoUrl: '', duration: 18, order: 1 },
            { title: 'Asymmetric Encryption', videoUrl: '', duration: 20, order: 2 },
            { title: 'Hashing & PKI', videoUrl: '', duration: 22, order: 3 },
            { title: 'VPN Types & Setup', videoUrl: '', duration: 25, order: 4 },
            { title: 'TOR & Onion Routing', videoUrl: '', duration: 18, order: 5 },
          ],
        },
        {
          title: 'Network Security',
          order: 3,
          lessons: [
            { title: 'Network Basics', videoUrl: '', duration: 15, order: 1 },
            { title: 'Firewalls & IDS', videoUrl: '', duration: 20, order: 2 },
            { title: 'Wireless Security', videoUrl: '', duration: 18, order: 3 },
            { title: 'Network Attacks & Defenses', videoUrl: '', duration: 25, order: 4 },
          ],
        },
      ],
    },
    {
      title: 'UI/UX Design Bootcamp: Master Figma & Design Thinking',
      description: `Learn UI/UX Design from scratch using Figma. Master Design Thinking, wireframing, prototyping, and build a professional design portfolio.\n\nThis complete UI/UX Design bootcamp will take you from absolute beginner to a professional designer. You'll learn the entire UX process from research and ideation to wireframing, prototyping, and testing.\n\nUsing Figma, the industry-standard design tool, you'll create stunning interfaces that users love. This course includes real-world projects that you can add to your portfolio.\n\nDesign is one of the most in-demand skills in tech, and this course gives you everything you need to start your career.`,
      shortDescription: 'Master UI/UX Design with Figma. Learn Design Thinking, wireframing, prototyping & build a portfolio.',
      instructor: instructors[0]._id,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      category: 'UI/UX Design',
      level: 'Beginner',
      tags: ['UI Design', 'UX Design', 'Figma', 'Prototyping', 'Design Thinking', 'Wireframing'],
      price: 59.99,
      isPublished: true,
      enrollmentCount: 189340,
      rating: { average: 4.7, count: 42380 },
      requirements: [
        'No design experience required',
        'A free Figma account (instructions provided)',
        'Creativity and willingness to learn',
      ],
      whatYouWillLearn: [
        'Master Figma from zero to hero',
        'Apply Design Thinking methodology to real projects',
        'Create wireframes, mockups, and interactive prototypes',
        'Understand color theory, typography, and layout principles',
        'Build a professional design portfolio',
        'Conduct user research and usability testing',
        'Design responsive interfaces for web and mobile',
        'Create a complete design system from scratch',
      ],
      modules: [
        {
          title: 'Design Fundamentals',
          order: 1,
          lessons: [
            { title: 'What is UI/UX Design?', videoUrl: '', duration: 10, order: 1 },
            { title: 'Design Thinking Process', videoUrl: '', duration: 18, order: 2 },
            { title: 'Color Theory', videoUrl: '', duration: 20, order: 3 },
            { title: 'Typography Essentials', videoUrl: '', duration: 15, order: 4 },
            { title: 'Layout & Spacing', videoUrl: '', duration: 12, order: 5 },
          ],
        },
        {
          title: 'Figma Mastery',
          order: 2,
          lessons: [
            { title: 'Figma Interface Tour', videoUrl: '', duration: 15, order: 1 },
            { title: 'Frames and Auto Layout', videoUrl: '', duration: 22, order: 2 },
            { title: 'Components & Variants', videoUrl: '', duration: 25, order: 3 },
            { title: 'Prototyping & Interactions', videoUrl: '', duration: 20, order: 4 },
            { title: 'Design Systems', videoUrl: '', duration: 28, order: 5 },
          ],
        },
        {
          title: 'Real Project: Mobile App Design',
          order: 3,
          lessons: [
            { title: 'User Research & Personas', videoUrl: '', duration: 20, order: 1 },
            { title: 'Information Architecture', videoUrl: '', duration: 15, order: 2 },
            { title: 'Wireframing', videoUrl: '', duration: 25, order: 3 },
            { title: 'High-Fidelity Mockups', videoUrl: '', duration: 30, order: 4 },
            { title: 'Interactive Prototype', videoUrl: '', duration: 20, order: 5 },
            { title: 'Usability Testing', videoUrl: '', duration: 15, order: 6 },
          ],
        },
      ],
    },
    {
      title: 'Digital Marketing Masterclass: Get Your First 1,000 Customers',
      description: `Complete digital marketing course covering SEO, social media marketing, Google Ads, Facebook Ads, email marketing, analytics, and conversion optimization.\n\nLearn the 12 major digital marketing channels, from SEO to social media, from paid advertising to email marketing. This comprehensive course includes real-world case studies and hands-on projects.\n\nWhether you want to grow your own business, start a career in digital marketing, or add marketing skills to your existing skillset, this course covers it all.`,
      shortDescription: 'Complete digital marketing course: SEO, social media, Google Ads, Facebook Ads, email marketing & analytics.',
      instructor: instructors[5]._id,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      category: 'Digital Marketing',
      level: 'Beginner',
      tags: ['SEO', 'Social Media', 'Google Ads', 'Facebook Ads', 'Email Marketing', 'Analytics'],
      price: 54.99,
      isPublished: true,
      enrollmentCount: 145670,
      rating: { average: 4.4, count: 34560 },
      requirements: [
        'No prior marketing knowledge required',
        'A computer and internet connection',
        'Free accounts on social media platforms',
      ],
      whatYouWillLearn: [
        'Create a complete digital marketing strategy from scratch',
        'Master SEO and rank #1 on Google',
        'Run profitable Google Ads and Facebook Ads campaigns',
        'Build an email marketing funnel that converts',
        'Grow your social media following organically',
        'Use Google Analytics to track and optimize performance',
        'Understand content marketing and copywriting fundamentals',
        'Convert website visitors into paying customers',
      ],
      modules: [
        {
          title: 'Digital Marketing Foundations',
          order: 1,
          lessons: [
            { title: 'The Digital Marketing Landscape', videoUrl: '', duration: 12, order: 1 },
            { title: 'Building Your Marketing Strategy', videoUrl: '', duration: 18, order: 2 },
            { title: 'Understanding Your Audience', videoUrl: '', duration: 15, order: 3 },
            { title: 'Setting Up Analytics', videoUrl: '', duration: 20, order: 4 },
          ],
        },
        {
          title: 'SEO Mastery',
          order: 2,
          lessons: [
            { title: 'How Search Engines Work', videoUrl: '', duration: 15, order: 1 },
            { title: 'Keyword Research', videoUrl: '', duration: 22, order: 2 },
            { title: 'On-Page SEO', videoUrl: '', duration: 20, order: 3 },
            { title: 'Link Building Strategies', videoUrl: '', duration: 18, order: 4 },
            { title: 'Technical SEO', videoUrl: '', duration: 15, order: 5 },
          ],
        },
        {
          title: 'Paid Advertising',
          order: 3,
          lessons: [
            { title: 'Google Ads Setup', videoUrl: '', duration: 18, order: 1 },
            { title: 'Campaign Types & Bidding', videoUrl: '', duration: 22, order: 2 },
            { title: 'Facebook & Instagram Ads', videoUrl: '', duration: 25, order: 3 },
            { title: 'Retargeting Strategies', videoUrl: '', duration: 15, order: 4 },
            { title: 'A/B Testing & Optimization', videoUrl: '', duration: 20, order: 5 },
          ],
        },
      ],
    },
    {
      title: 'Docker & Kubernetes: The Complete Guide',
      description: `Build, test, and deploy Docker applications with Kubernetes while learning production-style development workflows.\n\nIf you're tired of spinning your wheels learning how to deploy web applications, this is the course for you.\n\nCI+CD Pipelines? You'll learn it. AWS Deployment? Included. Kubernetes in Production? Of course!\n\nThis is the ultimate course to learn how to deploy any web application you can possibly dream up.`,
      shortDescription: 'Build, test, and deploy Docker apps with Kubernetes. Master CI/CD, AWS deployment & production workflows.',
      instructor: instructors[1]._id,
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
      category: 'DevOps',
      level: 'Advanced',
      tags: ['Docker', 'Kubernetes', 'DevOps', 'CI/CD', 'AWS', 'Containers'],
      price: 79.99,
      isPublished: true,
      enrollmentCount: 267890,
      rating: { average: 4.6, count: 65430 },
      requirements: [
        'Basic knowledge of terminal/command line',
        'Understanding of web development fundamentals',
        'A computer capable of running Docker',
      ],
      whatYouWillLearn: [
        'Learn Docker from scratch, no previous experience required',
        'Master the Docker CLI to inspect and debug running containers',
        'Build a CI/CD pipeline from scratch with GitHub Actions',
        'Understand Kubernetes from the ground up',
        'Build and deploy multi-container applications',
        'Deploy applications to AWS using Elastic Beanstalk and EKS',
        'Implement production-grade workflows',
        'Master Docker Compose for multi-container orchestration',
      ],
      modules: [
        {
          title: 'Docker Fundamentals',
          order: 1,
          lessons: [
            { title: 'Why use Docker?', videoUrl: '', duration: 10, order: 1 },
            { title: 'Docker Setup & Installation', videoUrl: '', duration: 15, order: 2 },
            { title: 'Using the Docker CLI', videoUrl: '', duration: 18, order: 3 },
            { title: 'Building Custom Images', videoUrl: '', duration: 25, order: 4 },
            { title: 'Docker Compose', videoUrl: '', duration: 22, order: 5 },
          ],
        },
        {
          title: 'Production-Grade Workflow',
          order: 2,
          lessons: [
            { title: 'Development Workflow', videoUrl: '', duration: 15, order: 1 },
            { title: 'Multi-Step Docker Builds', videoUrl: '', duration: 20, order: 2 },
            { title: 'GitHub Actions CI/CD', videoUrl: '', duration: 25, order: 3 },
            { title: 'AWS Deployment', videoUrl: '', duration: 30, order: 4 },
          ],
        },
        {
          title: 'Kubernetes',
          order: 3,
          lessons: [
            { title: 'Why Kubernetes?', videoUrl: '', duration: 12, order: 1 },
            { title: 'Pods, Services, Deployments', videoUrl: '', duration: 22, order: 2 },
            { title: 'Managing App State', videoUrl: '', duration: 20, order: 3 },
            { title: 'Persistent Volumes', videoUrl: '', duration: 18, order: 4 },
            { title: 'Helm & HTTPS Setup', videoUrl: '', duration: 25, order: 5 },
            { title: 'Production Deployment', videoUrl: '', duration: 28, order: 6 },
          ],
        },
      ],
    },
  ];

  // calculate totalDuration & totalLessons for each course
  coursesData.forEach(c => {
    let tl = 0, td = 0;
    (c.modules || []).forEach(m => {
      tl += m.lessons.length;
      m.lessons.forEach(l => { td += l.duration || 0; });
    });
    c.totalLessons = tl;
    c.totalDuration = td;
  });

  const courses = await Course.insertMany(coursesData);
  console.log(`📚 ${courses.length} courses created`);

  // update instructors with created courses
  for (const course of courses) {
    await User.findByIdAndUpdate(course.instructor, { $push: { createdCourses: course._id } });
  }

  // ─── Enrollments ─────────────────────────────
  const enrollmentPairs = [
    [0, 0], [0, 2], [0, 4], [0, 7],
    [1, 1], [1, 4], [1, 11],
    [2, 0], [2, 3], [2, 5],
    [3, 2], [3, 9], [3, 6],
    [4, 7], [4, 11], [4, 8],
  ];

  for (const [si, ci] of enrollmentPairs) {
    const progress = Math.floor(Math.random() * 85) + 10;
    const lessonsCompleted = [];
    const c = courses[ci];
    let count = 0;
    const target = Math.floor((progress / 100) * c.totalLessons);
    for (const mod of c.modules) {
      for (const les of mod.lessons) {
        if (count >= target) break;
        lessonsCompleted.push({ moduleId: mod._id, lessonId: les._id, completedAt: new Date(Date.now() - Math.random() * 30 * 86400000) });
        count++;
      }
    }
    await Enrollment.create({
      student: students[si]._id,
      course: c._id,
      progress,
      completedLessons: lessonsCompleted,
      status: progress >= 100 ? 'completed' : 'active',
      lastAccessedAt: new Date(Date.now() - Math.random() * 7 * 86400000),
    });
    await User.findByIdAndUpdate(students[si]._id, { $push: { enrolledCourses: c._id } });
  }

  console.log('📝 Enrollments created');

  // ─── Reviews ─────────────────────────────────
  const reviewData = [
    { si: 0, ci: 0, rating: 5, title: 'Best web dev course I have ever taken', comment: 'Angela explains everything so clearly. The projects are amazing and really help solidify the concepts. I went from zero knowledge to building full-stack apps in weeks. Worth every penny!' },
    { si: 0, ci: 2, rating: 5, title: 'React finally makes sense', comment: 'Max is an incredible instructor. He breaks down complex React concepts into digestible pieces. The hooks section was particularly well done. I feel confident building React apps now.' },
    { si: 0, ci: 4, rating: 4, title: 'Excellent ML foundations', comment: 'Andrew Ng is a legend in the field. The math explanations are thorough but accessible. Only 4 stars because some of the newer techniques like transformers are not covered yet.' },
    { si: 0, ci: 7, rating: 5, title: 'Perfect for AWS certification prep', comment: 'Passed my SA Associate exam on the first try after this course! Max covers all the exam topics comprehensively. The hands-on labs were crucial for understanding real-world scenarios.' },
    { si: 1, ci: 1, rating: 5, title: 'Python + DS masterpiece', comment: 'Jose does a fantastic job covering both Python fundamentals and data science libraries. The Jupyter notebooks provided are invaluable for practice. Matplotlib and Seaborn sections are top-notch.' },
    { si: 1, ci: 4, rating: 5, title: 'Stanford quality education accessible to all', comment: 'This course changed my career trajectory. Andrew Ng has a gift for making complex mathematical concepts intuitive. The programming assignments are challenging but fair.' },
    { si: 1, ci: 11, rating: 4, title: 'Solid Docker and K8s intro', comment: 'Good coverage of containerization basics. The Kubernetes section could use more real-world deployment examples, but overall a very solid foundation for DevOps skills.' },
    { si: 2, ci: 0, rating: 4, title: 'Comprehensive but lengthy', comment: 'Angela is a great teacher and the content is very thorough. My only minor complaint is the course length - some sections could be more concise. But the quality of instruction is undeniable.' },
    { si: 2, ci: 3, rating: 5, title: 'Colt is the GOAT', comment: 'I have tried multiple web dev courses and this one stands out. Colt\'s teaching style is engaging and fun. The color game and YelpCamp projects are incredibly well structured.' },
    { si: 2, ci: 5, rating: 5, title: 'MERN stack done right', comment: 'Brad\'s approach to teaching the MERN stack is practical and project-driven. I built a real social network following along. His coding style is clean and professional.' },
    { si: 3, ci: 2, rating: 4, title: 'Great React course with minor gaps', comment: 'Very thorough coverage of React concepts. The Redux section is excellent. I felt the testing section could have been more in-depth, but overall this is one of the best React courses available.' },
    { si: 3, ci: 9, rating: 5, title: 'Design skills transformed', comment: 'As a developer who always struggled with design, this course was a game changer. Angela teaches design principles in a way that just clicks. My UIs have improved dramatically.' },
    { si: 3, ci: 6, rating: 4, title: 'Great intro to iOS development', comment: 'Angela makes Swift approachable even for beginners. The app projects are fun and practical. Would love to see more content on SwiftUI though.' },
    { si: 4, ci: 7, rating: 4, title: 'Solid AWS preparation', comment: 'Comprehensive coverage of AWS services. The diagrams and visual explanations really help with understanding the architecture. Some sections feel a bit fast-paced for beginners.' },
    { si: 4, ci: 11, rating: 5, title: 'DevOps essentials in one course', comment: 'Everything you need to know about Docker and Kubernetes in one place. Jose explains the concepts well and the hands-on exercises are excellent. Already using these skills at work.' },
    { si: 4, ci: 8, rating: 5, title: 'Essential cybersecurity knowledge', comment: 'Colt covers cybersecurity fundamentals thoroughly. The ethical hacking sections are fascinating and the security best practices are immediately applicable. Highly recommend for any developer.' },
  ];

  for (const rd of reviewData) {
    await Review.create({
      student: students[rd.si]._id,
      course: courses[rd.ci]._id,
      rating: rd.rating,
      title: rd.title,
      comment: rd.comment,
      helpful: Math.floor(Math.random() * 40),
      createdAt: new Date(Date.now() - Math.random() * 90 * 86400000),
    });
  }

  // Recalculate course ratings from reviews
  for (const course of courses) {
    const reviews = await Review.find({ course: course._id });
    if (reviews.length > 0) {
      const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
      await Course.findByIdAndUpdate(course._id, {
        'rating.average': Math.round(avg * 10) / 10,
        'rating.count': reviews.length,
      });
    }
  }

  console.log(`⭐ ${reviewData.length} reviews created`);

  // ─── Add rich content to lessons ─────────────
  console.log('📚 Adding lesson content (descriptions & videos)...');
  const addCourseContent = require('./addCourseContent');
  await addCourseContent();

  console.log('✅ Seed complete!');
  console.log('\n📋 Login credentials (password: password123):');
  console.log('   Student:    student@eduverse.com');
  console.log('   Instructor: angela@eduverse.com');
  console.log('   Admin:      admin@eduverse.com');

  process.exit(0);
};

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
