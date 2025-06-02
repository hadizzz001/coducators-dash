'use client';

import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSearchParams } from 'next/navigation';

const WorkDetails = () => {
  const [data, setData] = useState(null);
  const searchParams = useSearchParams();
  const search = searchParams.get('id');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/coll/${search}`);
      const json = await res.json();
      setData(json);
    };

    if (search) {
      fetchData();
    }
  }, [search]);

  if (!data) return <p className="text-center mt-4">Loading...</p>;

  const {
    organizationName,
    contactPerson,
    phone,
    email,
    website,
    location,
    preferredDays,
    preferredTimes,
    startDate,
    duration,
    sessionOther,
    sessions,
    targetAgeGroup,
    studentCount,
    hasRooms,
    ownDevices,
    wifiAccess,
    needEquipment,
    additionalNotes
  } = data.data;

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Collaboration Request Details</h3>
      <table className="table table-striped">
        <tbody> 
          <tr>
            <th>Organization Name</th>
            <td>{organizationName}</td>
          </tr>
          <tr>
            <th>Contact Person</th>
            <td>{contactPerson}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{phone}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{email}</td>
          </tr>
          <tr>
            <th>Website</th>
            <td>{website}</td>
          </tr>
          <tr>
            <th>Location</th>
            <td>{location}</td>
          </tr>
          <tr>
            <th>Preferred Days</th>
            <td>{preferredDays}</td>
          </tr>
          <tr>
            <th>Preferred Times</th>
            <td>{preferredTimes}</td>
          </tr>
          <tr>
            <th>Start Date</th>
            <td>{startDate}</td>
          </tr>
          <tr>
            <th>Duration</th>
            <td>{duration}</td>
          </tr>
          <tr>
            <th>Other Session Info</th>
            <td>{sessionOther}</td>
          </tr>
          <tr>
            <th>Sessions</th>
            <td>{sessions?.join(', ')}</td>
          </tr>
          <tr>
            <th>Target Age Group</th>
            <td>{targetAgeGroup}</td>
          </tr>
          <tr>
            <th>Student Count</th>
            <td>{studentCount}</td>
          </tr>
          <tr>
            <th>Has Rooms</th>
            <td>{hasRooms}</td>
          </tr>
          <tr>
            <th>Own Devices</th>
            <td>{ownDevices}</td>
          </tr>
          <tr>
            <th>WiFi Access</th>
            <td>{wifiAccess}</td>
          </tr>
          <tr>
            <th>Need Equipment</th>
            <td>{needEquipment}</td>
          </tr>
          <tr>
            <th>Additional Notes</th>
            <td>{additionalNotes}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WorkDetails;
