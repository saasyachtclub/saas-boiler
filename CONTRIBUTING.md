# 🤝 Contributing to SaaS Yacht Club

Thank you for your interest in contributing to SaaS Yacht Club! ⚓ We welcome contributions from developers of all skill levels. This **FREE and open source** project thrives on community contributions and is built with the latest technologies including **React 19**, **Next.js 15**, **TypeScript 5.7**, and modern development tools. This guide will help you get started.

## 📋 Table of Contents

- [🔗 All Links & Resources](./LINKS.md) - **Complete directory of all project links**
- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Making Changes](#-making-changes)
- [Pull Request Process](#-pull-request-process)
- [Coding Standards](#-coding-standards)
- [Testing Guidelines](#-testing-guidelines)
- [Documentation](#-documentation)
- [Community](#-community)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+
- **pnpm** 9+ (recommended package manager)
- **Git** for version control
- A **Neon** account for PostgreSQL database
- A **Stripe** account for payment testing

### Fork and Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:

```bash
git clone https://github.com/yourusername/saas-boiler.git
cd saas-boiler
```

3. **Add upstream** remote:

```bash
git remote add upstream https://github.com/saasyachtclub/saas-boiler.git
```

## 🛠️ Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Or use our interactive setup
pnpm setup
```

Configure your `.env` file with:
- Database URL (Neon PostgreSQL)
- Better Auth secrets
- Stripe keys (test mode)
- Other required environment variables

### 3. Database Setup

```bash
# Generate and run migrations
pnpm db:generate
pnpm db:migrate

# Optional: Open Drizzle Studio
pnpm db:studio
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app running.

## 🔄 Making Changes

### 1. Create a Branch

Always create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow our coding standards (see below)
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linting and formatting
pnpm lint
pnpm format

# Run tests
pnpm test

# Run type checking
pnpm type-check

# Build to ensure no build errors
pnpm build
```

### 4. Commit Your Changes

We use conventional commits for clear commit messages:

```bash
git add .
git commit -m "feat: add user profile management"
```

#### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```bash
feat(auth): add social login with Google
fix(stripe): resolve webhook signature validation
docs(readme): update installation instructions
test(api): add tests for user endpoints
```

## 🔀 Pull Request Process

### 1. Update Your Branch

Before creating a PR, ensure your branch is up to date:

```bash
git fetch upstream
git rebase upstream/main
```

### 2. Push Your Branch

```bash
git push origin your-branch-name
```

### 3. Create Pull Request

1. Go to the GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template completely
5. Link any related issues

### 4. PR Requirements

Your PR must:
- [ ] Pass all automated checks (CI/CD)
- [ ] Include tests for new functionality
- [ ] Update documentation if needed
- [ ] Follow coding standards
- [ ] Have a clear description of changes
- [ ] Be reviewed and approved by maintainers

### 5. Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, your PR will be merged

## 📏 Coding Standards

### TypeScript

- Use **strict TypeScript** configuration
- Define proper types for all functions and variables
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

```typescript
// ✅ Good
interface UserProfile {
  id: string
  email: string
  name: string
  createdAt: Date
}

async function getUserProfile(userId: string): Promise<UserProfile> {
  // Implementation
}

// ❌ Bad
function getUser(id: any): any {
  // Implementation
}
```

### React Components

- Use **functional components** with hooks
- Implement proper **prop types** with TypeScript
- Use **descriptive component names**
- Keep components **small and focused**

```typescript
// ✅ Good
interface UserCardProps {
  user: User
  onEdit: (userId: string) => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  )
}
```

### Styling

- Use **Tailwind CSS** for styling
- Follow **mobile-first** approach
- Use **semantic class names**
- Maintain **consistent spacing**

```tsx
// ✅ Good
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <p className="text-gray-600">Description</p>
</div>
```

### API Routes

- Use proper **HTTP status codes**
- Implement **error handling**
- Validate **input data** with Zod
- Add **rate limiting** where appropriate

```typescript
// ✅ Good
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = userSchema.parse(body)

    const user = await createUser(validatedData)

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for **utility functions**
- Test **component behavior**
- Mock **external dependencies**

```typescript
// Example test
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { UserCard } from './UserCard'

test('renders user information', () => {
  const user = { id: '1', name: 'John Doe', email: 'john@example.com' }

  render(<UserCard user={user} onEdit={() => {}} />)

  expect(screen.getByText('John Doe')).toBeInTheDocument()
})
```

### Integration Tests

- Test **API endpoints**
- Test **database operations**
- Test **authentication flows**

### E2E Tests

- Test **critical user journeys**
- Test **payment flows**
- Test **authentication processes**

## 📚 Documentation

### Code Documentation

- Add **JSDoc comments** for complex functions
- Document **API endpoints**
- Explain **business logic**

```typescript
/**
 * Creates a new user subscription with Stripe
 * @param userId - The user's unique identifier
 * @param priceId - Stripe price ID for the subscription
 * @returns Promise resolving to the created subscription
 * @throws {Error} When Stripe API call fails
 */
async function createSubscription(userId: string, priceId: string) {
  // Implementation
}
```

### README Updates

- Update setup instructions if needed
- Add new feature documentation
- Update environment variable requirements

## 🌟 Types of Contributions

We welcome various types of contributions:

### 🐛 Bug Fixes
- Fix existing issues
- Improve error handling
- Resolve performance problems

### ✨ New Features
- Add new functionality
- Improve existing features
- Enhance user experience

### 📚 Documentation
- Improve README
- Add code comments
- Create tutorials and guides

### 🧪 Testing
- Add missing tests
- Improve test coverage
- Fix flaky tests

### 🎨 UI/UX Improvements
- Enhance design
- Improve accessibility
- Add animations and interactions

### ⚡ Performance
- Optimize database queries
- Improve loading times
- Reduce bundle size

## 🏷️ Issue Labels

We use labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested
- `wontfix` - This will not be worked on

## 🎯 Getting Help

### Before Asking for Help

1. Check existing [issues](https://github.com/saasyachtclub/saas-better/issues)
2. Read the [documentation](https://docs.saasyachtclub.com)
3. Search [discussions](https://github.com/saasyachtclub/saas-better/discussions)

### Where to Get Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and general discussion
- **Discord** - [Join our community](https://discord.gg/saasyachtclub)
- **Email** - support@saasyachtclub.com

## 🏆 Recognition

Contributors are recognized in several ways:

- Listed in our **Contributors** section
- Mentioned in **release notes**
- Invited to our **contributors Discord channel**
- Eligible for **SaaS Yacht Club swag**

## 📝 Development Scripts

Here are the key scripts you'll use during development:

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run linter
pnpm format           # Format code
pnpm check            # Check code with Biome
pnpm fix              # Auto-fix issues

# Testing
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Generate coverage report

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio

# Utilities
pnpm setup            # Interactive setup
pnpm reset            # Reset project safely
pnpm repair           # Fix common issues
```

## 🚀 Release Process

1. **Feature Development** - Develop in feature branches
2. **Testing** - Comprehensive testing on staging
3. **Code Review** - Peer review and approval
4. **Merge** - Merge to main branch
5. **Release** - Automated release with semantic versioning

## 📞 Contact

For questions about contributing:

- **Email**: contributors@saasyachtclub.com
- **Discord**: [SaaS Yacht Club Community](https://discord.gg/saasyachtclub)
- **Twitter**: [@saasyachtclub](https://twitter.com/saasyachtclub)

---

**Thank you for contributing to SaaS Better! 🙏**

Your contributions help make this project better for everyone. We appreciate your time and effort! 🎉
