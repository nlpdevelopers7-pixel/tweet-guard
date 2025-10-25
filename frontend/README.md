# ⚛️ React Frontend

Modern React.js frontend for the hate speech detection system.

## 📁 Structure

```
frontend/
├── src/
│   ├── App.js              # Main React component
│   └── index.js            # Entry point
├── public/
│   └── index.html          # HTML template
├── components/             # React components
├── package.json            # Dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend/
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🎨 Features

- ✅ **Real-time Prediction**: Type and get instant results
- ✅ **Confidence Scores**: See prediction confidence
- ✅ **Threshold Control**: Adjust sensitivity
- ✅ **Responsive Design**: Works on all devices
- ✅ **Modern UI**: Clean, intuitive interface

## 🔧 Configuration

### API Endpoint
The frontend connects to the Flask API. Update the API URL in `src/App.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5004';
```

### Environment Variables
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5004
```

## 🎯 Usage

1. **Enter Text**: Type or paste a tweet in the text area
2. **Adjust Threshold**: Use the slider to control sensitivity
3. **Get Prediction**: Click "Analyze" to get results
4. **View Results**: See prediction, confidence, and probability

## 🧪 Testing

```bash
# Run frontend tests
npm test
```

## 🚀 Production Build

```bash
# Build for production
npm run build

# Serve production build
npm install -g serve
serve -s build
```

## 🐳 Docker

```bash
# Build frontend container
docker build -t tweet-guard-frontend .

# Run frontend container
docker run -p 3000:3000 tweet-guard-frontend
```

## 🎨 Customization

### Styling
- Uses Styled Components for styling
- Modify `src/App.js` for custom styles
- Responsive design with mobile support

### Components
- Main component: `App.js`
- Add new components in `components/` directory
- Follow React best practices
