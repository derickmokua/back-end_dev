export const skills = [
  { name: 'Python', level: 95, icon: '🐍' },
  { name: 'FastAPI / Django', level: 90, icon: '⚡' },
  { name: 'Backend Architecture', level: 88, icon: '🏗️' },
  { name: 'PostgreSQL / MySQL', level: 85, icon: '🗄️' },
  { name: 'Docker & CI/CD', level: 80, icon: '🐳' },
  { name: 'API Design', level: 92, icon: '🔌' }
];

export const projects = [
  {
    title: 'Saibae AI Agent',
    desc: 'Context-aware AI assistant built with Python & LLMs.',
    tags: ['Python', 'AI', 'FastAPI'],
    status: 'Active'
  },
  {
    title: 'ALX Travel App',
    desc: 'A robust booking and itinerary management system built for scalability.',
    tags: ['Python', 'Django', 'PostgreSQL'],
    status: 'Production'
  },
  {
    title: 'Poultry Management API',
    desc: 'Bespoke API for livestock tracking, analytics, and resource optimization.',
    tags: ['FastAPI', 'Analytics', 'React'],
    status: 'Live'
  },
  {
    title: 'Secure API Gateway',
    desc: 'High-performance gateway handling auth, rate-limiting, and routing.',
    tags: ['Node.js', 'Redis', 'Docker'],
    status: 'Production'
  }
];

export const services = [
  {
    title: 'Backend Development',
    icon: '⚙️',
    desc: 'Building robust, scalable server-side applications with Python & Node.js',
    features: ['API Design', 'Microservices', 'Database Architecture']
  },
  {
    title: 'System Architecture',
    icon: '🏗️',
    desc: 'Designing resilient infrastructure for high-load applications',
    features: ['Cloud Deployment', 'Dockerization', 'CI/CD Pipelines']
  },
  {
    title: 'API Integration',
    icon: '🔌',
    desc: 'Seamlessly connecting services and third-party tools',
    features: ['Payment Gateways', 'AI Integration', 'Real-time Data']
  }
];

export const testimonials = [
  {
    text: "Derick's backend architecture scaled effortlessly as our user base grew. His attention to database optimization is unmatched.",
    name: "Sarah Mitchell",
    initials: "SM",
    role: "CTO",
    company: "TechStart Inc."
  },
  {
    text: "The API Derick designed for us is rock-solid. Documentation, error handling, and performance are all top-tier.",
    name: "James Omondi",
    initials: "JO",
    role: "Head of Engineering",
    company: "DataSecure Kenya"
  },
  {
    text: "A developer who actually understands deployment. Derick set up our CI/CD pipelines and Docker containers perfectly.",
    name: "Maria Santos",
    initials: "MS",
    role: "Product Manager",
    company: "CloudFlow Solutions"
  },
  {
    text: "Working with Derick on our inventory system API was a breeze. He delivers clean, maintainable code.",
    name: "David Kimani",
    initials: "DK",
    role: "Founder & CEO",
    company: "AgriTech Africa"
  }
];

export const blogPosts = [
  {
    title: "Deconstructing the Latest Zero-Day Exploit",
    date: "Oct 15, 2025",
    desc: "A deep dive into the technical details of the recent CVE-2025-XXXX vulnerability and how we mitigated it.",
    tags: ["Cybersecurity", "Exploit", "Analysis"],
    content: [
      "The discovery of CVE-2025-XXXX sent shockwaves through the InfoSec community. It wasn't just another buffer overflow; it was a sophisticated logic flaw in a widely used authentication protocol. In this post, I'll walk you through the exploit chain, from initial discovery to reliable execution.",
      "The vulnerability stems from a race condition in the session validation logic. By flooding the auth endpoint with concurrent requests using a specific timing vector, an attacker could trick the server into issuing a valid session token for an arbitrary user ID.",
      "Our mitigation strategy involved implementing a strict mutex lock on the validation routine and introducing a cryptographically secure nonce for every handshake. This effectively neutralized the race condition without impacting performance.",
      "Remember: complexity is the enemy of security. The more intricate your state management, the more hiding spots for bugs like this one."
    ]
  },
  {
    title: "Building a Secure API with Node.js and JWT",
    date: "Sep 28, 2025",
    desc: "Step-by-step guide on implementing robust authentication and authorization using JSON Web Tokens.",
    tags: ["Node.js", "Security", "Backend"],
    content: [
      "Authentication is the gatekeeper of your application. Get it wrong, and nothing else matters. Today, we're building a production-ready authentication system using Node.js, Express, and JSON Web Tokens (JWT).",
      "We'll start by defining our schema. Storing passwords? Never. We'll use Argon2 for hashing, as it provides superior resistance to GPU-based cracking attempts compared to bcrypt.",
      "Next, the JWT strategy. We'll implement short-lived access tokens (15 minutes) paired with rotating refresh tokens stored in HTTP-only cookies. This prevents XSS attacks from stealing tokens while mitigating the risk of CSRF.",
      "Finally, let's talk about middleware. We'll write a custom 'authorize' middleware that validates the token signature, checks for revocation in Redis, and attaches the user context to the request object."
    ]
  },
  {
    title: "My Penetration Testing Workflow",
    date: "Sep 10, 2025",
    desc: "An overview of the tools, techniques, and methodologies I use to uncover critical vulnerabilities.",
    tags: ["Pentesting", "Workflow", "Tools"],
    content: [
      "Every penetration test is a new puzzle, but a consistent workflow is what separates the pros from the script kiddies. My process follows the PTES standard but tweaked for modern web architectures.",
      "Reconnaissance is 90% of the work. I start with passive subdomain enumeration using Amass and Subfinder, followed by active probing with Nmap and masscan. The goal is to maximize the attack surface before sending a single exploit.",
      "For web apps, Burp Suite Pro is my command center. I rely heavily on custom extensions to hunt for IDORs and business logic flaws—vulnerabilities that automated scanners usually miss.",
      "Reporting is the final, critical step. A vulnerability isn't fixed until the developer understands it. I prioritize writing clear, reproducible proof-of-concept exploits along with pragmatic remediation advice."
    ]
  }
];

export const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Blog', href: '#blog' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' }
];

export const typewriterLines = [
  '┌──(derick㉿kali)-[~/portfolio]',
  '└─$ whoami',
  '└─$ cat role.txt',
  '└─$ ls skills/',
  '└─$ ./projects.sh',
  '└─$ cat posts/latest.md',
  '└─$ ./connect.sh'
];
