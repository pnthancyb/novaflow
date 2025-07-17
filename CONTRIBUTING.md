# Contributing to NovaFlow

Thank you for considering contributing to NovaFlow! We welcome contributions from the community and are grateful for your help in making this project better.

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, please include:

- A clear and descriptive title
- A detailed description of the issue
- Steps to reproduce the problem
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- A clear and descriptive title
- A detailed description of the suggested enhancement
- Use cases and examples
- Any relevant mockups or designs

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the coding standards below
3. **Add tests** for your changes if applicable
4. **Run the test suite** to ensure all tests pass
5. **Update documentation** as needed
6. **Submit a pull request** with a clear description of your changes

## Development Setup

1. Clone your fork:
```bash
git clone https://github.com/yourusername/novaflow.git
cd novaflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the development server:
```bash
npm run dev
```

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Follow existing type patterns
- Ensure proper type safety

### React/Frontend
- Use functional components with hooks
- Follow existing component patterns
- Use Tailwind CSS for styling
- Ensure components are accessible

### Backend
- Use Express.js patterns
- Implement proper error handling
- Use Zod for request validation
- Follow RESTful API conventions

### Database
- Use Drizzle ORM for all database operations
- Follow existing schema patterns
- Use migrations for schema changes

## Commit Messages

We use conventional commits. Please format your commit messages as:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(ai): add support for mind map generation
fix(chart): resolve mermaid rendering issue
docs(readme): update installation instructions
```

## Testing

### Running Tests
```bash
npm test
```

### Writing Tests
- Write unit tests for new functions
- Add integration tests for API endpoints
- Test React components with testing library
- Ensure good test coverage

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update API documentation for endpoint changes
- Include examples in documentation

## Project Structure

Understanding the project structure will help you contribute effectively:

```
novaflow/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Express backend
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database layer
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database and validation schemas
└── docs/                  # Documentation
```

## AI Integration Guidelines

When working with AI features:

- Use the Groq API responsibly
- Implement proper error handling for AI responses
- Test with various input scenarios
- Consider rate limiting and costs
- Ensure AI responses are properly sanitized

## Performance Considerations

- Keep bundle sizes minimal
- Optimize database queries
- Use proper caching strategies
- Consider mobile performance
- Test with various network conditions

## Security

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Implement proper input validation
- Follow security best practices
- Report security issues privately

## Getting Help

- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Join our community chat (if available)
- Contact maintainers for complex issues

## License

By contributing to NovaFlow, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in the project's README and release notes. We appreciate all forms of contribution, from code to documentation to bug reports.

Thank you for contributing to NovaFlow!