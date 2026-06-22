import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsDashboard from '../AnalyticsDashboard';
import { resultService } from '../../services/apiService';

// Mock the API service
jest.mock('../../services/apiService', () => ({
  resultService: {
    getAnalytics: jest.fn()
  }
}));

// Mock antd components
jest.mock('antd', () => ({
  Card: ({ children, title }) => <div data-testid="card" data-title={title}>{children}</div>,
  Spin: ({ children, spinning }) => (
    <div data-testid="spin" data-spinning={spinning}>
      {children}
    </div>
  ),
  Statistic: ({ title, value }) => (
    <div data-testid="statistic">
      <div>{title}</div>
      <div>{value}</div>
    </div>
  ),
  message: {
    error: jest.fn()
  }
}));

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data }) => <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)} />
}));

// Mock Chart.js
jest.mock('chart.js', () => ({}));

const mockAnalyticsData = {
  totalApplicants: 25,
  averageScore: 72,
  highMatches: 15,
  mediumMatches: 7,
  lowMatches: 3,
  topMatches: [
    { candidateName: 'John Doe', score: 95 },
    { candidateName: 'Jane Smith', score: 88 },
    { candidateName: 'Bob Johnson', score: 82 }
  ],
  distributionChart: {
    labels: ['70-100%', '40-70%', '<40%'],
    data: [15, 7, 3]
  }
};

describe('AnalyticsDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render "Please select a job to view analytics" when no jobId provided', () => {
    render(<AnalyticsDashboard jobId={null} />);

    expect(screen.getByText('Please select a job to view analytics')).toBeInTheDocument();
  });

  it('should render "Please select a job to view analytics" when jobId is undefined', () => {
    render(<AnalyticsDashboard />);

    expect(screen.getByText('Please select a job to view analytics')).toBeInTheDocument();
  });

  it('should fetch and display analytics data when jobId is provided', async () => {
    resultService.getAnalytics.mockResolvedValue({
      data: mockAnalyticsData
    });

    await act(async () => {
      render(<AnalyticsDashboard jobId="job123" />);
    });

    await waitFor(() => {
      expect(resultService.getAnalytics).toHaveBeenCalledWith('job123');
    });

    // Check if statistics are displayed
    expect(screen.getByText('Total Applicants')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Average Score')).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument();
    expect(screen.getByText('High Matches')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Medium Matches')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should display loading spinner while fetching data', () => {
    resultService.getAnalytics.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<AnalyticsDashboard jobId="job123" />);

    const spinElement = screen.getByTestId('spin');
    expect(spinElement).toHaveAttribute('data-spinning', 'true');
  });

  it('should display bar chart with distribution data', async () => {
    resultService.getAnalytics.mockResolvedValue({
      data: mockAnalyticsData
    });

    await act(async () => {
      render(<AnalyticsDashboard jobId="job123" />);
    });

    await waitFor(() => {
      const chartElement = screen.getByTestId('bar-chart');
      expect(chartElement).toBeInTheDocument();

      const chartData = JSON.parse(chartElement.getAttribute('data-chart-data'));
      expect(chartData.labels).toEqual(['70-100%', '40-70%', '<40%']);
      expect(chartData.datasets[0].data).toEqual([15, 7, 3]);
    });
  });

  it('should display top matches section', async () => {
    resultService.getAnalytics.mockResolvedValue({
      data: mockAnalyticsData
    });

    await act(async () => {
      render(<AnalyticsDashboard jobId="job123" />);
    });

    await waitFor(() => {
      expect(screen.getByText('Top Matches')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Score: 95%')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Score: 88%')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.getByText('Score: 82%')).toBeInTheDocument();
    });
  });

  it('should handle API error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    resultService.getAnalytics.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(<AnalyticsDashboard jobId="job123" />);
    });

    await waitFor(() => {
      expect(resultService.getAnalytics).toHaveBeenCalledWith('job123');
    });

    // The component should still render but without data
    expect(screen.getByTestId('card')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should not fetch data when jobId changes from null to undefined', () => {
    const { rerender } = render(<AnalyticsDashboard jobId={null} />);

    rerender(<AnalyticsDashboard jobId={undefined} />);

    expect(resultService.getAnalytics).not.toHaveBeenCalled();
  });

  it('should refetch data when jobId changes', async () => {
    resultService.getAnalytics.mockResolvedValue({
      data: mockAnalyticsData
    });

    const { rerender } = render(<AnalyticsDashboard jobId="job123" />);

    await waitFor(() => {
      expect(resultService.getAnalytics).toHaveBeenCalledWith('job123');
    });

    // Change jobId
    rerender(<AnalyticsDashboard jobId="job456" />);

    await waitFor(() => {
      expect(resultService.getAnalytics).toHaveBeenCalledWith('job456');
    });

    expect(resultService.getAnalytics).toHaveBeenCalledTimes(2);
  });
});