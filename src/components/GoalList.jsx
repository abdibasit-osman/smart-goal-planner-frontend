import React, { useEffect, useState } from 'react';
import GoalForm from './GoalForm';

const GoalList = () => {
  const [goals, setGoals] = useState([]);
  const [goalToEdit, setGoalToEdit] = useState(null);

  const BASE_URL = "https://smart-goal-planner-backend-1.onrender.com";

  useEffect(() => {
    fetch(`${BASE_URL}/goals`)
      .then((res) => res.json())
      .then((data) => setGoals(data))
      .catch((error) => console.error('Error fetching goals:', error));
  }, []);

  const handleAddGoal = (newGoal) => {
    setGoals([...goals, newGoal]);
  };

  const handleUpdateGoal = (updatedGoal) => {
    setGoals(goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)));
    setGoalToEdit(null); // Clear editing state
  };

  return (
    <div>
      <GoalForm
        onAddGoal={handleAddGoal}
        onUpdateGoal={handleUpdateGoal}
        goalToEdit={goalToEdit}
      />

      <h2>My Goals</h2>
      {goals.length === 0 ? (
        <p>No goals found.</p>
      ) : (
        <ul>
          {goals.map((goal) => (
            <li key={goal.id}>
              <strong>{goal.title}</strong> - KES {goal.savedAmount} / {goal.targetAmount}
              <br />
              Deadline: {goal.deadline}

              {/* Deposit form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const amount = parseFloat(form.deposit.value);
                  if (!amount || amount <= 0) return;

                  const updatedAmount = goal.savedAmount + amount;

                  fetch(`${BASE_URL}/goals/${goal.id}`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ savedAmount: updatedAmount }),
                  })
                    .then((res) => res.json())
                    .then((updatedGoal) => {
                      setGoals(goals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
                      form.reset();
                    });
                }}
              >
                <input type="number" name="deposit" placeholder="KES deposit" required />
                <button type="submit">Deposit</button>
              </form>

              {/* Edit button */}
              <button
                style={{ marginLeft: '10px' }}
                onClick={() => setGoalToEdit(goal)}
              >
                Edit
              </button>

              {/* Delete button */}
              <button
                style={{ marginLeft: '10px', color: 'red' }}
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${goal.title}"?`)) {
                    fetch(`${BASE_URL}/goals/${goal.id}`, {
                      method: 'DELETE',
                    })
                      .then(() => {
                        setGoals(goals.filter((g) => g.id !== goal.id));
                      })
                      .catch((error) => console.error('Error deleting goal:', error));
                  }
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoalList;