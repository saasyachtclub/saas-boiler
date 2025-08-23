#!/bin/bash

# SaaS Better Setup Script
# This script sets up the entire SaaS boilerplate with one command

set -e

echo "🚀 Setting up SaaS Better..."
echo "================================"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Check if Node.js version is 18+
NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created from template"
    echo "⚠️  Please update your .env file with your credentials"
else
    echo "⚠️  .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate database types
echo "🗄️  Generating database types..."
pnpm db:generate

echo ""
echo "🎉 Setup completed successfully!"
echo "================================="
echo ""
echo "Next steps:"
echo "1. Update your .env file with your database URL and other credentials"
echo "2. Run 'pnpm db:migrate' to apply database migrations"
echo "3. Run 'pnpm dev' to start the development server"
echo "4. Create your first admin user:"
echo "   pnpm admin create-admin -e your@email.com -p password -n 'Your Name'"
echo ""
echo "Available commands:"
echo "  pnpm dev         - Start development server"
echo "  pnpm build       - Build for production"
echo "  pnpm db:migrate  - Apply database migrations"
echo "  pnpm db:studio   - Open Drizzle Studio"
echo "  pnpm admin       - Admin CLI commands"
echo "  pnpm deploy      - Deploy to Vercel"
echo ""
echo "📚 For more information, check the README.md file"
