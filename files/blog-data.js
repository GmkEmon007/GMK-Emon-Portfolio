/* =======================================================
   GMK Emon Portfolio — blog-data.js
   Dynamic structured content block database for SPA blog.
   ======================================================= */

window.BLOG_POSTS = [
  {
    slug: "building-my-portfolio",
    title: "How I Designed and Built My Portfolio",
    excerpt: "Inside the design and architectural choices of my custom high-conversion portfolio.",
    category: "Web Design",
    date: "2026-08-17",
    readingTime: 6,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    featured: true,
    tags: ["Web Design", "Development"],
    takeaways: [
      "Keep design elements aligned with core business conversion goals.",
      "Custom vanilla setups beat heavy libraries for speed and Lighthouse scores.",
      "Motion should guide focus, not overwhelm the visitor."
    ],
    content: [
      { type: "paragraph", text: "When building my portfolio, my goal was clear: create a fast, premium, high-conversion landing page that positions me as a specialized freelancer. I wanted to focus on utility, performance, and strong typographic hierarchy." },
      { type: "heading", level: 2, text: "The Core Philosophy" },
      { type: "paragraph", text: "I chose to pull back from the standard dashboard layouts and focus on editorial styling. The design system leverages a dark Obsidian-Black canvas (#080a09) combined with bright Neon-Mint accents (#05f394) to build a distinct technical identity." },
      { type: "quote", text: "A portfolio is not a playground; it is a sales funnel for your services." },
      { type: "paragraph", text: "Rather than using a heavy framework like React or Next.js, I opted for vanilla HTML5, CSS3, and ES6 JavaScript. This keeps the bundle size under 80KB and yields near-perfect Lighthouse scores, preventing bounce rates from slow page loads." }
    ]
  },
  {
    slug: "wordpress-workflow",
    title: "My Workflow for Building WordPress Websites",
    excerpt: "How I build blazing fast WordPress websites optimized for conversions and core web vitals.",
    category: "WordPress",
    date: "2026-08-10",
    readingTime: 5,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    featured: false,
    tags: ["WordPress", "Workflow"],
    takeaways: [
      "Always design mobile-first to ensure responsive performance.",
      "Minimize plugin overhead to keep pages light.",
      "Implement strong caching policies from day one."
    ],
    content: [
      { type: "paragraph", text: "WordPress is a powerful tool, but it is often bogged down by massive page builders and excessive plugins. My custom workflow ensures that I ship lightweight WordPress platforms optimized for speed and conversion." },
      { type: "heading", level: 2, text: "Custom Themes vs Page Builders" },
      { type: "paragraph", text: "I build my themes using a hybrid Gutenberg approach or clean starter structures. This ensures that only the required CSS and JS are loaded for any given component, maintaining sub-second loading times." }
    ]
  },
  {
    slug: "figma-to-production",
    title: "From Figma to Production",
    excerpt: "My step-by-step pipeline for translating design frames into responsive code without loss of detail.",
    category: "Web Design",
    date: "2026-08-01",
    readingTime: 7,
    image: "https://images.unsplash.com/photo-1581291518655-9523c932ded7?auto=format&fit=crop&w=800&q=80",
    featured: false,
    tags: ["Design", "Figma", "Web Design"],
    takeaways: [
      "Export absolute assets cleanly as SVG to preserve crispness.",
      "Use viewport units and CSS grid variables for fluid scaling.",
      "Document typographic breakpoints in style sheets from the start."
    ],
    content: [
      { type: "paragraph", text: "Translating static designs from Figma to functional code can introduce detail drift if not handled methodically. In this article, I layout my pipeline for preserving typography and layout consistency." },
      { type: "heading", level: 2, text: "The Transition Pipeline" },
      { type: "paragraph", text: "By using fluid CSS variables, container queries, and structured utility layout tokens, I ensure that the web page matches Figma dimensions down to the pixel." }
    ]
  },
  {
    slug: "lessons-client-projects",
    title: "5 Lessons From Real Client Projects",
    excerpt: "Important lessons learned from managing freelance clients, scoping projects, and managing expectations.",
    category: "Learning",
    date: "2026-07-25",
    readingTime: 6,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    featured: false,
    tags: ["Freelancing", "Learning"],
    takeaways: [
      "Under-promise and over-deliver to secure long-term client relations.",
      "Establish strict project scopes early to avoid scope creep.",
      "Maintain active communication to eliminate client anxiety."
    ],
    content: [
      { type: "paragraph", text: "Freelance work is about business outcomes, not just code. Working on production client systems has taught me how to align engineering choices with actual client revenue goals." },
      { type: "heading", level: 2, text: "Scoping and Project Scars" },
      { type: "paragraph", text: "Projects frequently derail due to communication breakdowns rather than technical failures. Having a clean process and a single collaboration thread changes everything." }
    ]
  },
  {
    slug: "roadmap-ai-ml-engineering",
    title: "My Roadmap Toward AI/ML Engineering",
    excerpt: "A deep dive into my current self-study and university roadmap for mastering ML algorithms.",
    category: "AI & ML",
    date: "2026-07-15",
    readingTime: 8,
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
    featured: false,
    tags: ["AI & ML", "Roadmap"],
    takeaways: [
      "Master linear algebra and multivariable calculus fundamentals first.",
      "Understand the mechanics of neural networks before using abstractions.",
      "Apply algorithms directly to real physical sensor data."
    ],
    content: [
      { type: "paragraph", text: "Mastering machine learning is a long journey of theoretical study and practical application. I've designed a structured path focusing on mathematical foundations and real-world signal data processing." },
      { type: "heading", level: 2, text: "The Theoretical Core" },
      { type: "paragraph", text: "Instead of jumping straight into deep learning APIs, understanding the mathematical structures behind regression, clustering, and optimizer convergence is essential for writing robust code." }
    ]
  },
  {
    slug: "first-ml-projects",
    title: "What I Learned From My First ML Projects",
    excerpt: "Insights from designing ECG classification and clinical risk metrics models.",
    category: "AI & ML",
    date: "2026-07-05",
    readingTime: 5,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    featured: false,
    tags: ["AI & ML", "PyTorch"],
    takeaways: [
      "Data preprocessing is 80% of the effort in ML pipelines.",
      "Beware of overfitting on small clinical datasets.",
      "Explainability is key for clinical acceptance."
    ],
    content: [
      { type: "paragraph", text: "Applying machine learning algorithms to healthcare data is incredibly educational. Working with ECG data streams highlights the importance of clean signal processing and robust model generalization." },
      { type: "heading", level: 2, text: "Handling Real-World Data" },
      { type: "paragraph", text: "Real medical readings contain massive amounts of baseline drift and patient variance. Preprocessing datasets using bandpass filters is vital before feeding them to convolutional networks." }
    ]
  },
  {
    slug: "building-ai-saas",
    title: "Building an AI-Powered SaaS",
    excerpt: "A tutorial on how to wire Next.js with a FastAPI backend to serve model predictions.",
    category: "Development",
    date: "2026-06-20",
    readingTime: 7,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    featured: false,
    tags: ["Next.js", "FastAPI", "Development"],
    takeaways: [
      "Decouple model endpoints to prevent blocking main backend logic.",
      "Use serverless architectures for scalable inference nodes.",
      "Implement proper rate limiting on intensive model routes."
    ],
    content: [
      { type: "paragraph", text: "Serving AI predictions quickly requires a decoupled system design. In this tutorial, I outline a scalable architecture using Next.js for UI presentation and a FastAPI service for handling inputs." },
      { type: "heading", level: 2, text: "Decoupled Architecture" },
      { type: "paragraph", text: "By isolating machine learning services behind simple REST APIs, you can optimize, containerize, and scale prediction containers without affecting core database operations." }
    ]
  },
  {
    slug: "exploring-multimodal-ai",
    title: "Why I'm Exploring Multimodal AI",
    excerpt: "A look at the future of machine learning where models process tabular, text, and visual data simultaneously.",
    category: "AI & ML",
    date: "2026-06-10",
    readingTime: 6,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    featured: false,
    tags: ["AI & ML", "Research"],
    takeaways: [
      "Real intelligence combines multiple input modalities.",
      "Tabular data and visual signal embeddings can be joined dynamically.",
      "Early fusion models provide rich, contextual outputs."
    ],
    content: [
      { type: "paragraph", text: "Single-modality models are limited when tackling complex tasks. Multimodal artificial intelligence combines clinical logs, sensory data, and text annotations to make accurate predictions." },
      { type: "heading", level: 2, text: "Early and Late Fusion" },
      { type: "paragraph", text: "Fusing data embeddings early at the feature level yields richer contextual understandings than simply combining separate model probability scores at the output layer." }
    ]
  },
  {
    slug: "better-presentation-decks",
    title: "Designing Better Presentation Decks",
    excerpt: "How to use layout hierarchy, typography contrast, and visual rhythm to design winning decks.",
    category: "Design",
    date: "2026-05-28",
    readingTime: 5,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
    featured: false,
    tags: ["Design", "Typography"],
    takeaways: [
      "Focus on one single message per presentation slide.",
      "Maintain a 60-30-10 color proportion rule for slides.",
      "Whitespace is as important as the presentation copy."
    ],
    content: [
      { type: "paragraph", text: "Presentation decks are visual arguments. Designing them requires high typographic contrast and layout hierarchy to keep audiences engaged and focused on the key message." },
      { type: "heading", level: 2, text: "Layout Hierarchy" },
      { type: "paragraph", text: "Avoid stuffing slides with walls of bullet points. Use clean typography, large headings, and high visual contrast to guide the viewer's eye where it matters." }
    ]
  },
  {
    slug: "balance-university-freelancing",
    title: "Lessons From University, Freelancing & Projects",
    excerpt: "Practical time management tactics for balancing computer science coursework with active client work.",
    category: "Learning",
    date: "2026-05-15",
    readingTime: 6,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    featured: false,
    tags: ["Learning", "Freelancing"],
    takeaways: [
      "Time blocking is vital to prevent context switching.",
      "Define strict time limits for university and business tasks.",
      "Work in sprints to maximize focus and avoid burnout."
    ],
    content: [
      { type: "paragraph", text: "Balancing active computer science coursework alongside production client commitments requires strict calendar management and focus." },
      { type: "heading", level: 2, text: "Time Blocking and Boundaries" },
      { type: "paragraph", text: "Setting specific boundaries for business and school commitments guarantees that client deliveries are met without compromising academic scores." }
    ]
  }
];
