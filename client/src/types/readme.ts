export interface Skill {
  name: string;
  icon: string;
  category: string;
}

export interface SocialMedia {
  github: string;
  linkedin: string;
  twitter: string;
  devto: string;
  medium: string;
  youtube: string;
  instagram: string;
  facebook: string;
  codepen: string;
  hashnode: string;
}

export interface GitHubStats {
  showStats: boolean;
  showLanguages: boolean;
  showStreak: boolean;
  showTrophy: boolean;
  showVisitors: boolean;
  showActivity: boolean;
  showContributions: boolean;
  showProductivityStats: boolean;
  showWakaTime: boolean;
  showCommitGraph: boolean;
  showCodetime: boolean;
  showMetrics: boolean;
  showSummaryCard: boolean;
  showDetailedStats: boolean;
  statsTheme: string;
  languagesTheme: string;
  wakaTimeUsername: string;
}

export interface BlogPosts {
  showDevtoPosts: boolean;
  showMediumPosts: boolean;
  showRssPosts: boolean;
  rssUrl: string;
}

export interface Achievements {
  showCertifications: boolean;
  certifications: string;
  showEducation: boolean;
  education: string;
  showAwards: boolean;
  awards: string;
}

export interface CustomSections {
  showFunFacts: boolean;
  funFacts: string;
  showGoals: boolean;
  goals: string;
  showQuote: boolean;
  quote: string;
  showTimezone: boolean;
  timezone: string;
  showHobbies: boolean;
  hobbies: string;
}

export interface ReadmeFormData {
  // General Information
  userName: string;
  userBio: string;
  currentWork: string;
  currentLearning: string;
  askAbout: string;
  userEmail: string;
  portfolioUrl: string;
  blogUrl: string;
  location: string;
  pronouns: string;
  
  // Skills
  skills: Skill[];
  
  // Social Media
  social: SocialMedia;
  
  // GitHub Stats
  stats: GitHubStats;
  
  // Blog Posts
  blog: BlogPosts;
  
  // Support
  buyMeCoffeeUsername: string;
  sponsorUrl: string;
  
  // Achievements
  achievements: Achievements;
  
  // Custom Sections
  custom: CustomSections;
}

export const skillCategories = {
  'Programming Languages': [
    { name: 'javascript', icon: 'devicon-javascript-plain', displayName: 'JavaScript' },
    { name: 'typescript', icon: 'devicon-typescript-plain', displayName: 'TypeScript' },
    { name: 'python', icon: 'devicon-python-plain', displayName: 'Python' },
    { name: 'java', icon: 'devicon-java-plain', displayName: 'Java' },
    { name: 'cplusplus', icon: 'devicon-cplusplus-plain', displayName: 'C++' },
    { name: 'csharp', icon: 'devicon-csharp-plain', displayName: 'C#' },
    { name: 'php', icon: 'devicon-php-plain', displayName: 'PHP' },
    { name: 'swift', icon: 'devicon-swift-plain', displayName: 'Swift' },
    { name: 'kotlin', icon: 'devicon-kotlin-plain', displayName: 'Kotlin' },
    { name: 'go', icon: 'devicon-go-plain', displayName: 'Go' },
    { name: 'rust', icon: 'devicon-rust-plain', displayName: 'Rust' },
    { name: 'ruby', icon: 'devicon-ruby-plain', displayName: 'Ruby' },
  ],
  'Frontend Development': [
    { name: 'react', icon: 'devicon-react-original', displayName: 'React' },
    { name: 'angular', icon: 'devicon-angularjs-plain', displayName: 'Angular' },
    { name: 'vuejs', icon: 'devicon-vuejs-plain', displayName: 'Vue.js' },
    { name: 'nextjs', icon: 'devicon-nextjs-original', displayName: 'Next.js' },
    { name: 'svelte', icon: 'devicon-svelte-plain', displayName: 'Svelte' },
    { name: 'html5', icon: 'devicon-html5-plain', displayName: 'HTML5' },
    { name: 'css3', icon: 'devicon-css3-plain', displayName: 'CSS3' },
    { name: 'tailwindcss', icon: 'devicon-tailwindcss-plain', displayName: 'Tailwind CSS' },
    { name: 'bootstrap', icon: 'devicon-bootstrap-plain', displayName: 'Bootstrap' },
  ],
  'Backend Development': [
    { name: 'nodejs', icon: 'devicon-nodejs-plain', displayName: 'Node.js' },
    { name: 'express', icon: 'devicon-express-original', displayName: 'Express' },
    { name: 'django', icon: 'devicon-django-plain', displayName: 'Django' },
    { name: 'flask', icon: 'devicon-flask-original', displayName: 'Flask' },
    { name: 'laravel', icon: 'devicon-laravel-plain', displayName: 'Laravel' },
    { name: 'spring', icon: 'devicon-spring-plain', displayName: 'Spring Boot' },
    { name: 'fastapi', icon: 'devicon-fastapi-plain', displayName: 'FastAPI' },
  ],
  'Mobile App Development': [
    { name: 'react-native', icon: 'devicon-react-original', displayName: 'React Native' },
    { name: 'flutter', icon: 'devicon-flutter-plain', displayName: 'Flutter' },
    { name: 'ionic', icon: 'devicon-ionic-original', displayName: 'Ionic' },
  ],
  'AI/ML': [
    { name: 'tensorflow', icon: 'devicon-tensorflow-original', displayName: 'TensorFlow' },
    { name: 'pytorch', icon: 'devicon-pytorch-original', displayName: 'PyTorch' },
    { name: 'scikit-learn', icon: 'devicon-scikitlearn-plain', displayName: 'Scikit-learn' },
    { name: 'pandas', icon: 'devicon-pandas-original', displayName: 'Pandas' },
    { name: 'numpy', icon: 'devicon-numpy-original', displayName: 'NumPy' },
  ],
  'Database': [
    { name: 'mongodb', icon: 'devicon-mongodb-plain', displayName: 'MongoDB' },
    { name: 'postgresql', icon: 'devicon-postgresql-plain', displayName: 'PostgreSQL' },
    { name: 'mysql', icon: 'devicon-mysql-plain', displayName: 'MySQL' },
    { name: 'sqlite', icon: 'devicon-sqlite-plain', displayName: 'SQLite' },
    { name: 'firebase', icon: 'devicon-firebase-plain', displayName: 'Firebase' },
    { name: 'redis', icon: 'devicon-redis-plain', displayName: 'Redis' },
  ],
  'DevOps': [
    { name: 'docker', icon: 'devicon-docker-plain', displayName: 'Docker' },
    { name: 'kubernetes', icon: 'devicon-kubernetes-plain', displayName: 'Kubernetes' },
    { name: 'jenkins', icon: 'devicon-jenkins-line', displayName: 'Jenkins' },
    { name: 'github-actions', icon: 'devicon-github-original', displayName: 'GitHub Actions' },
    { name: 'terraform', icon: 'devicon-terraform-plain', displayName: 'Terraform' },
    { name: 'aws', icon: 'devicon-amazonwebservices-original', displayName: 'AWS' },
  ],
  'Testing': [
    { name: 'jest', icon: 'devicon-jest-plain', displayName: 'Jest' },
    { name: 'cypress', icon: 'devicon-cypress-plain', displayName: 'Cypress' },
    { name: 'selenium', icon: 'devicon-selenium-original', displayName: 'Selenium' },
  ],
  'Software & Tools': [
    { name: 'git', icon: 'devicon-git-plain', displayName: 'Git' },
    { name: 'vscode', icon: 'devicon-vscode-plain', displayName: 'VS Code' },
    { name: 'figma', icon: 'devicon-figma-plain', displayName: 'Figma' },
    { name: 'postman', icon: 'devicon-postman-plain', displayName: 'Postman' },
  ],
};
