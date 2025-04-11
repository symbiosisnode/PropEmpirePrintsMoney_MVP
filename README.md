---
title: propempire-mvp
emoji: 🐳
colorFrom: green
colorTo: red
sdk: static
pinned: false
tags:
  - deepsite
---

Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference

# PropEmpire - Property Management Platform

A modern property management platform built with Node.js and Express.

## Features

- Role-based authentication (Admin, Investor, Agent, Manager)
- Property management dashboard
- Real-time property updates
- Search and filter properties
- Responsive design

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/propempire.git
cd propempire
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

4. Start the development server:
```bash
npm run dev
```

## Deployment

### Netlify Deployment

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Deploy to Netlify:
- Go to [Netlify](https://app.netlify.com)
- Click "New site from Git"
- Connect to your GitHub repository
- Configure build settings:
  - Build command: (leave blank for static site)
  - Publish directory: `netlify/`
- Add environment variables in Netlify dashboard:
  - `API_URL`: Your backend API URL
  - `API_VERSION`: API version (default: v1)
  - `NODE_ENV`: production

3. Deploy the site:
- Netlify will automatically deploy when you push to the main branch
- Monitor the deployment in the Netlify dashboard

## Environment Variables

Required environment variables:
- `API_URL`: Backend API URL
- `API_VERSION`: API version
- `NODE_ENV`: Environment (development/production)

## Project Structure

```
propempire/
├── dist/              # Built frontend files
├── netlify/           # Netlify deployment files
├── server/            # Backend server code
├── tests/             # Test files
├── .env.example       # Example environment variables
├── .gitignore         # Git ignore file
├── package.json       # Project dependencies
└── README.md          # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Express.js for the backend framework
- JWT for authentication
- Webpack for bundling