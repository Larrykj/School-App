import React from 'react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

interface StudentIDCardProps {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    class?: { name: string };
    parent?: { user?: { phone?: string } };
    photoUrl?: string;
    bloodGroup?: string;
    dateOfBirth?: string;
  };
  schoolName: string;
  schoolLogo?: string;
}

export default function StudentIDCard({ student, schoolName, schoolLogo }: StudentIDCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // Generate QR code with student ID for verification
    QRCode.toDataURL(JSON.stringify({
      id: student.id,
      adm: student.admissionNumber,
      name: `${student.firstName} ${student.lastName}`
    }))
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error(err));
  }, [student]);

  return (
    <div className="w-[350px] h-[550px] bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg relative print:border-black print:shadow-none">
      {/* Header */}
      <div className="bg-indigo-900 text-white p-4 text-center h-[100px] flex flex-col items-center justify-center">
        {schoolLogo && <img src={schoolLogo} alt="Logo" className="h-10 w-10 mb-1" />}
        <h1 className="font-bold text-lg uppercase tracking-wider">{schoolName}</h1>
        <p className="text-xs text-indigo-200 uppercase tracking-widest">Student Identity Card</p>
      </div>

      {/* Photo Area */}
      <div className="flex justify-center -mt-10 mb-4 relative z-10">
        <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
          {student.photoUrl ? (
            <img src={student.photoUrl} alt="Student" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500 text-4xl font-bold">
              {student.firstName[0]}{student.lastName[0]}
            </div>
          )}
        </div>
      </div>

      {/* Student Details */}
      <div className="px-6 text-center space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 uppercase">
          {student.firstName} {student.lastName}
        </h2>
        <div className="text-indigo-600 font-bold text-lg mb-4">{student.admissionNumber}</div>
        
        <div className="grid grid-cols-2 gap-2 text-left text-sm mt-6">
          <div className="text-gray-500">Class/Grade:</div>
          <div className="font-semibold">{student.class?.name || 'N/A'}</div>
          
          <div className="text-gray-500">DOB:</div>
          <div className="font-semibold">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
          
          <div className="text-gray-500">Blood Group:</div>
          <div className="font-semibold">{student.bloodGroup || 'N/A'}</div>
          
          <div className="text-gray-500">Emergency:</div>
          <div className="font-semibold">{student.parent?.user?.phone || 'N/A'}</div>
        </div>
      </div>

      {/* Footer / QR Code */}
      <div className="absolute bottom-0 w-full p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          <p>Property of {schoolName}.</p>
          <p>If found, please return.</p>
        </div>
        {qrCodeUrl && (
          <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16" />
        )}
      </div>
      
      {/* Decorative strip */}
      <div className="absolute top-[98px] left-0 w-full h-2 bg-yellow-500"></div>
    </div>
  );
}
