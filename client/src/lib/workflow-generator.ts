import { BlogPosts } from '@/types/readme';

export function generateWorkflowYaml(blogConfig: BlogPosts, devtoUsername?: string, mediumUsername?: string): string {
  const feedList: string[] = [];
  
  if (blogConfig.showDevtoPosts && devtoUsername) {
    feedList.push(`https://dev.to/feed/${devtoUsername}`);
  }
  
  if (blogConfig.showMediumPosts && mediumUsername) {
    feedList.push(`https://medium.com/feed/@${mediumUsername}`);
  }
  
  if (blogConfig.showRssPosts && blogConfig.rssUrl) {
    feedList.push(blogConfig.rssUrl);
  }

  return `name: Latest blog post workflow
on:
  schedule: # Run workflow automatically
    - cron: '0 * * * *' # Runs every hour, on the hour
  workflow_dispatch: # Run workflow manually (without waiting for the cron to be called), through the GitHub Actions Workflow page directly

jobs:
  update-readme-with-blog:
    name: Update this repo's README with latest blog posts
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Pull in blog posts
        uses: gautamkrishnar/blog-post-workflow@v1
        with:
          comment_tag_name: "BLOG-POST-LIST"
          feed_list: "${feedList.join(',')}"
          max_post_count: 5
          template: "- [$title]($url)"`;
}
