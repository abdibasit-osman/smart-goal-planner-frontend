import React, { useEffect, useState } from 'react';

const GoalForm = ({ onAddGoal, onUpdateGoal, goalToEdit }) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const BASE_URL = "https://smart-goal-planner-backend-1.onrender.com";

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setTargetAmount(goalToEdit.targetAmount);
      setDeadline(goalToEdit.deadline);
    }
  }, [goalToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const goalData = {
      title,
      targetAmount: parseFloat(targetAmount),
      deadline,
    };

    if (goalToEdit) {
      // Update existing goal
      fetch(`${BASE_URL}/goals/${goalToEdit.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      })
        .then((res) => res.json())
        .then((updatedGoal) => {
          onUpdateGoal(updatedGoal);
          resetForm();
        })
        .catch((error) => console.error('Error updating goal:', error));
    } else {
      // Add new goal
      fetch(`${BASE_URL}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...goalData, savedAmount: 0 }),
      })
        .then((res) => res.json())
        .then((data) => {
          onAddGoal(data);
          resetForm();
        })
        .catch((error) => console.error('Error adding goal:', error));
    }
  };

  const resetForm = () => {
    setTitle('');
    setTargetAmount('');
    setDeadline('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{goalToEdit ? 'Edit Goal' : 'Add New Goal'}</h3>
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
      <button type="submit">{goalToEdit ? 'Update Goal' : 'Add Goal'}</button>
    </form>
  );
};

export default GoalForm;