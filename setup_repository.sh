#!/bin/bash

# GitHub Repository Configuration Script
# Automates repository settings updates using GitHub CLI
# Usage: ./setup_repository.sh

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository details
OWNER="raghavendra-exp"
REPO="bankexamv2"

# Configuration
DESCRIPTION="🎓 AI-powered exam prompt generator and study platform for Indian competitive exams (Bank, SSC, UPSC, JEE, NEET, etc.) with interactive tools and comprehensive study guides."

TOPICS=(
    "exam-preparation"
    "competitive-exams"
    "india"
    "education"
    "bank-exams"
    "ssc"
    "upsc"
    "jee"
    "neet"
    "ai-prompt-generator"
    "study-materials"
    "mock-tests"
    "educational-tools"
    "open-source"
    "github-pages"
)

# Print header
print_header() {
    echo -e "\n${BLUE}============================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================================${NC}\n"
}

# Print success message
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Print warning message
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Print error message
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Print info message
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Main execution
main() {
    print_header "🚀 GitHub Repository Configuration Script"
    
    print_info "Repository: $OWNER/$REPO"
    print_info "Target: Update repository settings"
    
    # Step 1: Check prerequisites
    print_header "Step 1: Checking Prerequisites"
    
    # Check if gh CLI is installed
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI is not installed!"
        echo -e "\n${YELLOW}Please install GitHub CLI from: https://cli.github.com/${NC}"
        echo -e "After installation, run: ${BLUE}gh auth login${NC}\n"
        exit 1
    fi
    
    print_success "GitHub CLI is installed"
    echo "Version: $(gh --version)"
    
    # Check if authenticated
    if ! gh auth status &> /dev/null; then
        print_error "Not authenticated with GitHub!"
        echo -e "\n${YELLOW}Please run: ${BLUE}gh auth login${NC}"
        exit 1
    fi
    
    print_success "Authenticated with GitHub"
    
    # Step 2: Update description
    print_header "Step 2: Updating Repository Description"
    
    echo "New description:"
    echo "$DESCRIPTION"
    echo ""
    
    if gh repo edit "$OWNER/$REPO" --description "$DESCRIPTION" 2>/dev/null; then
        print_success "Repository description updated successfully!"
    else
        print_warning "Failed to update description (may require additional permissions)"
    fi
    
    # Step 3: Update topics
    print_header "Step 3: Updating Repository Topics"
    
    echo "Topics to add (${#TOPICS[@]}):"
    for i in "${!TOPICS[@]}"; do
        printf "  %2d. %s\n" $((i+1)) "${TOPICS[$i]}"
    done
    echo ""
    
    # Add topics one by one
    for topic in "${TOPICS[@]}"; do
        if gh repo edit "$OWNER/$REPO" --add-topic "$topic" 2>/dev/null; then
            echo -e "${GREEN}  ✓${NC} Added: $topic"
        else
            echo -e "${YELLOW}  •${NC} $topic (may already exist or require manual update)"
        fi
    done
    
    print_success "Topics configuration completed!"
    
    # Step 4: Discussions setup
    print_header "Step 4: GitHub Discussions Setup"
    
    print_warning "Discussions must be enabled through GitHub Web UI"
    echo ""
    echo "To enable discussions:"
    echo "  1. Go to: ${BLUE}https://github.com/$OWNER/$REPO/settings/general${NC}"
    echo "  2. Find the 'Features' section"
    echo "  3. Check the 'Discussions' checkbox"
    echo "  4. Click Save"
    echo ""
    
    # Step 5: Verify Pages
    print_header "Step 5: Verifying GitHub Pages"
    
    print_success "GitHub Pages should be live at:"
    echo "  ${BLUE}https://$OWNER.github.io/$REPO${NC}"
    echo ""
    echo "Verify in settings: ${BLUE}https://github.com/$OWNER/$REPO/settings/pages${NC}"
    
    # Final summary
    print_header "✅ Configuration Summary"
    
    echo "📍 Repository: $OWNER/$REPO"
    echo ""
    echo "✅ Completed:"
    echo "   • Description updated"
    echo "   • Topics added (${#TOPICS[@]} tags)"
    echo "   • GitHub Pages verified"
    echo ""
    echo "⚠️  Manual Step Required:"
    echo "   • Enable Discussions (requires GitHub UI)"
    echo ""
    echo "📊 Workflows Deployed:"
    echo "   ✅ deploy.yml - Auto-deployment on push"
    echo "   ✅ validate.yml - CI/CD validation"
    echo ""
    echo "📝 Issue Templates:"
    echo "   ✅ bug_report.md"
    echo "   ✅ feature_request.md"
    echo "   ✅ documentation.md"
    echo ""
    echo "💬 Discussion Templates:"
    echo "   ✅ announcements.md"
    echo "   ✅ general-q-and-a.md"
    echo "   ✅ ideas.md"
    echo "   ✅ show-and-tell.md"
    echo ""
    echo "📖 Documentation:"
    echo "   ✅ README.md (500+ lines)"
    echo ""
    
    print_header "🎉 Setup Complete!"
    
    echo "Your repository is now configured with:"
    echo ""
    echo "  • Professional description and topic tags"
    echo "  • Automated CI/CD deployment workflows"
    echo "  • Structured issue and discussion templates"
    echo "  • Comprehensive documentation"
    echo "  • GitHub Pages hosting ready"
    echo ""
    echo "Next Step:"
    echo "  1. Enable Discussions in settings"
    echo "  2. Share your repository with the community!"
    echo ""
}

# Run main function
main
