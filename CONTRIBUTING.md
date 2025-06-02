# Contributing to AI Content Writer

First off, thank you for considering contributing to AI Content Writer! It's people like you that make this project great.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible using our bug report template.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please use our feature request template and provide:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Explain why this enhancement would be useful
- List any dependencies or related issues

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes following our coding standards
4. Add tests for your changes (if applicable)
5. Ensure all tests pass
6. Update documentation if needed
7. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
8. Push to the branch (`git push origin feature/AmazingFeature`)
9. Open a Pull Request

## Development Setup

1. **Clone the repository:**
```powershell
git clone https://github.com/AnasNasim12/ai-content-writer.git
cd ai-content-writer
```

2. **Install all dependencies:**
```powershell
npm run install-all
```

3. **Set up environment variables:**
   - Copy `.env.example` files in each directory
   - Fill in your Firebase and API keys

4. **Start development servers:**
```powershell
npm start
```

## Coding Standards

### JavaScript/React
- Use ES6+ features
- Follow functional components with hooks
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused

### Python
- Follow PEP 8 style guide
- Use type hints where applicable
- Add docstrings for functions and classes

### General
- Write clear, descriptive commit messages
- Keep PRs focused on a single feature/fix
- Update tests when adding new functionality
- Update documentation for user-facing changes

## Project Structure

```
ai-content-writer/
├── frontend/          # React application
├── backend/           # Node.js API server
│   └── python_scripts/ # Python LLM service
├── docs/              # Documentation
└── .github/           # GitHub templates
```

## Testing

- Frontend: `cd frontend && npm test`
- Backend: `cd backend && npm test`
- Python: `cd backend/python_scripts && python -m pytest`

## Documentation

- Update README.md for major changes
- Update API_DOCUMENTATION.md for API changes
- Add JSDoc comments for new functions
- Update inline comments for complex logic

## Questions?

Feel free to open an issue with the "question" label or start a discussion in the GitHub Discussions tab.

Thank you for contributing! 🎉
