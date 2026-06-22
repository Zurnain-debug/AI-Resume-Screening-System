import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobManagement from '../JobManagement';
import { jobService } from '../../services/apiService';

// Mock the API service
jest.mock('../../services/apiService', () => ({
  jobService: {
    getJobs: jest.fn(),
    createJob: jest.fn(),
    updateJob: jest.fn(),
    deleteJob: jest.fn()
  }
}));

// Mock antd components
jest.mock('antd', () => {
  const mockForm = {
    resetFields: jest.fn(),
    setFieldsValue: jest.fn(),
    validateFields: jest.fn().mockResolvedValue({}),
    getFieldsValue: jest.fn().mockReturnValue({
      title: 'Software Engineer',
      description: 'Develop web applications',
      requiredSkills: 'JavaScript, React',
      experienceLevel: 'Mid'
    }),
    submit: jest.fn(async function () {
      if (typeof mockForm.onFinish === 'function') {
        await mockForm.onFinish(mockForm.getFieldsValue());
      }
    }),
    onFinish: null
  };

  const Form = ({ onFinish, children }) => {
    mockForm.onFinish = onFinish;
    return <div data-testid="form">{children}</div>;
  };

  Form.useForm = () => [mockForm];
  Form.Item = ({ children, name, label }) => (
    <div data-testid="form-item" data-name={name} data-label={label}>
      {children}
    </div>
  );

  const Input = ({ placeholder, onChange, value, rows }) => (
    rows ? (
      <textarea
        data-testid="textarea"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        rows={rows}
      />
    ) : (
      <input
        data-testid="input"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    )
  );

  Input.TextArea = Input;

  const Option = ({ value, children }) => (
    <option value={value}>{children}</option>
  );

  const Select = ({ children, placeholder, onChange, value }) => (
    <select data-testid="select" placeholder={placeholder} onChange={onChange} value={value}>
      {children}
    </select>
  );

  Select.Option = Option;

  return {
    Table: ({ dataSource, loading, columns }) => (
      <div data-testid="table" data-loading={loading}>
        {dataSource && dataSource.map((item, index) => (
          <div key={index} data-testid="table-row">
            {columns.map((column) => (
              <div key={column.key || column.dataIndex}>
                {column.render ? column.render(item[column.dataIndex], item) : item[column.dataIndex]}
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
    Button: ({ children, onClick, icon, type, ...rest }) => (
      <button
        data-testid="button"
        data-type={type}
        onClick={onClick}
        {...rest}
      >
        {icon && <span>icon</span>}
        {children}
      </button>
    ),
    Modal: ({ visible, onCancel, onOk, title, children }) => (
      visible ? (
        <div data-testid="modal" data-title={title}>
          <div>{children}</div>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onOk}>OK</button>
        </div>
      ) : null
    ),
    Form,
    Input,
    Select,
    Space: ({ children }) => <div data-testid="space">{children}</div>,
    Tag: ({ children, color }) => (
      <span data-testid="tag" data-color={color}>{children}</span>
    ),
    message: {
      success: jest.fn(),
      error: jest.fn()
    }
  };
});

// Mock antd icons
jest.mock('@ant-design/icons', () => ({
  PlusOutlined: () => <span>plus-icon</span>,
  DeleteOutlined: () => <span>delete-icon</span>,
  EditOutlined: () => <span>edit-icon</span>
}));

const mockJobs = [
  {
    _id: 'job1',
    title: 'Software Engineer',
    status: 'Open',
    requiredSkills: ['JavaScript', 'React'],
    description: 'Develop web applications',
    experienceLevel: 'Mid'
  },
  {
    _id: 'job2',
    title: 'Data Scientist',
    status: 'Closed',
    requiredSkills: ['Python', 'Machine Learning'],
    description: 'Analyze data',
    experienceLevel: 'Senior'
  }
];

describe('JobManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jobService.getJobs.mockResolvedValue({ data: mockJobs });
  });

  it('should fetch and display jobs on mount', async () => {
    await act(async () => {
      render(<JobManagement />);
    });

    await waitFor(() => {
      expect(jobService.getJobs).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Data Scientist')).toBeInTheDocument();
  });

  it('should display create job button', () => {
    render(<JobManagement />);

    const createButton = screen.getByText('Create Job');
    expect(createButton).toBeInTheDocument();
    expect(createButton.closest('button')).toHaveAttribute('data-type', 'primary');
  });

  it('should display loading state while fetching jobs', () => {
    jobService.getJobs.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<JobManagement />);

    const table = screen.getByTestId('table');
    expect(table).toHaveAttribute('data-loading', 'true');
  });

  it('should display job status as colored tags', async () => {
    await act(async () => {
      render(<JobManagement />);
    });

    await waitFor(() => {
      const tags = screen.getAllByTestId('tag');
      expect(tags).toHaveLength(2);

      const openTag = tags.find(tag => tag.textContent === 'Open');
      const closedTag = tags.find(tag => tag.textContent === 'Closed');

      expect(openTag).toHaveAttribute('data-color', 'green');
      expect(closedTag).toHaveAttribute('data-color', 'red');
    });
  });

  it('should display required skills as tags', async () => {
    await act(async () => {
      render(<JobManagement />);
    });

    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
    });
  });

  it('should open create modal when create button is clicked', async () => {
    await act(async () => {
      render(<JobManagement />);
    });

    const createButton = screen.getByText('Create Job');
    fireEvent.click(createButton);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal')).toHaveAttribute('data-title', 'Create Job');
  });

  it('should open edit modal when edit button is clicked', async () => {
    await act(async () => {
      render(<JobManagement />);
    });

    await waitFor(() => {
      const editButton = screen.getByTestId('edit-job1');
      fireEvent.click(editButton);
    });

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal')).toHaveAttribute('data-title', 'Edit Job');
  });

  it('should show confirmation modal when delete button is clicked', async () => {
    // Mock window.confirm
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    await act(async () => {
      render(<JobManagement />);
    });

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-job1');
      fireEvent.click(deleteButton);
    });

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this job?');
    expect(jobService.deleteJob).toHaveBeenCalledWith('job1');

    confirmSpy.mockRestore();
  });

  it('should call createJob API when form is submitted for new job', async () => {
    jobService.createJob.mockResolvedValue({ data: { _id: 'newJob', ...mockJobs[0] } });

    await act(async () => {
      render(<JobManagement />);
    });

    const createButton = screen.getByText('Create Job');
    await act(async () => {
      fireEvent.click(createButton);
    });

    // Simulate form submission
    const modal = screen.getByTestId('modal');
    const okButton = modal.querySelector('button:last-child');
    await act(async () => {
      fireEvent.click(okButton);
    });

    await waitFor(() => {
      expect(jobService.createJob).toHaveBeenCalled();
    });
  });

  it('should call updateJob API when form is submitted for existing job', async () => {
    jobService.updateJob.mockResolvedValue({ data: mockJobs[0] });

    await act(async () => {
      render(<JobManagement />);
    });

    await waitFor(() => {
      const editButton = screen.getByTestId('edit-job1');
      fireEvent.click(editButton);
    });

    const modal = screen.getByTestId('modal');
    const okButton = modal.querySelector('button:last-child');
    await act(async () => {
      fireEvent.click(okButton);
    });

    await waitFor(() => {
      expect(jobService.updateJob).toHaveBeenCalledWith('job1', expect.any(Object));
    });
  });

  it('should refresh jobs list after successful create', async () => {
    jobService.createJob.mockResolvedValue({ data: { _id: 'newJob', title: 'New Job' } });

    await act(async () => {
      render(<JobManagement />);
    });

    const createButton = screen.getByText('Create Job');
    fireEvent.click(createButton);

    const modal = screen.getByTestId('modal');
    const okButton = modal.querySelector('button:last-child');
    fireEvent.click(okButton);

    await waitFor(() => {
      expect(jobService.getJobs).toHaveBeenCalledTimes(2); // Initial load + refresh
    });
  });

  it('should refresh jobs list after successful update', async () => {
    jobService.updateJob.mockResolvedValue({ data: mockJobs[0] });

    await act(async () => {
      render(<JobManagement />);
    });

    await waitFor(() => {
      const editButton = screen.getByTestId('edit-job1');
      fireEvent.click(editButton);
    });

    const modal = screen.getByTestId('modal');
    const okButton = modal.querySelector('button:last-child');
    fireEvent.click(okButton);

    await waitFor(() => {
      expect(jobService.getJobs).toHaveBeenCalledTimes(2); // Initial load + refresh
    });
  });

  it('should refresh jobs list after successful delete', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    jobService.deleteJob.mockResolvedValue({ data: { message: 'Job deleted' } });

    await act(async () => {
      render(<JobManagement />);
    });

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-job1');
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(jobService.getJobs).toHaveBeenCalledTimes(2); // Initial load + refresh
    });

    confirmSpy.mockRestore();
  });

  it('should handle API errors gracefully', async () => {
    jobService.getJobs.mockRejectedValue(new Error('API Error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(<JobManagement />);
    });

    await waitFor(() => {
      expect(jobService.getJobs).toHaveBeenCalled();
    });

    // Component should still render
    expect(screen.getByTestId('table')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should close modal after successful operation', async () => {
    jobService.createJob.mockResolvedValue({ data: { _id: 'newJob' } });

    await act(async () => {
      render(<JobManagement />);
    });

    const createButton = screen.getByText('Create Job');
    fireEvent.click(createButton);

    expect(screen.getByTestId('modal')).toBeInTheDocument();

    const modal = screen.getByTestId('modal');
    const okButton = modal.querySelector('button:last-child');
    fireEvent.click(okButton);

    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });
});