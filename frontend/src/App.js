import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FiSend, FiAlertTriangle, FiCheckCircle, FiLoader } from 'react-icons/fi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://tweet-guard-435287385741.us-central1.run.app';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 30px;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 10px 0 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
`;

const MainContent = styled.div`
  padding: 40px;
`;

const InputSection = styled.div`
  margin-bottom: 30px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 15px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  border-radius: 10px;
  background: ${props => props.isFoul ? '#ffe6e6' : '#e6f7e6'};
  border: 2px solid ${props => props.isFoul ? '#ff6b6b' : '#4caf50'};
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const ResultTitle = styled.h3`
  margin: 0;
  color: ${props => props.isFoul ? '#d32f2f' : '#2e7d32'};
  font-size: 1.3rem;
`;

const ConfidenceBar = styled.div`
  width: 100%;
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  background: ${props => props.isFoul ? 'linear-gradient(90deg, #ff6b6b, #ee5a24)' : 'linear-gradient(90deg, #4caf50, #2e7d32)'};
  width: ${props => props.confidence * 100}%;
  transition: width 0.3s ease;
`;

const ConfidenceText = styled.div`
  text-align: center;
  font-weight: 600;
  color: #333;
  margin-top: 5px;
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 10px;
  border: 2px solid #ffcdd2;
  margin-top: 20px;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  border: 2px solid #e9ecef;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPredictions: 0,
    foulPredictions: 0,
    properPredictions: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, {
        text: text.trim()
      });

      setResult(response.data);
      
      // Update stats
      setStats(prev => ({
        totalPredictions: prev.totalPredictions + 1,
        foulPredictions: prev.foulPredictions + (response.data.prediction === 1 ? 1 : 0),
        properPredictions: prev.properPredictions + (response.data.prediction === 0 ? 1 : 0)
      }));

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  return (
    <AppContainer>
      <Container>
        <Header>
          <Title>Hate Speech Detection</Title>
          <Subtitle>AI-powered tool to detect hate speech and offensive language</Subtitle>
        </Header>

        <MainContent>
          <form onSubmit={handleSubmit}>
            <InputSection>
              <Label htmlFor="text-input">Enter text to analyze:</Label>
              <TextArea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                maxLength={1000}
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <Button type="submit" disabled={loading || !text.trim()}>
                  {loading ? <LoadingSpinner><FiLoader /></LoadingSpinner> : <FiSend />}
                  {loading ? 'Analyzing...' : 'Analyze Text'}
                </Button>
                <Button type="button" onClick={handleClear} style={{ background: '#6c757d' }}>
                  Clear
                </Button>
              </div>
            </InputSection>
          </form>

          {error && (
            <ErrorMessage>
              <FiAlertTriangle style={{ marginRight: '8px' }} />
              {error}
            </ErrorMessage>
          )}

          {result && (
            <ResultSection isFoul={result.prediction === 1}>
              <ResultHeader>
                {result.prediction === 1 ? <FiAlertTriangle color="#d32f2f" /> : <FiCheckCircle color="#2e7d32" />}
                <ResultTitle isFoul={result.prediction === 1}>
                  {result.label}
                </ResultTitle>
              </ResultHeader>
              
              <div>
                <strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%
                <ConfidenceBar>
                  <ConfidenceFill 
                    confidence={result.confidence} 
                    isFoul={result.prediction === 1}
                  />
                </ConfidenceBar>
                <ConfidenceText>
                  {(result.confidence * 100).toFixed(1)}% confident
                </ConfidenceText>
              </div>

              <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
                <div><strong>Raw Probability:</strong> {(result.probability * 100).toFixed(1)}%</div>
                <div><strong>Threshold:</strong> {(result.threshold * 100).toFixed(1)}%</div>
              </div>
            </ResultSection>
          )}

          <StatsSection>
            <StatCard>
              <StatValue>{stats.totalPredictions}</StatValue>
              <StatLabel>Total Predictions</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue style={{ color: '#ff6b6b' }}>{stats.foulPredictions}</StatValue>
              <StatLabel>Foul Detected</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue style={{ color: '#4caf50' }}>{stats.properPredictions}</StatValue>
              <StatLabel>Proper Content</StatLabel>
            </StatCard>
          </StatsSection>
        </MainContent>
      </Container>
    </AppContainer>
  );
}

export default App;
