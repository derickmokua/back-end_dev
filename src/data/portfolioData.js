export const skills = [
  {
    category: "Backend Architecture",
    items: [
      { name: 'Django / FastAPI', level: 95, icon: '⚡' },
      { name: 'Rust', level: 75, icon: '🦀' },
      { name: 'PostgreSQL', level: 90, icon: '🗄️' },
      { name: 'Microservices', level: 85, icon: '🧩' }
    ]
  },
  {
    category: "Security Moat",
    items: [
      { name: 'Zero-Trust Arch.', level: 88, icon: '🛡️' },
      { name: 'System Hardening', level: 92, icon: '🏰' },
      { name: 'AuthZ / OAuth2', level: 90, icon: '🔑' }
    ]
  },
  {
    category: "AI Research",
    items: [
      { name: 'Gemini API', level: 95, icon: '✨' },
      { name: 'Model Evaluation', level: 85, icon: '📊' },
      { name: 'USSD-AI Gateways', level: 80, icon: '📱' },
      { name: 'RAG Pipelines', level: 88, icon: '🧠' }
    ]
  }
];

export const projects = [
  {
    title: 'KukuConnect (Flagship)',
    desc: 'Case Study in Applied AI Safety. Mitigating hallucinations in veterinary diagnostics using Gemini API and RAG, secured by a Zero-Trust data pipeline.',
    tags: ['Gemini API', 'RAG', 'Zero-Trust', 'FastAPI'],
    status: 'Applied Research'
  },
  {
    title: 'Saibae: A Study in Autonomous Agent Alignment',
    desc: 'Technical exploration of constrained behavior and safe user-interaction design in autonomous agents.',
    tags: ['Python', 'Alignment Research', 'NLP'],
    status: 'Active'
  },
  {
    title: 'ALX Travel App',
    desc: 'Robust booking and itinerary management system built for scalability.',
    tags: ['Python', 'Django', 'PostgreSQL'],
    status: 'Production'
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
    title: 'Backend Architecture',
    icon: '⚙️',
    desc: 'Building robust, scalable server-side systems with Django, Rust, and FastAPI.',
    features: ['High-performance APIs', 'Microservices', 'Database Design']
  },
  {
    title: 'AI Safety & Integration',
    icon: '🧠',
    desc: 'Architecting secure, reliable integrations for frontier models.',
    features: ['RAG Pipelines', 'Model Evaluation', 'Prompt Engineering']
  },
  {
    title: 'Security Engineering',
    icon: '🛡️',
    desc: 'Hardening digital infrastructure for high-stakes environments.',
    features: ['Zero-Trust', 'Penetration Testing', 'Secure Audits']
  }
];

export const testimonials = [
  {
    text: "Derick's approach to AI safety in agricultural diagnostics is groundbreaking. He doesn't just build; he secures.",
    name: "Sarah Mitchell",
    initials: "SM",
    role: "Research Director",
    company: "AgriTech Labs"
  },
  {
    text: "The zero-trust pipeline Derick architected for us has saved us from critical data leaks. His security-first mindset is rare.",
    name: "James Omondi",
    initials: "JO",
    role: "CTO",
    company: "DataSecure Kenya"
  },
  {
    text: "Derick bridged the gap between complex AI models and usable USSD interfaces for our farmers.",
    name: "David Kimani",
    initials: "DK",
    role: "Founder",
    company: "FarmConnect"
  },
  {
    text: "A true backend architect. The system handles massive loads without flinching.",
    name: "Maria Santos",
    initials: "MS",
    role: "Lead Engineer",
    company: "CloudFlow"
  }
];

export const blogPosts = [
  {
    title: "Beyond the Perimeter: Why Zero Trust is the New Standard for Modern Security",
    date: "Jan 15, 2026",
    desc: "In the early days of the internet, cybersecurity was built like a medieval castle: thick walls, a moat, and a drawbridge. In today's world of remote work and cloud infrastructure, the castle has no walls.",
    tags: ["Security", "Zero-Trust", "Cybersecurity"],
    link: "https://derickmokua.hashnode.dev/beyond-the-perimeter-why-zero-trust-is-the-new-standard-for-modern-security",
    content: [
      "In the early days of the internet, cybersecurity was built like a medieval castle: thick walls, a deep moat, and a single drawbridge. If you were inside the walls, you were trusted. If you were outside, you weren't. But in today’s world of remote work, mobile devices, and sprawling cloud infrastructures, the 'castle' has no walls.",
      "Zero Trust is a security framework based on the premise: 'Never trust, always verify.' It requires all users, whether inside or outside the organization's network, to be authenticated, authorized, and continuously validated for security configuration and posture before being granted or keeping access to applications and data.",
      "By decoupling access from network location, we enforce micro-segmentation and least-privilege principles, significantly reducing the lateral movement capabilities of potential attackers."
    ]
  },
  {
    title: "Defensive Security: Building Resilient Systems in an Ever-Evolving Threat Landscape",
    date: "Jan 9, 2026",
    desc: "In today's interconnected digital world, organizations face an unprecedented array of cyber threats. We explore defense-in-depth strategies to build truly resilient infrastructures.",
    tags: ["Security", "Defensive Security", "Infrastructure"],
    link: "https://derickmokua.hashnode.dev/defensive-security-building-resilient-systems-in-an-ever-evolving-threat-landscape-1-1",
    content: [
      "In today's interconnected digital world, organizations face an unprecedented array of cyber threats. From sophisticated nation-state attacks to opportunistic ransomware campaigns, the modern threat landscape demands a robust and comprehensive approach to protection. This is where defensive security comes into play-a multifaceted strategy that goes beyond simple firewalls and antivirus software to create truly resilient systems.",
      "Building resilient systems requires defense-in-depth, continuous monitoring, and automated incident response pipelines. We must assume that breach is inevitable and focus on minimizing detection and containment times."
    ]
  },
  {
    title: "Ethical Hacking 101: Understanding the Rules of Engagement and Data Protection",
    date: "Jan 4, 2026",
    desc: "Penetration testing is critical to verifying security posture, but its effectiveness hinges entirely on adhering to strict ethical and legal guidelines.",
    tags: ["Ethical Hacking", "Pentesting", "Security"],
    link: "https://derickmokua.hashnode.dev/ethical-hacking-101-understanding-the-rules-of-engagement-and-data-protection",
    content: [
      "Penetration testing is a critical practice for verifying an organization's security posture. However, its effectiveness hinges entirely on adherence to strict ethical and legal guidelines. Ethical hacking, or pen testing, is not just about finding flaws; it's about doing so responsibly and legally.",
      "Understanding scope, rules of engagement, and safe handling of sensitive target data is paramount for any security assessment. Without proper authorization and planning, pen testing is indistinguishable from malicious activity."
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

export const birthdayConfig = {
  month: 6, // June
  day: 12   // 12th
};
