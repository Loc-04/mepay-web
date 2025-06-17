import React, { useState, useEffect } from 'react';
import { Modal, Table } from 'react-bootstrap';
import { FaCog } from 'react-icons/fa';
import axios from 'axios';

const ActivityHistory = () => {
  const [show, setShow] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (show) {
      fetchActivities();
    }
  }, [show]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/activities/all-login-activities');
      // Filter only login activities
      const loginActivities = response.data.filter(
        (activity) => activity.type === 'account' && activity.category === 'login'
      );
      setActivities(loginActivities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <button
        onClick={handleShow}
        style={{
          background: '#4F8CFF',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          padding: '12px 0',
          fontWeight: 700,
          fontSize: 16,
          marginTop: 0,
          marginBottom: 16,
          cursor: 'pointer',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'background 0.6s, color 0.6s',
        }}
      >
        <FaCog /> Activity History
      </button>

      <Modal show={show} onHide={handleClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Login Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : activities.length === 0 ? (
            <div className="text-center">No login activity found.</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{formatDate(activity.created_at)}</td>
                    <td>{activity.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ActivityHistory; 