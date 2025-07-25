import React, { useState } from 'react';

const GoalForm = ({ onAddGoal }) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newGoal = {
      title,
      targetAmount: parseFloat(targetAmount),
      savedAmount: 0,
      deadline
    };

    fetch('http://localhost:3001/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newGoal)
    })
      .then((res) => res.json())
      .then((data) => {
        onAddGoal(data); // call parent to update state
        // Reset form
        setTitle('');
        setTargetAmount('');
        setDeadline('');
      })
      .catch((error) => console.error('Error adding goal:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Goal</h3>
      <input
        type="text"
        placeholder="Goal Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br />
      <input
        type="number"
        placeholder="Target Amount"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        required
      />
      <br />
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />
      <br />
      <button type="submit">Add Goal</button>
    </form>
  );
};

export default GoalForm;