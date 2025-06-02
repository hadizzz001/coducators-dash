 
'use client';

import { useEffect, useState } from 'react'; 
import { FaFilePdf } from 'react-icons/fa'; // Install react-icons if not yet
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useSearchParams } from 'next/navigation' 

const WorkDetails = () => { 
  const [data, setData] = useState(null);

    const searchParams = useSearchParams()
    const search = searchParams.get('id') 


 
 


  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/work/${search}`);
      const json = await res.json();
      setData(json);
    };

    if (search) {
      fetchData();
    }
  }, [search]);

  if (!data) return <p className="text-center mt-4">Loading...</p>;

  const {
    fullName,
    phone,
    email,
    dob,
    availableSaturday,
    city,
    commute,
    enrolledUniversity,
    languages,
    position,
    otherPosition,
    startDate,
    motivation,
    notes,
    cvUrl,
  } = data.data;

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Work Application Details</h3>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th>Full Name</th>
            <td>{fullName}</td>
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
            <th>Date of Birth</th>
            <td>{dob}</td>
          </tr>
          <tr>
            <th>Available on Saturday</th>
            <td>{availableSaturday}</td>
          </tr>
          <tr>
            <th>City</th>
            <td>{city}</td>
          </tr>
          <tr>
            <th>Commute</th>
            <td>{commute}</td>
          </tr>
          <tr>
            <th>Enrolled in University</th>
            <td>{enrolledUniversity}</td>
          </tr>
          <tr>
            <th>Languages</th>
            <td>{languages.join(', ')}</td>
          </tr>
          <tr>
            <th>Position</th>
            <td>{position}</td>
          </tr>
          <tr>
            <th>Other Position</th>
            <td>{otherPosition}</td>
          </tr>
          <tr>
            <th>Start Date</th>
            <td>{startDate}</td>
          </tr>
          <tr>
            <th>Motivation</th>
            <td>{motivation}</td>
          </tr>
          <tr>
            <th>Notes</th>
            <td>{notes}</td>
          </tr>
          <tr>
            <th>CV</th>
            <td>
              <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                <FaFilePdf size={24} color="red" /> Open CV
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WorkDetails;
