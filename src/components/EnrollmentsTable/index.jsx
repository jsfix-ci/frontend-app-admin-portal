import React from 'react';

import TableContainer from '../../containers/TableContainer';
import { formatTimestamp, formatPassedTimestamp, formatPercentage } from '../../utils';
import EnterpriseDataApiService from '../../data/services/EnterpriseDataApiService';

const EnrollmentsTable = () => {
  const enrollmentTableColumns = [
    {
      label: 'Email',
      key: 'user_email',
      columnSortable: true,
    },
    {
      label: 'Course Title',
      key: 'course_title',
      columnSortable: true,
    },
    {
      label: 'Course Price',
      key: 'course_list_price',
      columnSortable: true,
    },
    {
      label: 'Start Date',
      key: 'course_start_date',
      columnSortable: true,
    },
    {
      label: 'End Date',
      key: 'course_end_date',
      columnSortable: true,
    },
    {
      label: 'Passed Date',
      key: 'passed_date',
      columnSortable: true,
    },
    {
      label: 'Current Grade',
      key: 'current_grade',
      columnSortable: true,
    },
    {
      label: 'Progress Status',
      key: 'progress_status',
      columnSortable: true,
    },
    {
      label: 'Last Activity Date',
      key: 'last_activity_date',
      columnSortable: true,
    },
  ];

  const formatEnrollmentData = enrollments => enrollments.map(enrollment => ({
    ...enrollment,
    user_email: <span data-hj-suppress>{enrollment.user_email}</span>,
    last_activity_date: formatTimestamp({ timestamp: enrollment.last_activity_date }),
    course_start_date: formatTimestamp({ timestamp: enrollment.course_start_date }),
    course_end_date: formatTimestamp({ timestamp: enrollment.course_end_date }),
    enrollment_date: formatTimestamp({
      timestamp: enrollment.enrollment_date,
    }),
    passed_date: formatPassedTimestamp(enrollment.passed_date),
    user_account_creation_date: formatTimestamp({
      timestamp: enrollment.user_account_creation_date,
    }),
    progress_status: enrollment.progress_status,
    course_list_price: enrollment.course_list_price ? `$${enrollment.course_list_price}` : '',
    current_grade: formatPercentage({ decimal: enrollment.current_grade }),
  }));

  return (
    <TableContainer
      id="enrollments"
      className="enrollments"
      fetchMethod={EnterpriseDataApiService.fetchCourseEnrollments}
      columns={enrollmentTableColumns}
      formatData={formatEnrollmentData}
      tableSortable
    />
  );
};

export default EnrollmentsTable;
