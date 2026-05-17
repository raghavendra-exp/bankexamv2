#!/bin/bash
# ============================================================
# Deploy script — push bankexamv2 to GitHub Pages
# Usage: bash deploy_to_github.sh
# ============================================================

REPO="https://github.com/raghavendra-exp/bankexamv2.git"
BRANCH="main"

echo "=== bankexamv2 GitHub Deploy Script ==="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
  echo "❌ git not found. Install git first: https://git-scm.com/"
  exit 1
fi

# Check if inside a git repo, if not initialize one
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
  git remote add origin $REPO
  echo "✅ Git repo initialized"
else
  # Make sure remote is set correctly
  git remote set-url origin $REPO 2>/dev/null || git remote add origin $REPO
  echo "✅ Remote set to $REPO"
fi

# Stage all files
echo ""
echo "Staging all files..."
git add -A
echo "✅ All files staged"

# Commit
COMMIT_MSG="Deploy: 12 exam tools + live news + Firebase Analytics — $(date '+%Y-%m-%d %H:%M')"
git commit -m "$COMMIT_MSG"
echo "✅ Commit: $COMMIT_MSG"

# Push
echo ""
echo "Pushing to GitHub ($BRANCH branch)..."
git push -u origin $BRANCH

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ SUCCESS! Site is live at:"
  echo "   https://raghavendra-exp.github.io/bankexamv2/"
  echo ""
  echo "If GitHub Pages is not yet enabled:"
  echo "   1. Go to https://github.com/raghavendra-exp/bankexamv2/settings/pages"
  echo "   2. Source → Deploy from branch → main → / (root)"
  echo "   3. Click Save — site goes live in ~2 minutes"
else
  echo ""
  echo "❌ Push failed. Try:"
  echo "   git push -u origin main --force"
  echo "   (or use GitHub Desktop / upload files manually)"
fi
