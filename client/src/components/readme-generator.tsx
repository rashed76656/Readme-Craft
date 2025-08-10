import { useState, useEffect, useCallback } from 'react';
import { Github, Sun, Moon, RotateCcw, Download, Copy, Eye, Code, User, CodeIcon, Share2, BarChart3, Rss, Coffee, ChevronDown, Award, Target, Lightbulb, Clock, Palette, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTheme } from '@/hooks/use-theme';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { ReadmeFormData, skillCategories, Skill } from '@/types/readme';
import { generateMarkdown } from '@/lib/markdown-generator';
import { generateWorkflowYaml } from '@/lib/workflow-generator';

// Import marked.js from CDN
declare global {
  interface Window {
    marked: {
      parse: (markdown: string) => string;
    };
  }
}

const defaultFormData: ReadmeFormData = {
  userName: '',
  userBio: '',
  currentWork: '',
  currentLearning: '',
  askAbout: '',
  userEmail: '',
  portfolioUrl: '',
  blogUrl: '',
  location: '',
  pronouns: '',
  skills: [],
  social: {
    github: '',
    linkedin: '',
    twitter: '',
    devto: '',
    medium: '',
    youtube: '',
    instagram: '',
    facebook: '',
    codepen: '',
    hashnode: '',
  },
  stats: {
    showStats: false,
    showLanguages: false,
    showStreak: false,
    showTrophy: false,
    showVisitors: false,
    showActivity: false,
    showContributions: false,
    showProductivityStats: false,
    showWakaTime: false,
    showCommitGraph: false,
    showCodetime: false,
    showMetrics: false,
    showSummaryCard: false,
    showDetailedStats: false,
    statsTheme: 'default',
    languagesTheme: 'default',
    wakaTimeUsername: '',
  },
  blog: {
    showDevtoPosts: false,
    showMediumPosts: false,
    showRssPosts: false,
    rssUrl: '',
  },
  buyMeCoffeeUsername: '',
  sponsorUrl: '',
  achievements: {
    showCertifications: false,
    certifications: '',
    showEducation: false,
    education: '',
    showAwards: false,
    awards: '',
  },
  custom: {
    showFunFacts: false,
    funFacts: '',
    showGoals: false,
    goals: '',
    showQuote: false,
    quote: '',
    showTimezone: false,
    timezone: '',
    showHobbies: false,
    hobbies: '',
  },
};

export default function ReadmeGenerator() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [formData, setFormData] = useLocalStorage<ReadmeFormData>('github-readme-generator-data', defaultFormData);
  const [markdownContent, setMarkdownContent] = useState('');
  const [accordionValue, setAccordionValue] = useState(['general']);

  // Load marked.js from CDN
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Ensure backward compatibility with localStorage data
  useEffect(() => {
    if (!formData.custom || !formData.achievements) {
      // Clear localStorage and start fresh if structure is incompatible
      localStorage.removeItem('github-readme-generator-data');
      setFormData(defaultFormData);
    }
  }, []);

  // Generate markdown when form data changes
  useEffect(() => {
    const markdown = generateMarkdown(formData);
    setMarkdownContent(markdown);
  }, [formData]);

  const updateFormData = useCallback((updates: Partial<ReadmeFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, [setFormData]);

  const handleInputChange = (field: keyof ReadmeFormData, value: any) => {
    updateFormData({ [field]: value });
  };

  const handleSocialChange = (platform: keyof ReadmeFormData['social'], value: string) => {
    updateFormData({
      social: { ...formData.social, [platform]: value }
    });
  };

  const handleStatsChange = (stat: keyof ReadmeFormData['stats'], value: boolean | string) => {
    updateFormData({
      stats: { ...formData.stats, [stat]: value }
    });
  };

  const handleBlogChange = (blog: keyof ReadmeFormData['blog'], value: any) => {
    updateFormData({
      blog: { ...formData.blog, [blog]: value }
    });
  };

  const handleAchievementChange = (achievement: keyof ReadmeFormData['achievements'], value: any) => {
    updateFormData({
      achievements: { ...formData.achievements, [achievement]: value }
    });
  };

  const handleCustomChange = (custom: keyof ReadmeFormData['custom'], value: any) => {
    updateFormData({
      custom: { ...formData.custom, [custom]: value }
    });
  };

  const handleSkillToggle = (skill: { name: string; icon: string; displayName: string }, category: string) => {
    const skillData: Skill = { ...skill, category };
    const isSelected = formData.skills.some(s => s.name === skill.name);
    
    if (isSelected) {
      updateFormData({
        skills: formData.skills.filter(s => s.name !== skill.name)
      });
    } else {
      updateFormData({
        skills: [...formData.skills, skillData]
      });
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setAccordionValue(['general']);
    toast({
      title: "Form Reset",
      description: "All fields have been cleared.",
    });
  };

  const exportTemplate = () => {
    const template = {
      ...formData,
      skills: formData.skills.map(skill => ({ name: skill.name, category: skill.category }))
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'readme-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template Exported",
      description: "Your configuration has been exported as a JSON template.",
    });
  };

  const importTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const template = JSON.parse(e.target?.result as string);
          // Reconstruct skills with proper structure
          if (template.skills) {
            template.skills = template.skills.map((skill: any) => {
              const skillDef = Object.values(skillCategories)
                .flat()
                .find(s => s.name === skill.name);
              return skillDef ? { ...skillDef, category: skill.category } : skill;
            });
          }
          setFormData({ ...defaultFormData, ...template });
          toast({
            title: "Template Imported",
            description: "Your configuration has been loaded successfully.",
          });
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Invalid template file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadReadme = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "README.md file has been downloaded.",
    });
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      toast({
        title: "Copied",
        description: "Markdown copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const copyWorkflow = async () => {
    const workflow = generateWorkflowYaml(
      formData.blog,
      formData.social.devto,
      formData.social.medium
    );
    
    try {
      await navigator.clipboard.writeText(workflow);
      toast({
        title: "Workflow Copied",
        description: "GitHub Actions workflow YAML copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy workflow to clipboard.",
        variant: "destructive",
      });
    }
  };

  const renderPreview = () => {
    if (window.marked) {
      return (
        <div 
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: window.marked.parse(markdownContent) }}
        />
      );
    }
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <h1>Hi there, I'm {formData.userName || '[Your Name]'} 👋</h1>
        <h3>{formData.userBio || 'A passionate [Your Title] from [Your Location]'}</h3>
        <p className="text-muted-foreground">
          Start filling out the form to see your README preview here...
        </p>
      </div>
    );
  };

  const anyBlogEnabled = formData.blog.showDevtoPosts || formData.blog.showMediumPosts || formData.blog.showRssPosts;

  return (
    <div className="min-h-screen text-foreground">
      {/* Header */}
<header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Github className="h-8 w-8" />
              <h1 className="text-xl font-bold">README Generator</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <input
                type="file"
                accept=".json"
                onChange={importTemplate}
                className="hidden"
                id="template-import"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('template-import')?.click()}
              >
                Import
              </Button>
              
              <Button variant="outline" size="sm" onClick={exportTemplate}>
                Export
              </Button>
              
              <Button variant="outline" size="sm" onClick={resetForm}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <Button size="sm" onClick={downloadReadme}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              <Button size="sm" variant="outline" onClick={copyMarkdown}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-3">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Profile Configuration</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Fill out the sections below to generate your README
                </p>
              </CardHeader>
              
              <CardContent>
                <Accordion 
                  type="multiple" 
                  value={accordionValue} 
                  onValueChange={setAccordionValue}
                  className="space-y-4"
                >
                  {/* General Information */}
                  <AccordionItem value="general" className="accordion-item">
                    <AccordionTrigger className="flex items-center space-x-3 p-4 hover:bg-muted/20">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-primary" />
                        <span className="font-medium">General Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="userName">Your Name</Label>
                          <Input
                            id="userName"
                            placeholder="John Doe"
                            value={formData.userName}
                            onChange={(e) => handleInputChange('userName', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="userBio">Subtitle/Bio</Label>
                          <Input
                            id="userBio"
                            placeholder="A passionate Full Stack Developer from India"
                            value={formData.userBio}
                            onChange={(e) => handleInputChange('userBio', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            placeholder="New York, USA"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="pronouns">Pronouns</Label>
                          <Input
                            id="pronouns"
                            placeholder="he/him, she/her, they/them"
                            value={formData.pronouns}
                            onChange={(e) => handleInputChange('pronouns', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="currentWork">Currently Working On</Label>
                        <Textarea
                          id="currentWork"
                          placeholder="Project Name | https://project-link.com"
                          rows={3}
                          value={formData.currentWork}
                          onChange={(e) => handleInputChange('currentWork', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="currentLearning">Currently Learning</Label>
                        <Textarea
                          id="currentLearning"
                          placeholder="React, Node.js, Docker"
                          rows={2}
                          value={formData.currentLearning}
                          onChange={(e) => handleInputChange('currentLearning', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="askAbout">Ask Me About</Label>
                        <Textarea
                          id="askAbout"
                          placeholder="React, Node.js, JavaScript"
                          rows={2}
                          value={formData.askAbout}
                          onChange={(e) => handleInputChange('askAbout', e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="userEmail">Email</Label>
                          <Input
                            id="userEmail"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.userEmail}
                            onChange={(e) => handleInputChange('userEmail', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                          <Input
                            id="portfolioUrl"
                            type="url"
                            placeholder="https://portfolio.com"
                            value={formData.portfolioUrl}
                            onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="blogUrl">Blog URL</Label>
                        <Input
                          id="blogUrl"
                          type="url"
                          placeholder="https://blog.com"
                          value={formData.blogUrl}
                          onChange={(e) => handleInputChange('blogUrl', e.target.value)}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Skills Showcase */}
                  <AccordionItem value="skills">
                    <AccordionTrigger className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg hover:bg-muted">
                      <div className="flex items-center space-x-3">
                        <CodeIcon className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Skills & Technologies</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-6">
                      {Object.entries(skillCategories).map(([category, skills]) => (
                        <div key={category}>
                          <h4 className="font-medium mb-3">{category}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {skills.map((skill) => (
                              <div key={skill.name} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`skill-${skill.name}`}
                                  checked={formData.skills.some(s => s.name === skill.name)}
                                  onCheckedChange={() => handleSkillToggle(skill, category)}
                                />
                                <Label
                                  htmlFor={`skill-${skill.name}`}
                                  className="flex items-center space-x-2 cursor-pointer"
                                >
                                  <i className={`${skill.icon} text-xl skill-icon`} />
                                  <span>{skill.displayName}</span>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Social Media Links */}
                  <AccordionItem value="social">
                    <AccordionTrigger className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg hover:bg-muted">
                      <div className="flex items-center space-x-3">
                        <Share2 className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">Social Media Links</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(formData.social).map(([platform, value]) => (
                          <div key={platform}>
                            <Label htmlFor={platform} className="capitalize">
                              {platform === 'devto' ? 'Dev.to' : platform}
                            </Label>
                            <Input
                              id={platform}
                              placeholder="username"
                              value={value}
                              onChange={(e) => handleSocialChange(platform as keyof ReadmeFormData['social'], e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* GitHub Stats */}
                  <AccordionItem value="stats">
                    <AccordionTrigger className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg hover:bg-muted">
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                        <span className="font-medium">GitHub Stats & Add-ons</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Display Options</h4>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="showStats"
                              checked={formData.stats.showStats}
                              onCheckedChange={(value) => handleStatsChange('showStats', !!value)}
                            />
                            <Label htmlFor="showStats">GitHub Profile Stats</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="showLanguages"
                              checked={formData.stats.showLanguages}
                              onCheckedChange={(value) => handleStatsChange('showLanguages', !!value)}
                            />
                            <Label htmlFor="showLanguages">Top Languages</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="showStreak"
                              checked={formData.stats.showStreak}
                              onCheckedChange={(value) => handleStatsChange('showStreak', !!value)}
                            />
                            <Label htmlFor="showStreak">GitHub Streak</Label>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Additional Stats</h4>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="showTrophy"
                              checked={formData.stats.showTrophy}
                              onCheckedChange={(value) => handleStatsChange('showTrophy', !!value)}
                            />
                            <Label htmlFor="showTrophy">GitHub Trophies</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="showActivity"
                              checked={formData.stats.showActivity}
                              onCheckedChange={(value) => handleStatsChange('showActivity', !!value)}
                            />
                            <Label htmlFor="showActivity">Activity Graph</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="showContributions"
                              checked={formData.stats.showContributions}
                              onCheckedChange={(value) => handleStatsChange('showContributions', !!value)}
                            />
                            <Label htmlFor="showContributions">Contribution Snake</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="showVisitors"
                              checked={formData.stats.showVisitors}
                              onCheckedChange={(value) => handleStatsChange('showVisitors', !!value)}
                            />
                            <Label htmlFor="showVisitors">Visitor Count</Label>
                          </div>
                        </div>
                      </div>

                      {/* Modern Analytics Section */}
                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-medium text-blue-600">🚀 Modern Analytics & Statistics</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <h5 className="font-medium text-sm">Advanced Metrics</h5>
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id="showProductivityStats"
                                checked={formData.stats.showProductivityStats}
                                onCheckedChange={(value) => handleStatsChange('showProductivityStats', !!value)}
                              />
                              <Label htmlFor="showProductivityStats">Productivity Stats</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id="showCommitGraph"
                                checked={formData.stats.showCommitGraph}
                                onCheckedChange={(value) => handleStatsChange('showCommitGraph', !!value)}
                              />
                              <Label htmlFor="showCommitGraph">3D Commit Graph</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id="showMetrics"
                                checked={formData.stats.showMetrics}
                                onCheckedChange={(value) => handleStatsChange('showMetrics', !!value)}
                              />
                              <Label htmlFor="showMetrics">Advanced Metrics</Label>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h5 className="font-medium text-sm">Enhanced Views</h5>
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id="showSummaryCard"
                                checked={formData.stats.showSummaryCard}
                                onCheckedChange={(value) => handleStatsChange('showSummaryCard', !!value)}
                              />
                              <Label htmlFor="showSummaryCard">Summary Card</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id="showDetailedStats"
                                checked={formData.stats.showDetailedStats}
                                onCheckedChange={(value) => handleStatsChange('showDetailedStats', !!value)}
                              />
                              <Label htmlFor="showDetailedStats">Detailed Statistics</Label>
                            </div>
                          </div>
                        </div>
                        
                        {/* WakaTime Integration */}
                        <div className="space-y-3 pt-3 border-t">
                          <h5 className="font-medium text-purple-600">⏰ WakaTime Integration</h5>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="showWakaTime"
                              checked={formData.stats.showWakaTime}
                              onCheckedChange={(value) => handleStatsChange('showWakaTime', !!value)}
                            />
                            <Label htmlFor="showWakaTime">Show WakaTime Stats</Label>
                          </div>
                          {formData.stats.showWakaTime && (
                            <div>
                              <Label htmlFor="wakaTimeUsername">WakaTime Username</Label>
                              <Input
                                id="wakaTimeUsername"
                                placeholder="your-wakatime-username"
                                value={formData.stats.wakaTimeUsername}
                                onChange={(e) => handleStatsChange('wakaTimeUsername', e.target.value)}
                              />
                              <p className="text-sm text-muted-foreground mt-1">
                                Make sure your WakaTime profile is public
                              </p>
                            </div>
                          )}
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="showCodetime"
                              checked={formData.stats.showCodetime}
                              onCheckedChange={(value) => handleStatsChange('showCodetime', !!value)}
                            />
                            <Label htmlFor="showCodetime">Coding Time Summary</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="statsTheme">Stats Theme</Label>
                          <Select value={formData.stats.statsTheme} onValueChange={(value) => handleStatsChange('statsTheme', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="radical">Radical</SelectItem>
                              <SelectItem value="merko">Merko</SelectItem>
                              <SelectItem value="gruvbox">Gruvbox</SelectItem>
                              <SelectItem value="tokyonight">Tokyo Night</SelectItem>
                              <SelectItem value="onedark">One Dark</SelectItem>
                              <SelectItem value="cobalt">Cobalt</SelectItem>
                              <SelectItem value="synthwave">Synthwave</SelectItem>
                              <SelectItem value="highcontrast">High Contrast</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="languagesTheme">Languages Theme</Label>
                          <Select value={formData.stats.languagesTheme} onValueChange={(value) => handleStatsChange('languagesTheme', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="radical">Radical</SelectItem>
                              <SelectItem value="merko">Merko</SelectItem>
                              <SelectItem value="gruvbox">Gruvbox</SelectItem>
                              <SelectItem value="tokyonight">Tokyo Night</SelectItem>
                              <SelectItem value="onedark">One Dark</SelectItem>
                              <SelectItem value="cobalt">Cobalt</SelectItem>
                              <SelectItem value="synthwave">Synthwave</SelectItem>
                              <SelectItem value="highcontrast">High Contrast</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Blog Posts */}
                  <AccordionItem value="blog">
                    <AccordionTrigger className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg hover:bg-muted">
                      <div className="flex items-center space-x-3">
                        <Rss className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">Dynamic Blog Posts</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="showDevtoPosts"
                            checked={formData.blog.showDevtoPosts}
                            onCheckedChange={(value) => handleBlogChange('showDevtoPosts', !!value)}
                          />
                          <Label htmlFor="showDevtoPosts">Show latest Dev.to posts</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="showMediumPosts"
                            checked={formData.blog.showMediumPosts}
                            onCheckedChange={(value) => handleBlogChange('showMediumPosts', !!value)}
                          />
                          <Label htmlFor="showMediumPosts">Show latest Medium posts</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="showRssPosts"
                            checked={formData.blog.showRssPosts}
                            onCheckedChange={(value) => handleBlogChange('showRssPosts', !!value)}
                          />
                          <Label htmlFor="showRssPosts">Show blog posts from RSS feed</Label>
                        </div>
                      </div>
                      
                      {formData.blog.showRssPosts && (
                        <div>
                          <Label htmlFor="rssUrl">RSS Feed URL</Label>
                          <Input
                            id="rssUrl"
                            type="url"
                            placeholder="https://your-blog.com/rss"
                            value={formData.blog.rssUrl}
                            onChange={(e) => handleBlogChange('rssUrl', e.target.value)}
                          />
                        </div>
                      )}
                      
                      {anyBlogEnabled && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                            GitHub Actions Setup Required
                          </h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                            To enable dynamic blog posts, you'll need to add a GitHub Action workflow to your repository.
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={copyWorkflow}
                            className="bg-yellow-600 text-white hover:bg-yellow-700"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Workflow YAML
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Achievements */}
                  <AccordionItem value="achievements">
                    <AccordionTrigger className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg hover:bg-muted">
                      <div className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium">Achievements & Education</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="showEducation"
                          checked={formData.achievements.showEducation}
                          onCheckedChange={(value) => handleAchievementChange('showEducation', !!value)}
                        />
                        <Label htmlFor="showEducation">Show Education</Label>
                      </div>
                      {formData.achievements.showEducation && (
                        <div>
                          <Label htmlFor="education">Education Details</Label>
                          <Textarea
                            id="education"
                            placeholder="Bachelor's in Computer Science - University Name (2020-2024)"
                            rows={3}
                            value={formData.achievements.education}
                            onChange={(e) => handleAchievementChange('education', e.target.value)}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="showCertifications"
                          checked={formData.achievements.showCertifications}
                          onCheckedChange={(value) => handleAchievementChange('showCertifications', !!value)}
                        />
                        <Label htmlFor="showCertifications">Show Certifications</Label>
                      </div>
                      {formData.achievements.showCertifications && (
                        <div>
                          <Label htmlFor="certifications">Certifications (one per line)</Label>
                          <Textarea
                            id="certifications"
                            placeholder="AWS Certified Solutions Architect
Google Cloud Professional Cloud Architect
Microsoft Azure Fundamentals"
                            rows={4}
                            value={formData.achievements.certifications}
                            onChange={(e) => handleAchievementChange('certifications', e.target.value)}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="showAwards"
                          checked={formData.achievements.showAwards}
                          onCheckedChange={(value) => handleAchievementChange('showAwards', !!value)}
                        />
                        <Label htmlFor="showAwards">Show Awards & Recognition</Label>
                      </div>
                      {formData.achievements.showAwards && (
                        <div>
                          <Label htmlFor="awards">Awards & Recognition (one per line)</Label>
                          <Textarea
                            id="awards"
                            placeholder="Best Innovation Award - Tech Conference 2023
Top Contributor - Open Source Project 2022
Hackathon Winner - Global Hack Week 2021"
                            rows={4}
                            value={formData.achievements.awards}
                            onChange={(e) => handleAchievementChange('awards', e.target.value)}
                          />
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Custom Sections */}
                  <AccordionItem value="custom">
                    <AccordionTrigger className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg hover:bg-muted">
                      <div className="flex items-center space-x-3">
                        <Palette className="h-5 w-5 text-pink-600" />
                        <span className="font-medium">Custom Sections</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="showQuote"
                          checked={formData.custom.showQuote}
                          onCheckedChange={(value) => handleCustomChange('showQuote', !!value)}
                        />
                        <Label htmlFor="showQuote">Show Inspirational Quote</Label>
                      </div>
                      {formData.custom.showQuote && (
                        <div>
                          <Label htmlFor="quote">Your Quote</Label>
                          <Input
                            id="quote"
                            placeholder="Code is poetry, and debugging is the art of understanding it."
                            value={formData.custom.quote}
                            onChange={(e) => handleCustomChange('quote', e.target.value)}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="showTimezone"
                          checked={formData.custom.showTimezone}
                          onCheckedChange={(value) => handleCustomChange('showTimezone', !!value)}
                        />
                        <Label htmlFor="showTimezone">Show Timezone</Label>
                      </div>
                      {formData.custom.showTimezone && (
                        <div>
                          <Label htmlFor="timezone">Timezone</Label>
                          <Input
                            id="timezone"
                            placeholder="UTC+5:30 (IST)"
                            value={formData.custom.timezone}
                            onChange={(e) => handleCustomChange('timezone', e.target.value)}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="showFunFacts"
                          checked={formData.custom.showFunFacts}
                          onCheckedChange={(value) => handleCustomChange('showFunFacts', !!value)}
                        />
                        <Label htmlFor="showFunFacts">Show Fun Facts</Label>
                      </div>
                      {formData.custom.showFunFacts && (
                        <div>
                          <Label htmlFor="funFacts">Fun Facts (one per line)</Label>
                          <Textarea
                            id="funFacts"
                            placeholder="I can solve a Rubik's cube in under 2 minutes
I've contributed to over 50 open source projects
I love astronomy and astrophotography"
                            rows={4}
                            value={formData.custom.funFacts}
                            onChange={(e) => handleCustomChange('funFacts', e.target.value)}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="showGoals"
                          checked={formData.custom.showGoals}
                          onCheckedChange={(value) => handleCustomChange('showGoals', !!value)}
                        />
                        <Label htmlFor="showGoals">Show Current Goals</Label>
                      </div>
                      {formData.custom.showGoals && (
                        <div>
                          <Label htmlFor="goals">Current Goals (one per line)</Label>
                          <Textarea
                            id="goals"
                            placeholder="Master machine learning and AI
Contribute to major open source projects
Launch my own SaaS product"
                            rows={4}
                            value={formData.custom.goals}
                            onChange={(e) => handleCustomChange('goals', e.target.value)}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="showHobbies"
                          checked={formData.custom.showHobbies}
                          onCheckedChange={(value) => handleCustomChange('showHobbies', !!value)}
                        />
                        <Label htmlFor="showHobbies">Show Hobbies & Interests</Label>
                      </div>
                      {formData.custom.showHobbies && (
                        <div>
                          <Label htmlFor="hobbies">Hobbies & Interests (one per line)</Label>
                          <Textarea
                            id="hobbies"
                            placeholder="Photography and videography
Playing guitar and piano
Hiking and rock climbing
Reading sci-fi novels"
                            rows={4}
                            value={formData.custom.hobbies}
                            onChange={(e) => handleCustomChange('hobbies', e.target.value)}
                          />
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Support Me */}
                  <AccordionItem value="support">
                    <AccordionTrigger className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg hover:bg-muted">
                      <div className="flex items-center space-x-3">
                        <Heart className="h-5 w-5 text-red-600" />
                        <span className="font-medium">Support & Sponsorship</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <div>
                        <Label htmlFor="buyMeCoffeeUsername">Buy Me a Coffee Username</Label>
                        <Input
                          id="buyMeCoffeeUsername"
                          placeholder="your-username"
                          value={formData.buyMeCoffeeUsername}
                          onChange={(e) => handleInputChange('buyMeCoffeeUsername', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Your Buy Me a Coffee username (without @)
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="sponsorUrl">Custom Sponsor Link</Label>
                        <Input
                          id="sponsorUrl"
                          type="url"
                          placeholder="https://github.com/sponsors/your-username"
                          value={formData.sponsorUrl}
                          onChange={(e) => handleInputChange('sponsorUrl', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Link to GitHub Sponsors, Patreon, or any other sponsorship platform
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <Card className="glass-card">
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview" className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </TabsTrigger>
                    <TabsTrigger value="raw" className="flex items-center space-x-2">
                      <Code className="h-4 w-4" />
                      <span>Raw Markdown</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="preview" className="p-6">
                    {renderPreview()}
                  </TabsContent>
                  
                  <TabsContent value="raw" className="p-6">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyMarkdown}
                        className="absolute top-2 right-2 z-10"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96 border">
                        <code>{markdownContent}</code>
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Load Devicon CSS */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css"
      />
    </div>
  );
}
