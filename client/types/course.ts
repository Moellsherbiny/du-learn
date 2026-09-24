
export type CourseData = {
  id: number | string;
  teacher: number | string;
  teacher_name: string | null;
  teacher_image: string | null;

  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;

  visibility: string;
  category: string | null;

  created_at: string;
  updated_at: string;
};

export type EnrollmentStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "SUSPENDED"
  | "CANCELLED";

export type Enrollment = {
  id: number | string;
  student: number | string;

  /**
   * Course ID used when creating/updating enrollment.
   */
  course: number | string;

  /**
   * Full course data returned by the API.
   */
  course_details: CourseData;

  status: EnrollmentStatus;

  enrolled_at: string;
  expires_at: string | null;
  completed_at: string | null;
  suspended_at: string | null;
  cancelled_at: string | null;
  updated_at: string;
};
