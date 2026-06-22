import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import CandidateRanking from '../CandidateRanking';
import { resultService } from '../../services/apiService';

// Mock the API service
jest.mock('../../services/apiService', () => ({
  resultService: {
    getRanking: jest.fn()
  }
}));

// Mock antd components
jest.mock('antd', () => ({
  Table: ({ dataSource, columns }) => (
    <div data-testid="table">
      {dataSource && dataSource.map((item, index) => (
        <div key={index} data-testid="table-row">
          <span>Rank: {item.rank}</span>
          <span>Name: {item.candidateId?.name}</span>
          <span>Score: {item.percentageMatch}</span>
        </div>
      ))}
    </div>
  ),
  Tag: ({ children, color }) => (
    <span data-testid="tag" data-color={color}>{children}</span>
  ),
  Card: ({ children, title }) => (
    <div data-testid="card" data-title={title}>
      {children}
    </div>
  ),
  Spin: ({ children, spinning }) => (
    <div data-testid="spin" data-spinning={spinning}>
      {children}
    </div>
  ),
  message: {
    error: jest.fn()
  }
}));

const mockRankingData = {
  job: {
    id: 'job123',
    title: 'Software Engineer'
  },
  ranking: [
    {
      _id: 'result1',
      rank: 1,
      candidateId: { name: 'John Doe', email: 'john@example.com' },
      percentageMatch: 95,
      matchedSkills: [
        { skill: 'JavaScript' },
        { skill: 'React' }
      ]
    },
    {
      _id: 'result2',
      rank: 2,
      candidateId: { name: 'Jane Smith', email: 'jane@example.com' },
      percentageMatch: 88,
      matchedSkills: [
        { skill: 'Node.js' },
        { skill: 'MongoDB' }
      ]
    },
    {
      _id: 'result3',
      rank: 3,
      candidateId: { name: 'Bob Johnson', email: 'bob@example.com' },
      percentageMatch: 75,
      matchedSkills: [
        { skill: 'Python' }
      ]
    }
  ],
  totalApplicants: 3,
  averageScore: 86
};

describe('CandidateRanking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render "Please select a job to view candidate ranking" when no jobId provided', () => {
    render(<CandidateRanking jobId={null} />);

    expect(screen.getByText('Please select a job to view candidate ranking')).toBeInTheDocument();
  });

  it('should render "Please select a job to view candidate ranking" when jobId is undefined', () => {
    render(<CandidateRanking />);

    expect(screen.getByText('Please select a job to view candidate ranking')).toBeInTheDocument();
  });

  it('should fetch and display ranking data when jobId is provided', async () => {
    resultService.getRanking.mockResolvedValue({
      data: mockRankingData
    });

    await act(async () => {
      render(<CandidateRanking jobId="job123" />);
    });

    await waitFor(() => {
      expect(resultService.getRanking).toHaveBeenCalledWith('job123');
    });

    // Check if job title is displayed
    expect(screen.getByText('Candidate Ranking - Software Engineer')).toBeInTheDocument();

    // Check if summary statistics are displayed
    expect(screen.getByText('Total Applicants: 3')).toBeInTheDocument();
    expect(screen.getByText('Average Score: 86%')).toBeInTheDocument();
  });

  it('should display loading spinner while fetching data', () => {
    resultService.getRanking.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<CandidateRanking jobId="job123" />);

    const spinElement = screen.getByTestId('spin');
    expect(spinElement).toHaveAttribute('data-spinning', 'true');
  });

  it('should render table with ranking data', async () => {
    resultService.getRanking.mockResolvedValue({
      data: mockRankingData
    });

    await act(async () => {
      render(<CandidateRanking jobId="job123" />);
    });

    await waitFor(() => {
      const tableElement = screen.getByTestId('table');
      expect(tableElement).toBeInTheDocument();

      const rows = screen.getAllByTestId('table-row');
      expect(rows).toHaveLength(3);
    });

    // Check if ranking data is displayed
    expect(screen.getByText('Rank: 1')).toBeInTheDocument();
    expect(screen.getByText('Name: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Score: 95')).toBeInTheDocument();

    expect(screen.getByText('Rank: 2')).toBeInTheDocument();
    expect(screen.getByText('Name: Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Score: 88')).toBeInTheDocument();

    expect(screen.getByText('Rank: 3')).toBeInTheDocument();
    expect(screen.getByText('Name: Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('Score: 75')).toBeInTheDocument();
  });

  it('should display matched skills as tags', async () => {
    resultService.getRanking.mockResolvedValue({
      data: mockRankingData
    });

    await act(async () => {
      render(<CandidateRanking jobId="job123" />);
    });

    await waitFor(() => {
      const tags = screen.getAllByTestId('tag');
      expect(tags).toHaveLength(5); // 2 + 2 + 1 skills

      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('MongoDB')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
    });
  });

  it('should display score tags with appropriate colors', async () => {
    resultService.getRanking.mockResolvedValue({
      data: mockRankingData
    });

    await act(async () => {
      render(<CandidateRanking jobId="job123" />);
    });

    await waitFor(() => {
      const scoreTags = screen.getAllByTestId('tag').filter(tag =>
        tag.textContent.includes('%')
      );
      expect(scoreTags).toHaveLength(3);

      // Check color attributes (green for >=70, orange for >=40, red for <40)
      expect(scoreTags[0]).toHaveAttribute('data-color', 'green'); // 95%
      expect(scoreTags[1]).toHaveAttribute('data-color', 'green'); // 88%
      expect(scoreTags[2]).toHaveAttribute('data-color', 'green'); // 75%
    });
  });

  it('should handle API error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    resultService.getRanking.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(<CandidateRanking jobId="job123" />);
    });

    await waitFor(() => {
      expect(resultService.getRanking).toHaveBeenCalledWith('job123');
    });

    // The component should still render but without data
    expect(screen.getByTestId('card')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should not fetch data when jobId changes from null to undefined', () => {
    const { rerender } = render(<CandidateRanking jobId={null} />);

    rerender(<CandidateRanking jobId={undefined} />);

    expect(resultService.getRanking).not.toHaveBeenCalled();
  });

  it('should refetch data when jobId changes', async () => {
    resultService.getRanking.mockResolvedValue({
      data: mockRankingData
    });

    const { rerender } = render(<CandidateRanking jobId="job123" />);

    await waitFor(() => {
      expect(resultService.getRanking).toHaveBeenCalledWith('job123');
    });

    // Change jobId
    rerender(<CandidateRanking jobId="job456" />);

    await waitFor(() => {
      expect(resultService.getRanking).toHaveBeenCalledWith('job456');
    });

    expect(resultService.getRanking).toHaveBeenCalledTimes(2);
  });

  it('should handle empty ranking data', async () => {
    const emptyRankingData = {
      job: { title: 'Empty Job' },
      ranking: [],
      totalApplicants: 0,
      averageScore: 0
    };

    resultService.getRanking.mockResolvedValue({
      data: emptyRankingData
    });

    await act(async () => {
      render(<CandidateRanking jobId="job123" />);
    });

    await waitFor(() => {
      expect(screen.getByText('Total Applicants: 0')).toBeInTheDocument();
      expect(screen.getByText('Average Score: 0%')).toBeInTheDocument();

      const rows = screen.queryAllByTestId('table-row');
      expect(rows).toHaveLength(0);
    });
  });
});