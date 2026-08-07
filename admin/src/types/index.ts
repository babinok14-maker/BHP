export interface Member {
  id: string;
  fullName: string;
  passportNumber: string;
  jobPosition: string;
  age: number;
  photoUrl: string | null;
  status: "Accepted" | "Pending" | "Rejected";
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  email: string;
}

export interface MemberFormValues {
  fullName: string;
  passportNumber: string;
  jobPosition: string;
  age: number;
  status: "Accepted" | "Pending" | "Rejected";
}
