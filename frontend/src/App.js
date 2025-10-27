import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { FiSend, FiAlertTriangle, FiCheckCircle, FiLoader, FiShield } from 'react-icons/fi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://tweet-guard-435287385741.us-central1.run.app';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

// Gradient Background with animated mesh
const AppContainer = styled.div`
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  background: #0a0f1e;
  background-image: 
    radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(5, 150, 105, 0.1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.12) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(6, 78, 59, 0.1) 0px, transparent 50%);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(5, 150, 105, 0.06) 0%, transparent 40%);
    animation: ${pulse} 8s ease-in-out infinite;
    pointer-events: none;
  }
`;

// Glass morphism container
const Container = styled.div`
  max-width: 650px;
  width: calc(100% - 24px);
  margin: 12px;
  position: relative;
  z-index: 1;
`;

// Floating badge
const FloatingBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background: rgba(16, 185, 129, 0.2);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 50px;
  padding: 3px 10px;
  color: #10b981;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: ${float} 3s ease-in-out infinite;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.2);
`;

// Glass card with liquid effect
const GlassCard = styled.div`
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 0 0 1px rgba(16, 185, 129, 0.1);
  overflow: hidden;
  position: relative;
  max-height: calc(100vh - 24px);
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(16, 185, 129, 0.05),
      transparent
    );
    animation: ${shimmer} 8s infinite;
  }
`;

// Header with gradient
const Header = styled.div`
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%);
  border-bottom: 1px solid rgba(16, 185, 129, 0.1);
  padding: 18px 22px;
  text-align: center;
  position: relative;
  flex-shrink: 0;
`;

const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%);
  border-radius: 14px;
  margin-bottom: 12px;
  animation: ${glow} 3s ease-in-out infinite;
  border: 1px solid rgba(16, 185, 129, 0.3);
  
  svg {
    width: 24px;
    height: 24px;
    color: #10b981;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  margin: 6px 0 0 0;
  font-size: 0.8rem;
  color: rgba(148, 163, 184, 0.9);
  font-weight: 400;
`;

const MainContent = styled.div`
  padding: 20px 22px;
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.3);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(16, 185, 129, 0.3);
    border-radius: 10px;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const InputSection = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #e2e8f0;
  font-size: 0.8rem;
  letter-spacing: 0.3px;
`;

const TextAreaWrapper = styled.div`
  position: relative;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 90px;
  max-height: 90px;
  padding: 12px 14px;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 12px;
  font-size: 0.85rem;
  font-family: inherit;
  color: #e2e8f0;
  resize: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &:focus {
    outline: none;
    border-color: rgba(16, 185, 129, 0.5);
    background: rgba(15, 23, 42, 0.7);
    box-shadow: 
      inset 0 2px 4px rgba(0, 0, 0, 0.2),
      0 0 0 3px rgba(16, 185, 129, 0.1),
      0 8px 24px rgba(16, 185, 129, 0.15);
  }
  
  &::placeholder {
    color: rgba(148, 163, 184, 0.5);
  }
`;

const CharCount = styled.div`
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-size: 0.65rem;
  color: rgba(148, 163, 184, 0.6);
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  flex: 1;
  background: ${props => props.variant === 'secondary' 
    ? 'rgba(51, 65, 85, 0.6)' 
    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
  color: white;
  border: 1px solid ${props => props.variant === 'secondary' 
    ? 'rgba(148, 163, 184, 0.2)' 
    : 'rgba(16, 185, 129, 0.3)'};
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 28px rgba(16, 185, 129, 0.3),
      0 0 40px rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.5);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ResultSection = styled.div`
  margin-top: 16px;
  padding: 16px;
  border-radius: 14px;
  background: ${props => props.isFoul 
    ? 'rgba(239, 68, 68, 0.1)' 
    : 'rgba(16, 185, 129, 0.1)'};
  border: 1px solid ${props => props.isFoul 
    ? 'rgba(239, 68, 68, 0.3)' 
    : 'rgba(16, 185, 129, 0.3)'};
  backdrop-filter: blur(20px);
  animation: ${glow} 3s ease-in-out infinite;
  box-shadow: ${props => props.isFoul 
    ? '0 8px 32px rgba(239, 68, 68, 0.2)' 
    : '0 8px 32px rgba(16, 185, 129, 0.2)'};
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const ResultTitle = styled.h3`
  margin: 0;
  color: ${props => props.isFoul ? '#ef4444' : '#10b981'};
  font-size: 1rem;
  font-weight: 700;
  text-shadow: 0 2px 8px ${props => props.isFoul 
    ? 'rgba(239, 68, 68, 0.3)' 
    : 'rgba(16, 185, 129, 0.3)'};
`;

const ConfidenceBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ConfidenceFill = styled.div`
  height: 100%;
  background: ${props => props.isFoul 
    ? 'linear-gradient(90deg, #ef4444, #dc2626)' 
    : 'linear-gradient(90deg, #10b981, #059669)'};
  width: ${props => props.confidence * 100}%;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 20px ${props => props.isFoul 
    ? 'rgba(239, 68, 68, 0.5)' 
    : 'rgba(16, 185, 129, 0.5)'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

const ConfidenceText = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #e2e8f0;
  margin-top: 8px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 12px;
`;

const MetricItem = styled.div`
  padding: 10px;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  
  strong {
    color: #10b981;
    display: block;
    margin-bottom: 4px;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  span {
    color: #e2e8f0;
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  margin-top: 16px;
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 0.85rem;
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
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
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 16px;
`;

const StatCard = styled.div`
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(20px);
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(148, 163, 184, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(16, 185, 129, 0.3);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);
  }
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.65rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, foul: 0, proper: 0 });

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, { text });
      setResult(response.data);
      
      // Update stats
      setStats(prev => ({
        total: prev.total + 1,
        foul: prev.foul + (response.data.prediction === 'Foul' ? 1 : 0),
        proper: prev.proper + (response.data.prediction === 'Proper' ? 1 : 0)
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
        <GlassCard>
          <Header>
            <IconWrapper>
              <FiShield />
            </IconWrapper>
            <Title>TweetGuard</Title>
            <Subtitle>AI-powered hate speech detection with 97% accuracy</Subtitle>
          </Header>

          <MainContent>
            <InputSection>
              <Label>✨ Enter text to analyze</Label>
              <TextAreaWrapper>
                <TextArea
                  placeholder="Type or paste your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={1000}
                />
                <CharCount>{text.length}/1000</CharCount>
              </TextAreaWrapper>
            </InputSection>

            <ButtonGroup>
              <Button onClick={handleAnalyze} disabled={loading || !text.trim()}>
                {loading ? (
                  <>
                    <LoadingSpinner><FiLoader /></LoadingSpinner>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Analyze Text
                  </>
                )}
              </Button>
              <Button variant="secondary" onClick={handleClear}>
                Clear
              </Button>
            </ButtonGroup>

            {error && (
              <ErrorMessage>
                <FiAlertTriangle />
                {error}
              </ErrorMessage>
            )}

            {result && (
              <ResultSection isFoul={result.prediction === 'Foul'}>
                <ResultHeader>
                  {result.prediction === 'Foul' ? (
                    <FiAlertTriangle size={20} />
                  ) : (
                    <FiCheckCircle size={20} />
                  )}
                  <ResultTitle isFoul={result.prediction === 'Foul'}>
                    {result.prediction === 'Foul' ? 'Foul Language Detected' : 'Content is Proper'}
                  </ResultTitle>
                </ResultHeader>

                <ConfidenceBar>
                  <ConfidenceFill 
                    confidence={result.confidence}
                    isFoul={result.prediction === 'Foul'}
                  />
                </ConfidenceBar>

                <ConfidenceText>
                  {(result.confidence * 100).toFixed(1)}% Confident
                </ConfidenceText>

                <MetricsGrid>
                  <MetricItem>
                    <strong>Prediction</strong>
                    <span>{result.prediction}</span>
                  </MetricItem>
                  <MetricItem>
                    <strong>Probability</strong>
                    <span>{(result.probability * 100).toFixed(1)}%</span>
                  </MetricItem>
                </MetricsGrid>
              </ResultSection>
            )}

            <StatsSection>
              <StatCard>
                <StatValue>{stats.total}</StatValue>
                <StatLabel>Total Analyzed</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{stats.foul}</StatValue>
                <StatLabel>Foul Detected</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{stats.proper}</StatValue>
                <StatLabel>Proper Content</StatLabel>
              </StatCard>
            </StatsSection>
          </MainContent>
        </GlassCard>
      </Container>
    </AppContainer>
  );
}

export default App;
