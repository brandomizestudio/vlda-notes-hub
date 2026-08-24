import { Metadata } from 'next';
import { StudentsTable } from './students-table';

export const metadata: Metadata = {
  title: 'Students Directory — VLDD Admin',
};

export default function AdminStudentsPage() {
  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-line pb-4">
        <div className="eyebrow">STUDENT DIRECTORY</div>
        <h1 className="font-display text-[26px] font-bold text-ink mt-1">
          Registered Students
        </h1>
      </div>

      <StudentsTable />
    </div>
  );
}
