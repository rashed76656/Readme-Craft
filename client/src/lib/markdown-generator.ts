import { ReadmeFormData } from '@/types/readme';

export function generateMarkdown(data: ReadmeFormData): string {
  let markdown = '';

  // Add colorful gradient background wrapper
  markdown += `<div align="center">\n`;
  markdown += `<img width="100%" height="300" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,2,5,30&height=300&section=header&text=${encodeURIComponent(data.userName || 'GitHub Profile')}&fontSize=90&fontColor=fff&animation=fadeIn&fontAlignY=38&desc=${encodeURIComponent(data.userBio || '')}&descAlignY=51&descAlign=62">\n`;
  markdown += `</div>\n\n`;

  // Header section with animated typing effect and gradient styling
  if (data.userName) {
    markdown += `<div align="center">\n`;
    markdown += `<h1><img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=75&duration=1500&pause=1000&multiline=true&width=1200&height=140&lines=Hi+👋,+I'm+${encodeURIComponent(data.userName)}" alt="Typing SVG" /></h1>\n`;
    if (data.pronouns) {
      markdown += `<h3 style="color: #667eea;">(${data.pronouns})</h3>\n`;
    }
    markdown += `</div>\n\n`;
  }

  // Colorful info section
  markdown += `<div align="center">\n`;
  markdown += `<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&size=35&center=true&vCenter=true&width=1000&lines=${encodeURIComponent(data.userBio || 'Passionate Developer')}" alt="Typing SVG" />\n`;
  
  if (data.location) {
    markdown += `<br/>\n`;
    markdown += `<img src="https://img.shields.io/badge/📍_Location-${encodeURIComponent(data.location)}-667eea?style=for-the-badge&labelColor=764ba2" />\n`;
  }

  if (data.custom?.showTimezone && data.custom?.timezone) {
    markdown += `<br/>\n`;
    markdown += `<img src="https://img.shields.io/badge/🕒_Timezone-${encodeURIComponent(data.custom.timezone)}-43e97b?style=for-the-badge&labelColor=38f9d7" />\n`;
  }
  
  markdown += `</div>\n\n`;

  // Colorful About Me section with gradient background
  const aboutItems: string[] = [];

  if (data.currentWork) {
    const workItems = data.currentWork.split('\n').filter(item => item.trim());
    workItems.forEach(item => {
      if (item.includes('|')) {
        const [name, link] = item.split('|').map(s => s.trim());
        aboutItems.push(`<img src="https://img.shields.io/badge/🔭_Currently_Working_On-${encodeURIComponent(name)}-667eea?style=for-the-badge&logo=github&logoColor=white&labelColor=764ba2&link=${encodeURIComponent(link)}" />`);
      } else {
        aboutItems.push(`<img src="https://img.shields.io/badge/🔭_Currently_Working_On-${encodeURIComponent(item.trim())}-667eea?style=for-the-badge&logo=code&logoColor=white&labelColor=764ba2" />`);
      }
    });
  }

  if (data.currentLearning) {
    const learningItems = data.currentLearning.split('\n').filter(item => item.trim());
    learningItems.forEach(item => {
      aboutItems.push(`<img src="https://img.shields.io/badge/🌱_Currently_Learning-${encodeURIComponent(item.trim())}-43e97b?style=for-the-badge&logo=book&logoColor=white&labelColor=38f9d7" />`);
    });
  }

  if (data.askAbout) {
    const askItems = data.askAbout.split('\n').filter(item => item.trim());
    askItems.forEach(item => {
      aboutItems.push(`<img src="https://img.shields.io/badge/💬_Ask_Me_About-${encodeURIComponent(item.trim())}-f093fb?style=for-the-badge&logo=chat&logoColor=white&labelColor=f5576c" />`);
    });
  }

  if (data.userEmail) {
    aboutItems.push(`<img src="https://img.shields.io/badge/📫_Contact-${encodeURIComponent(data.userEmail)}-4facfe?style=for-the-badge&logo=gmail&logoColor=white&labelColor=00f2fe" />`);
  }

  if (data.portfolioUrl) {
    aboutItems.push(`<img src="https://img.shields.io/badge/📄_Portfolio-View_My_Work-667eea?style=for-the-badge&logo=portfolio&logoColor=white&labelColor=764ba2" />`);
  }

  if (data.blogUrl) {
    aboutItems.push(`<img src="https://img.shields.io/badge/📝_Blog-Read_My_Articles-43e97b?style=for-the-badge&logo=blogger&logoColor=white&labelColor=38f9d7" />`);
  }

  if (aboutItems.length > 0) {
    markdown += `<div align="center">\n\n`;
    aboutItems.forEach(item => {
      markdown += `${item}\n<br/>\n`;
    });
    markdown += `\n</div>\n\n`;
  }

  // Colorful social media section
  const socialLinks: string[] = [];
  const socialPlatforms = [
    { key: 'github', name: 'GitHub', url: 'https://github.com/', color: '333' },
    { key: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/in/', color: '0077B5' },
    { key: 'twitter', name: 'Twitter', url: 'https://twitter.com/', color: '1DA1F2' },
    { key: 'devto', name: 'Dev.to', url: 'https://dev.to/', color: '0A0A0A' },
    { key: 'medium', name: 'Medium', url: 'https://medium.com/@', color: '12100E' },
    { key: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/c/', color: 'FF0000' },
    { key: 'instagram', name: 'Instagram', url: 'https://instagram.com/', color: 'E4405F' },
    { key: 'facebook', name: 'Facebook', url: 'https://fb.com/', color: '1877F2' },
    { key: 'codepen', name: 'CodePen', url: 'https://codepen.io/', color: '000000' },
    { key: 'hashnode', name: 'Hashnode', url: 'https://hashnode.com/@', color: '2962FF' },
  ];

  socialPlatforms.forEach(platform => {
    const username = data.social[platform.key as keyof typeof data.social];
    if (username) {
      socialLinks.push(
        `<a href="${platform.url}${username}" target="_blank"><img src="https://img.shields.io/badge/${platform.name}-${encodeURIComponent(username)}-${platform.color}?style=for-the-badge&logo=${platform.key}&logoColor=white" alt="${platform.name}" /></a>`
      );
    }
  });

  if (socialLinks.length > 0) {
    markdown += `<div align="center">\n<h2>🌐 Connect with me</h2>\n<br/>\n`;
    socialLinks.forEach(link => {
      markdown += `${link}\n`;
    });
    markdown += `</div>\n\n`;
  }

  // Colorful Skills section with animated icons
  if (data.skills && data.skills.length > 0) {
    markdown += `<div align="center">\n`;
    markdown += `<h2>🛠️ Languages and Tools</h2>\n<br/>\n`;
    markdown += `<div>\n`;
    
    data.skills.forEach(skill => {
      // Create colorful skill badges
      const colors = ['667eea', '764ba2', '43e97b', '38f9d7', 'f093fb', 'f5576c', '4facfe', '00f2fe'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const skillName = skill.name.charAt(0).toUpperCase() + skill.name.slice(1);
      
      markdown += `<img src="https://img.shields.io/badge/${skillName}-${randomColor}?style=for-the-badge&logo=${skill.name}&logoColor=white" alt="${skillName}" />\n`;
    });
    
    markdown += `</div>\n</div>\n\n`;
    
    // Add animated skill icons
    markdown += `<div align="center">\n`;
    markdown += `<img src="https://skillicons.dev/icons?i=`;
    const skillNames = data.skills.map(skill => skill.name).join(',');
    markdown += `${skillNames}&theme=dark" alt="Skills" />\n`;
    markdown += `</div>\n\n`;
  }

  // Custom sections
  if (data.custom?.showQuote && data.custom?.quote) {
    markdown += `<div align="center">\n<blockquote>\n<h3>"${data.custom.quote}"</h3>\n</blockquote>\n</div>\n\n`;
  }

  // Achievements section
  if (data.achievements?.showEducation && data.achievements?.education) {
    markdown += `## 🎓 Education\n${data.achievements.education}\n\n`;
  }

  if (data.achievements?.showCertifications && data.achievements?.certifications) {
    const certList = data.achievements.certifications.split('\n').filter(cert => cert.trim());
    if (certList.length > 0) {
      markdown += `## 📜 Certifications\n`;
      certList.forEach(cert => {
        markdown += `- ${cert.trim()}\n`;
      });
      markdown += `\n`;
    }
  }

  if (data.achievements?.showAwards && data.achievements?.awards) {
    const awardList = data.achievements.awards.split('\n').filter(award => award.trim());
    if (awardList.length > 0) {
      markdown += `## 🏆 Awards & Recognition\n`;
      awardList.forEach(award => {
        markdown += `- ${award.trim()}\n`;
      });
      markdown += `\n`;
    }
  }

  // Custom Fun Facts
  if (data.custom?.showFunFacts && data.custom?.funFacts) {
    const factList = data.custom.funFacts.split('\n').filter(fact => fact.trim());
    if (factList.length > 0) {
      markdown += `## ⚡ Fun Facts\n`;
      factList.forEach(fact => {
        markdown += `- ${fact.trim()}\n`;
      });
      markdown += `\n`;
    }
  }

  // Goals section
  if (data.custom?.showGoals && data.custom?.goals) {
    const goalList = data.custom.goals.split('\n').filter(goal => goal.trim());
    if (goalList.length > 0) {
      markdown += `## 🎯 Current Goals\n`;
      goalList.forEach(goal => {
        markdown += `- ${goal.trim()}\n`;
      });
      markdown += `\n`;
    }
  }

  // Hobbies section
  if (data.custom?.showHobbies && data.custom?.hobbies) {
    const hobbyList = data.custom.hobbies.split('\n').filter(hobby => hobby.trim());
    if (hobbyList.length > 0) {
      markdown += `## 🎨 Hobbies & Interests\n`;
      hobbyList.forEach(hobby => {
        markdown += `- ${hobby.trim()}\n`;
      });
      markdown += `\n`;
    }
  }

  // GitHub stats with modern analytics
  const githubUsername = data.social.github;
  if (githubUsername) {
    const statsTheme = data.stats.statsTheme !== 'default' ? `&theme=${data.stats.statsTheme}` : '';
    const languagesTheme = data.stats.languagesTheme !== 'default' ? `&theme=${data.stats.languagesTheme}` : '';

    // Modern stats wrapper
    markdown += `<div align="center">\n<h2>📊 GitHub Analytics & Statistics</h2>\n<br/>\n</div>\n\n`;

    // GitHub Stats Card
    if (data.stats.showStats) {
      markdown += `<div align="center">\n<img src="https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&locale=en${statsTheme}&hide_border=true&bg_color=0D1117&title_color=58A6FF&text_color=C9D1D9&icon_color=F0883E" alt="${githubUsername}" />\n</div>\n\n`;
    }

    // Top Languages with enhanced styling
    if (data.stats.showLanguages) {
      markdown += `<div align="center">\n<img src="https://github-readme-stats.vercel.app/api/top-langs?username=${githubUsername}&show_icons=true&locale=en&layout=compact${languagesTheme}&hide_border=true&bg_color=0D1117&title_color=58A6FF&text_color=C9D1D9" alt="${githubUsername}" />\n</div>\n\n`;
    }

    // GitHub Streak with modern styling
    if (data.stats.showStreak) {
      markdown += `<div align="center">\n<img src="https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}${statsTheme}&hide_border=true&background=0D1117&ring=58A6FF&fire=F0883E&currStreakLabel=C9D1D9" alt="${githubUsername}" />\n</div>\n\n`;
    }

    // Modern Activity Graph
    if (data.stats.showActivity) {
      markdown += `<div align="center">\n<img src="https://github-readme-activity-graph.vercel.app/graph?username=${githubUsername}${statsTheme}&hide_border=true&area=true&bg_color=0D1117&color=58A6FF&line=F0883E&point=C9D1D9" alt="${githubUsername}" />\n</div>\n\n`;
    }

    // Advanced Metrics
    if (data.stats.showMetrics) {
      markdown += `<div align="center">\n`;
      markdown += `<img src="https://metrics.lecoq.io/${githubUsername}?template=classic&base.header=0&base.activity=0&base.community=0&base.repositories=0&base.metadata=0&languages=1&lines=1&habits=1&followup=1&people=1&config.timezone=America%2FNew_York" alt="Metrics" />\n`;
      markdown += `</div>\n\n`;
    }

    // Productivity Stats
    if (data.stats.showProductivityStats) {
      markdown += `<div align="center">\n`;
      markdown += `<img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${githubUsername}&theme=github_dark" alt="Profile Details" />\n`;
      markdown += `<br/><br/>\n`;
      markdown += `<img src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=${githubUsername}&theme=github_dark" alt="Repos per Language" />\n`;
      markdown += `<img src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=${githubUsername}&theme=github_dark" alt="Most Commit Language" />\n`;
      markdown += `</div>\n\n`;
    }

    // 3D Commit Graph
    if (data.stats.showCommitGraph) {
      markdown += `<div align="center">\n`;
      markdown += `<img src="https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&count_private=true&hide_rank=true&custom_title=My%20GitHub%20Stats&disable_animations=false&theme=vision-friendly-dark" alt="3D Stats" />\n`;
      markdown += `</div>\n\n`;
    }

    // Summary Card
    if (data.stats.showSummaryCard) {
      markdown += `<div align="center">\n`;
      markdown += `<img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${githubUsername}&theme=monokai" alt="Summary Card" />\n`;
      markdown += `</div>\n\n`;
    }

    // Detailed Statistics
    if (data.stats.showDetailedStats) {
      markdown += `<div align="center">\n`;
      markdown += `<img src="https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&count_private=true&include_all_commits=true&line_height=20&title_color=7A7ADB&icon_color=2234AE&text_color=D3D3D3&bg_color=0,000000,130F40" alt="Detailed Stats" />\n`;
      markdown += `</div>\n\n`;
    }

    // WakaTime Integration
    if (data.stats.showWakaTime && data.stats.wakaTimeUsername) {
      markdown += `<div align="center">\n`;
      markdown += `<h3>⏰ Weekly Development Breakdown</h3>\n`;
      markdown += `<img src="https://github-readme-stats.vercel.app/api/wakatime?username=${data.stats.wakaTimeUsername}${statsTheme}&hide_border=true&bg_color=0D1117&title_color=58A6FF&text_color=C9D1D9" alt="WakaTime Stats" />\n`;
      markdown += `</div>\n\n`;
    }

    // Coding Time Summary
    if (data.stats.showCodetime) {
      markdown += `<div align="center">\n`;
      markdown += `<img src="https://github-readme-stats.vercel.app/api/pin/?username=${githubUsername}&repo=github-readme-stats&theme=dark&show_owner=true" alt="Coding Time" />\n`;
      markdown += `</div>\n\n`;
    }

    // GitHub Trophies with enhanced styling
    if (data.stats.showTrophy) {
      markdown += `<div align="center">\n<img src="https://github-profile-trophy.vercel.app/?username=${githubUsername}&theme=darkhub&no-frame=true&no-bg=false&margin-w=4&row=2&column=4" alt="${githubUsername}" />\n</div>\n\n`;
    }

    // Enhanced Contribution Snake
    if (data.stats.showContributions) {
      markdown += `<div align="center">\n<img src="https://raw.githubusercontent.com/${githubUsername}/${githubUsername}/output/github-contribution-grid-snake-dark.svg" alt="Snake animation" />\n</div>\n\n`;
    }
  }

  // Blog posts section
  if (data.blog.showDevtoPosts || data.blog.showMediumPosts || data.blog.showRssPosts) {
    markdown += `### 📝 Latest Blog Posts\n<!-- BLOG-POST-LIST:START -->\n<!-- BLOG-POST-LIST:END -->\n\n`;
  }

  // Support section
  const supportLinks = [];
  if (data.buyMeCoffeeUsername) {
    supportLinks.push(`<a href="https://www.buymeacoffee.com/${data.buyMeCoffeeUsername}"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="Buy Me A Coffee" /></a>`);
  }
  if (data.sponsorUrl) {
    supportLinks.push(`<a href="${data.sponsorUrl}"><img src="https://img.shields.io/badge/Sponsor-❤️-red?style=for-the-badge" alt="Sponsor" /></a>`);
  }
  
  if (supportLinks.length > 0) {
    markdown += `## ☕️ Support Me\n<div align="center">\n${supportLinks.join('\n')}\n</div>\n\n`;
  }

  // Colorful visitor count
  if (data.stats.showVisitors && githubUsername) {
    markdown += `<div align="center">\n<img src="https://komarev.com/ghpvc/?username=${githubUsername}&label=Profile%20views&color=gradient&style=for-the-badge" alt="${githubUsername}" />\n</div>\n\n`;
  }

  // Add colorful footer with wave
  markdown += `<div align="center">\n`;
  markdown += `<img width="100%" height="200" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,2,5,30&height=200&section=footer&animation=fadeIn" />\n`;
  markdown += `</div>\n\n`;

  // Thanks message
  markdown += `<div align="center">\n`;
  markdown += `<h3>✨ Thanks for visiting my profile! ✨</h3>\n`;
  markdown += `<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=22&duration=3000&pause=1000&center=true&vCenter=true&width=600&lines=Let's+connect+and+build+something+amazing+together!" alt="Typing SVG" />\n`;
  markdown += `</div>\n`;

  return markdown;
}
