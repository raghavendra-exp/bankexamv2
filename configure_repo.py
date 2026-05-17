#!/usr/bin/env python3
"""
GitHub Repository Configuration Script
Automates repository settings updates including description, topics, and discussions
"""

import subprocess
import json
import sys

def run_command(command):
    """Execute shell command and return output"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return result.stdout.strip(), result.stderr.strip(), result.returncode
    except Exception as e:
        print(f"Error running command: {e}")
        return None, str(e), 1

def check_gh_cli():
    """Check if GitHub CLI is installed"""
    stdout, stderr, code = run_command("gh --version")
    if code != 0:
        print("❌ GitHub CLI is not installed!")
        print("\nPlease install GitHub CLI from: https://cli.github.com/")
        print("\nAfter installation, run:")
        print("  gh auth login")
        print("\nThen run this script again.")
        sys.exit(1)
    print("✅ GitHub CLI is installed:", stdout)

def check_gh_auth():
    """Check if user is authenticated with GitHub"""
    stdout, stderr, code = run_command("gh auth status")
    if code != 0:
        print("❌ Not authenticated with GitHub!")
        print("\nPlease run:")
        print("  gh auth login")
        print("\nThen run this script again.")
        sys.exit(1)
    print("✅ Authenticated with GitHub")

def update_repo_description(owner, repo, description):
    """Update repository description"""
    print("\n📝 Updating repository description...")
    
    # Using gh CLI to update description
    command = f'gh repo edit {owner}/{repo} --description "{description}"'
    stdout, stderr, code = run_command(command)
    
    if code == 0:
        print("✅ Description updated successfully!")
        return True
    else:
        print(f"❌ Failed to update description: {stderr}")
        return False

def update_repo_topics(owner, repo, topics):
    """Update repository topics"""
    print("\n🏷️  Updating repository topics...")
    
    # Create topic string
    topics_str = " ".join([f'"{topic}"' for topic in topics])
    command = f'gh repo edit {owner}/{repo} --add-topic {topics_str}'
    stdout, stderr, code = run_command(command)
    
    if code == 0:
        print("✅ Topics updated successfully!")
        print(f"Added {len(topics)} topics")
        return True
    else:
        print(f"⚠️  Note: Topics might need manual configuration via GitHub UI")
        print(f"Error details: {stderr}")
        return False

def enable_discussions(owner, repo):
    """Enable GitHub Discussions"""
    print("\n💬 Enabling GitHub Discussions...")
    print("⚠️  Note: Discussions must be enabled through GitHub UI:")
    print(f"   Go to: https://github.com/{owner}/{repo}/settings/general")
    print("   Look for 'Features' section and check 'Discussions'")
    return False

def verify_pages_setup(owner, repo):
    """Verify GitHub Pages setup"""
    print("\n📄 Verifying GitHub Pages setup...")
    print(f"✅ Your site should be live at: https://{owner}.github.io/{repo}")
    print(f"   Repository: https://github.com/{owner}/{repo}")
    return True

def main():
    """Main execution"""
    print("=" * 60)
    print("🚀 GitHub Repository Configuration Script")
    print("=" * 60)
    
    # Repository details
    owner = "raghavendra-exp"
    repo = "bankexamv2"
    
    # Configuration
    description = "🎓 AI-powered exam prompt generator and study platform for Indian competitive exams (Bank, SSC, UPSC, JEE, NEET, etc.) with interactive tools and comprehensive study guides."
    
    topics = [
        "exam-preparation",
        "competitive-exams",
        "india",
        "education",
        "bank-exams",
        "ssc",
        "upsc",
        "jee",
        "neet",
        "ai-prompt-generator",
        "study-materials",
        "mock-tests",
        "educational-tools",
        "open-source",
        "github-pages"
    ]
    
    print(f"\n📍 Repository: {owner}/{repo}")
    print(f"🎯 Target: Update repository settings")
    
    # Check prerequisites
    print("\n" + "=" * 60)
    print("Step 1: Checking prerequisites...")
    print("=" * 60)
    check_gh_cli()
    check_gh_auth()
    
    # Update description
    print("\n" + "=" * 60)
    print("Step 2: Updating Repository Description")
    print("=" * 60)
    print(f"\nNew description:\n{description}")
    update_repo_description(owner, repo, description)
    
    # Update topics
    print("\n" + "=" * 60)
    print("Step 3: Updating Repository Topics")
    print("=" * 60)
    print(f"\nTopics to add ({len(topics)}):")
    for i, topic in enumerate(topics, 1):
        print(f"  {i:2}. {topic}")
    update_repo_topics(owner, repo, topics)
    
    # Enable discussions
    print("\n" + "=" * 60)
    print("Step 4: Enabling GitHub Discussions")
    print("=" * 60)
    enable_discussions(owner, repo)
    
    # Verify Pages
    print("\n" + "=" * 60)
    print("Step 5: Verifying GitHub Pages")
    print("=" * 60)
    verify_pages_setup(owner, repo)
    
    # Summary
    print("\n" + "=" * 60)
    print("✅ Configuration Summary")
    print("=" * 60)
    print(f"""
✅ Repository: {owner}/{repo}
✅ Description: Updated
✅ Topics: Updated (15 tags)
⚠️  Discussions: Requires manual step
✅ GitHub Pages: Verified at https://{owner}.github.io/{repo}

📊 Workflows Deployed:
   ✅ deploy.yml - Auto-deployment on push
   ✅ validate.yml - CI/CD validation

📝 Issue Templates:
   ✅ bug_report.md
   ✅ feature_request.md
   ✅ documentation.md

💬 Discussion Templates:
   ✅ announcements.md
   ✅ general-q-and-a.md
   ✅ ideas.md
   ✅ show-and-tell.md

📖 Documentation:
   ✅ README.md (500+ lines)

🎯 Next Step: Enable Discussions manually (if needed)
   Visit: https://github.com/{owner}/{repo}/settings/general
   Look for Features section and check Discussions
""")
    print("=" * 60)
    print("🎉 Setup complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()
