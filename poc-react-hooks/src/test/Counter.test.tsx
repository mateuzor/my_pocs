import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '../components/Counter';

// describe groups related tests — keeps the output readable in CI
describe('Counter component', () => {

  it('renders initial count of 0', () => {
    render(<Counter />);
    // getByText queries the DOM like a user would — finds visible text
    expect(screen.getByText(/count is: 0/i)).toBeInTheDocument();
  });

  it('increments count when the increment button is clicked', () => {
    render(<Counter />);
    // getByRole finds elements by their ARIA role — more resilient than getByTestId
    const btn = screen.getByRole('button', { name: /count is: 0/i });
    fireEvent.click(btn);
    expect(screen.getByText(/count is: 1/i)).toBeInTheDocument();
  });

  it('increments the useReducer counter with Add 1 button', () => {
    render(<Counter />);
    const addBtn = screen.getByRole('button', { name: /add 1/i });
    fireEvent.click(addBtn);
    // The reducer counter starts at 0 and increments by 1
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('decrements the useReducer counter with Subtract 1 button', () => {
    render(<Counter />);
    const subBtn = screen.getByRole('button', { name: /subtract 1/i });
    fireEvent.click(subBtn);
    expect(screen.getByText('-1')).toBeInTheDocument();
  });

  it('multiplies the useReducer counter by 10', () => {
    render(<Counter />);
    const addBtn = screen.getByRole('button', { name: /add 1/i });
    const multiplyBtn = screen.getByRole('button', { name: /multiple per 10/i });
    fireEvent.click(addBtn);    // counter = 1
    fireEvent.click(multiplyBtn); // counter = 10
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
